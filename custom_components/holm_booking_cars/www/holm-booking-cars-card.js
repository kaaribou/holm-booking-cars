/* HOLM Booking Cars — carte de réservation des véhicules partagés (intégration holm_booking_cars).
   https://github.com/kaaribou/holm-booking-cars */
const HBC_VERSION = "1.0.0";
const LANGS = ["en", "de", "es", "it", "nl", "pt", "pl"];
// texte français -> [en, de, es, it, nl, pt, pl]
const I18N = {
  "Disponible": ["Available", "Verfügbar", "Disponible", "Disponibile", "Beschikbaar", "Disponível", "Dostępny"],
  "Libre jusqu'à {t}": ["Free until {t}", "Frei bis {t}", "Libre hasta las {t}", "Libera fino alle {t}", "Vrij tot {t}", "Livre até às {t}", "Wolny do {t}"],
  "Réservé par {who}": ["Booked by {who}", "Reserviert von {who}", "Reservado por {who}", "Prenotata da {who}", "Gereserveerd door {who}", "Reservado por {who}", "Zarezerwowany przez {who}"],
  "jusqu'à {t}": ["until {t}", "bis {t}", "hasta {t}", "fino a {t}", "tot {t}", "até {t}", "do {t}"],
  "{who} part à {t}": ["{who} leaves at {t}", "{who} fährt um {t}", "{who} sale a las {t}", "{who} parte alle {t}", "{who} vertrekt om {t}", "{who} sai às {t}", "{who} wyjeżdża o {t}"],
  "encore {d}": ["{d} left", "noch {d}", "quedan {d}", "ancora {d}", "nog {d}", "faltam {d}", "jeszcze {d}"],
  "dans {d}": ["in {d}", "in {d}", "en {d}", "tra {d}", "over {d}", "daqui a {d}", "za {d}"],
  "Réserver": ["Book", "Reservieren", "Reservar", "Prenota", "Reserveren", "Reservar", "Zarezerwuj"],
  "Rendre maintenant": ["Return now", "Jetzt zurückgeben", "Devolver ahora", "Riconsegna ora", "Nu terugbrengen", "Devolver agora", "Zwróć teraz"],
  "Semaine": ["Week", "Woche", "Semana", "Settimana", "Week", "Semana", "Tydzień"],
  "Liste": ["List", "Liste", "Lista", "Elenco", "Lijst", "Lista", "Lista"],
  "Aujourd'hui": ["Today", "Heute", "Hoy", "Oggi", "Vandaag", "Hoje", "Dziś"],
  "Demain": ["Tomorrow", "Morgen", "Mañana", "Domani", "Morgen", "Amanhã", "Jutro"],
  "Semaine précédente": ["Previous week", "Vorherige Woche", "Semana anterior", "Settimana precedente", "Vorige week", "Semana anterior", "Poprzedni tydzień"],
  "Semaine suivante": ["Next week", "Nächste Woche", "Semana siguiente", "Settimana successiva", "Volgende week", "Semana seguinte", "Następny tydzień"],
  "Aucune réservation à venir": ["No upcoming bookings", "Keine anstehenden Reservierungen", "No hay reservas próximas", "Nessuna prenotazione in arrivo", "Geen komende reserveringen", "Sem reservas futuras", "Brak nadchodzących rezerwacji"],
  "Aucune réservation passée": ["No past bookings", "Keine vergangenen Reservierungen", "No hay reservas pasadas", "Nessuna prenotazione passata", "Geen eerdere reserveringen", "Sem reservas passadas", "Brak minionych rezerwacji"],
  "Historique": ["History", "Verlauf", "Historial", "Cronologia", "Geschiedenis", "Histórico", "Historia"],
  "À venir": ["Upcoming", "Anstehend", "Próximas", "In arrivo", "Komend", "Próximas", "Nadchodzące"],
  "En cours": ["Now", "Läuft", "En curso", "In corso", "Bezig", "Em curso", "Trwa"],
  "Terminée": ["Ended", "Beendet", "Terminada", "Terminata", "Afgelopen", "Terminada", "Zakończona"],
  "Nouvelle réservation": ["New booking", "Neue Reservierung", "Nueva reserva", "Nuova prenotazione", "Nieuwe reservering", "Nova reserva", "Nowa rezerwacja"],
  "Modifier la réservation": ["Edit booking", "Reservierung bearbeiten", "Editar reserva", "Modifica prenotazione", "Reservering bewerken", "Editar reserva", "Edytuj rezerwację"],
  "Réservation": ["Booking", "Reservierung", "Reserva", "Prenotazione", "Reservering", "Reserva", "Rezerwacja"],
  "Véhicule": ["Vehicle", "Fahrzeug", "Vehículo", "Veicolo", "Voertuig", "Veículo", "Pojazd"],
  "Pour qui ?": ["For whom?", "Für wen?", "¿Para quién?", "Per chi?", "Voor wie?", "Para quem?", "Dla kogo?"],
  "Départ": ["Departure", "Abfahrt", "Salida", "Partenza", "Vertrek", "Partida", "Wyjazd"],
  "Retour": ["Return", "Rückgabe", "Regreso", "Rientro", "Terug", "Regresso", "Powrót"],
  "Durée": ["Duration", "Dauer", "Duración", "Durata", "Duur", "Duração", "Czas"],
  "Journée": ["Full day", "Ganzer Tag", "Día entero", "Giornata", "Hele dag", "Dia inteiro", "Cały dzień"],
  "Motif": ["Reason", "Grund", "Motivo", "Motivo", "Reden", "Motivo", "Powód"],
  "Destination": ["Destination", "Ziel", "Destino", "Destinazione", "Bestemming", "Destino", "Cel"],
  "Km prévus": ["Planned km", "Geplante km", "Km previstos", "Km previsti", "Geplande km", "Km previstos", "Planowane km"],
  "Note": ["Note", "Notiz", "Nota", "Nota", "Notitie", "Nota", "Notatka"],
  "Enregistrer": ["Save", "Speichern", "Guardar", "Salva", "Opslaan", "Guardar", "Zapisz"],
  "Annuler": ["Cancel", "Abbrechen", "Cancelar", "Annulla", "Annuleren", "Cancelar", "Anuluj"],
  "Supprimer": ["Delete", "Löschen", "Eliminar", "Elimina", "Verwijderen", "Eliminar", "Usuń"],
  "Supprimer cette réservation ?": ["Delete this booking?", "Diese Reservierung löschen?", "¿Eliminar esta reserva?", "Eliminare questa prenotazione?", "Deze reservering verwijderen?", "Eliminar esta reserva?", "Usunąć tę rezerwację?"],
  "Oui, supprimer": ["Yes, delete", "Ja, löschen", "Sí, eliminar", "Sì, elimina", "Ja, verwijderen", "Sim, eliminar", "Tak, usuń"],
  "Fermer": ["Close", "Schließen", "Cerrar", "Chiudi", "Sluiten", "Fechar", "Zamknij"],
  "Réservé !": ["Booked!", "Reserviert!", "¡Reservado!", "Prenotato!", "Gereserveerd!", "Reservado!", "Zarezerwowano!"],
  "Modifié !": ["Updated!", "Geändert!", "¡Modificado!", "Modificato!", "Gewijzigd!", "Alterado!", "Zmieniono!"],
  "Supprimé": ["Deleted", "Gelöscht", "Eliminado", "Eliminato", "Verwijderd", "Eliminado", "Usunięto"],
  "Bonne route !": ["Drive safe!", "Gute Fahrt!", "¡Buen viaje!", "Buon viaggio!", "Goede reis!", "Boa viagem!", "Szerokiej drogi!"],
  "Véhicule rendu, merci !": ["Vehicle returned, thanks!", "Fahrzeug zurück, danke!", "¡Vehículo devuelto, gracias!", "Veicolo riconsegnato, grazie!", "Voertuig terug, bedankt!", "Veículo devolvido, obrigado!", "Pojazd zwrócony, dzięki!"],
  "Chevauche la réservation de {who} ({t}).": ["Overlaps {who}'s booking ({t}).", "Überschneidet sich mit der Reservierung von {who} ({t}).", "Se solapa con la reserva de {who} ({t}).", "Si sovrappone alla prenotazione di {who} ({t}).", "Overlapt met de reservering van {who} ({t}).", "Sobrepõe-se à reserva de {who} ({t}).", "Nakłada się na rezerwację {who} ({t})."],
  "Le retour doit être après le départ.": ["Return must be after departure.", "Die Rückgabe muss nach der Abfahrt liegen.", "El regreso debe ser posterior a la salida.", "Il rientro deve essere dopo la partenza.", "Terugkomst moet na vertrek zijn.", "O regresso deve ser depois da partida.", "Powrót musi być po wyjeździe."],
  "Réservation trop longue (maximum {n} jours).": ["Booking too long ({n} days max).", "Reservierung zu lang (max. {n} Tage).", "Reserva demasiado larga (máximo {n} días).", "Prenotazione troppo lunga (massimo {n} giorni).", "Reservering te lang (max. {n} dagen).", "Reserva demasiado longa (máximo {n} dias).", "Rezerwacja za długa (maks. {n} dni)."],
  "Ce créneau est déjà passé.": ["This slot is already over.", "Dieser Zeitraum ist bereits vorbei.", "Esta franja ya ha pasado.", "Questa fascia è già passata.", "Dit tijdslot is al voorbij.", "Este período já passou.", "Ten termin już minął."],
  "Vous ne pouvez modifier que vos propres réservations.": ["You can only change your own bookings.", "Sie können nur Ihre eigenen Reservierungen ändern.", "Solo puede modificar sus propias reservas.", "Puoi modificare solo le tue prenotazioni.", "Je kunt alleen je eigen reserveringen wijzigen.", "Só pode alterar as suas próprias reservas.", "Możesz zmieniać tylko własne rezerwacje."],
  "Réservation introuvable (déjà supprimée ?).": ["Booking not found (already deleted?).", "Reservierung nicht gefunden (schon gelöscht?).", "Reserva no encontrada (¿ya eliminada?).", "Prenotazione non trovata (già eliminata?).", "Reservering niet gevonden (al verwijderd?).", "Reserva não encontrada (já eliminada?).", "Nie znaleziono rezerwacji (już usunięta?)."],
  "HOLM Booking Cars n'est pas installé : ajoutez l'intégration dans Paramètres › Appareils et services.": ["HOLM Booking Cars is not set up: add the integration in Settings › Devices & services.", "HOLM Booking Cars ist nicht eingerichtet: Integration unter Einstellungen › Geräte & Dienste hinzufügen.", "HOLM Booking Cars no está instalado: añada la integración en Ajustes › Dispositivos y servicios.", "HOLM Booking Cars non è installato: aggiungi l'integrazione in Impostazioni › Dispositivi e servizi.", "HOLM Booking Cars is niet ingesteld: voeg de integratie toe via Instellingen › Apparaten en diensten.", "O HOLM Booking Cars não está instalado: adicione a integração em Definições › Dispositivos e serviços.", "HOLM Booking Cars nie jest zainstalowany: dodaj integrację w Ustawienia › Urządzenia i usługi."],
  "Erreur : {e}": ["Error: {e}", "Fehler: {e}", "Error: {e}", "Errore: {e}", "Fout: {e}", "Erro: {e}", "Błąd: {e}"],
  "Réglages": ["Settings", "Einstellungen", "Ajustes", "Impostazioni", "Instellingen", "Definições", "Ustawienia"],
  "Véhicules": ["Vehicles", "Fahrzeuge", "Vehículos", "Veicoli", "Voertuigen", "Veículos", "Pojazdy"],
  "Personnes": ["People", "Personen", "Personas", "Persone", "Personen", "Pessoas", "Osoby"],
  "Options": ["Options", "Optionen", "Opciones", "Opzioni", "Opties", "Opções", "Opcje"],
  "Ajouter un véhicule": ["Add a vehicle", "Fahrzeug hinzufügen", "Añadir un vehículo", "Aggiungi un veicolo", "Voertuig toevoegen", "Adicionar um veículo", "Dodaj pojazd"],
  "Ajouter une personne": ["Add a person", "Person hinzufügen", "Añadir una persona", "Aggiungi una persona", "Persoon toevoegen", "Adicionar uma pessoa", "Dodaj osobę"],
  "Nom": ["Name", "Name", "Nombre", "Nome", "Naam", "Nome", "Nazwa"],
  "Couleur": ["Colour", "Farbe", "Color", "Colore", "Kleur", "Cor", "Kolor"],
  "Icône": ["Icon", "Symbol", "Icono", "Icona", "Pictogram", "Ícone", "Ikona"],
  "Photo": ["Photo", "Foto", "Foto", "Foto", "Foto", "Foto", "Zdjęcie"],
  "Importer une photo": ["Upload a photo", "Foto hochladen", "Subir una foto", "Carica una foto", "Foto uploaden", "Carregar uma foto", "Wgraj zdjęcie"],
  "Retirer la photo": ["Remove photo", "Foto entfernen", "Quitar la foto", "Rimuovi la foto", "Foto verwijderen", "Remover a foto", "Usuń zdjęcie"],
  "Immatriculation": ["Plate", "Kennzeichen", "Matrícula", "Targa", "Kenteken", "Matrícula", "Numer rejestracyjny"],
  "Places": ["Seats", "Sitze", "Plazas", "Posti", "Zitplaatsen", "Lugares", "Miejsca"],
  "Batterie ou carburant (entité)": ["Battery or fuel (entity)", "Akku oder Kraftstoff (Entität)", "Batería o combustible (entidad)", "Batteria o carburante (entità)", "Accu of brandstof (entiteit)", "Bateria ou combustível (entidade)", "Bateria lub paliwo (encja)"],
  "Compte Home Assistant": ["Home Assistant account", "Home Assistant Konto", "Cuenta de Home Assistant", "Account Home Assistant", "Home Assistant account", "Conta do Home Assistant", "Konto Home Assistant"],
  "Aucun": ["None", "Keines", "Ninguna", "Nessuno", "Geen", "Nenhuma", "Brak"],
  "Notifications": ["Notifications", "Benachrichtigungen", "Notificaciones", "Notifiche", "Meldingen", "Notificações", "Powiadomienia"],
  "Aucun service de notification trouvé (installez l'application compagnon).": ["No notification service found (install the companion app).", "Kein Benachrichtigungsdienst gefunden (Companion-App installieren).", "No se encontró ningún servicio de notificación (instale la app).", "Nessun servizio di notifica trovato (installa l'app companion).", "Geen meldingsdienst gevonden (installeer de companion-app).", "Nenhum serviço de notificação encontrado (instale a app).", "Nie znaleziono usługi powiadomień (zainstaluj aplikację)."],
  "Tester": ["Test", "Testen", "Probar", "Prova", "Testen", "Testar", "Testuj"],
  "Test envoyé ({n})": ["Test sent ({n})", "Test gesendet ({n})", "Prueba enviada ({n})", "Prova inviata ({n})", "Test verzonden ({n})", "Teste enviado ({n})", "Test wysłany ({n})"],
  "Enregistrez d'abord, puis testez.": ["Save first, then test.", "Erst speichern, dann testen.", "Guarde primero y luego pruebe.", "Prima salva, poi prova.", "Eerst opslaan, dan testen.", "Guarde primeiro e depois teste.", "Najpierw zapisz, potem testuj."],
  "Rappel avant le départ": ["Reminder before departure", "Erinnerung vor der Abfahrt", "Recordatorio antes de salir", "Promemoria prima della partenza", "Herinnering voor vertrek", "Lembrete antes da partida", "Przypomnienie przed wyjazdem"],
  "Aucun rappel": ["No reminder", "Keine Erinnerung", "Sin recordatorio", "Nessun promemoria", "Geen herinnering", "Sem lembrete", "Bez przypomnienia"],
  "Prévenir les autres à chaque réservation ou annulation": ["Tell the others about each booking or cancellation", "Die anderen bei jeder Reservierung oder Stornierung benachrichtigen", "Avisar a los demás de cada reserva o cancelación", "Avvisa gli altri a ogni prenotazione o annullamento", "De anderen melden bij elke reservering of annulering", "Avisar os outros de cada reserva ou cancelamento", "Powiadamiaj innych o każdej rezerwacji lub anulowaniu"],
  "Rappeler le retour du véhicule à l'heure de fin": ["Remind to return the vehicle at end time", "Bei Ende an die Rückgabe erinnern", "Recordar la devolución a la hora de fin", "Ricorda la riconsegna all'ora di fine", "Herinneren aan terugbrengen op eindtijd", "Lembrar a devolução à hora de fim", "Przypominaj o zwrocie o godzinie końca"],
  "Pas des horaires": ["Time step", "Zeitraster", "Intervalo horario", "Passo orario", "Tijdstap", "Intervalo horário", "Krok czasu"],
  "Durée maximale (jours)": ["Maximum duration (days)", "Maximale Dauer (Tage)", "Duración máxima (días)", "Durata massima (giorni)", "Maximale duur (dagen)", "Duração máxima (dias)", "Maksymalny czas (dni)"],
  "Tout le monde peut modifier toutes les réservations": ["Everyone can edit every booking", "Jeder darf alle Reservierungen ändern", "Todos pueden modificar todas las reservas", "Tutti possono modificare tutte le prenotazioni", "Iedereen mag alle reserveringen wijzigen", "Todos podem alterar todas as reservas", "Każdy może edytować wszystkie rezerwacje"],
  "Sinon : chacun ses réservations, les administrateurs toutes.": ["Otherwise: everyone their own bookings, administrators all of them.", "Sonst: jeder seine eigenen, Administratoren alle.", "Si no: cada uno las suyas, los administradores todas.", "Altrimenti: ognuno le proprie, gli amministratori tutte.", "Anders: ieder de eigen, beheerders alle.", "Caso contrário: cada um as suas, os administradores todas.", "W przeciwnym razie: każdy swoje, administratorzy wszystkie."],
  "Courses": ["Shopping", "Einkaufen", "Compras", "Spesa", "Boodschappen", "Compras", "Zakupy"],
  "Travail": ["Work", "Arbeit", "Trabajo", "Lavoro", "Werk", "Trabalho", "Praca"],
  "Rendez-vous": ["Appointment", "Termin", "Cita", "Appuntamento", "Afspraak", "Consulta", "Wizyta"],
  "Sport": ["Sport", "Sport", "Deporte", "Sport", "Sport", "Desporto", "Sport"],
  "Loisirs": ["Leisure", "Freizeit", "Ocio", "Tempo libero", "Vrije tijd", "Lazer", "Rozrywka"],
  "Vacances": ["Holidays", "Urlaub", "Vacaciones", "Vacanze", "Vakantie", "Férias", "Wakacje"],
  "École": ["School", "Schule", "Colegio", "Scuola", "School", "Escola", "Szkoła"],
  "Réservé par {who} le {d}": ["Booked by {who} on {d}", "Reserviert von {who} am {d}", "Reservado por {who} el {d}", "Prenotata da {who} il {d}", "Gereserveerd door {who} op {d}", "Reservado por {who} em {d}", "Zarezerwowane przez {who} {d}"],
  "Seul un administrateur ou {who} peut modifier cette réservation.": ["Only an administrator or {who} can change this booking.", "Nur ein Administrator oder {who} kann diese Reservierung ändern.", "Solo un administrador o {who} puede modificar esta reserva.", "Solo un amministratore o {who} può modificare questa prenotazione.", "Alleen een beheerder of {who} kan deze reservering wijzigen.", "Só um administrador ou {who} pode alterar esta reserva.", "Tylko administrator lub {who} może zmienić tę rezerwację."],
  "Créneau libre ✓": ["Slot available ✓", "Zeitraum frei ✓", "Franja libre ✓", "Fascia libera ✓", "Tijdslot vrij ✓", "Período livre ✓", "Termin wolny ✓"],
  "Touchez un créneau libre pour réserver.": ["Tap a free slot to book.", "Tippen Sie auf einen freien Zeitraum, um zu reservieren.", "Toque una franja libre para reservar.", "Tocca una fascia libera per prenotare.", "Tik op een vrij tijdslot om te reserveren.", "Toque num período livre para reservar.", "Dotknij wolnego terminu, aby zarezerwować."],
  "Supprimer ce véhicule ? Ses réservations seront effacées à l'enregistrement.": ["Delete this vehicle? Its bookings will be erased when you save.", "Dieses Fahrzeug löschen? Seine Reservierungen werden beim Speichern gelöscht.", "¿Eliminar este vehículo? Sus reservas se borrarán al guardar.", "Eliminare questo veicolo? Le sue prenotazioni saranno cancellate al salvataggio.", "Dit voertuig verwijderen? De reserveringen worden bij opslaan gewist.", "Eliminar este veículo? As reservas serão apagadas ao guardar.", "Usunąć ten pojazd? Jego rezerwacje zostaną usunięte przy zapisie."],
  "Enregistré ✓": ["Saved ✓", "Gespeichert ✓", "Guardado ✓", "Salvato ✓", "Opgeslagen ✓", "Guardado ✓", "Zapisano ✓"],
  "Monter": ["Move up", "Nach oben", "Subir", "Su", "Omhoog", "Subir", "W górę"],
  "Descendre": ["Move down", "Nach unten", "Bajar", "Giù", "Omlaag", "Descer", "W dół"],
  "Réservations de {who} : notifications envoyées à": ["{who}'s notifications go to", "Benachrichtigungen für {who} an", "Las notificaciones de {who} van a", "Le notifiche di {who} vanno a", "Meldingen van {who} gaan naar", "As notificações de {who} vão para", "Powiadomienia {who} trafiają do"],
  "Les personnes de Home Assistant sont reprises à l'installation. Liez un compte pour que chacun soit reconnu automatiquement.": ["Home Assistant people are imported on setup. Link an account so everyone is recognised automatically.", "Personen aus Home Assistant werden bei der Einrichtung übernommen. Verknüpfen Sie ein Konto, damit jeder automatisch erkannt wird.", "Las personas de Home Assistant se importan al instalar. Vincule una cuenta para que cada uno sea reconocido automáticamente.", "Le persone di Home Assistant vengono importate all'installazione. Collega un account perché ognuno sia riconosciuto automaticamente.", "Personen uit Home Assistant worden bij installatie overgenomen. Koppel een account zodat iedereen automatisch herkend wordt.", "As pessoas do Home Assistant são importadas na instalação. Associe uma conta para que cada um seja reconhecido automaticamente.", "Osoby z Home Assistant są importowane przy instalacji. Połącz konto, aby każdy był rozpoznawany automatycznie."],
  "Rien de prévu": ["Nothing planned", "Nichts geplant", "Nada previsto", "Niente in programma", "Niets gepland", "Nada previsto", "Nic zaplanowanego"],
  "{n} réservation(s) cette semaine": ["{n} booking(s) this week", "{n} Reservierung(en) diese Woche", "{n} reserva(s) esta semana", "{n} prenotazione/i questa settimana", "{n} reservering(en) deze week", "{n} reserva(s) esta semana", "{n} rezerwacja(e) w tym tygodniu"],
  "Vous": ["You", "Sie", "Usted", "Tu", "Jij", "Você", "Ty"],
  // éditeur visuel
  "Véhicule affiché": ["Vehicle shown", "Angezeigtes Fahrzeug", "Vehículo mostrado", "Veicolo mostrato", "Getoond voertuig", "Veículo mostrado", "Wyświetlany pojazd"],
  "Tous (sélecteur)": ["All (selector)", "Alle (Auswahl)", "Todos (selector)", "Tutti (selettore)", "Alle (keuze)", "Todos (seletor)", "Wszystkie (wybór)"],
  "Vue par défaut": ["Default view", "Standardansicht", "Vista predeterminada", "Vista predefinita", "Standaardweergave", "Vista predefinida", "Widok domyślny"],
  "Titre": ["Title", "Titel", "Título", "Titolo", "Titel", "Título", "Tytuł"],
  "Heure de début de la frise": ["Timeline start hour", "Startstunde der Zeitleiste", "Hora de inicio de la línea", "Ora di inizio della linea", "Beginuur van de tijdlijn", "Hora de início da linha", "Godzina początku osi"],
  "Heure de fin de la frise": ["Timeline end hour", "Endstunde der Zeitleiste", "Hora de fin de la línea", "Ora di fine della linea", "Einduur van de tijdlijn", "Hora de fim da linha", "Godzina końca osi"],
  "Premier jour de la semaine": ["First day of the week", "Erster Wochentag", "Primer día de la semana", "Primo giorno della settimana", "Eerste dag van de week", "Primeiro dia da semana", "Pierwszy dzień tygodnia"],
  "Lundi": ["Monday", "Montag", "Lunes", "Lunedì", "Maandag", "Segunda", "Poniedziałek"],
  "Dimanche": ["Sunday", "Sonntag", "Domingo", "Domenica", "Zondag", "Domingo", "Niedziela"],
  "Aujourd'hui en premier": ["Today first", "Heute zuerst", "Hoy primero", "Oggi per primo", "Vandaag eerst", "Hoje primeiro", "Dziś na początku"],
  "Afficher l'en-tête (photo et statut)": ["Show header (photo and status)", "Kopfbereich anzeigen (Foto und Status)", "Mostrar cabecera (foto y estado)", "Mostra intestazione (foto e stato)", "Koptekst tonen (foto en status)", "Mostrar cabeçalho (foto e estado)", "Pokaż nagłówek (zdjęcie i status)"],
  "Animations": ["Animations", "Animationen", "Animaciones", "Animazioni", "Animaties", "Animações", "Animacje"],
  "Langue": ["Language", "Sprache", "Idioma", "Lingua", "Taal", "Idioma", "Język"],
  "Automatique": ["Automatic", "Automatisch", "Automático", "Automatica", "Automatisch", "Automático", "Automatycznie"],
};
let HBC_LANG = "fr";
const _ = (s, vars) => {
  let out = s;
  if (HBC_LANG !== "fr") {
    const row = I18N[s];
    const i = LANGS.indexOf(HBC_LANG);
    if (row && i >= 0 && row[i]) out = row[i];
  }
  if (vars) for (const [k, v] of Object.entries(vars)) out = out.split(`{${k}}`).join(v);
  return out;
};
const setLang = (hass, forced) => {
  const l = String(forced && forced !== "auto" ? forced : (hass?.locale?.language || hass?.language || "fr")).slice(0, 2).toLowerCase();
  HBC_LANG = l === "fr" || LANGS.includes(l) ? l : "en";
  return HBC_LANG;
};

