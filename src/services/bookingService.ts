interface Traveler {
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  street: string;
  city: string;
  country: string;
  houseNumber: string;
  postalCode: string;
  addressAdditional?: string;
  travelDocumentType?: string;
  documentNr?: string;
  issueDate?: string;
  expiryDate?: string;
  issuingAuthority?: string;
}

interface AdditionalGuest {
  firstName: string;
  lastName: string;
  birthDate: string;
}

interface Booking {
  id: number;
  accommodationId: number;
  mainTraveler: Traveler;
  checkIn: string;
  expectedCheckOut: string;
  additionalGuests?: AdditionalGuest[];
}

const BASE_URL = 'http://localhost:8080/api/v1';

export const bookingService = {
  // Alle Buchungen für eine bestimmte Immobilie abrufen
  async getBookingsByAccommodationId(accommodationId: number): Promise<Booking[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/bookings?accommodationId=${accommodationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Fehler beim Laden der Buchungen');
    }

    return response.json();
  },

  // Eine einzelne Buchung abrufen
  async getBookingById(id: number): Promise<Booking> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/bookings/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Buchung nicht gefunden');
    }

    return response.json();
  },

  // Neue Buchung erstellen
  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    });

    if (!response.ok) {
      throw new Error('Fehler beim Erstellen der Buchung');
    }

    return response.json();
  },

  // Buchung aktualisieren
  async updateBooking(id: number, booking: Booking): Promise<Booking> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(booking),
    });

    if (!response.ok) {
      throw new Error('Fehler beim Aktualisieren der Buchung');
    }

    return response.json();
  },
}; 