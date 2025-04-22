interface Accommodation {
  id: number;
  name: string;
  type: string;
  description: string;
  maxGuests: number;
  pricePerNight: number;
  pictureUrls: string[];
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  addressAdditional?: string;
}

const BASE_URL = 'http://localhost:8080/api/v1';

export const accommodationService = {
  // Alle Immobilien abrufen
  async getAllAccommodations(): Promise<Accommodation[]> {
    const response = await fetch(`${BASE_URL}/accommodations`);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Immobilien');
    }
    return response.json();
  },

  // Eine spezifische Immobilie abrufen
  async getAccommodationById(id: number): Promise<Accommodation> {
    const response = await fetch(`${BASE_URL}/accommodations/${id}`);
    if (!response.ok) {
      throw new Error('Immobilie nicht gefunden');
    }
    return response.json();
  },

  // Neue Immobilie erstellen (erfordert Authentifizierung)
  async createAccommodation(accommodation: Omit<Accommodation, 'id'>): Promise<Accommodation> {
    const token = localStorage.getItem('token'); // Token aus dem localStorage holen
    const response = await fetch(`${BASE_URL}/accommodations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(accommodation)
    });
    if (!response.ok) {
      throw new Error('Fehler beim Erstellen der Immobilie');
    }
    return response.json();
  },

  // Immobilie aktualisieren (erfordert Authentifizierung)
  async updateAccommodation(id: number, accommodation: Accommodation): Promise<Accommodation> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/accommodations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(accommodation)
    });
    if (!response.ok) {
      throw new Error('Fehler beim Aktualisieren der Immobilie');
    }
    return response.json();
  },

  // Immobilie löschen (erfordert Authentifizierung)
  async deleteAccommodation(id: number): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/accommodations/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Fehler beim Löschen der Immobilie');
    }
  }
}; 