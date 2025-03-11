# Equilibira Frontend

## Design Konzept

- Mach halt schön irgendwie.

## Starten
1. Frontend Starten:
```bash
npm i
npm run dev
```
2. Backend Starten
   - Docker Deamon muss laufen
3. Zum aufrufen des Registrieren einer Buchung müssen Daten Base64 kodiert mittels dem folgenden Schema mitübergeben werden:
```json
{
  "accommodationId": 1,
  "checkIn": "2025-07-26T00:00:00.000Z",
  "expectedCheckOut": "2025-07-30T00:00:00.000Z"
}
```

## Testen
URL zum Testen des des tenantRegistration:
http://localhost:3000/tenantRegistration?data=eyJhY2NvbW1vZGF0aW9uSWQiOjEsImNoZWNrSW4iOiIyMDI1LTA3LTI2VDAwOjAwOjAwLjAwMFoiLCJleHBlY3RlZENoZWNrT3V0IjoiMjAyNS0wNy0zMFQwMDowMDowMC4wMDBaIn0=