const HBC_CSS = `
:host{display:block;--ok:#2e9d4f;--warn:#f08c00;--bad:#e5484d;--r:var(--ha-card-border-radius,16px);--fg:var(--primary-text-color);--fg2:var(--secondary-text-color);--line:var(--divider-color,rgba(127,127,127,.2));--bg2:color-mix(in srgb,var(--fg) 5%,transparent);--acc:var(--primary-color,#03a9f4)}
*{box-sizing:border-box}
ha-card{overflow:hidden;position:relative;padding:0 0 4px;container-type:inline-size}
button{font:inherit;color:inherit;cursor:pointer;border:0;background:none}
button:disabled{opacity:.4;cursor:default}
ha-icon{--mdc-icon-size:20px;display:inline-flex}
.title{padding:14px 16px 0;font-size:1.05rem;font-weight:600}
.loading{display:flex;justify-content:center;padding:40px}
.spin{width:28px;height:28px;border-radius:50%;border:3px solid var(--line);border-top-color:var(--acc);animation:rot 0.8s linear infinite}
@keyframes rot{to{transform:rotate(360deg)}}
.err{display:flex;gap:12px;align-items:center;padding:18px;color:var(--fg2)}
.err ha-icon{--mdc-icon-size:32px;color:var(--bad)}
/* en-tête */
.hdr{display:flex;gap:14px;align-items:center;padding:16px 16px 10px;position:relative}
.hdr::before{content:"";position:absolute;inset:0;background:radial-gradient(120% 140% at 0% 0%,color-mix(in srgb,var(--vc) 22%,transparent),transparent 60%);pointer-events:none}
.pic{flex:0 0 auto;width:76px;height:76px;border-radius:20px;display:grid;place-items:center;background:linear-gradient(145deg,color-mix(in srgb,var(--vc) 85%,#fff),var(--vc));box-shadow:0 8px 22px -8px var(--vc);position:relative;overflow:hidden;color:#fff}
.pic ha-icon{--mdc-icon-size:44px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.25))}
.pic.img{background:var(--bg2)}
.pic img{width:100%;height:100%;object-fit:cover}
.st-booked .pic::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 3px color-mix(in srgb,var(--bad) 70%,transparent)}
.info{flex:1;min-width:0;position:relative}
.name{font-size:1.2rem;font-weight:700;display:flex;align-items:center;gap:8px;flex-wrap:wrap;line-height:1.2}
.plate{font-size:.7rem;font-weight:600;letter-spacing:.06em;padding:2px 6px;border-radius:5px;border:1.5px solid var(--line);color:var(--fg2);font-family:ui-monospace,monospace}
.energy{display:inline-flex;align-items:center;gap:2px;font-size:.78rem;font-weight:600;color:var(--ok)}
.energy.low{color:var(--bad)}
.energy ha-icon{--mdc-icon-size:17px}
.pill{display:inline-flex;align-items:center;gap:7px;margin-top:7px;padding:4px 11px 4px 9px;border-radius:999px;font-size:.85rem;font-weight:600}
.pill .dot{width:9px;height:9px;border-radius:50%;background:currentColor;position:relative}
.pill.free{color:var(--ok);background:color-mix(in srgb,var(--ok) 14%,transparent)}
.pill.soon{color:var(--warn);background:color-mix(in srgb,var(--warn) 15%,transparent)}
.pill.booked{color:var(--fg);background:color-mix(in srgb,var(--pc) 22%,transparent)}
.pill.booked .dot{background:var(--pc)}
.pill .dot::after{content:"";position:absolute;inset:0;border-radius:50%;background:inherit;animation:ping 1.8s cubic-bezier(0,0,.2,1) infinite}
@keyframes ping{75%,100%{transform:scale(2.4);opacity:0}}
.sub{margin-top:5px;font-size:.85rem;color:var(--fg2)}
.sub b{color:var(--fg);font-weight:600;white-space:nowrap}
.acts{align-self:flex-start;position:relative}
.prog{height:5px;margin:2px 16px 6px;border-radius:9px;background:var(--bg2);overflow:hidden}
.prog i{display:block;height:100%;border-radius:inherit;transition:width 1s ease;background-image:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)!important;background-size:200% 100%!important;animation:shine 2.4s linear infinite}
.prog i{background-blend-mode:overlay}
@keyframes shine{from{background-position:200% 0}to{background-position:-200% 0}}
.finish{padding:0 16px 4px}
/* boutons */
.icon{width:38px;height:38px;border-radius:12px;display:inline-grid;place-items:center;color:var(--fg2);transition:background .15s,transform .15s}
.icon:hover:not(:disabled){background:var(--bg2);color:var(--fg)}
.icon:active:not(:disabled){transform:scale(.92)}
.icon.del{color:var(--bad)}
.icon.armed{background:var(--bad);color:#fff;animation:pulse .8s ease infinite alternate}
@keyframes pulse{to{transform:scale(1.08)}}
.primary,.ghost,.danger{display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 16px;border-radius:12px;font-weight:600;transition:transform .15s,filter .15s,background .15s}
.primary{background:var(--acc);color:var(--text-primary-color,#fff);box-shadow:0 6px 16px -8px var(--acc)}
.primary:hover:not(:disabled){filter:brightness(1.08)}
.primary:active:not(:disabled),.ghost:active:not(:disabled),.danger:active:not(:disabled){transform:scale(.96)}
.ghost{background:var(--bg2)}
.ghost:hover:not(:disabled){background:color-mix(in srgb,var(--fg) 10%,transparent)}
.danger{background:var(--bad);color:#fff}
.danger.ghost{background:color-mix(in srgb,var(--bad) 12%,transparent);color:var(--bad)}
.sm{height:32px;padding:0 12px;font-size:.85rem}
.sm ha-icon{--mdc-icon-size:18px}
/* véhicules */
.vchips{display:flex;gap:8px;padding:4px 16px 2px;overflow-x:auto;scrollbar-width:none}
.vchip{display:inline-flex;align-items:center;gap:6px;padding:5px 12px 5px 8px;border-radius:999px;border:1.5px solid var(--line);font-size:.85rem;font-weight:600;white-space:nowrap;position:relative;transition:all .2s}
.vchip img{width:22px;height:22px;border-radius:50%;object-fit:cover}
.vchip ha-icon{--mdc-icon-size:18px;color:var(--vc)}
.vchip.on{border-color:var(--vc);background:color-mix(in srgb,var(--vc) 14%,transparent)}
.sd{position:absolute;top:2px;left:24px;width:8px;height:8px;border-radius:50%;border:1.5px solid var(--card-background-color,#fff)}
.sd.st-free{background:var(--ok)}.sd.st-soon{background:var(--warn)}.sd.st-booked{background:var(--bad)}
/* barre d'outils */
.toolbar{display:flex;align-items:center;gap:8px;padding:10px 12px 6px 16px}
.seg{display:inline-flex;padding:3px;border-radius:12px;background:var(--bg2);gap:2px}
.seg button{white-space:nowrap;height:32px;min-width:36px;padding:0 10px;border-radius:9px;display:inline-grid;place-items:center;color:var(--fg2);font-size:.85rem;font-weight:600;transition:all .2s}
.seg button.on{background:var(--card-background-color,#fff);color:var(--fg);box-shadow:0 1px 4px rgba(0,0,0,.12)}
.seg.sm button{height:30px}
.nav{display:flex;align-items:center;flex:1;justify-content:center;min-width:0}
.nav .icon{width:32px;height:32px}
.lbl{font-size:.85rem;font-weight:600;padding:6px 8px;border-radius:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lbl:hover{background:var(--bg2)}
.lbl.away{color:var(--acc)}
.toolbar > .seg.sm{flex:1;justify-content:center;margin:0 auto;max-width:max-content}
.toolbar .primary{margin-left:auto}
@container (max-width:430px){.toolbar .primary span{display:none}.toolbar .primary{padding:0 10px}.toolbar{gap:4px;padding-left:12px}.week{--dl:40px}.hdr{gap:10px}.pic{width:60px;height:60px;border-radius:16px}.pic ha-icon{--mdc-icon-size:34px}.name{font-size:1.05rem}.lbl{font-size:.78rem;padding:6px 2px}.nav .icon{width:26px}}
/* semaine */
.body{padding:2px 12px 8px 12px;overflow:hidden}
.week{--dl:52px}
.week.slide-right{animation:slr .35s cubic-bezier(.2,.8,.2,1)}
.week.slide-left{animation:sll .35s cubic-bezier(.2,.8,.2,1)}
@keyframes slr{from{transform:translateX(40px);opacity:0}}
@keyframes sll{from{transform:translateX(-40px);opacity:0}}
.ticks{display:grid;grid-template-columns:var(--dl) 1fr;height:16px}
.tk{position:relative;font-size:.68rem;color:var(--fg2)}
.tk span{position:absolute;transform:translateX(-50%)}
.tk span:first-child{transform:none}.tk span:last-child{transform:translateX(-100%)}
.day{display:grid;grid-template-columns:var(--dl) 1fr;align-items:center;margin:4px 0}
.dl{display:flex;flex-direction:column;align-items:center;line-height:1.05;color:var(--fg2);font-size:.72rem;text-transform:capitalize}
.dl span{font-size:1.05rem;font-weight:700;color:var(--fg)}
.day.today .dl b,.day.today .dl span{color:var(--acc)}
.day.today .dl span{background:var(--acc);color:var(--text-primary-color,#fff);border-radius:9px;padding:1px 6px;margin-top:2px}
.day.past{opacity:.55}
.track{position:relative;height:38px;border-radius:11px;cursor:pointer;background:
  linear-gradient(90deg,color-mix(in srgb,var(--fg) 7%,transparent) var(--past),transparent var(--past)),
  repeating-linear-gradient(90deg,var(--line) 0 1px,transparent 1px calc(100% / var(--steps))),var(--bg2);transition:background-color .2s}
.track:hover{background-color:color-mix(in srgb,var(--acc) 8%,transparent)}
.blk{position:absolute;top:3px;bottom:3px;border-radius:8px;background:var(--c);color:#fff;font-size:.74rem;font-weight:600;display:flex;align-items:center;padding:0 7px;overflow:hidden;white-space:nowrap;box-shadow:0 3px 10px -4px var(--c);transform-origin:left center;transition:filter .15s,transform .15s;z-index:1}
.blk span{overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 2px rgba(0,0,0,.3)}
.blk:hover{filter:brightness(1.1);transform:translateY(-1px);z-index:2}
.blk.done{filter:saturate(.45);opacity:.75}
.blk.mine{box-shadow:0 0 0 2px var(--card-background-color,#fff),0 0 0 3.5px var(--c)}
.blk.cur{background-image:repeating-linear-gradient(-45deg,rgba(255,255,255,.18) 0 8px,transparent 8px 16px);background-size:22.6px 22.6px;animation:stripes 1.2s linear infinite}
@keyframes stripes{to{background-position:22.6px 0}}
.blk.cl{border-top-left-radius:2px;border-bottom-left-radius:2px}
.blk.cr{border-top-right-radius:2px;border-bottom-right-radius:2px}
.week.anim .blk{animation:grow .5s cubic-bezier(.2,.9,.3,1.2) backwards}
.week.anim .blk.cur{animation:grow .5s cubic-bezier(.2,.9,.3,1.2) backwards,stripes 1.2s linear .5s infinite}
@keyframes grow{from{transform:scaleX(0);opacity:0}}
.blk.flash,.item.flash{animation:flash 1.6s ease!important}
@keyframes flash{0%{transform:scale(.6);opacity:0}30%{transform:scale(1.08);opacity:1;filter:brightness(1.3)}60%{transform:scale(1)}}
.now{position:absolute;top:-3px;bottom:-3px;width:2px;margin-left:-1px;background:var(--bad);border-radius:2px;z-index:3;pointer-events:none}
.now::before{content:"";position:absolute;top:-3px;left:-3px;width:8px;height:8px;border-radius:50%;background:var(--bad)}
.wfoot{text-align:center;font-size:.78rem;color:var(--fg2);padding:8px 0 2px}
/* liste */
.list{display:flex;flex-direction:column;gap:6px;padding:2px 0}
.grp{font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--fg2);margin:8px 4px 0}
.grp:first-letter{text-transform:uppercase}
.item{display:flex;gap:12px;align-items:center;padding:10px 12px;border-radius:14px;background:var(--bg2);cursor:pointer;position:relative;overflow:hidden;transition:transform .15s,background .15s}
.item::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--c)}
.item:hover{background:color-mix(in srgb,var(--c) 10%,transparent);transform:translateX(2px)}
.item.anim{animation:rise .45s cubic-bezier(.2,.8,.2,1) backwards}
@keyframes rise{from{transform:translateY(12px);opacity:0}}
.item.cur{background:color-mix(in srgb,var(--c) 14%,transparent)}
.av{flex:0 0 auto;width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:var(--c);color:#fff;font-weight:700;font-size:.85rem;box-shadow:0 3px 8px -3px var(--c)}
.it{flex:1;min-width:0}
.it-t{font-weight:600;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.it-t small{color:var(--fg2);font-weight:500}
.it-s{font-size:.82rem;color:var(--fg2);margin-top:2px}
.it-n{font-size:.8rem;color:var(--fg2);font-style:italic;margin-top:2px}
.chip{font-size:.68rem;font-weight:700;padding:2px 7px;border-radius:999px;background:var(--bg2);color:var(--fg2);text-transform:uppercase;letter-spacing:.03em}
.chip.cur{background:var(--c);color:#fff;animation:pulse .9s ease infinite alternate}
.go{color:var(--fg2)}
.empty{display:flex;flex-direction:column;align-items:center;gap:8px;padding:28px;color:var(--fg2)}
.empty ha-icon{--mdc-icon-size:40px;opacity:.5}
/* message flottant */
#toast{position:absolute;left:0;right:0;bottom:12px;display:flex;justify-content:center;pointer-events:none;z-index:5}
.tst{display:flex;align-items:center;gap:8px;padding:9px 16px;border-radius:999px;background:var(--ok);color:#fff;font-weight:600;font-size:.9rem;box-shadow:0 8px 24px -8px rgba(0,0,0,.4);animation:tin .4s cubic-bezier(.2,.9,.3,1.3)}
.tst.bad{background:var(--bad)}
@keyframes tin{from{transform:translateY(20px) scale(.9);opacity:0}}
/* fenêtres */
#ov{position:relative;z-index:9999}
.ov{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;font-family:var(--paper-font-body1_-_font-family,var(--ha-font-family-body,Roboto,sans-serif));color:var(--fg)}
.back{position:absolute;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(3px);animation:fade .25s ease}
@keyframes fade{from{opacity:0}}
.sheet{position:relative;width:min(520px,100%);max-height:min(92vh,860px);display:flex;flex-direction:column;background:var(--card-background-color,var(--ha-card-background,#fff));border-radius:24px;box-shadow:0 24px 64px -12px rgba(0,0,0,.5);overflow:hidden;animation:pop .35s cubic-bezier(.2,.9,.3,1.15)}
.sheet.wide{width:min(640px,100%)}
.ov.still .sheet,.ov.still .back{animation:none}
@keyframes pop{from{transform:translateY(30px) scale(.96);opacity:0}}
.ov.out .sheet{animation:popout .2s ease forwards}.ov.out .back{animation:fadeout .2s ease forwards}
@keyframes popout{to{transform:translateY(20px) scale(.97);opacity:0}}
@keyframes fadeout{to{opacity:0}}
@media (max-width:600px){.ov{align-items:flex-end;padding:0}.sheet,.sheet.wide{width:100%;border-radius:24px 24px 0 0;max-height:94vh;animation:up .38s cubic-bezier(.2,.9,.3,1)}
  @keyframes up{from{transform:translateY(100%)}}.ov.out .sheet{animation:down .22s ease forwards}@keyframes down{to{transform:translateY(100%)}}}
.sheet.shake{animation:shake .45s ease}
@keyframes shake{20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}
.sh-h{display:flex;align-items:center;gap:12px;padding:16px 14px 12px 18px;background:linear-gradient(180deg,color-mix(in srgb,var(--vc,var(--acc)) 16%,transparent),transparent)}
.sh-ic{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:var(--vc,var(--acc));color:#fff;overflow:hidden;flex:0 0 auto}
.sh-ic img{width:100%;height:100%;object-fit:cover}
.sh-ic ha-icon{--mdc-icon-size:26px}
.sh-tt{flex:1;min-width:0}
.sh-tt h3{margin:0;font-size:1.15rem}
.sh-tt small{color:var(--fg2)}
.sh-b{padding:4px 18px 14px;overflow-y:auto;flex:1;overscroll-behavior:contain}
.sh-f{display:flex;align-items:center;gap:8px;padding:12px 16px calc(12px + env(safe-area-inset-bottom));border-top:1px solid var(--line)}
.sp{flex:1}
label{display:block;font-size:.78rem;font-weight:600;color:var(--fg2);margin:14px 0 6px}
input[type=text],input[type=number],input[type=date],input[type=time],textarea,select{width:100%;font:inherit;color:var(--fg);background:var(--bg2);border:1.5px solid transparent;border-radius:12px;padding:9px 11px;outline:none;transition:border-color .15s,background .15s;color-scheme:light dark}
input:focus,textarea:focus,select:focus{border-color:var(--acc);background:transparent}
input:disabled,textarea:disabled{opacity:.8}
textarea{resize:vertical;min-height:44px}
.row2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}
.row2 .km{max-width:none}
@media (max-width:440px){.row2{grid-template-columns:1fr;gap:0}}
.when{display:flex;flex-direction:column;gap:8px;margin-top:16px}
.dt{display:grid;grid-template-columns:92px minmax(0,1.4fr) minmax(0,1fr);gap:6px;align-items:center}
.wl{display:flex;align-items:center;gap:5px;font-size:.8rem;font-weight:600;color:var(--fg2)}
.wl ha-icon{--mdc-icon-size:18px;color:var(--vc,var(--acc))}
@media (max-width:440px){.dt{grid-template-columns:minmax(0,1.4fr) minmax(0,1fr)}.wl{grid-column:1/-1}}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip-b{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;background:var(--bg2);font-size:.88rem;font-weight:500;border:1.5px solid transparent;transition:all .18s}
.chip-b.sm{padding:4px 10px;font-size:.8rem}
.chip-b ha-icon{--mdc-icon-size:16px;color:var(--c,var(--fg2))}
.chip-b:hover:not(:disabled){background:color-mix(in srgb,var(--c,var(--acc)) 12%,transparent)}
.chip-b.on{border-color:var(--c,var(--acc));background:color-mix(in srgb,var(--c,var(--acc)) 16%,transparent);font-weight:600}
.chip-b.person{padding:4px 12px 4px 4px}
.chip-b.person .av{width:28px;height:28px;font-size:.72rem}
.chip-b.person.on .av{transform:scale(1.08);box-shadow:0 0 0 2px var(--card-background-color,#fff),0 0 0 4px var(--c)}
.chip-b.person small{color:var(--fg2)}
.chip-b:disabled{opacity:.55}.chip-b.on:disabled{opacity:1}
.dur{margin-top:8px;align-items:center}
.dl2{font-size:.75rem;color:var(--fg2);margin-right:2px}
.rs{margin-bottom:6px}
.avail{margin-top:12px;display:flex;flex-direction:column;gap:5px}
.av-r,.av-h{display:grid;grid-template-columns:62px 1fr;align-items:center}
.av-d{font-size:.72rem;color:var(--fg2);text-transform:capitalize}
.av-t{position:relative;height:26px;border-radius:8px;background:repeating-linear-gradient(90deg,var(--line) 0 1px,transparent 1px calc(100% / 24)),var(--bg2);overflow:hidden}
.pst{position:absolute;top:0;bottom:0;left:0;background:repeating-linear-gradient(-45deg,color-mix(in srgb,var(--fg) 8%,transparent) 0 4px,transparent 4px 8px)}
.tk-b{position:absolute;top:0;bottom:0;background:color-mix(in srgb,var(--fg2) 28%,transparent);border-left:3px solid var(--c);display:flex;align-items:center;padding:0 5px;font-size:.66rem;color:var(--fg);overflow:hidden;white-space:nowrap}
.sel{position:absolute;top:2px;bottom:2px;border-radius:6px;background:var(--c);opacity:.9;box-shadow:0 0 0 2px color-mix(in srgb,var(--c) 40%,transparent);transition:left .25s ease,width .25s ease}
.sel.bad{background:var(--bad);animation:blink .7s ease infinite alternate}
@keyframes blink{to{opacity:.5}}
.av-h div{position:relative;height:14px}
.av-h i{position:absolute;transform:translateX(-50%);font-style:normal;font-size:.64rem;color:var(--fg2)}
.av-h i:first-child{transform:none}.av-h i:last-child{transform:translateX(-100%)}
.msg{display:flex;align-items:center;gap:7px;font-size:.85rem;font-weight:600;min-height:22px;margin-top:8px;transition:color .2s}
.msg:empty{display:none}
.msg ha-icon{--mdc-icon-size:18px}
.msg.ok{color:var(--ok)}.msg.bad{color:var(--bad)}.msg.info{color:var(--fg2);background:var(--bg2);padding:10px 12px;border-radius:12px;margin:6px 0}
.meta{margin-top:14px;font-size:.75rem;color:var(--fg2)}
.confirm{position:absolute;inset:0;display:grid;place-items:center;background:color-mix(in srgb,var(--card-background-color,#fff) 80%,transparent);backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .2s;z-index:3}
.confirm.show{opacity:1;pointer-events:auto}
.cf-box{display:flex;flex-direction:column;align-items:center;gap:12px;padding:24px;text-align:center;transform:scale(.9);transition:transform .25s cubic-bezier(.2,.9,.3,1.3)}
.confirm.show .cf-box{transform:none}
.cf-box > ha-icon{--mdc-icon-size:44px;color:var(--bad)}
.cf-b{display:flex;gap:8px}
.done{position:absolute;inset:0;z-index:4;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;background:var(--card-background-color,#fff);animation:fade .2s ease}
.done svg{width:92px;height:92px}
.done .c{fill:none;stroke:var(--ok);stroke-width:2.5;stroke-dasharray:151;stroke-dashoffset:151;animation:draw .55s ease forwards}
.done .k{fill:none;stroke:var(--ok);stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:48;stroke-dashoffset:48;animation:draw .35s .45s ease forwards}
.done.trash .c,.done.trash .k{stroke:var(--bad)}
.done svg{animation:boing .5s .75s ease}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes boing{50%{transform:scale(1.12)}}
.done b{font-size:1.3rem;animation:rise .4s .5s backwards}
.done span{color:var(--fg2);animation:rise .4s .65s backwards}
/* réglages */
.tabs{display:flex;gap:4px;padding:0 14px;border-bottom:1px solid var(--line)}
.tabs button{display:flex;align-items:center;gap:6px;padding:10px 12px;font-weight:600;font-size:.88rem;color:var(--fg2);border-bottom:2.5px solid transparent;margin-bottom:-1px;transition:all .2s}
.tabs button.on{color:var(--acc);border-bottom-color:var(--acc)}
@media (max-width:420px){.tabs button span{display:none}.tabs button{flex:1;justify-content:center}}
.sblock{margin-top:14px;padding:12px 14px 14px;border-radius:16px;background:var(--bg2);border-left:4px solid var(--c);animation:rise .3s ease backwards}
.ov.still .sblock{animation:none}
.sb-h{display:flex;align-items:center;gap:6px}
.sb-pic{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:var(--c);color:#fff;overflow:hidden;flex:0 0 auto}
.sb-pic.av{border-radius:50%}
.sb-pic img{width:100%;height:100%;object-fit:cover}
.sb-h input.big{flex:1;min-width:0;font-weight:600;font-size:1rem;background:var(--card-background-color,#fff)}
.sblock input,.sblock select{background:var(--card-background-color,#fff)}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:0 12px}
@media (max-width:440px){.grid2{grid-template-columns:1fr}}
input[type=color]{width:100%;height:40px;padding:3px;border-radius:12px;border:1.5px solid var(--line);background:none;cursor:pointer}
input[type=color].sw{width:40px;flex:0 0 auto}
.icons{display:flex;flex-wrap:wrap;gap:4px;align-items:center}
.ic{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;background:var(--card-background-color,#fff);border:1.5px solid transparent;color:var(--fg2)}
.ic.on{border-color:var(--c);color:var(--c);background:color-mix(in srgb,var(--c) 12%,transparent)}
.icin{flex:1;min-width:120px;width:auto!important}
.photo{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.photo input{flex:1;min-width:160px;width:auto}
.upl{margin:0;height:40px;cursor:pointer;color:var(--fg);font-size:.85rem}
.checks{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.ck{display:inline-flex;align-items:center;gap:6px;margin:0;padding:6px 10px;border-radius:10px;background:var(--card-background-color,#fff);font-weight:500;color:var(--fg);cursor:pointer}
.ck input{accent-color:var(--acc);margin:0}
.sw-l{display:flex;gap:10px;align-items:flex-start;margin:14px 0 0;padding:10px 12px;border-radius:12px;background:var(--bg2);color:var(--fg);font-weight:500;font-size:.9rem;cursor:pointer}
.sw-l input{width:18px;height:18px;accent-color:var(--acc);margin:1px 0 0;flex:0 0 auto}
.sw-l small{display:block;color:var(--fg2);font-size:.78rem;margin-top:2px}
.narrow{max-width:120px}
.hint{font-size:.82rem;color:var(--fg2);margin-top:10px}
.add{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:14px;padding:12px;border-radius:14px;border:2px dashed var(--line);color:var(--fg2);font-weight:600;transition:all .2s}
.add:hover{border-color:var(--acc);color:var(--acc)}
.smsg{font-size:.82rem;font-weight:600;color:var(--ok)}
.smsg.bad{color:var(--bad)}
:host([noanim]) *,:host([noanim]) *::before,:host([noanim]) *::after{animation:none!important;transition:none!important}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition:none!important}}
`;

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = (n) => String(n).padStart(2, "0");
const HOUR = 3600e3, DAY = 864e5;
const dayStart = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const hm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const locale = () => (HBC_LANG === "fr" ? "fr-FR" : HBC_LANG);
const fT = (d) => d.toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit" });
const fD = (d, o = { weekday: "short", day: "numeric", month: "short" }) => d.toLocaleDateString(locale(), o);
const sameDay = (a, b) => ymd(a) === ymd(b);
const parseLocal = (date, time) => { const [y, m, d] = String(date).split("-").map(Number); const [h, mi] = String(time || "00:00").split(":").map(Number); return new Date(y, (m || 1) - 1, d || 1, h || 0, mi || 0, 0, 0); };
const initials = (n) => String(n || "?").trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
function fWhen(d, now = new Date()) {
  if (sameDay(d, now)) return fT(d);
  if (sameDay(d, addDays(now, 1))) return `${_("Demain").toLowerCase()} ${fT(d)}`;
  if (d - now < 6 * DAY && d > now) return `${fD(d, { weekday: "short" })} ${fT(d)}`;
  return `${fD(d, { day: "numeric", month: "short" })} ${fT(d)}`;
}
function fDur(ms) {
  const m = Math.max(0, Math.round(ms / 60000));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  if (h < 24) return r ? `${h} h ${pad(r)}` : `${h} h`;
  const d = Math.floor(h / 24), rh = h % 24;
  const j = { fr: "j", de: "T", es: "d", it: "g", nl: "d", pt: "d", pl: "d", en: "d" }[HBC_LANG] || "d";
  return rh ? `${d} ${j} ${rh} h` : `${d} ${j}`;
}
const fRange = (s, e) => (sameDay(s, e) ? `${fT(s)} → ${fT(e)}` : `${fD(s, { weekday: "short", day: "numeric" })} ${fT(s)} → ${fD(e, { weekday: "short", day: "numeric" })} ${fT(e)}`);
const REASONS = [["Courses", "mdi:cart"], ["Travail", "mdi:briefcase"], ["Rendez-vous", "mdi:calendar-account"], ["École", "mdi:school"], ["Sport", "mdi:run"], ["Loisirs", "mdi:party-popper"], ["Vacances", "mdi:beach"]];
const ERRORS = {
  overlap: (e) => _("Chevauche la réservation de {who} ({t}).", { who: e?.data?.booking?.person_name || "?", t: e?.data?.booking ? fRange(new Date(e.data.booking.start), new Date(e.data.booking.end)) : "" }),
  invalid_dates: () => _("Le retour doit être après le départ."),
  too_long: (e) => _("Réservation trop longue (maximum {n} jours).", { n: e?.data?.max_days ?? "?" }),
  past: () => _("Ce créneau est déjà passé."),
  forbidden: () => _("Vous ne pouvez modifier que vos propres réservations."),
  not_found: () => _("Réservation introuvable (déjà supprimée ?)."),
  not_loaded: () => _("HOLM Booking Cars n'est pas installé : ajoutez l'intégration dans Paramètres › Appareils et services."),
  unknown_command: () => _("HOLM Booking Cars n'est pas installé : ajoutez l'intégration dans Paramètres › Appareils et services."),
};
const errText = (e) => (ERRORS[e?.code] ? ERRORS[e.code](e) : _("Erreur : {e}", { e: e?.message || e?.code || e }));

