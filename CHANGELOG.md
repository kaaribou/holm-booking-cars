# Changelog

## 1.0.0
- Première version.
- **Réservations** d'un ou plusieurs véhicules partagés : personne, départ, retour, motif, destination, kilomètres prévus, note. **Aucun chevauchement** possible (vérifié sous verrou, même pour deux demandes simultanées), durée maximale réglable.
- **Personnes** reprises des personnes de Home Assistant, reconnues par leur compte ; réservation possible pour quelqu'un d'autre. Droits : chacun ses réservations, les administrateurs toutes (option pour tout le monde).
- **Entités par véhicule** : `sensor.<véhicule>_statut` (disponible / bientôt / réservé), `sensor.<véhicule>_en_cours`, `sensor.<véhicule>_prochaine_reservation`, `binary_sensor.<véhicule>_disponible` et `calendar.<véhicule>` (création, modification et suppression depuis le calendrier de Home Assistant).
- **Notifications** : rappel avant le départ, alerte aux autres à chaque réservation ou annulation, prévenir la personne pour qui on réserve, rappel de rendre le véhicule à l'heure de fin.
- **Actions** `holm_booking_cars.book`, `cancel` et `finish` ; évènement `holm_booking_cars_booking` (`created`, `updated`, `deleted`, `started`, `ended`).
- **Carte HOLM Booking Cars** : en-tête avec photo, statut et compte à rebours, planning de la semaine et liste, fenêtre de réservation animée avec les disponibilités et le contrôle des chevauchements, lecture seule pour les réservations des autres, « Rendre maintenant », mise à jour en direct, réglages complets (véhicules, personnes, options) et éditeur visuel.
- 8 langues : français, anglais, allemand, espagnol, italien, néerlandais, portugais, polonais.
