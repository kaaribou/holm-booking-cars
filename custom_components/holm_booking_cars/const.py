"""Constantes de HOLM Booking Cars."""
DOMAIN = "holm_booking_cars"
NAME = "HOLM Booking Cars"
VERSION = "1.0.0"
STORE_VERSION = 1
STATIC_PATH = "/holm_booking_cars_static"
CARD_NAME = "holm-booking-cars-card.js"
CARD_URL = f"{STATIC_PATH}/{CARD_NAME}"
EVENT_BOOKING = f"{DOMAIN}_booking"           # created / updated / deleted / started / ended
SIGNAL_CHANGED = f"{DOMAIN}_changed"

PALETTE = ["#26c6da", "#ff7043", "#ab47bc", "#66bb6a", "#ffca28", "#42a5f5", "#ec407a", "#8d6e63", "#78909c", "#d4e157"]

DEFAULT_SETTINGS = {
    "reminder_before": 60,      # rappel au réservant N minutes avant le départ (0 = aucun)
    "notify_new": True,         # prévenir les autres personnes quand une réservation est créée
    "notify_end": True,         # rappeler au réservant de rendre le véhicule à l'heure de fin
    "slot_minutes": 15,         # pas des heures proposées dans la carte
    "max_days": 14,             # durée maximale d'une réservation, en jours
    "others_can_edit": False,   # chacun peut modifier les réservations des autres (sinon : les siennes, et les administrateurs tout)
}
DEFAULT_VEHICLE = {"name": "Voiture", "color": "#26c6da", "icon": "mdi:car-side", "image": "", "plate": "", "seats": 5,
                   "battery_entity": "", "fuel_entity": "", "location_entity": "", "notes": ""}
DEFAULT_PERSON = {"name": "", "color": "#26c6da", "user_id": "", "notify": [], "person_entity": ""}

STATUS_FREE = "disponible"
STATUS_BOOKED = "reserve"
STATUS_SOON = "bientot"         # une réservation commence dans moins d'une heure

STORE_KEY = DOMAIN
HISTORY_DAYS = 120              # réservations passées conservées (historique de la carte)

