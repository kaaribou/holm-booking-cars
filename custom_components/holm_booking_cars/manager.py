"""Cœur de HOLM Booking Cars : véhicules, personnes, réservations (sans chevauchement), états calculés, rappels et notifications."""
from __future__ import annotations

import asyncio
import copy
import logging
import re
import unicodedata
import uuid
from datetime import datetime, timedelta
from typing import Any, Callable

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_track_time_change
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (DEFAULT_PERSON, DEFAULT_SETTINGS, DEFAULT_VEHICLE, EVENT_BOOKING, HISTORY_DAYS, NOTIF,
                    PALETTE, STATUS_BOOKED, STATUS_FREE, STATUS_SOON, STORE_KEY, STORE_VERSION, WEEKDAYS)

_LOGGER = logging.getLogger(__name__)
COLOR = re.compile(r"^#[0-9a-fA-F]{6}$")
TEXT_LIMITS = {"reason": 80, "destination": 120, "note": 500}


class BookingError(Exception):
    """Refus d'une réservation ; `code` est traduit par la carte (overlap, invalid_dates, too_long, past, forbidden…)."""

    def __init__(self, code: str, data: dict | None = None) -> None:
        super().__init__(code)
        self.code = code
        self.data = data or {}


def slugify(text: str, default: str = "vehicule") -> str:
    t = unicodedata.normalize("NFKD", str(text or "")).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "_", t).strip("_") or default


def _unique(base: str, ids: set[str]) -> str:
    out, n = base, 2
    while out in ids:
        out, n = f"{base}_{n}", n + 1
    return out


def parse_dt(value: Any) -> datetime:
    """Date et heure reçues de la carte, d'un service ou du calendrier -> UTC (une heure sans fuseau est l'heure locale de HA)."""
    d = value if isinstance(value, datetime) else dt_util.parse_datetime(str(value or "").strip())
    if d is None:
        raise BookingError("invalid_dates")
    if d.tzinfo is None:
        d = d.replace(tzinfo=dt_util.get_default_time_zone())
    return dt_util.as_utc(d).replace(second=0, microsecond=0)


def iso(d: datetime) -> str:
    return dt_util.as_utc(d).isoformat()


def clean_vehicle(raw: dict, ids: set[str], index: int = 0) -> dict:
    v = copy.deepcopy(DEFAULT_VEHICLE)
    for k, val in (raw or {}).items():
        if k in DEFAULT_VEHICLE or k == "id":
            v[k] = val
    v["name"] = str(v.get("name") or "Voiture").strip()[:40]
    for k in ("image", "plate", "icon", "battery_entity", "fuel_entity", "location_entity"):
        v[k] = str(v.get(k) or "").strip()[:500]
    v["icon"] = v["icon"] or DEFAULT_VEHICLE["icon"]
    v["notes"] = str(v.get("notes") or "").strip()[:500]
    try:
        v["seats"] = max(1, min(99, int(v.get("seats") or 5)))
    except (TypeError, ValueError):
        v["seats"] = 5
    if not COLOR.match(str(v.get("color") or "")):
        v["color"] = PALETTE[index % len(PALETTE)]
    vid = str(v.get("id") or "")
    if not re.match(r"^[a-z0-9_]+$", vid) or vid in ids:
        vid = _unique(slugify(v["name"]), ids)
    v["id"] = vid
    return v


def clean_person(raw: dict, ids: set[str], index: int = 0) -> dict:
    p = copy.deepcopy(DEFAULT_PERSON)
    for k, val in (raw or {}).items():
        if k in DEFAULT_PERSON or k == "id":
            p[k] = val
    p["name"] = str(p.get("name") or "").strip()[:40] or f"#{index + 1}"
    p["user_id"] = str(p.get("user_id") or "")
    p["person_entity"] = str(p.get("person_entity") or "")
    p["notify"] = [str(t).removeprefix("notify.") for t in (p.get("notify") or []) if t]
    if not COLOR.match(str(p.get("color") or "")):
        p["color"] = PALETTE[index % len(PALETTE)]
    pid = str(p.get("id") or "")
    if not re.match(r"^[a-z0-9_]+$", pid) or pid in ids:
        pid = _unique(slugify(p["name"], "personne"), ids)
    p["id"] = pid
    return p


