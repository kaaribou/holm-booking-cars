"""Tests de HOLM Booking Cars (pytest-homeassistant-custom-component)."""
import asyncio
from datetime import datetime, timedelta
from types import SimpleNamespace
from zoneinfo import ZoneInfo

import pytest
from freezegun.api import FrozenDateTimeFactory
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed, async_mock_service

from custom_components.holm_booking_cars.const import DOMAIN
from custom_components.holm_booking_cars.manager import BookingError

TZ = ZoneInfo("Europe/Paris")
ADMIN = SimpleNamespace(id="u_admin", name="Paul", is_admin=True)
LEA = SimpleNamespace(id="u_lea", name="Léa", is_admin=False)


@pytest.fixture(autouse=True)
def auto_enable(enable_custom_integrations):
    yield


async def _setup(hass, freezer, when):
    await hass.config.async_set_time_zone("Europe/Paris")
    hass.config.language = "fr"
    freezer.move_to(when)
    entry = MockConfigEntry(domain=DOMAIN, data={"vehicle_name": "Clio"})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    m = entry.runtime_data
    await m.async_replace(None, [{"name": "Paul", "user_id": "u_admin", "notify": ["mobile_app_paul"]},
                                 {"name": "Léa", "user_id": "u_lea", "notify": ["mobile_app_lea"]}], None)
    return entry, m


def at(d, h, mi=0):
    return datetime(2026, 11, d, h, mi, tzinfo=TZ).isoformat()


async def test_entities_and_overlap(hass, freezer: FrozenDateTimeFactory):
    entry, m = await _setup(hass, freezer, datetime(2026, 11, 23, 8, 0, tzinfo=TZ))
    assert hass.states.get("sensor.clio_statut").state == "disponible"
    assert hass.states.get("binary_sensor.clio_disponible").state == "on"
    b = await m.async_book({"start": at(23, 9), "end": at(23, 11), "reason": "Courses"}, LEA)
    assert b["person"] == "lea" and b["vehicle"] == "clio"
    with pytest.raises(BookingError) as err:
        await m.async_book({"start": at(23, 10), "end": at(23, 12)}, ADMIN)
    assert err.value.code == "overlap" and err.value.data["booking"]["person_name"] == "Léa"
    await m.async_book({"start": at(23, 11), "end": at(23, 12)}, ADMIN)            # bout à bout : permis
    await hass.async_block_till_done()
    assert hass.states.get("sensor.clio_statut").state == "bientot"
    freezer.move_to(datetime(2026, 11, 23, 9, 30, tzinfo=TZ))
    async_fire_time_changed(hass, datetime(2026, 11, 23, 9, 30, tzinfo=TZ))
    await hass.async_block_till_done()
    assert hass.states.get("sensor.clio_statut").state == "reserve"
    assert hass.states.get("sensor.clio_en_cours").state == "Léa"
    assert hass.states.get("binary_sensor.clio_disponible").state == "off"
    assert hass.states.get("calendar.clio").attributes["message"] == "Léa — Courses"


async def test_concurrent_requests(hass, freezer):
    entry, m = await _setup(hass, freezer, datetime(2026, 11, 23, 8, 0, tzinfo=TZ))
    res = await asyncio.gather(m.async_book({"start": at(24, 9), "end": at(24, 12)}, ADMIN),
                               m.async_book({"start": at(24, 10), "end": at(24, 11)}, LEA), return_exceptions=True)
    assert sum(isinstance(r, dict) for r in res) == 1 and sum(isinstance(r, BookingError) for r in res) == 1


async def test_rules_and_rights(hass, freezer):
    entry, m = await _setup(hass, freezer, datetime(2026, 11, 23, 8, 0, tzinfo=TZ))
    for data, code in (({"start": at(23, 12), "end": at(23, 11)}, "invalid_dates"), ({"start": at(22, 9), "end": at(22, 10)}, "past"),
                       ({"start": at(23, 9), "end": (datetime(2026, 12, 20, tzinfo=TZ)).isoformat()}, "too_long")):
        with pytest.raises(BookingError) as err:
            await m.async_book(data, ADMIN)
        assert err.value.code == code
    b = await m.async_book({"start": at(25, 9), "end": at(25, 10)}, ADMIN)
    with pytest.raises(BookingError) as err:
        await m.async_delete(b["id"], LEA)
    assert err.value.code == "forbidden"
    await m.async_replace(None, None, {**m.settings, "others_can_edit": True})
    await m.async_update(b["id"], {"reason": "Gare"}, LEA)
    assert m.booking(b["id"])["reason"] == "Gare"
    await m.async_delete(b["id"], LEA)
    assert not m.bookings


async def test_notifications(hass, freezer):
    paul = async_mock_service(hass, "notify", "mobile_app_paul")
    lea = async_mock_service(hass, "notify", "mobile_app_lea")
    entry, m = await _setup(hass, freezer, datetime(2026, 11, 23, 8, 0, tzinfo=TZ))
    b = await m.async_book({"person": "lea", "start": at(23, 10), "end": at(23, 11)}, ADMIN)    # pour Léa, par Paul
    await hass.async_block_till_done()
    assert "pour vous" in lea[0].data["title"] and not paul
    for minute in (9 * 60, 11 * 60 + 1):
        t = datetime(2026, 11, 23, minute // 60, minute % 60, tzinfo=TZ)
        freezer.move_to(t)
        async_fire_time_changed(hass, t)
        await hass.async_block_till_done()
    titles = [c.data["title"] for c in lea]
    assert "⏰ Départ bientôt" in titles and "🔑 Retour du véhicule" in titles
    # rendu en avance : la réservation se termine maintenant
    b2 = await m.async_book({"start": at(23, 12), "end": at(23, 15)}, LEA)
    assert any("Clio réservé" in c.data["title"] for c in paul)
    t = datetime(2026, 11, 23, 13, 0, tzinfo=TZ)
    freezer.move_to(t)
    done = await m.async_finish(b2["id"], LEA)
    assert done["end"].startswith("2026-11-23T12:00")


async def test_service_and_calendar(hass, freezer):
    entry, m = await _setup(hass, freezer, datetime(2026, 11, 23, 8, 0, tzinfo=TZ))
    resp = await hass.services.async_call(DOMAIN, "book", {"person": "paul", "start": at(26, 8), "end": at(26, 9)}, blocking=True, return_response=True)
    assert resp["booking"]["person_name"] == "Paul"
    await hass.services.async_call("calendar", "create_event", {"entity_id": "calendar.clio", "summary": "Léa — Piscine",
                                                                "start_date_time": "2026-11-27 10:00:00", "end_date_time": "2026-11-27 11:00:00"}, blocking=True)
    lea = [b for b in m.bookings if b["person"] == "lea"]
    assert lea and lea[0]["reason"] == "Piscine"
    await hass.services.async_call(DOMAIN, "cancel", {"booking_id": resp["booking"]["id"]}, blocking=True)
    assert len(m.bookings) == 1
