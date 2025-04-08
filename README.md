# Equilibira Frontend

## Design Konzept

- Ziel ist es, ein ansprechendes und benutzerfreundliches Design zu erstellen.
- Fokus auf einfache Navigation und klare Benutzerführung.

## Features

- **Dynamische Formulare:** Unterstützt mehrseitige Formulare mit Validierung.
- **Internationalisierung:** Mehrsprachige Unterstützung mit `next-intl`.
- **Responsive Design:** Optimiert für verschiedene Bildschirmgrößen.
- **Integration mit Backend:** Kommuniziert mit einer RESTful API für Buchungsdaten.
- **Modulare Komponenten:** Wiederverwendbare UI-Komponenten wie Date-Picker und Dropdowns.

## Technologien

- **Framework:** [Next.js](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Formular-Handling:** [React Hook Form](https://react-hook-form.com/) mit [Zod](https://zod.dev/) für Validierung.
- **Internationalisierung:** [next-intl](https://github.com/amannn/next-intl)
- **Icons:** [Lucide React](https://lucide.dev/)

## Projekt starten

### Voraussetzungen
- Node.js und npm müssen installiert sein.
- Docker muss installiert und der Docker Daemon muss laufen.

### Schritte
1. **Frontend starten:**
   ```bash
   npm install
   npm run dev
   ```
2. **Backend starten:**
   - Stelle sicher, dass der Docker Daemon läuft.

3. **Registrierung einer Buchung testen:**
   - Übergebe Base64-kodierte Daten mit folgendem Schema in der URL:
     ```json
     {
       "accommodationId": 1,
       "checkIn": "2025-07-26T00:00:00.000Z",
       "expectedCheckOut": "2025-07-30T00:00:00.000Z"
     }
     ```

## Testen

### URL zum Testen der `tenantRegistration`-Seite:
```plaintext
http://localhost:3000/tenantRegistration?data=eyJhY2NvbW1vZGF0aW9uSWQiOjEsImNoZWNrSW4iOiIyMDI1LTA3LTI2VDAwOjAwOjAwLjAwMFoiLCJleHBlY3RlZENoZWNrT3V0IjoiMjAyNS0wNy0zMFQwMDowMDowMC4wMDBaIn0=
```

### Beispiel-Daten
- **accommodationId:** 1
- **checkIn:** 26. Juli 2025
- **expectedCheckOut:** 30. Juli 2025

## Verzeichnisstruktur

```plaintext
src/
├── components/         # Wiederverwendbare UI-Komponenten
├── pages/              # Next.js Seiten
├── styles/             # Globale und Tailwind CSS-Stile
├── lib/                # Hilfsfunktionen und Utilities
```