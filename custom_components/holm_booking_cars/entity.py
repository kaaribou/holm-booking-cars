"""Base commune : un véhicule = un appareil, avec des identifiants d'entité fixes (sensor.<véhicule>_statut…)."""
from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import Entity

from .const import DOMAIN, NAME, VERSION


class VehicleEntity(Entity):
    _attr_should_poll = False
    _attr_has_entity_name = True
    _domain = "sensor"
    _suffix = ""

    def __init__(self, entry, manager, vehicle: dict, key: str) -> None:
        self.manager = manager
        self.vehicle_id = vehicle["id"]
        self._attr_unique_id = f"{entry.entry_id}_{self.vehicle_id}_{key}"
        self._attr_translation_key = key
        self.entity_id = f"{self._domain}.{self.vehicle_id}{'_' + (self._suffix or key) if (self._suffix or key) else ''}"
        self._attr_device_info = DeviceInfo(identifiers={(DOMAIN, f"{entry.entry_id}_{self.vehicle_id}")}, name=vehicle["name"],
                                            manufacturer="HOLM", model=NAME, sw_version=VERSION)

    @property
    def cfg(self) -> dict:
        return self.manager.vehicle(self.vehicle_id) or {}

    @property
    def state_info(self) -> dict:
        return self.manager.vehicle_state(self.vehicle_id)

    @property
    def available(self) -> bool:
        return self.manager.vehicle(self.vehicle_id) is not None

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self.manager.add_listener(self.async_write_ha_state))


def booking_attrs(b: dict | None, prefix: str = "") -> dict:
    if not b:
        return {}
    return {f"{prefix}person": b.get("person_name"), f"{prefix}person_id": b.get("person"), f"{prefix}start": b.get("start"),
            f"{prefix}end": b.get("end"), f"{prefix}reason": b.get("reason") or None, f"{prefix}destination": b.get("destination") or None,
            f"{prefix}booking_id": b.get("id")}
