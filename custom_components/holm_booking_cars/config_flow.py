"""Installation : une seule entrée ; on donne le nom du premier véhicule. Le reste (véhicules, personnes, notifications) se règle depuis la carte."""
from __future__ import annotations

import voluptuous as vol

from homeassistant.config_entries import ConfigFlow
from homeassistant.helpers import selector

from .const import DOMAIN, NAME


class HolmBookingCarsConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        if user_input is not None:
            return self.async_create_entry(title=NAME, data={"vehicle_name": (user_input.get("vehicle_name") or "").strip() or "Voiture"})
        schema = vol.Schema({vol.Required("vehicle_name", default="Voiture"): selector.TextSelector()})
        return self.async_show_form(step_id="user", data_schema=schema)