# textes des notifications, dans la langue de Home Assistant
# {car} véhicule, {who} personne, {start}/{end} « lun. 14:30 », {reason} motif (précédé de « — » s'il existe), {by} auteur
NOTIF = {
    "fr": {"new_t": "🚗 {car} réservé", "new": "{who} a réservé {car} du {start} au {end}{reason}.",
           "for_t": "🚗 {car} réservé pour vous", "for": "{by} a réservé {car} pour vous du {start} au {end}{reason}.",
           "rem_t": "⏰ Départ bientôt", "rem": "{car} est à vous à {start_h} (jusqu'au {end}){reason}.",
           "end_t": "🔑 Retour du véhicule", "end": "Votre réservation de {car} se termine maintenant. Pensez à le rendre !",
           "del_t": "🚗 Réservation annulée", "del": "La réservation de {car} par {who} du {start} est annulée.", "test_t": "🚗 HOLM Booking Cars", "test": "Notification de test pour {who}."},
    "en": {"new_t": "🚗 {car} booked", "new": "{who} booked {car} from {start} to {end}{reason}.",
           "for_t": "🚗 {car} booked for you", "for": "{by} booked {car} for you from {start} to {end}{reason}.",
           "rem_t": "⏰ Leaving soon", "rem": "{car} is yours at {start_h} (until {end}){reason}.",
           "end_t": "🔑 Vehicle return", "end": "Your booking of {car} ends now. Remember to bring it back!",
           "del_t": "🚗 Booking cancelled", "del": "{who}'s booking of {car} on {start} was cancelled.", "test_t": "🚗 HOLM Booking Cars", "test": "Test notification for {who}."},
    "de": {"new_t": "🚗 {car} reserviert", "new": "{who} hat {car} von {start} bis {end} reserviert{reason}.",
           "for_t": "🚗 {car} für dich reserviert", "for": "{by} hat {car} für dich von {start} bis {end} reserviert{reason}.",
           "rem_t": "⏰ Bald geht's los", "rem": "{car} gehört dir ab {start_h} (bis {end}){reason}.",
           "end_t": "🔑 Fahrzeugrückgabe", "end": "Deine Reservierung von {car} endet jetzt. Denk an die Rückgabe!",
           "del_t": "🚗 Reservierung storniert", "del": "Die Reservierung von {car} durch {who} am {start} wurde storniert.", "test_t": "🚗 HOLM Booking Cars", "test": "Testbenachrichtigung für {who}."},
    "es": {"new_t": "🚗 {car} reservado", "new": "{who} reservó {car} del {start} al {end}{reason}.",
           "for_t": "🚗 {car} reservado para ti", "for": "{by} reservó {car} para ti del {start} al {end}{reason}.",
           "rem_t": "⏰ Salida pronto", "rem": "{car} es tuyo a las {start_h} (hasta {end}){reason}.",
           "end_t": "🔑 Devolución del vehículo", "end": "Tu reserva de {car} termina ahora. ¡No olvides devolverlo!",
           "del_t": "🚗 Reserva cancelada", "del": "La reserva de {car} de {who} del {start} fue cancelada.", "test_t": "🚗 HOLM Booking Cars", "test": "Notificación de prueba para {who}."},
    "it": {"new_t": "🚗 {car} prenotata", "new": "{who} ha prenotato {car} dal {start} al {end}{reason}.",
           "for_t": "🚗 {car} prenotata per te", "for": "{by} ha prenotato {car} per te dal {start} al {end}{reason}.",
           "rem_t": "⏰ Partenza a breve", "rem": "{car} è tua alle {start_h} (fino a {end}){reason}.",
           "end_t": "🔑 Riconsegna del veicolo", "end": "La tua prenotazione di {car} termina ora. Ricordati di riportarla!",
           "del_t": "🚗 Prenotazione annullata", "del": "La prenotazione di {car} di {who} del {start} è stata annullata.", "test_t": "🚗 HOLM Booking Cars", "test": "Notifica di prova per {who}."},
    "nl": {"new_t": "🚗 {car} gereserveerd", "new": "{who} heeft {car} gereserveerd van {start} tot {end}{reason}.",
           "for_t": "🚗 {car} voor jou gereserveerd", "for": "{by} heeft {car} voor jou gereserveerd van {start} tot {end}{reason}.",
           "rem_t": "⏰ Bijna vertrek", "rem": "{car} is van jou om {start_h} (tot {end}){reason}.",
           "end_t": "🔑 Voertuig terugbrengen", "end": "Je reservering van {car} eindigt nu. Vergeet hem niet terug te brengen!",
           "del_t": "🚗 Reservering geannuleerd", "del": "De reservering van {car} door {who} op {start} is geannuleerd.", "test_t": "🚗 HOLM Booking Cars", "test": "Testmelding voor {who}."},
    "pt": {"new_t": "🚗 {car} reservado", "new": "{who} reservou {car} de {start} a {end}{reason}.",
           "for_t": "🚗 {car} reservado para si", "for": "{by} reservou {car} para si de {start} a {end}{reason}.",
           "rem_t": "⏰ Partida em breve", "rem": "{car} é seu às {start_h} (até {end}){reason}.",
           "end_t": "🔑 Devolução do veículo", "end": "A sua reserva de {car} termina agora. Não se esqueça de o devolver!",
           "del_t": "🚗 Reserva cancelada", "del": "A reserva de {car} de {who} em {start} foi cancelada.", "test_t": "🚗 HOLM Booking Cars", "test": "Notificação de teste para {who}."},
    "pl": {"new_t": "🚗 {car} zarezerwowany", "new": "{who} zarezerwował(a) {car} od {start} do {end}{reason}.",
           "for_t": "🚗 {car} zarezerwowany dla Ciebie", "for": "{by} zarezerwował(a) {car} dla Ciebie od {start} do {end}{reason}.",
           "rem_t": "⏰ Wyjazd wkrótce", "rem": "{car} jest Twój o {start_h} (do {end}){reason}.",
           "end_t": "🔑 Zwrot pojazdu", "end": "Twoja rezerwacja {car} właśnie się kończy. Pamiętaj o zwrocie!",
           "del_t": "🚗 Rezerwacja anulowana", "del": "Rezerwacja {car} przez {who} na {start} została anulowana.", "test_t": "🚗 HOLM Booking Cars", "test": "Powiadomienie testowe dla {who}."},
}
WEEKDAYS = {
    "fr": ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."], "en": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "de": ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"], "es": ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"],
    "it": ["lun", "mar", "mer", "gio", "ven", "sab", "dom"], "nl": ["ma", "di", "wo", "do", "vr", "za", "zo"],
    "pt": ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"], "pl": ["pon.", "wt.", "śr.", "czw.", "pt.", "sob.", "niedz."],
}
