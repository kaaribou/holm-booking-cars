"""API de la carte : lecture, abonnement en direct, réserver / modifier / terminer / supprimer, réglages (administrateurs)."""
from __future__ import annotations

import asyncio

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .manager import BookingError


def _entry(hass: HomeAssistant):
    entries = [e for e in hass.config_entries.async_entries(DOMAIN) if e.state is ConfigEntryState.LOADED and getattr(e, "runtime_data", None)]
    return entries[0] if entries else None


async def _wait_entry(hass: HomeAssistant, timeout: float = 15.0):
    """L'entrée chargée ; si elle est en train de se recharger (après un enregistrement), on attend qu'elle revienne."""
    for _ in range(int(timeout * 4)):
        if entry := _entry(hass):
            return entry
        if not hass.config_entries.async_entries(DOMAIN):
            return None
        await asyncio.sleep(0.25)
    return None


def _not_loaded(connection, msg):
    connection.send_error(msg["id"], "not_loaded", "HOLM Booking Cars is not set up")


def _refused(connection, msg, err: BookingError):
    # le code est traduit par la carte ; la réservation en conflit est jointe pour l'afficher
    error = {"code": err.code, "message": err.code}
    if err.data:
        error["data"] = err.data
    connection.send_message({"id": msg["id"], "type": "result", "success": False, "error": error})


def _structure(vehicles: list[dict]) -> list[tuple]:
    """Ce qui impose de recharger l'intégration : véhicules ajoutés, supprimés ou renommés (entités et appareils)."""
    return [(v.get("id"), v.get("name")) for v in vehicles]


@callback
def async_register(hass: HomeAssistant) -> None:
    for cmd in (ws_get, ws_subscribe, ws_book, ws_update, ws_finish, ws_delete, ws_save, ws_test):
        websocket_api.async_register_command(hass, cmd)


async def _payload(hass, connection, m) -> dict:
    user = connection.user
    notify = sorted(hass.services.async_services().get("notify", {}).keys())
    me = m.person_of_user(user.id)
    data = {
        "vehicles": m.vehicles, "people": m.people, "settings": m.settings,
        "bookings": [{**m.public(b), "can_edit": m.can_edit(user, b)} for b in m.bookings],
        "states": {v["id"]: {k: (val["id"] if isinstance(val, dict) else val) for k, val in m.vehicle_state(v["id"]).items()} for v in m.vehicles},
        "admin": user.is_admin, "user_id": user.id, "user_name": user.name, "me": me["id"] if me else None,
    }
    if user.is_admin:
        data["notify_services"] = [s for s in notify if s not in ("send_message", "persistent_notification")]
        users = await hass.auth.async_get_users()
        data["users"] = [{"id": u.id, "name": u.name} for u in users if not u.system_generated and u.is_active]
    return data


@websocket_api.websocket_command({vol.Required("type"): "holm_booking_cars/get"})
@websocket_api.async_response
async def ws_get(hass, connection, msg):
    entry = await _wait_entry(hass)
    if not entry:
        return _not_loaded(connection, msg)
    connection.send_result(msg["id"], await _payload(hass, connection, entry.runtime_data))


@websocket_api.websocket_command({vol.Required("type"): "holm_booking_cars/subscribe"})
@websocket_api.async_response
async def ws_subscribe(hass, connection, msg):
    """Envoie toutes les données tout de suite puis à chaque changement (réservation d'un autre membre, début, fin, réglages)."""
    entry = await _wait_entry(hass)
    if not entry:
        return _not_loaded(connection, msg)
    m = entry.runtime_data

    async def _push():
        connection.send_message(websocket_api.event_message(msg["id"], await _payload(hass, connection, m)))

    @callback
    def _changed():
        hass.async_create_task(_push())

    unsub = m.subscribe(_changed)
    connection.subscriptions[msg["id"]] = unsub
    connection.send_result(msg["id"])
    await _push()


_FIELDS = {
    vol.Optional("vehicle"): str, vol.Optional("person"): vol.Any(str, None), vol.Optional("start"): str, vol.Optional("end"): str,
    vol.Optional("reason"): vol.Any(str, None), vol.Optional("destination"): vol.Any(str, None),
    vol.Optional("km"): vol.Any(int, float, str, None), vol.Optional("note"): vol.Any(str, None),
}


@websocket_api.websocket_command({vol.Required("type"): "holm_booking_cars/book", **_FIELDS})
@websocket_api.async_response
async def ws_book(hass, connection, msg):
    entry = await _wait_entry(hass)
    if not entry:
        return _not_loaded(connection, msg)
    data = {k: v for k, v in msg.items() if k not in ("id", "type")}
    try:
        b = await entry.runtime_data.async_book(data, connection.user)
    except BookingError as err:
        return _refused(connection, msg, err)
    connection.send_result(msg["id"], {"booking": b})


@websocket_api.websocket_command({vol.Required("type"): "holm_booking_cars/update", vol.Required("booking_id"): str, **_FIELDS})
@websocket_api.async_response
async def ws_update(hass, connection, msg):
    entry = await _wait_entry(hass)
    if not entry:
        return _not_loaded(connection, msg)
    data = {k: v for k, v in msg.items() if k not in ("id", "type", "booking_id")}
    try:
        b = await entry.runtime_data.async_update(msg["booking_id"], data, connection.user)
    except BookingError as err:
        return _refused(connection, msg, err)
    connection.send_result(msg["id"], {"booking": b})


@websocket_api.websocket_command({vol.Required("type"): "holm_booking_cars/finish", vol.Required("booking_id"): str})
@websocket_api.async_response
async def ws_finish(hass, connection, msg):
    entry = await _wait_entry(hass)
    if not entry:
        return _not_loaded(connection, msg)
    try:
        b = await entry.runtime_data.async_finish(msg["booking_id"], connection.user)
    except BookingError as err:
        return _refused(connection, msg, err)
    connection.send_result(msg["id"], {"booking": b})


@websocket_api.websocket_command({vol.Required("type"): "holm_booking_cars/delete", vol.Required("booking_id"): str})
@websocket_api.async_response
async def ws_delete(hass, connection, msg):
    entry = await _wait_entry(hass)
    if not entry:
        return _not_loaded(connection, msg)
    try:
        await entry.runtime_data.async_delete(msg["booking_id"], connection.user)
    except BookingError as err:
        return _refused(connection, msg, err)
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "holm_booking_cars/save", vol.Optional("vehicles"): [dict],
                                  vol.Optional("people"): [dict], vol.Optional("settings"): dict})
@websocket_api.async_response
async def ws_save(hass, connection, msg):
    entry = await _wait_entry(hass)
    if not entry:
        return _not_loaded(connection, msg)
    m = entry.runtime_data
    before = _structure(m.vehicles)
    await m.async_replace(msg.get("vehicles"), msg.get("people"), msg.get("settings"))
    reloaded = _structure(m.vehicles) != before
    if reloaded:    # véhicules ajoutés, supprimés ou renommés : entités et appareils recréés
        await hass.config_entries.async_reload(entry.entry_id)
        entry = _entry(hass)
        m = entry.runtime_data if entry else m
    connection.send_result(msg["id"], {"ok": True, "reloaded": reloaded})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "holm_booking_cars/test", vol.Required("person"): str})
@websocket_api.async_response
async def ws_test(hass, connection, msg):
    entry = await _wait_entry(hass)
    if not entry:
        return _not_loaded(connection, msg)
    try:
        sent = await entry.runtime_data.async_test(msg["person"])
    except BookingError as err:
        return _refused(connection, msg, err)
    connection.send_result(msg["id"], {"sent": sent})
