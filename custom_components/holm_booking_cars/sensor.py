"""Capteurs par véhicule : statut (disponible / réservé / bientôt réservé), réservation en cours, prochaine réservation."""
from __future__ import annotations

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity

from .const import STATUS_BOOKED, STATUS_FREE, STATUS_SOON
from .entity import VehicleEntity, booking_attrs
from .manager import parse_dt


async def async_setup_entry(hass, entry, async_add_entities):
    m = entry.runtime_data
    ents = []
    for v in m.vehicles:
        ents += [StatusSensor(entry, m, v, "statut"), CurrentSensor(entry, m, v, "en_cours"), NextSensor(entry, m, v, "prochaine_reservation")]
    async_add_entities(ents)


class StatusSensor(VehicleEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.ENUM
    _attr_options = [STATUS_FREE, STATUS_SOON, STATUS_BOOKED]

    @property
    def native_value(self):
        return self.state_info["status"]

    @property
    def icon(self):
        s = self.state_info["status"]
        return "mdi:car-key" if s == STATUS_BOOKED else ("mdi:car-clock" if s == STATUS_SOON else (self.cfg.get("icon") or "mdi:car-side"))

    @property
    def entity_picture(self):
        return self.cfg.get("image") or None

    @property
    def extra_state_attributes(self):
        st = self.state_info
        cur, nxt = st["current"], st["next"]
        attrs = {"vehicle": self.cfg.get("name"), "color": self.cfg.get("color"), "plate": self.cfg.get("plate") or None}
        attrs.update(booking_attrs(cur))
        if cur:
            attrs["until"] = cur["end"]
        if nxt:
            attrs["next_start"] = nxt["start"]
            attrs["next_person"] = nxt.get("person_name")
        return attrs


class CurrentSensor(VehicleEntity, SensorEntity):
    """Nom de la personne qui a le véhicule en ce moment (vide s'il est libre)."""
    _attr_icon = "mdi:account-key"

    @property
    def native_value(self):
        cur = self.state_info["current"]
        return cur.get("person_name") if cur else None

    @property
    def extra_state_attributes(self):
        return booking_attrs(self.state_info["current"])


class NextSensor(VehicleEntity, SensorEntity):
    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_icon = "mdi:calendar-clock"

    @property
    def native_value(self):
        nxt = self.state_info["next"]
        return parse_dt(nxt["start"]) if nxt else None

    @property
    def extra_state_attributes(self):
        return booking_attrs(self.state_info["next"])
