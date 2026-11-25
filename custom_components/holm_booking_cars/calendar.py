"""Un calendrier par véhicule (calendar.<véhicule>) : les réservations, modifiables aussi depuis le calendrier de Home Assistant."""
from __future__ import annotations

from datetime import date, datetime, time

from homeassistant.components.calendar import CalendarEntity, CalendarEntityFeature, CalendarEvent
from homeassistant.exceptions import HomeAssistantError
from homeassistant.util import dt as dt_util

from .entity import VehicleEntity
from .manager import BookingError, iso, parse_dt


async def async_setup_entry(hass, entry, async_add_entities):
    m = entry.runtime_data
    async_add_entities([VehicleCalendar(entry, m, v) for v in m.vehicles])


def _to_dt(value) -> datetime:
    if isinstance(value, datetime):
        return value
    if isinstance(value, date):     # événement « journée entière » : de minuit à minuit, heure locale
        return datetime.combine(value, time.min, tzinfo=dt_util.get_default_time_zone())
    return parse_dt(value)


class VehicleCalendar(VehicleEntity, CalendarEntity):
    _domain = "calendar"
    _attr_name = None
    _attr_supported_features = CalendarEntityFeature.CREATE_EVENT | CalendarEntityFeature.UPDATE_EVENT | CalendarEntityFeature.DELETE_EVENT

    def __init__(self, entry, manager, vehicle) -> None:
        super().__init__(entry, manager, vehicle, "calendar")
        self._attr_translation_key = None
        self.entity_id = f"calendar.{vehicle['id']}"

    def _event(self, b: dict) -> CalendarEvent:
        summary = b.get("person_name") or "?"
        if b.get("reason"):
            summary += f" — {b['reason']}"
        desc = "\n".join(x for x in (b.get("note"), f"{b['km']} km" if b.get("km") else "") if x) or None
        return CalendarEvent(start=dt_util.as_local(parse_dt(b["start"])), end=dt_util.as_local(parse_dt(b["end"])), summary=summary,
                             description=desc, location=b.get("destination") or None, uid=b["id"])

    @property
    def event(self) -> CalendarEvent | None:
        st = self.state_info
        b = st["current"] or st["next"]
        return self._event(b) if b else None

    async def async_get_events(self, hass, start_date: datetime, end_date: datetime) -> list[CalendarEvent]:
        s, e = dt_util.as_utc(start_date), dt_util.as_utc(end_date)
        return [self._event(b) for b in self.manager.vehicle_bookings(self.vehicle_id) if parse_dt(b["start"]) < e and parse_dt(b["end"]) > s]

    def _from_event(self, event: dict) -> dict:
        """Titre « Prénom — motif » : la personne est reconnue par son nom en début de titre."""
        summary = str(event.get("summary") or "").strip()
        data = {"vehicle": self.vehicle_id}
        if "dtstart" in event:
            data["start"] = iso(_to_dt(event["dtstart"]))
        if "dtend" in event:
            data["end"] = iso(_to_dt(event["dtend"]))
        if summary:
            low = summary.lower()
            p = next((p for p in sorted(self.manager.people, key=lambda p: -len(p["name"])) if low.startswith(p["name"].lower())), None)
            rest = summary[len(p["name"]):] if p else summary
            if p:
                data["person"] = p["id"]
            else:
                data["person_name"] = summary.split("—")[0].strip()
            data["reason"] = rest.strip(" —-:") if p else ""
        if "description" in event:
            data["note"] = event.get("description") or ""
        if "location" in event:
            data["destination"] = event.get("location") or ""
        return data

    async def async_create_event(self, **kwargs) -> None:
        try:
            await self.manager.async_book(self._from_event(kwargs), None)
        except BookingError as err:
            raise HomeAssistantError(_message(err)) from err

    async def async_update_event(self, uid: str, event: dict, recurrence_id: str | None = None, recurrence_range: str | None = None) -> None:
        data = self._from_event(event)
        data.pop("person_name", None)
        try:
            await self.manager.async_update(uid, data, None)
        except BookingError as err:
            raise HomeAssistantError(_message(err)) from err

    async def async_delete_event(self, uid: str, recurrence_id: str | None = None, recurrence_range: str | None = None) -> None:
        try:
            await self.manager.async_delete(uid, None)
        except BookingError as err:
            raise HomeAssistantError(_message(err)) from err


def _message(err: BookingError) -> str:
    if err.code == "overlap":
        b = err.data.get("booking") or {}
        return f"Créneau déjà réservé par {b.get('person_name', '?')} / already booked"
    return f"HOLM Booking Cars : {err.code}"
