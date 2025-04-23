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
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/accommodations`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Immobilien');
    }
    return response.json();
  },

  // Eine spezifische Immobilie abrufen
  async getAccommodationById(id: number): Promise<Accommodation> {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}/accommodations/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Immobilie nicht gefunden');
      }
      
      const data = await response.json();
      console.log('Rohdaten von der API:', data);
      return {
        id: data.id,
        name: data.name,
        type: data.type,
        description: data.description,
        street: data.address?.street || '',
        houseNumber: data.address?.houseNumber || '',
        postalCode: data.address?.postalCode || '',
        city: data.address?.city || '',
        country: data.address?.country || '',
        addressAdditional: data.address?.addressAdditional,
        maxGuests: data.maxGuests,
        pricePerNight: data.pricePerNight,
        pictureUrls: data.pictureUrls || []
      };
    } catch (error) {
      console.error('Fehler beim Abrufen der Immobilie:', error);
      throw error;
    }
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