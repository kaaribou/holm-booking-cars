"""« Disponible » : allumé quand personne n'a le véhicule en ce moment."""
from __future__ import annotations

from homeassistant.components.binary_sensor import BinarySensorEntity

from .const import STATUS_BOOKED
from .entity import VehicleEntity


async def async_setup_entry(hass, entry, async_add_entities):
    m = entry.runtime_data
    async_add_entities([AvailableSensor(entry, m, v, "disponible") for v in m.vehicles])


class AvailableSensor(VehicleEntity, BinarySensorEntity):
    _domain = "binary_sensor"

    @property
    def is_on(self):
        return self.state_info["status"] != STATUS_BOOKED

    @property
    def icon(self):
        return "mdi:car-check" if self.is_on else "mdi:car-off"