class BookingManager:
    def __init__(self, hass: HomeAssistant, entry) -> None:
        self.hass = hass
        self.entry = entry
        self._store = Store(hass, STORE_VERSION, STORE_KEY)
        self.vehicles: list[dict] = []
        self.people: list[dict] = []
        self.bookings: list[dict] = []
        self.settings: dict = dict(DEFAULT_SETTINGS)
        self._sent: dict[str, str] = {}          # clé de notification -> date d'envoi
        self._lock = asyncio.Lock()               # deux demandes simultanées ne peuvent pas réserver le même créneau
        self._listeners: list[Callable] = []      # entités : réécrire leur état
        self._subscribers: list[Callable] = []    # cartes abonnées : données modifiées
        self._unsubs: list[Callable] = []
        self._snap: dict = {}
        self._phase: dict[str, str] = {}          # réservation -> « before » / « during » / « after » (événements started / ended)

    # ---------- chargement / enregistrement ----------
    async def async_load(self) -> None:
        data = await self._store.async_load() or {}
        self.settings = {**DEFAULT_SETTINGS, **(data.get("settings") or {})}
        ids: set[str] = set()
        for i, raw in enumerate(data.get("vehicles") or []):
            v = clean_vehicle(raw, ids, i)
            ids.add(v["id"])
            self.vehicles.append(v)
        ids = set()
        for i, raw in enumerate(data.get("people") or []):
            p = clean_person(raw, ids, i)
            ids.add(p["id"])
            self.people.append(p)
        self.bookings = [b for b in data.get("bookings") or [] if b.get("id") and b.get("vehicle")]
        self._sent = dict(data.get("sent") or {})
        first = not data
        if not self.vehicles:
            name = self.entry.data.get("vehicle_name") or "Voiture"
            self.vehicles.append(clean_vehicle({"name": name}, set(), 0))
        if not self.people:
            self._import_people()
        self._prune()
        now = dt_util.utcnow()
        self._phase = {b["id"]: self._phase_of(b, now) for b in self.bookings}
        if first:
            await self.async_save()

    def _import_people(self) -> None:
        """Première installation : une personne par entité « person » de Home Assistant (nom, compte utilisateur, couleur)."""
        ids: set[str] = set()
        for i, st in enumerate(sorted(self.hass.states.async_all("person"), key=lambda s: s.name)):
            p = clean_person({"name": st.name, "user_id": st.attributes.get("user_id") or "", "person_entity": st.entity_id}, ids, i)
            ids.add(p["id"])
            self.people.append(p)

    async def async_save(self) -> None:
        await self._store.async_save({"vehicles": self.vehicles, "people": self.people, "bookings": self.bookings,
                                      "settings": self.settings, "sent": self._sent})

    def _prune(self) -> None:
        limit = dt_util.utcnow() - timedelta(days=HISTORY_DAYS)
        self.bookings = [b for b in self.bookings if parse_dt(b["end"]) >= limit]
        known = {b["id"] for b in self.bookings}
        self._sent = {k: v for k, v in self._sent.items() if k.split("|")[0] in known}
        self.bookings.sort(key=lambda b: b["start"])

    async def async_replace(self, vehicles: list[dict] | None, people: list[dict] | None, settings: dict | None) -> None:
        """Enregistrement des réglages depuis la carte (administrateurs)."""
        if vehicles is not None:
            ids: set[str] = set()
            out = []
            for i, raw in enumerate(vehicles):
                v = clean_vehicle(raw, ids, i)
                ids.add(v["id"])
                out.append(v)
            self.vehicles = out or [clean_vehicle({}, set(), 0)]
            keep = {v["id"] for v in self.vehicles}
            self.bookings = [b for b in self.bookings if b["vehicle"] in keep]
        if people is not None:
            ids = set()
            out = []
            for i, raw in enumerate(people):
                p = clean_person(raw, ids, i)
                ids.add(p["id"])
                out.append(p)
            self.people = out
            names = {p["id"]: p["name"] for p in self.people}
            for b in self.bookings:          # un renommage se répercute sur les réservations ; une personne supprimée garde son nom
                if b.get("person") in names:
                    b["person_name"] = names[b["person"]]
        if settings is not None:
            s = {**DEFAULT_SETTINGS, **{k: v for k, v in settings.items() if k in DEFAULT_SETTINGS}}
            s["reminder_before"] = max(0, min(1440, int(s.get("reminder_before") or 0)))
            s["slot_minutes"] = int(s.get("slot_minutes") or 15) if int(s.get("slot_minutes") or 15) in (5, 10, 15, 30, 60) else 15
            s["max_days"] = max(1, min(90, int(s.get("max_days") or 14)))
            for k in ("notify_new", "notify_end", "others_can_edit"):
                s[k] = bool(s.get(k))
            self.settings = s
        await self.async_save()
        self._changed()

    # ---------- démarrage ----------
    def start(self) -> None:
        self._unsubs.append(async_track_time_change(self.hass, self._tick, second=0))

    def stop(self) -> None:
        for u in self._unsubs:
            u()
        self._unsubs.clear()

    def add_listener(self, cb: Callable) -> Callable:
        self._listeners.append(cb)
        return lambda: self._listeners.remove(cb) if cb in self._listeners else None

    def subscribe(self, cb: Callable) -> Callable:
        self._subscribers.append(cb)
        return lambda: self._subscribers.remove(cb) if cb in self._subscribers else None

    def _changed(self) -> None:
        """Données modifiées : entités réécrites, cartes ouvertes prévenues."""
        self._snap = self._snapshot(dt_util.utcnow())
        for cb in list(self._listeners):
            cb()
        for cb in list(self._subscribers):
            cb()

    # ---------- lecture ----------
    def vehicle(self, vid: str) -> dict | None:
        return next((v for v in self.vehicles if v["id"] == vid), None)

    def person(self, pid: str) -> dict | None:
        return next((p for p in self.people if p["id"] == pid), None)

    def person_of_user(self, user_id: str | None) -> dict | None:
        return next((p for p in self.people if user_id and p.get("user_id") == user_id), None)

    def booking(self, bid: str) -> dict | None:
        return next((b for b in self.bookings if b["id"] == bid), None)

    def color_of(self, b: dict) -> str:
        p = self.person(b.get("person") or "")
        return p["color"] if p else "#78909c"

    def vehicle_bookings(self, vid: str) -> list[dict]:
        return [b for b in self.bookings if b["vehicle"] == vid]

    @staticmethod
    def _phase_of(b: dict, now: datetime) -> str:
        if now < parse_dt(b["start"]):
            return "before"
        return "during" if now < parse_dt(b["end"]) else "after"

    def vehicle_state(self, vid: str, now: datetime | None = None) -> dict:
        """État calculé d'un véhicule : statut, réservation en cours, prochaine réservation."""
        now = now or dt_util.utcnow()
        current, nxt = None, None
        for b in self.vehicle_bookings(vid):
            s, e = parse_dt(b["start"]), parse_dt(b["end"])
            if s <= now < e:
                current = b
            elif s > now and (nxt is None or s < parse_dt(nxt["start"])):
                nxt = b
        status = STATUS_FREE
        if current:
            status = STATUS_BOOKED
        elif nxt and parse_dt(nxt["start"]) - now <= timedelta(hours=1):
            status = STATUS_SOON
        return {"status": status, "current": current, "next": nxt}

    def _snapshot(self, now: datetime) -> dict:
        return {v["id"]: (lambda s: (s["status"], (s["current"] or {}).get("id"), (s["next"] or {}).get("id")))(self.vehicle_state(v["id"], now))
                for v in self.vehicles}

    # ---------- droits ----------
    def can_edit(self, user, b: dict) -> bool:
        if user is None or user.is_admin or self.settings.get("others_can_edit"):
            return True
        if b.get("created_by") == user.id:
            return True
        p = self.person(b.get("person") or "")
        return bool(p and p.get("user_id") == user.id)

    # ---------- réservations ----------
    def _validate(self, data: dict, own_id: str | None, is_new: bool) -> tuple[datetime, datetime]:
        if not self.vehicle(data.get("vehicle") or ""):
            raise BookingError("unknown_vehicle")
        if data.get("person") and not self.person(data["person"]):
            raise BookingError("unknown_person")
        start, end = parse_dt(data.get("start")), parse_dt(data.get("end"))
        if end <= start:
            raise BookingError("invalid_dates")
        if end - start > timedelta(days=int(self.settings.get("max_days") or 14)):
            raise BookingError("too_long", {"max_days": self.settings.get("max_days")})
        if is_new and end <= dt_util.utcnow():
            raise BookingError("past")
        for b in self.vehicle_bookings(data["vehicle"]):
            if b["id"] != own_id and start < parse_dt(b["end"]) and end > parse_dt(b["start"]):
                raise BookingError("overlap", {"booking": self.public(b)})
        return start, end

    def _fields(self, target: dict, data: dict) -> None:
        for k, limit in TEXT_LIMITS.items():
            if k in data:
                target[k] = str(data.get(k) or "").strip()[:limit]
        if "km" in data:
            try:
                target["km"] = max(0, min(100000, int(data["km"]))) if data.get("km") not in (None, "") else None
            except (TypeError, ValueError):
                target["km"] = None

    def public(self, b: dict) -> dict:
        return {**b, "color": self.color_of(b)}

    async def async_book(self, data: dict, user=None) -> dict:
        async with self._lock:
            data = dict(data)
            if not data.get("person"):
                me = self.person_of_user(user.id if user else None)
                if me:
                    data["person"] = me["id"]
            if not data.get("vehicle") and len(self.vehicles) == 1:
                data["vehicle"] = self.vehicles[0]["id"]
            start, end = self._validate(data, None, True)
            p = self.person(data.get("person") or "")
            now = dt_util.utcnow()
            b = {"id": uuid.uuid4().hex[:10], "vehicle": data["vehicle"], "person": p["id"] if p else "",
                 "person_name": p["name"] if p else (data.get("person_name") or (user.name if user else "") or "?"),
                 "start": iso(start), "end": iso(end), "reason": "", "destination": "", "km": None, "note": "",
                 "created_by": user.id if user else "", "created_by_name": (user.name if user else "") or "",
                 "created_at": iso(now), "updated_at": iso(now)}
            self._fields(b, data)
            self.bookings.append(b)
            self.bookings.sort(key=lambda x: x["start"])
            self._phase[b["id"]] = self._phase_of(b, now)
            await self.async_save()
        self._fire("created", b)
        self._notify_created(b, user)
        self._changed()
        return self.public(b)

    async def async_update(self, bid: str, data: dict, user=None) -> dict:
        async with self._lock:
            b = self.booking(bid)
            if not b:
                raise BookingError("not_found")
            if not self.can_edit(user, b):
                raise BookingError("forbidden")
            merged = {**b, **{k: v for k, v in data.items() if v is not None or k == "km"}}
            start, end = self._validate(merged, bid, False)
            now = dt_util.utcnow()
            moved = iso(start) != b["start"] or iso(end) != b["end"]
            running = parse_dt(b["start"]) <= now < parse_dt(b["end"])
            if moved and end <= now and not running:   # raccourcir une réservation en cours reste permis ; le passé ne se déplace pas
                raise BookingError("past")
            p = self.person(merged.get("person") or "")
            b.update({"vehicle": merged["vehicle"], "start": iso(start), "end": iso(end), "updated_at": iso(dt_util.utcnow())})
            if p:
                b.update({"person": p["id"], "person_name": p["name"]})
            self._fields(b, data)
            self.bookings.sort(key=lambda x: x["start"])
            self._phase[b["id"]] = self._phase_of(b, dt_util.utcnow())
            await self.async_save()
        self._fire("updated", b)
        self._changed()
        return self.public(b)

    async def async_finish(self, bid: str, user=None) -> dict:
        """Véhicule rendu en avance : la réservation en cours se termine maintenant (le créneau se libère)."""
        b = self.booking(bid)
        if not b:
            raise BookingError("not_found")
        now = dt_util.utcnow()
        if not parse_dt(b["start"]) <= now < parse_dt(b["end"]):
            raise BookingError("not_current")
        return await self.async_update(bid, {"end": iso(max(now, parse_dt(b["start"]) + timedelta(minutes=1)))}, user)

    async def async_delete(self, bid: str, user=None) -> None:
        async with self._lock:
            b = self.booking(bid)
            if not b:
                raise BookingError("not_found")
            if not self.can_edit(user, b):
                raise BookingError("forbidden")
            self.bookings.remove(b)
            self._phase.pop(bid, None)
            await self.async_save()
        self._fire("deleted", b)
        if parse_dt(b["end"]) > dt_util.utcnow():
            self._notify_deleted(b, user)
        self._changed()

    def _fire(self, action: str, b: dict) -> None:
        v = self.vehicle(b["vehicle"]) or {}
        self.hass.bus.async_fire(EVENT_BOOKING, {"action": action, "booking_id": b["id"], "vehicle": b["vehicle"], "vehicle_name": v.get("name"),
                                                 "person": b.get("person"), "person_name": b.get("person_name"), "start": b["start"],
                                                 "end": b["end"], "reason": b.get("reason"), "destination": b.get("destination")})

    # ---------- horloge ----------
    @callback
    def _tick(self, now: datetime) -> None:
        now = dt_util.as_utc(now).replace(second=0, microsecond=0)
        for b in list(self.bookings):
            phase = self._phase_of(b, now)
            old = self._phase.get(b["id"])
            if old and old != phase:
                if phase == "during":
                    self._fire("started", b)
                elif phase == "after" and old == "during":
                    self._fire("ended", b)
            self._phase[b["id"]] = phase
            self._check_notifications(b, now)
        if now.hour == 3 and now.minute == 0:
            self._prune()
        snap = self._snapshot(now)
        if snap != self._snap:
            self._snap = snap
            for cb in list(self._listeners):
                cb()
            for cb in list(self._subscribers):
                cb()

    def _check_notifications(self, b: dict, now: datetime) -> None:
        start, end = parse_dt(b["start"]), parse_dt(b["end"])
        before = int(self.settings.get("reminder_before") or 0)
        key = f"{b['id']}|rem|{b['start']}"
        if before and start - timedelta(minutes=before) <= now < start and key not in self._sent:
            self._sent[key] = iso(now)
            if parse_dt(b.get("created_at") or b["start"]) <= start - timedelta(minutes=before):   # réservé à la dernière minute : inutile
                self._send_person(b, "rem")
            self.hass.async_create_task(self.async_save())
        key = f"{b['id']}|end|{b['end']}"
        if self.settings.get("notify_end") and end <= now < end + timedelta(minutes=10) and start < end and key not in self._sent:
            self._sent[key] = iso(now)
            self._send_person(b, "end")
            self.hass.async_create_task(self.async_save())

    # ---------- notifications ----------
    def _lang(self) -> str:
        lang = (self.hass.config.language or "fr").split("-")[0].lower()
        return lang if lang in NOTIF else "en"

    def _fmt(self, d: datetime, lang: str) -> str:
        loc = dt_util.as_local(d)
        return f"{WEEKDAYS[lang][loc.weekday()]} {loc.strftime('%d/%m %H:%M')}"

    def _vars(self, b: dict, lang: str, user=None) -> dict:
        v = self.vehicle(b["vehicle"]) or {}
        start, end = parse_dt(b["start"]), parse_dt(b["end"])
        reason = " — " + b["reason"] if b.get("reason") else ""
        if b.get("destination"):
            reason += (" — " if not reason else ", ") + b["destination"]
        return {"car": v.get("name", "?"), "who": b.get("person_name") or "?", "start": self._fmt(start, lang), "end": self._fmt(end, lang),
                "start_h": dt_util.as_local(start).strftime("%H:%M"), "reason": reason,
                "by": (user.name if user else "") or b.get("created_by_name") or "?"}

    def _message(self, kind: str, b: dict, user=None) -> dict:
        lang = self._lang()
        t, var = NOTIF[lang], self._vars(b, lang, user)
        data: dict = {"tag": f"holm_booking_{b['id']}", "notification_icon": "mdi:car-clock", "group": "holm_booking_cars"}
        return {"title": t[f"{kind}_t"].format(**var), "message": t[kind].format(**var), "data": data}

    def _send_person(self, b: dict, kind: str) -> None:
        p = self.person(b.get("person") or "")
        if p:
            self._notify(p.get("notify") or [], self._message(kind, b))

    def _notify_created(self, b: dict, user) -> None:
        mine = self.person(b.get("person") or "")
        booker = self.person_of_user(user.id if user else None)
        if mine and (not booker or booker["id"] != mine["id"]) and user is not None:
            self._notify(mine.get("notify") or [], self._message("for", b, user))     # réservé pour quelqu'un d'autre : on le prévient
        if self.settings.get("notify_new"):
            skip = {x["id"] for x in (mine, booker) if x}
            targets = [t for p in self.people if p["id"] not in skip for t in p.get("notify") or []]
            self._notify(targets, self._message("new", b, user))

    def _notify_deleted(self, b: dict, user) -> None:
        if not self.settings.get("notify_new"):
            return
        booker = self.person_of_user(user.id if user else None)
        targets = [t for p in self.people if not booker or p["id"] != booker["id"] for t in p.get("notify") or []]
        self._notify(targets, self._message("del", b, user))

    def _notify(self, targets: list[str], data: dict) -> None:
        for target in dict.fromkeys(targets):    # sans doublon, dans l'ordre
            if self.hass.services.has_service("notify", target):
                self.hass.async_create_task(self.hass.services.async_call("notify", target, data))
            else:
                _LOGGER.warning("Service notify.%s introuvable", target)

    async def async_test(self, pid: str) -> int:
        p = self.person(pid)
        if not p:
            raise BookingError("unknown_person")
        lang = self._lang()
        t = NOTIF[lang]
        sent = 0
        for target in p.get("notify") or []:
            if self.hass.services.has_service("notify", target):
                await self.hass.services.async_call("notify", target, {"title": t["test_t"], "message": t["test"].format(who=p["name"])})
                sent += 1
        return sent