class HolmBookingCarsCard extends HTMLElement {
  static getConfigElement() { return document.createElement("holm-booking-cars-card-editor"); }
  static getStubConfig() { return { view: "week" }; }

  setConfig(config) {
    this._config = { view: "week", first_day: "today", hours_from: 6, hours_to: 24, show_header: true, animations: true, ...(config || {}) };
    this._view = this._view || (this._config.view === "list" ? "list" : "week");
    if (this._config.vehicle) this._vid = this._config.vehicle;
    if (this.shadowRoot) this._render();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    setLang(hass, this._config?.language);
    if (!this.shadowRoot) this._build();
    if (this.isConnected) this._subscribe();
    if (first) this._render();
    else if (this._energyKey() !== this._lastEnergy) this._renderMain();
  }

  getCardSize() { return 7; }
  getGridOptions() { return { columns: 12, min_columns: 6 }; }

  connectedCallback() {
    if (!this.shadowRoot) this._build();
    this._subscribe();
    clearInterval(this._timer);
    this._timer = setInterval(() => { if (!this._modal && !this._settings) this._renderMain(false); else this._renderHeaderOnly(); }, 30000);
  }

  disconnectedCallback() {
    clearInterval(this._timer);
    const u = this._unsub; this._unsub = null; this._subPending = false;
    if (typeof u === "function") Promise.resolve().then(u).catch(() => {});
    this._closeOverlay();
  }

  _build() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<style>${HBC_CSS}</style><ha-card><div id="main"></div><div id="toast"></div></ha-card>`;
    this.$main = this.shadowRoot.getElementById("main");
    this.$toast = this.shadowRoot.getElementById("toast");
    this.$main.addEventListener("click", (e) => this._onMainClick(e));
  }

  async _subscribe() {
    if (!this._hass || this._unsub || this._subPending) return;
    this._subPending = true;
    try {
      const unsub = await this._hass.connection.subscribeMessage((d) => this._onData(d), { type: "holm_booking_cars/subscribe" });
      if (!this._subPending) { unsub(); return; }   // carte retirée entre-temps
      this._unsub = unsub;
    } catch (e) {
      this._error = e;
      this._render();
      if (e?.code !== "unknown_command") setTimeout(() => { if (this.isConnected) this._subscribe(); }, 20000);
    } finally { this._subPending = false; }
  }

  _ws(msg) { return this._hass.callWS(msg); }

  _onData(d) {
    const firstData = !this._data;
    this._data = d;
    this._error = null;
    if (!this._vid || !d.vehicles.some((v) => v.id === this._vid)) this._vid = this._config.vehicle && d.vehicles.some((v) => v.id === this._config.vehicle) ? this._config.vehicle : d.vehicles[0]?.id;
    if (firstData) this._anim = "in";
    this._renderMain();
    if (this._modal) this._modalRefresh();
  }

  // ---------- données ----------
  get vehicle() { return this._data?.vehicles.find((v) => v.id === this._vid); }
  person(id) { return this._data?.people.find((p) => p.id === id); }
  bookings(vid = this._vid) { return (this._data?.bookings || []).filter((b) => b.vehicle === vid).map((b) => ({ ...b, s: new Date(b.start), e: new Date(b.end) })); }
  vstate(vid = this._vid, now = new Date()) {
    let current = null, next = null;
    for (const b of this.bookings(vid)) {
      if (b.s <= now && now < b.e) current = b;
      else if (b.s > now && (!next || b.s < next.s)) next = b;
    }
    const status = current ? "booked" : next && next.s - now <= HOUR ? "soon" : "free";
    return { status, current, next };
  }
  _energyKey() {
    const v = this.vehicle; const ent = v?.battery_entity || v?.fuel_entity;
    const st = ent && this._hass?.states[ent];
    return st ? `${st.state}` : "";
  }

  // ---------- rendu ----------
  _render() {
    if (!this.shadowRoot) return;
    this.toggleAttribute("noanim", this._config?.animations === false);
    this._renderMain();
  }

  _renderMain(animate = true) {
    if (!this.$main) return;
    if (this._error && !this._data) {
      this.$main.innerHTML = `<div class="err"><ha-icon icon="mdi:car-off"></ha-icon><div>${esc(errText(this._error))}</div></div>`;
      return;
    }
    if (!this._data) { this.$main.innerHTML = `<div class="loading"><div class="spin"></div></div>`; return; }
    const anim = animate && this._anim;
    this.$main.innerHTML = `${this._config.title ? `<div class="title">${esc(this._config.title)}</div>` : ""}
      ${this._config.show_header !== false ? `<div id="hdr">${this._headerHtml()}</div>` : ""}
      ${this._chipsHtml()}
      ${this._toolbarHtml()}
      <div class="body">${this._view === "list" ? this._listHtml(anim) : this._weekHtml(anim)}</div>`;
    this._anim = null;
    this._lastEnergy = this._energyKey();
  }

  _renderHeaderOnly() {
    const h = this.shadowRoot?.getElementById("hdr");
    if (h && this._data) h.innerHTML = this._headerHtml();
  }

  _headerHtml() {
    const v = this.vehicle;
    if (!v) return "";
    const now = new Date();
    const { status, current, next } = this.vstate(v.id, now);
    const pc = (b) => this.person(b.person)?.color || b.color || "#78909c";
    let pill, sub = "", prog = "";
    if (status === "booked") {
      pill = `<div class="pill booked" style="--pc:${pc(current)}"><span class="dot"></span>${esc(_("Réservé par {who}", { who: current.person_name }))}</div>`;
      sub = `${esc(_("jusqu'à {t}", { t: fWhen(current.e, now) }))} · <b>${esc(_("encore {d}", { d: fDur(current.e - now) }))}</b>`;
      const pct = Math.min(100, Math.max(0, ((now - current.s) / (current.e - current.s)) * 100));
      prog = `<div class="prog"><i style="width:${pct.toFixed(1)}%;background:${pc(current)}"></i></div>`;
    } else if (status === "soon") {
      pill = `<div class="pill soon"><span class="dot"></span>${esc(_("Disponible"))}</div>`;
      sub = `${esc(_("{who} part à {t}", { who: next.person_name, t: fT(next.s) }))} · <b>${esc(_("dans {d}", { d: fDur(next.s - now) }))}</b>`;
    } else {
      pill = `<div class="pill free"><span class="dot"></span>${esc(_("Disponible"))}</div>`;
      sub = next ? esc(_("Libre jusqu'à {t}", { t: fWhen(next.s, now) })) + ` · ${esc(next.person_name)}` : esc(_("Rien de prévu"));
    }
    const ent = v.battery_entity || v.fuel_entity;
    const st = ent && this._hass?.states[ent];
    let energy = "";
    if (st && !["unknown", "unavailable"].includes(st.state)) {
      const val = Number(st.state);
      const icon = v.battery_entity ? (val >= 90 ? "mdi:battery" : val < 10 ? "mdi:battery-outline" : `mdi:battery-${Math.max(10, Math.round(val / 10) * 10)}`) : "mdi:gas-station";
      energy = `<span class="energy ${val < 20 ? "low" : ""}"><ha-icon icon="${icon}"></ha-icon>${esc(st.state)}${esc(st.attributes.unit_of_measurement ? " " + st.attributes.unit_of_measurement : "")}</span>`;
    }
    const finish = current && current.can_edit ? `<button class="ghost sm" data-act="finish" data-b="${current.id}"><ha-icon icon="mdi:key-arrow-right"></ha-icon>${esc(_("Rendre maintenant"))}</button>` : "";
    const pic = v.image ? `<img src="${esc(v.image)}" alt="">` : `<ha-icon icon="${esc(v.icon || "mdi:car-side")}"></ha-icon>`;
    return `<div class="hdr st-${status}" style="--vc:${v.color}">
      <div class="pic ${v.image ? "img" : ""}">${pic}</div>
      <div class="info">
        <div class="name">${esc(v.name)}${v.plate ? `<span class="plate">${esc(v.plate)}</span>` : ""}${energy}</div>
        ${pill}
        <div class="sub">${sub}</div>
      </div>
      <div class="acts">
        ${this._data.admin ? `<button class="icon" data-act="settings" title="${esc(_("Réglages"))}"><ha-icon icon="mdi:cog"></ha-icon></button>` : ""}
      </div>
    </div>${prog}${finish ? `<div class="finish">${finish}</div>` : ""}`;
  }

  _chipsHtml() {
    const vs = this._data.vehicles;
    if (vs.length < 2 || this._config.vehicle) return "";
    return `<div class="vchips">${vs.map((v) => {
      const st = this.vstate(v.id).status;
      return `<button class="vchip ${v.id === this._vid ? "on" : ""}" data-act="vehicle" data-v="${v.id}" style="--vc:${v.color}">
        <span class="sd st-${st}"></span>${v.image ? `<img src="${esc(v.image)}" alt="">` : `<ha-icon icon="${esc(v.icon)}"></ha-icon>`}<span>${esc(v.name)}</span></button>`;
    }).join("")}</div>`;
  }

  _weekStart() {
    const today = dayStart(new Date());
    let s = today;
    if (this._config.first_day === "monday") s = addDays(today, -((today.getDay() + 6) % 7));
    else if (this._config.first_day === "sunday") s = addDays(today, -today.getDay());
    return addDays(s, 7 * (this._week || 0));
  }

  _toolbarHtml() {
    const ws = this._weekStart(), we = addDays(ws, 6);
    const label = ws.getMonth() === we.getMonth() ? `${ws.getDate()}–${fD(we, { day: "numeric", month: "short" })}`
      : `${fD(ws, { day: "numeric", month: "short" })}–${fD(we, { day: "numeric", month: "short" })}`;
    const nav = this._view === "week" ? `<div class="nav">
        <button class="icon" data-act="prev" title="${esc(_("Semaine précédente"))}"><ha-icon icon="mdi:chevron-left"></ha-icon></button>
        <button class="lbl ${this._week ? "away" : ""}" data-act="today" title="${esc(_("Aujourd'hui"))}">${esc(label)}</button>
        <button class="icon" data-act="next" title="${esc(_("Semaine suivante"))}"><ha-icon icon="mdi:chevron-right"></ha-icon></button></div>`
      : `<div class="seg sm">
        <button class="${!this._history ? "on" : ""}" data-act="upcoming">${esc(_("À venir"))}</button>
        <button class="${this._history ? "on" : ""}" data-act="history">${esc(_("Historique"))}</button></div>`;
    return `<div class="toolbar">
      <div class="seg">
        <button class="${this._view === "week" ? "on" : ""}" data-act="week" title="${esc(_("Semaine"))}"><ha-icon icon="mdi:calendar-week"></ha-icon></button>
        <button class="${this._view === "list" ? "on" : ""}" data-act="list" title="${esc(_("Liste"))}"><ha-icon icon="mdi:format-list-bulleted"></ha-icon></button>
      </div>
      ${nav}
      <button class="primary" data-act="book"><ha-icon icon="mdi:plus"></ha-icon><span>${esc(_("Réserver"))}</span></button>
    </div>`;
  }

  _hours() {
    let h0 = Math.max(0, Math.min(23, Number(this._config.hours_from ?? 6)));
    let h1 = Math.max(h0 + 1, Math.min(24, Number(this._config.hours_to ?? 24)));
    return [h0, h1];
  }

  _weekHtml(anim) {
    const [h0, h1] = this._hours();
    const span = (h1 - h0) * HOUR;
    const ws = this._weekStart();
    const now = new Date();
    const list = this.bookings();
    const me = this._data.me;
    const step = h1 - h0 > 12 ? 3 : 2;
    const ticks = [];
    for (let h = Math.ceil(h0 / step) * step; h <= h1; h += step) ticks.push(`<span style="left:${((h - h0) / (h1 - h0)) * 100}%">${pad(h)}</span>`);
    let count = 0, idx = 0;
    const rows = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(ws, i);
      const a = new Date(d.getTime() + h0 * HOUR), z = new Date(d.getTime() + h1 * HOUR);
      const isToday = sameDay(d, now);
      const pastPct = now <= a ? 0 : now >= z ? 100 : ((now - a) / span) * 100;
      const blocks = list.filter((b) => b.s < z && b.e > a).map((b) => {
        if (b.s >= a || sameDay(b.s, d)) count++;
        const l = Math.max(0, (b.s - a) / span) * 100, r = Math.min(1, (b.e - a) / span) * 100;
        const cur = b.s <= now && now < b.e;
        const color = this.person(b.person)?.color || b.color;
        const wide = r - l;
        const txt = wide > 22 ? `${esc(b.person_name)}${b.reason ? ` · ${esc(b.reason)}` : ""}` : wide > 9 ? esc(b.person_name) : esc(initials(b.person_name));
        return `<div class="blk ${b.id === this._flash ? "flash" : ""} ${cur ? "cur" : ""} ${b.person === me ? "mine" : ""} ${b.e <= now ? "done" : ""} ${b.s < a ? "cl" : ""} ${b.e > z ? "cr" : ""}"
          data-b="${b.id}" title="${esc(`${b.person_name} — ${fRange(b.s, b.e)}${b.reason ? " — " + b.reason : ""}`)}"
          style="left:${l}%;width:max(${r - l}%,10px);--c:${color};${anim ? `animation-delay:${idx++ * 45}ms` : ""}"><span>${txt}</span></div>`;
      }).join("");
      const nowLine = isToday && now > a && now < z ? `<div class="now" style="left:${pastPct}%"></div>` : "";
      rows.push(`<div class="day ${isToday ? "today" : ""} ${z <= now ? "past" : ""}">
        <div class="dl"><b>${esc(fD(d, { weekday: "short" }))}</b><span>${d.getDate()}</span></div>
        <div class="track" data-day="${ymd(d)}" style="--past:${pastPct}%">${blocks}${nowLine}</div></div>`);
    }
    const slide = anim === "left" || anim === "right" ? `slide-${anim}` : "";
    return `<div class="week ${slide} ${anim ? "anim" : ""}" style="--steps:${(h1 - h0) / step}">
      <div class="ticks"><div></div><div class="tk">${ticks.join("")}</div></div>
      ${rows.join("")}
      <div class="wfoot">${count ? esc(_("{n} réservation(s) cette semaine", { n: count })) : esc(_("Touchez un créneau libre pour réserver."))}</div>
    </div>`;
  }

  _listHtml(anim) {
    const now = new Date();
    let list = this.bookings();
    list = this._history ? list.filter((b) => b.e <= now).sort((a, b) => b.s - a.s) : list.filter((b) => b.e > now).sort((a, b) => a.s - b.s);
    if (!list.length) return `<div class="empty"><ha-icon icon="mdi:calendar-blank-outline"></ha-icon><div>${esc(_(this._history ? "Aucune réservation passée" : "Aucune réservation à venir"))}</div></div>`;
    let html = "", last = "", i = 0;
    for (const b of list) {
      const key = ymd(b.s);
      if (key !== last) {
        last = key;
        const lbl = sameDay(b.s, now) ? _("Aujourd'hui") : sameDay(b.s, addDays(now, 1)) ? _("Demain") : fD(b.s, { weekday: "long", day: "numeric", month: "long" });
        html += `<div class="grp">${esc(lbl)}</div>`;
      }
      const p = this.person(b.person);
      const color = p?.color || b.color;
      const cur = b.s <= now && now < b.e;
      const chip = cur ? `<span class="chip cur">${esc(_("En cours"))}</span>` : b.e <= now ? `<span class="chip">${esc(_("Terminée"))}</span>` : "";
      const meta = [fRange(b.s, b.e), b.reason, b.destination ? `📍\u00a0${b.destination}` : "", b.km ? `${b.km} km` : ""].filter(Boolean).map(esc).join(" · ");
      html += `<div class="item ${b.id === this._flash ? "flash" : ""} ${anim ? "anim" : ""} ${cur ? "cur" : ""}" data-b="${b.id}" style="--c:${color};${anim ? `animation-delay:${i++ * 40}ms` : ""}">
        <div class="av">${esc(initials(b.person_name))}</div>
        <div class="it"><div class="it-t">${esc(b.person_name)}${b.person === this._data.me ? ` <small>(${esc(_("Vous"))})</small>` : ""}${chip}</div><div class="it-s">${meta}</div>
        ${b.note ? `<div class="it-n">${esc(b.note)}</div>` : ""}</div>
        <ha-icon class="go" icon="${b.can_edit ? "mdi:pencil" : "mdi:chevron-right"}"></ha-icon></div>`;
    }
    return `<div class="list">${html}</div>`;
  }

  // ---------- actions ----------
  _onMainClick(e) {
    const t = e.target.closest("[data-act],[data-b],.track");
    if (!t) return;
    const act = t.dataset.act;
    if (act === "vehicle") { this._vid = t.dataset.v; this._anim = "in"; return this._renderMain(); }
    if (act === "week" || act === "list") { this._view = act; this._anim = "in"; return this._renderMain(); }
    if (act === "prev" || act === "next") { this._week = (this._week || 0) + (act === "next" ? 1 : -1); this._anim = act === "next" ? "right" : "left"; return this._renderMain(); }
    if (act === "today") { const dir = (this._week || 0) > 0 ? "left" : "right"; this._week = 0; this._anim = dir; return this._renderMain(); }
    if (act === "upcoming" || act === "history") { this._history = act === "history"; this._anim = "in"; return this._renderMain(); }
    if (act === "book") return this._openNew();
    if (act === "settings") return this._openSettings();
    if (act === "finish") return this._finish(t.dataset.b);
    if (t.dataset.b) return this._openBooking(t.dataset.b);
    if (t.classList.contains("track")) {
      const r = t.getBoundingClientRect();
      const [h0, h1] = this._hours();
      const ratio = Math.min(0.999, Math.max(0, (e.clientX - r.left) / r.width));
      const day = parseLocal(t.dataset.day, "00:00");
      const at = new Date(day.getTime() + (h0 + Math.floor(ratio * (h1 - h0))) * HOUR);
      return this._openNew(at);
    }
  }

  async _finish(id) {
    try {
      await this._ws({ type: "holm_booking_cars/finish", booking_id: id });
      this._toast(_("Véhicule rendu, merci !"), "mdi:check-circle");
    } catch (e) { this._toast(errText(e), "mdi:alert-circle", true); }
  }

  _toast(text, icon = "mdi:check-circle", bad = false) {
    if (!this.$toast) return;
    this.$toast.innerHTML = `<div class="tst ${bad ? "bad" : ""}"><ha-icon icon="${icon}"></ha-icon><span>${esc(text)}</span></div>`;
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => { this.$toast.innerHTML = ""; }, bad ? 5000 : 2600);
  }
}

const roundUp = (d, min) => { const x = new Date(d); x.setSeconds(0, 0); const m = x.getMinutes(); const r = Math.ceil(m / min) * min; x.setMinutes(r); return x; };

Object.assign(HolmBookingCarsCard.prototype, {
  // ---------- couche au-dessus de la page (hors de la carte : jamais rognée par la vue) ----------
  _overlay() {
    if (!this._ovHost) {
      this._ovHost = document.createElement("div");
      this._ovHost.setAttribute("data-holm-booking-cars", "");
      const sr = this._ovHost.attachShadow({ mode: "open" });
      sr.innerHTML = `<style>${HBC_CSS}</style><div id="ov"></div>`;
      this.$ov = sr.getElementById("ov");
      this.$ov.addEventListener("click", (e) => this._onOvClick(e));
      this.$ov.addEventListener("input", (e) => this._onOvInput(e));
      this.$ov.addEventListener("change", (e) => this._onOvInput(e, true));
      this._onKey = (e) => { if (e.key === "Escape") this._closeOverlay(); };
    }
    if (!this._ovHost.isConnected) { document.body.appendChild(this._ovHost); window.addEventListener("keydown", this._onKey); }
    this._ovHost.toggleAttribute("noanim", this._config?.animations === false);
    return this.$ov;
  },

  _closeOverlay(now = false) {
    this._modal = null;
    this._settings = null;
    if (!this._ovHost?.isConnected) return;
    window.removeEventListener("keydown", this._onKey);
    const ov = this.$ov.querySelector(".ov");
    if (ov && !now && this._config?.animations !== false) {
      ov.classList.add("out");
      setTimeout(() => { if (!this._modal && !this._settings) this._ovHost.remove(); }, 220);
    } else this._ovHost.remove();
    this._renderMain(false);
  },

  // ---------- réservation : ouverture ----------
  _slot() { return Number(this._data?.settings?.slot_minutes) || 15; },

  _openNew(at) {
    const now = new Date(), slot = this._slot();
    let s = at ? new Date(at) : roundUp(now, slot);
    if (s < now) s = roundUp(now, slot);
    const list = this.bookings().sort((a, b) => a.s - b.s);
    for (const b of list) if (b.s <= s && s < b.e) s = new Date(b.e);
    let e = new Date(s.getTime() + 2 * HOUR);
    const nxt = list.find((b) => b.s >= s);
    if (nxt && nxt.s < e && nxt.s - s >= slot * 60000) e = new Date(nxt.s);
    const me = this._data.me || this._data.people[0]?.id || "";
    this._modal = { mode: "new", vehicle: this._vid, person: me, start: s, end: e, reason: "", destination: "", km: "", note: "" };
    this._renderModal();
  },

  _openBooking(id) {
    const b = (this._data.bookings || []).find((x) => x.id === id);
    if (!b) return;
    this._modal = { mode: b.can_edit ? "edit" : "view", id, vehicle: b.vehicle, person: b.person, start: new Date(b.start), end: new Date(b.end),
      reason: b.reason || "", destination: b.destination || "", km: b.km ?? "", note: b.note || "", orig: b };
    this._renderModal();
  },

  // ---------- réservation : rendu ----------
  _renderModal() {
    const m = this._modal, d = this._data;
    const ov = this._overlay();
    const ro = m.mode === "view";
    const v = d.vehicles.find((x) => x.id === m.vehicle) || this.vehicle;
    const title = m.mode === "new" ? _("Nouvelle réservation") : m.mode === "edit" ? _("Modifier la réservation") : _("Réservation");
    const people = d.people.length ? d.people : [{ id: "", name: d.user_name || "?", color: "#78909c" }];
    const step = this._slot() * 60;
    const vehicles = d.vehicles.length > 1 && !ro ? `<label>${esc(_("Véhicule"))}</label><div class="chips">${d.vehicles.map((x) =>
      `<button class="chip-b ${x.id === m.vehicle ? "on" : ""}" data-m="veh" data-v="${x.id}" style="--c:${x.color}"><ha-icon icon="${esc(x.icon)}"></ha-icon>${esc(x.name)}</button>`).join("")}</div>` : "";
    const who = `<label>${esc(_("Pour qui ?"))}</label><div class="chips">${people.map((p) =>
      `<button class="chip-b person ${p.id === m.person ? "on" : ""}" data-m="person" data-p="${p.id}" style="--c:${p.color}" ${ro ? "disabled" : ""}>
        <span class="av">${esc(initials(p.name))}</span>${esc(p.name)}${p.id === d.me ? ` <small>(${esc(_("Vous"))})</small>` : ""}</button>`).join("")}</div>`;
    const dis = ro ? "disabled" : "";
    const dt = `<div class="when">
      <div class="dt"><span class="wl"><ha-icon icon="mdi:ray-start-arrow"></ha-icon>${esc(_("Départ"))}</span><input type="date" data-f="sd" ${dis}><input type="time" data-f="st" step="${step}" ${dis}></div>
      <div class="dt"><span class="wl"><ha-icon icon="mdi:ray-end"></ha-icon>${esc(_("Retour"))}</span><input type="date" data-f="ed" ${dis}><input type="time" data-f="et" step="${step}" ${dis}></div></div>
      ${ro ? "" : `<div class="chips dur"><span class="dl2">${esc(_("Durée"))}</span>${[1, 2, 3, 4, 8].map((h) => `<button class="chip-b sm" data-m="dur" data-h="${h}">${h} h</button>`).join("")}
        <button class="chip-b sm" data-m="dur" data-h="day">${esc(_("Journée"))}</button></div>`}
      <div class="avail" id="avail"></div><div class="msg" id="msg"></div>`;
    const reasons = ro ? "" : `<div class="chips rs">${REASONS.map(([r, i]) => `<button class="chip-b sm" data-m="reason" data-r="${esc(_(r))}"><ha-icon icon="${i}"></ha-icon>${esc(_(r))}</button>`).join("")}</div>`;
    const fields = `<label>${esc(_("Motif"))}</label>${reasons}<input type="text" data-f="reason" maxlength="80" placeholder="${esc(_("Motif"))}…" ${dis}>
      <div class="row2"><div><label>${esc(_("Destination"))}</label><input type="text" data-f="destination" maxlength="120" ${dis}></div>
      <div class="km"><label>${esc(_("Km prévus"))}</label><input type="number" min="0" inputmode="numeric" data-f="km" ${dis}></div></div>
      <label>${esc(_("Note"))}</label><textarea data-f="note" rows="2" maxlength="500" ${dis}></textarea>`;
    const o = m.orig;
    const meta = o ? `<div class="meta">${esc(_("Réservé par {who} le {d}", { who: o.created_by_name || "?", d: fD(new Date(o.created_at), { day: "numeric", month: "short" }) + " " + fT(new Date(o.created_at)) }))}</div>` : "";
    const notice = ro ? `<div class="msg info"><ha-icon icon="mdi:lock"></ha-icon>${esc(_("Seul un administrateur ou {who} peut modifier cette réservation.", { who: o?.person_name || "?" }))}</div>` : "";
    const foot = ro ? `<span class="sp"></span><button class="primary" data-m="close">${esc(_("Fermer"))}</button>`
      : `${m.mode === "edit" ? `<button class="danger ghost" data-m="askdel"><ha-icon icon="mdi:delete-outline"></ha-icon>${esc(_("Supprimer"))}</button>` : ""}
         <span class="sp"></span><button class="ghost" data-m="close">${esc(_("Annuler"))}</button>
         <button class="primary" data-m="save" id="save"><ha-icon icon="mdi:check"></ha-icon>${esc(_(m.mode === "new" ? "Réserver" : "Enregistrer"))}</button>`;
    ov.innerHTML = `<div class="ov"><div class="back" data-m="close"></div>
      <div class="sheet" role="dialog" aria-modal="true" style="--vc:${v?.color || "var(--primary-color)"}">
        <div class="sh-h"><div class="sh-ic">${v?.image ? `<img src="${esc(v.image)}" alt="">` : `<ha-icon icon="${esc(v?.icon || "mdi:car-side")}"></ha-icon>`}</div>
          <div class="sh-tt"><h3>${esc(title)}</h3><small>${esc(v?.name || "")}</small></div>
          <button class="icon" data-m="close" title="${esc(_("Fermer"))}"><ha-icon icon="mdi:close"></ha-icon></button></div>
        <div class="sh-b">${notice}${vehicles}${who}${dt}${fields}${meta}</div>
        <div class="sh-f">${foot}</div>
        <div class="confirm" id="confirm"><div class="cf-box"><ha-icon icon="mdi:delete-alert-outline"></ha-icon><b>${esc(_("Supprimer cette réservation ?"))}</b>
          <div class="cf-b"><button class="ghost" data-m="nodel">${esc(_("Annuler"))}</button><button class="danger" data-m="del">${esc(_("Oui, supprimer"))}</button></div></div></div>
      </div></div>`;
    const q = (k) => ov.querySelector(`[data-f="${k}"]`);
    q("sd").value = ymd(m.start); q("st").value = hm(m.start); q("ed").value = ymd(m.end); q("et").value = hm(m.end);
    for (const k of ["reason", "destination", "km", "note"]) q(k).value = m[k] ?? "";
    this._modalRefresh();
  },

  // parties qui changent sans reconstruire la fenêtre (saisie conservée) : disponibilités, message, boutons
  _modalRefresh() {
    const m = this._modal;
    if (!m || !this.$ov) return;
    if (m.id && !this._data.bookings.some((b) => b.id === m.id) && !m.done) {   // supprimée ailleurs entre-temps
      this._closeOverlay();
      return this._toast(_("Réservation introuvable (déjà supprimée ?)."), "mdi:information", true);
    }
    const ov = this.$ov;
    ov.querySelectorAll('[data-m="person"]').forEach((b) => b.classList.toggle("on", b.dataset.p === m.person));
    ov.querySelectorAll('[data-m="veh"]').forEach((b) => b.classList.toggle("on", b.dataset.v === m.vehicle));
    ov.querySelectorAll('[data-m="reason"]').forEach((b) => b.classList.toggle("on", b.dataset.r === m.reason));
    const dur = (m.end - m.start) / HOUR;
    ov.querySelectorAll('[data-m="dur"]').forEach((b) => b.classList.toggle("on", Number(b.dataset.h) === dur));
    const { level, text } = this._check();
    const msg = ov.querySelector("#msg");
    if (msg && !m.serverError) { msg.className = `msg ${level}`; msg.innerHTML = text ? `<ha-icon icon="${level === "bad" ? "mdi:alert-circle" : "mdi:check-circle"}"></ha-icon>${esc(text)}` : ""; }
    const save = ov.querySelector("#save");
    if (save) save.disabled = level === "bad" || m.busy;
    const av = ov.querySelector("#avail");
    if (av) av.innerHTML = this._availHtml();
  },

  _others() {
    const m = this._modal;
    return this.bookings(m.vehicle).filter((b) => b.id !== m.id);
  },

  _check() {
    const m = this._modal;
    if (m.mode === "view") return { level: "", text: "" };
    if (!(m.start instanceof Date) || isNaN(m.start) || isNaN(m.end) || m.end <= m.start) return { level: "bad", text: _("Le retour doit être après le départ.") };
    const max = Number(this._data.settings.max_days) || 14;
    if (m.end - m.start > max * DAY) return { level: "bad", text: _("Réservation trop longue (maximum {n} jours).", { n: max }) };
    const moved = !m.orig || +new Date(m.orig.start) !== +m.start || +new Date(m.orig.end) !== +m.end;
    const running = m.orig && new Date(m.orig.start) <= new Date() && new Date() < new Date(m.orig.end);
    if (moved && m.end <= new Date() && !running) return { level: "bad", text: _("Ce créneau est déjà passé.") };
    const c = this._others().find((b) => m.start < b.e && m.end > b.s);
    if (c) return { level: "bad", text: _("Chevauche la réservation de {who} ({t}).", { who: c.person_name, t: fRange(c.s, c.e) }), conflict: c };
    return { level: "ok", text: _("Créneau libre ✓") };
  },

  _availHtml() {
    const m = this._modal;
    if (isNaN(m.start) || isNaN(m.end)) return "";
    const first = dayStart(m.start);
    const last = dayStart(new Date(Math.max(+m.start, +m.end - 1)));
    const n = Math.min(3, Math.round((last - first) / DAY) + 1);
    const others = this._others();
    const color = this.person(m.person)?.color || "var(--primary-color)";
    const { level } = this._check();
    let rows = "";
    for (let i = 0; i < n; i++) {
      const a = addDays(first, i), z = addDays(first, i + 1);
      const pos = (t) => Math.min(100, Math.max(0, ((t - a) / (z - a)) * 100));
      const taken = others.filter((b) => b.s < z && b.e > a).map((b) =>
        `<div class="tk-b" style="left:${pos(b.s)}%;width:${pos(b.e) - pos(b.s)}%;--c:${this.person(b.person)?.color || b.color}" title="${esc(b.person_name + " — " + fRange(b.s, b.e))}"><span>${esc(b.person_name)}</span></div>`).join("");
      const sel = m.start < z && m.end > a ? `<div class="sel ${level === "bad" ? "bad" : ""}" style="left:${pos(m.start)}%;width:${Math.max(0.8, pos(m.end) - pos(m.start))}%;--c:${color}"></div>` : "";
      const now = new Date();
      const past = now > a ? `<div class="pst" style="width:${pos(now)}%"></div>` : "";
      rows += `<div class="av-r"><span class="av-d">${esc(fD(a, { weekday: "short", day: "numeric" }))}</span><div class="av-t">${past}${taken}${sel}</div></div>`;
    }
    return `${rows}<div class="av-h"><span></span><div>${[0, 6, 12, 18, 24].map((h) => `<i style="left:${(h / 24) * 100}%">${pad(h % 24 === 0 && h ? 24 : h)}</i>`).join("")}</div></div>`;
  },

  // ---------- réservation : saisie ----------
  _onOvInput(e, committed) {
    if (this._settings) return this._setInput(e, committed);
    const m = this._modal;
    const f = e.target.dataset?.f;
    if (!m || !f) return;
    m.serverError = null;
    const ov = this.$ov, val = (k) => ov.querySelector(`[data-f="${k}"]`).value;
    if (f === "sd" || f === "st") {
      const d = parseLocal(val("sd"), val("st"));
      if (!isNaN(d)) {
        const len = m.end - m.start;
        m.start = d;
        if (len > 0) { m.end = new Date(d.getTime() + len); ov.querySelector('[data-f="ed"]').value = ymd(m.end); ov.querySelector('[data-f="et"]').value = hm(m.end); }
      }
    } else if (f === "ed" || f === "et") {
      const d = parseLocal(val("ed"), val("et"));
      if (!isNaN(d)) m.end = d;
    } else m[f] = e.target.value;
    this._modalRefresh();
  },

  _setEnd(end) {
    const m = this._modal;
    m.end = end;
    const ov = this.$ov;
    ov.querySelector('[data-f="ed"]').value = ymd(end); ov.querySelector('[data-f="et"]').value = hm(end);
  },

  _onOvClick(e) {
    const t = e.target.closest("[data-m]");
    if (!t) return;
    if (this._settings) return this._settingsClick(t, e);
    const m = this._modal, a = t.dataset.m;
    if (!m) return;
    if (a === "close") return this._closeOverlay();
    if (m.busy || m.mode === "view") return;
    m.serverError = null;
    if (a === "person") m.person = t.dataset.p;
    else if (a === "veh") {
      m.vehicle = t.dataset.v;
      const v = this._data.vehicles.find((x) => x.id === m.vehicle);
      this.$ov.querySelector(".sheet").style.setProperty("--vc", v.color);
      this.$ov.querySelector(".sh-tt small").textContent = v.name;
      this.$ov.querySelector(".sh-ic").innerHTML = v.image ? `<img src="${esc(v.image)}" alt="">` : `<ha-icon icon="${esc(v.icon)}"></ha-icon>`;
    } else if (a === "dur") {
      if (t.dataset.h === "day") {
        const s = new Date(m.start); s.setHours(Math.min(s.getHours(), 8), 0, 0, 0);
        if (s < new Date()) s.setTime(m.start.getTime());
        m.start = s;
        this.$ov.querySelector('[data-f="st"]').value = hm(s);
        const e2 = new Date(s); e2.setHours(20, 0, 0, 0);
        this._setEnd(e2 > s ? e2 : new Date(s.getTime() + 2 * HOUR));
      } else this._setEnd(new Date(m.start.getTime() + Number(t.dataset.h) * HOUR));
    } else if (a === "reason") {
      m.reason = m.reason === t.dataset.r ? "" : t.dataset.r;
      this.$ov.querySelector('[data-f="reason"]').value = m.reason;
    } else if (a === "askdel") { this.$ov.querySelector("#confirm").classList.add("show"); return; }
    else if (a === "nodel") { this.$ov.querySelector("#confirm").classList.remove("show"); return; }
    else if (a === "del") return this._delete();
    else if (a === "save") return this._save();
    this._modalRefresh();
  },

  async _save() {
    const m = this._modal;
    if (this._check().level === "bad") return this._shake();
    m.busy = true;
    this._modalRefresh();
    const body = { vehicle: m.vehicle, person: m.person || null, start: m.start.toISOString(), end: m.end.toISOString(),
      reason: m.reason || "", destination: m.destination || "", note: m.note || "", km: m.km === "" || m.km == null ? null : Number(m.km) };
    try {
      const res = m.mode === "new" ? await this._ws({ type: "holm_booking_cars/book", ...body })
        : await this._ws({ type: "holm_booking_cars/update", booking_id: m.id, ...body });
      this._flash = res?.booking?.id;
      clearTimeout(this._flashT);
      this._flashT = setTimeout(() => { this._flash = null; }, 4000);
      this._vid = m.vehicle;
      this._done(m.mode === "new" ? _("Réservé !") : _("Modifié !"), m.mode === "new" ? _("Bonne route !") : "", "check");
    } catch (err) {
      m.busy = false;
      m.serverError = err;
      this._modalRefresh();
      const msg = this.$ov.querySelector("#msg");
      msg.className = "msg bad";
      msg.innerHTML = `<ha-icon icon="mdi:alert-circle"></ha-icon>${esc(errText(err))}`;
      this._shake();
    }
  },

  async _delete() {
    const m = this._modal;
    m.busy = true;
    try {
      await this._ws({ type: "holm_booking_cars/delete", booking_id: m.id });
      m.done = true;
      this._done(_("Supprimé"), "", "trash");
    } catch (err) {
      m.busy = false;
      this.$ov.querySelector("#confirm").classList.remove("show");
      const msg = this.$ov.querySelector("#msg");
      msg.className = "msg bad";
      msg.innerHTML = `<ha-icon icon="mdi:alert-circle"></ha-icon>${esc(errText(err))}`;
      this._shake();
    }
  },

  _shake() {
    const s = this.$ov?.querySelector(".sheet");
    if (!s) return;
    s.classList.remove("shake"); void s.offsetWidth; s.classList.add("shake");
  },

  _done(title, sub, kind) {
    const m = this._modal;
    if (m) m.done = true;
    const sheet = this.$ov.querySelector(".sheet");
    const svg = kind === "trash"
      ? `<svg viewBox="0 0 52 52"><circle class="c" cx="26" cy="26" r="24"/><path class="k" d="M17 17 L35 35 M35 17 L17 35"/></svg>`
      : `<svg viewBox="0 0 52 52"><circle class="c" cx="26" cy="26" r="24"/><path class="k" d="M15 27 L23 35 L38 19"/></svg>`;
    const done = document.createElement("div");
    done.className = `done ${kind}`;
    done.innerHTML = `${svg}<b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ""}`;
    sheet.appendChild(done);
    this._anim = "in";
    setTimeout(() => this._closeOverlay(), this._config.animations === false ? 500 : 1300);
  },
});

const SETTINGS_ICONS = ["mdi:car-side", "mdi:car-hatchback", "mdi:car-estate", "mdi:car-sports", "mdi:car-electric", "mdi:van-utility", "mdi:van-passenger", "mdi:rv-truck", "mdi:motorbike", "mdi:bicycle", "mdi:truck"];

Object.assign(HolmBookingCarsCard.prototype, {
  _openSettings() {
    const d = this._data;
    this._settings = { tab: "vehicles", vehicles: JSON.parse(JSON.stringify(d.vehicles)), people: JSON.parse(JSON.stringify(d.people)),
      settings: { ...d.settings }, busy: false, msg: "" };
    this._renderSettings();
  },

  _renderSettings() {
    const S = this._settings, d = this._data;
    const ov = this._overlay();
    const keepScroll = ov.querySelector(".sh-b")?.scrollTop || 0;
    const tabs = [["vehicles", "mdi:car-multiple", "Véhicules"], ["people", "mdi:account-group", "Personnes"], ["options", "mdi:tune-variant", "Options"]];
    let body = "";
    if (S.tab === "vehicles") body = this._sVehicles();
    else if (S.tab === "people") body = this._sPeople();
    else body = this._sOptions();
    const animIn = !ov.querySelector(".ov.settings");
    ov.innerHTML = `<div class="ov settings ${animIn ? "" : "still"}"><div class="back" data-m="close"></div>
      <div class="sheet wide" role="dialog" aria-modal="true">
        <div class="sh-h"><div class="sh-ic"><ha-icon icon="mdi:cog"></ha-icon></div><div class="sh-tt"><h3>${esc(_("Réglages"))}</h3><small>HOLM Booking Cars ${HBC_VERSION}</small></div>
          <button class="icon" data-m="close" title="${esc(_("Fermer"))}"><ha-icon icon="mdi:close"></ha-icon></button></div>
        <div class="tabs">${tabs.map(([k, i, l]) => `<button class="${S.tab === k ? "on" : ""}" data-m="tab" data-t="${k}"><ha-icon icon="${i}"></ha-icon><span>${esc(_(l))}</span></button>`).join("")}</div>
        <div class="sh-b">${body}</div>
        <div class="sh-f">${S.msg ? `<span class="smsg ${S.bad ? "bad" : ""}">${esc(S.msg)}</span>` : ""}<span class="sp"></span>
          <button class="ghost" data-m="close">${esc(_("Annuler"))}</button>
          <button class="primary" data-m="ssave" ${S.busy ? "disabled" : ""}><ha-icon icon="mdi:content-save"></ha-icon>${esc(_("Enregistrer"))}</button></div>
      </div></div>`;
    ov.querySelector(".sh-b").scrollTop = keepScroll;
  },

  _sVehicles() {
    const S = this._settings;
    const ents = Object.keys(this._hass.states).filter((e) => e.startsWith("sensor.") && (["battery", "%", "km", "L"].includes(this._hass.states[e].attributes.unit_of_measurement) || this._hass.states[e].attributes.device_class === "battery"));
    return `<datalist id="hbc-ents">${ents.map((e) => `<option value="${e}">`).join("")}</datalist>` + S.vehicles.map((v, i) => `
      <div class="sblock" style="--c:${v.color}">
        <div class="sb-h">
          <div class="sb-pic">${v.image ? `<img src="${esc(v.image)}" alt="">` : `<ha-icon icon="${esc(v.icon || "mdi:car-side")}"></ha-icon>`}</div>
          <input class="big" type="text" value="${esc(v.name)}" data-s="vehicles.${i}.name" placeholder="${esc(_("Nom"))}" maxlength="40">
          <button class="icon" data-m="up" data-l="vehicles" data-i="${i}" ${i ? "" : "disabled"} title="${esc(_("Monter"))}"><ha-icon icon="mdi:arrow-up"></ha-icon></button>
          <button class="icon" data-m="down" data-l="vehicles" data-i="${i}" ${i < S.vehicles.length - 1 ? "" : "disabled"} title="${esc(_("Descendre"))}"><ha-icon icon="mdi:arrow-down"></ha-icon></button>
          <button class="icon del ${S.armed === i ? "armed" : ""}" data-m="rm" data-l="vehicles" data-i="${i}" ${S.vehicles.length > 1 ? "" : "disabled"} title="${esc(_("Supprimer"))}"><ha-icon icon="${S.armed === i ? "mdi:delete-alert" : "mdi:delete-outline"}"></ha-icon></button>
        </div>
        <div class="grid2">
          <div><label>${esc(_("Couleur"))}</label><input type="color" value="${esc(v.color)}" data-s="vehicles.${i}.color"></div>
          <div><label>${esc(_("Immatriculation"))}</label><input type="text" value="${esc(v.plate)}" data-s="vehicles.${i}.plate" maxlength="20"></div>
          <div><label>${esc(_("Places"))}</label><input type="number" min="1" max="99" value="${esc(v.seats)}" data-s="vehicles.${i}.seats"></div>
          <div><label>${esc(_("Batterie ou carburant (entité)"))}</label><input type="text" list="hbc-ents" value="${esc(v.battery_entity || v.fuel_entity || "")}" data-s="vehicles.${i}.battery_entity" placeholder="sensor.…"></div>
        </div>
        <label>${esc(_("Icône"))}</label>
        <div class="icons">${SETTINGS_ICONS.map((ic) => `<button class="ic ${v.icon === ic ? "on" : ""}" data-m="icon" data-i="${i}" data-ic="${ic}"><ha-icon icon="${ic}"></ha-icon></button>`).join("")}
          <input type="text" class="icin" value="${esc(v.icon)}" data-s="vehicles.${i}.icon" placeholder="mdi:…"></div>
        <label>${esc(_("Photo"))}</label>
        <div class="photo"><input type="text" value="${esc(v.image)}" data-s="vehicles.${i}.image" placeholder="/local/… ou https://…">
          <label class="upl ghost"><ha-icon icon="mdi:image-plus"></ha-icon>${esc(_("Importer une photo"))}<input type="file" accept="image/*" data-up="${i}" hidden></label>
          ${v.image ? `<button class="icon" data-m="noimg" data-i="${i}" title="${esc(_("Retirer la photo"))}"><ha-icon icon="mdi:image-remove"></ha-icon></button>` : ""}</div>
      </div>`).join("") + `<button class="add" data-m="add" data-l="vehicles"><ha-icon icon="mdi:plus"></ha-icon>${esc(_("Ajouter un véhicule"))}</button>`;
  },

  _sPeople() {
    const S = this._settings, d = this._data;
    const users = d.users || [];
    const svcs = d.notify_services || [];
    return `<div class="hint">${esc(_("Les personnes de Home Assistant sont reprises à l'installation. Liez un compte pour que chacun soit reconnu automatiquement."))}</div>` + S.people.map((p, i) => `
      <div class="sblock" style="--c:${p.color}">
        <div class="sb-h">
          <div class="sb-pic av">${esc(initials(p.name))}</div>
          <input class="big" type="text" value="${esc(p.name)}" data-s="people.${i}.name" placeholder="${esc(_("Nom"))}" maxlength="40">
          <input type="color" class="sw" value="${esc(p.color)}" data-s="people.${i}.color" title="${esc(_("Couleur"))}">
          <button class="icon" data-m="up" data-l="people" data-i="${i}" ${i ? "" : "disabled"} title="${esc(_("Monter"))}"><ha-icon icon="mdi:arrow-up"></ha-icon></button>
          <button class="icon" data-m="down" data-l="people" data-i="${i}" ${i < S.people.length - 1 ? "" : "disabled"} title="${esc(_("Descendre"))}"><ha-icon icon="mdi:arrow-down"></ha-icon></button>
          <button class="icon del" data-m="rm" data-l="people" data-i="${i}" title="${esc(_("Supprimer"))}"><ha-icon icon="mdi:delete-outline"></ha-icon></button>
        </div>
        <label>${esc(_("Compte Home Assistant"))}</label>
        <select data-s="people.${i}.user_id"><option value="">${esc(_("Aucun"))}</option>
          ${users.map((u) => `<option value="${u.id}" ${u.id === p.user_id ? "selected" : ""}>${esc(u.name)}</option>`).join("")}</select>
        <label>${esc(_("Notifications"))}</label>
        ${svcs.length ? `<div class="checks">${svcs.map((s) => `<label class="ck"><input type="checkbox" data-n="${i}" value="${esc(s)}" ${(p.notify || []).includes(s) ? "checked" : ""}><span>${esc(s.replace(/^mobile_app_/, "📱 "))}</span></label>`).join("")}</div>
          <button class="ghost sm" data-m="test" data-i="${i}" ${(p.notify || []).length ? "" : "disabled"}><ha-icon icon="mdi:bell-ring-outline"></ha-icon>${esc(_("Tester"))}</button>`
        : `<div class="hint">${esc(_("Aucun service de notification trouvé (installez l'application compagnon)."))}</div>`}
      </div>`).join("") + `<button class="add" data-m="add" data-l="people"><ha-icon icon="mdi:account-plus"></ha-icon>${esc(_("Ajouter une personne"))}</button>`;
  },

  _sOptions() {
    const s = this._settings.settings;
    const rem = [0, 15, 30, 60, 120, 1440];
    const remLbl = (n) => (n === 0 ? _("Aucun rappel") : n < 60 ? `${n} min` : n < 1440 ? `${n / 60} h` : `24 h`);
    return `
      <label>${esc(_("Rappel avant le départ"))}</label>
      <div class="chips">${rem.map((n) => `<button class="chip-b sm ${Number(s.reminder_before) === n ? "on" : ""}" data-m="opt" data-k="reminder_before" data-v="${n}">${esc(remLbl(n))}</button>`).join("")}</div>
      <label class="sw-l"><input type="checkbox" data-o="notify_new" ${s.notify_new ? "checked" : ""}><span>${esc(_("Prévenir les autres à chaque réservation ou annulation"))}</span></label>
      <label class="sw-l"><input type="checkbox" data-o="notify_end" ${s.notify_end ? "checked" : ""}><span>${esc(_("Rappeler le retour du véhicule à l'heure de fin"))}</span></label>
      <label class="sw-l"><input type="checkbox" data-o="others_can_edit" ${s.others_can_edit ? "checked" : ""}><span>${esc(_("Tout le monde peut modifier toutes les réservations"))}<small>${esc(_("Sinon : chacun ses réservations, les administrateurs toutes."))}</small></span></label>
      <label>${esc(_("Pas des horaires"))}</label>
      <div class="chips">${[5, 10, 15, 30, 60].map((n) => `<button class="chip-b sm ${Number(s.slot_minutes) === n ? "on" : ""}" data-m="opt" data-k="slot_minutes" data-v="${n}">${n} min</button>`).join("")}</div>
      <label>${esc(_("Durée maximale (jours)"))}</label>
      <input type="number" min="1" max="90" value="${esc(s.max_days)}" data-o="max_days" class="narrow">`;
  },

  _setInput(e, committed) {
    const S = this._settings, t = e.target;
    if (t.dataset.s) {
      const [list, i, k] = t.dataset.s.split(".");
      let val = t.value;
      if (k === "seats") val = Number(val) || 1;
      S[list][i][k] = val;
      if (k === "battery_entity") S[list][i].fuel_entity = "";
      if (committed && ["color", "icon", "image"].includes(k)) this._renderSettings();
      else if (k === "color") t.closest(".sblock")?.style.setProperty("--c", val);
    } else if (t.dataset.n !== undefined) {
      const p = S.people[t.dataset.n];
      const set = new Set(p.notify || []);
      t.checked ? set.add(t.value) : set.delete(t.value);
      p.notify = [...set];
      t.closest(".sblock").querySelector('[data-m="test"]')?.toggleAttribute("disabled", !p.notify.length);
    } else if (t.dataset.o) {
      S.settings[t.dataset.o] = t.type === "checkbox" ? t.checked : Number(t.value);
    } else if (t.dataset.up !== undefined && committed && t.files?.[0]) this._upload(Number(t.dataset.up), t.files[0]);
  },

  async _upload(i, file) {
    const S = this._settings;
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await this._hass.fetchWithAuth("/api/image/upload", { method: "POST", body: fd });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      S.vehicles[i].image = `/api/image/serve/${j.id}/original`;
      this._renderSettings();
    } catch (err) { S.msg = errText(err); S.bad = true; this._renderSettings(); }
  },

  async _settingsClick(t) {
    const S = this._settings, a = t.dataset.m;
    if (a === "close") return this._closeOverlay();
    if (S.busy) return;
    S.msg = ""; S.bad = false;
    const armed = S.armed; S.armed = null;
    const list = t.dataset.l, i = Number(t.dataset.i);
    if (a === "tab") S.tab = t.dataset.t;
    else if (a === "up" || a === "down") { const L = S[list], j = a === "up" ? i - 1 : i + 1; [L[i], L[j]] = [L[j], L[i]]; }
    else if (a === "rm") {
      if (list === "vehicles" && armed !== i) { S.armed = i; S.msg = _("Supprimer ce véhicule ? Ses réservations seront effacées à l'enregistrement."); S.bad = true; return this._renderSettings(); }
      S[list].splice(i, 1);
    } else if (a === "add") {
      const used = new Set(S[list].map((x) => x.color));
      const color = PALETTE_JS.find((c) => !used.has(c)) || PALETTE_JS[S[list].length % PALETTE_JS.length];
      S[list].push(list === "vehicles" ? { name: `${_("Véhicule")} ${S.vehicles.length + 1}`, color, icon: "mdi:car-side", image: "", plate: "", seats: 5 }
        : { name: "", color, user_id: "", notify: [] });
      this._renderSettings();
      const inputs = this.$ov.querySelectorAll("input.big");
      inputs[inputs.length - 1]?.focus();
      this.$ov.querySelector(".sh-b").scrollTop = 1e6;
      return;
    } else if (a === "icon") S.vehicles[i].icon = t.dataset.ic;
    else if (a === "noimg") S.vehicles[i].image = "";
    else if (a === "opt") S.settings[t.dataset.k] = Number(t.dataset.v);
    else if (a === "test") {
      const p = S.people[i];
      const saved = this._data.people.find((x) => x.id === p.id);
      if (!saved || JSON.stringify(saved.notify || []) !== JSON.stringify(p.notify || [])) { S.msg = _("Enregistrez d'abord, puis testez."); S.bad = true; }
      else {
        try { const r = await this._ws({ type: "holm_booking_cars/test", person: p.id }); S.msg = _("Test envoyé ({n})", { n: r.sent }); }
        catch (err) { S.msg = errText(err); S.bad = true; }
      }
    } else if (a === "ssave") return this._saveSettings();
    this._renderSettings();
  },

  async _saveSettings() {
    const S = this._settings;
    S.busy = true;
    this._renderSettings();
    try {
      await this._ws({ type: "holm_booking_cars/save", vehicles: S.vehicles, people: S.people.filter((p) => String(p.name || "").trim()), settings: S.settings });
      this._closeOverlay();
      this._toast(_("Enregistré ✓"));
    } catch (err) { S.busy = false; S.msg = errText(err); S.bad = true; this._renderSettings(); }
  },
});
const PALETTE_JS = ["#26c6da", "#ff7043", "#ab47bc", "#66bb6a", "#ffca28", "#42a5f5", "#ec407a", "#8d6e63", "#78909c", "#d4e157"];

class HolmBookingCarsCardEditor extends HTMLElement {
  setConfig(config) { this._config = { ...config }; this._render(); }
  set hass(hass) {
    this._hass = hass;
    setLang(hass, this._config?.language);
    if (!this._vehicles && !this._loading) {
      this._loading = true;
      hass.callWS({ type: "holm_booking_cars/get" }).then((d) => { this._vehicles = d.vehicles; this._render(); }).catch(() => { this._vehicles = []; this._render(); });
    }
    if (this._form) this._form.hass = hass;
    else this._render();
  }
  _schema() {
    const opt = (pairs) => pairs.map(([value, label]) => ({ value, label }));
    return [
      { name: "vehicle", selector: { select: { mode: "dropdown", options: opt([["all", _("Tous (sélecteur)")], ...(this._vehicles || []).map((v) => [v.id, v.name])]) } } },
      { name: "title", selector: { text: {} } },
      { type: "grid", name: "", schema: [
        { name: "view", selector: { select: { mode: "dropdown", options: opt([["week", _("Semaine")], ["list", _("Liste")]]) } } },
        { name: "first_day", selector: { select: { mode: "dropdown", options: opt([["today", _("Aujourd'hui en premier")], ["monday", _("Lundi")], ["sunday", _("Dimanche")]]) } } },
        { name: "hours_from", selector: { number: { min: 0, max: 23, mode: "box" } } },
        { name: "hours_to", selector: { number: { min: 1, max: 24, mode: "box" } } },
      ] },
      { name: "show_header", selector: { boolean: {} } },
      { name: "animations", selector: { boolean: {} } },
      { name: "language", selector: { select: { mode: "dropdown", options: opt([["auto", _("Automatique")], ["fr", "Français"], ["en", "English"], ["de", "Deutsch"], ["es", "Español"], ["it", "Italiano"], ["nl", "Nederlands"], ["pt", "Português"], ["pl", "Polski"]]) } } },
    ];
  }
  _render() {
    if (!this._hass || !this._config) return;
    const labels = { vehicle: _("Véhicule affiché"), title: _("Titre"), view: _("Vue par défaut"), first_day: _("Premier jour de la semaine"), hours_from: _("Heure de début de la frise"),
      hours_to: _("Heure de fin de la frise"), show_header: _("Afficher l'en-tête (photo et statut)"), animations: _("Animations"), language: _("Langue") };
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => labels[s.name] ?? s.name;
      this._form.addEventListener("value-changed", (e) => {
        const c = { ...e.detail.value };
        for (const k of Object.keys(c)) if (c[k] === "" || c[k] == null || (k === "vehicle" && c[k] === "all")) delete c[k];
        this._config = c;
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: c }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.schema = this._schema();
    this._form.data = { view: "week", first_day: "today", hours_from: 6, hours_to: 24, show_header: true, animations: true, language: "auto", vehicle: "all", ...this._config };
  }
}

customElements.get("holm-booking-cars-card") || customElements.define("holm-booking-cars-card", HolmBookingCarsCard);
customElements.get("holm-booking-cars-card-editor") || customElements.define("holm-booking-cars-card-editor", HolmBookingCarsCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "holm-booking-cars-card"))
  window.customCards.push({ type: "holm-booking-cars-card", name: "HOLM Booking Cars", preview: true, documentationURL: "https://github.com/kaaribou/holm-booking-cars",
    description: "Réservation des véhicules de la famille : semaine, liste, réservations animées." });
console.info(`%c HOLM Booking Cars %c ${HBC_VERSION} `, "background:#26c6da;color:#fff;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px", "background:#37474f;color:#fff;border-radius:0 4px 4px 0;padding:2px 6px");
