"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { bookingService } from "@/services/bookingService"
import { accommodationService } from "@/services/accommodationService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { de } from "date-fns/locale"

interface Accommodation {
  id: number;
  name: string;
  type: string;
  description: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  addressAdditional?: string;
  maxGuests: number;
  pricePerNight: number;
  pictureUrls: string[];
}

interface Booking {
  id: number;
  accommodationId: number;
  mainTraveler: {
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
  };
  checkIn: string;
  expectedCheckOut: string;
  additionalGuests?: {
    firstName: string;
    lastName: string;
    birthDate: string;
  }[];
}

export default function PropertyBookingsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Zuerst Immobiliendaten laden
        const accommodationData = await accommodationService.getAccommodationById(Number(params.id))
        console.log('DATEN VON DER IMMOBILIE:', {
          street: accommodationData.street,
          city: accommodationData.city,
          country: accommodationData.country,
          postalCode: accommodationData.postalCode
        })
        setAccommodation(accommodationData)
        
        // Dann Buchungsdaten laden
        const bookingsData = await bookingService.getBookingsByAccommodationId(Number(params.id))
        setBookings(bookingsData)
      } catch (err) {
        console.error('Fehler beim Laden der Daten:', err)
        setError('Fehler beim Laden der Daten. Bitte stellen Sie sicher, dass Sie eingeloggt sind.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id])

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd.MM.yyyy', { locale: de })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A8C947]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    )
  }

  if (!accommodation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Immobilie nicht gefunden</p>
          <Button
            onClick={() => router.push("/tenantDataManagement/properties")}
            className="mt-4 bg-[#A8C947] text-white hover:bg-[#97B83B]"
          >
            Zurück zur Übersicht
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button
          onClick={() => router.push("/tenantDataManagement/properties")}
          className="mr-4 p-2 rounded-full bg-[#A8C947] text-white hover:bg-[#97B83B]"
          size="icon"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold">{accommodation.name}</h1>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Immobiliendetails</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="font-semibold">Typ:</span> {accommodation.type}</p>
                <p><span className="font-semibold">Max. Gäste:</span> {accommodation.maxGuests}</p>
                <p><span className="font-semibold">Preis pro Nacht:</span> €{accommodation.pricePerNight}</p>
                <p><span className="font-semibold">Adresse:</span> {accommodation.street} {accommodation.houseNumber}</p>
                <p><span className="font-semibold">PLZ:</span> {accommodation.postalCode}</p>
                <p><span className="font-semibold">Stadt:</span> {accommodation.city}</p>
                <p><span className="font-semibold">Land:</span> {accommodation.country}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-semibold">Beschreibung:</p>
              <p>{accommodation.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Buchungen</h2>
      
      {bookings.length === 0 ? (
        <p className="text-gray-500">Keine Buchungen vorhanden</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Hauptreisender:</p>
                    <p>{booking.mainTraveler.firstName} {booking.mainTraveler.lastName}</p>
                    <p>Geburtsdatum: {formatDate(booking.mainTraveler.birthDate)}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Aufenthalt:</p>
                    <p>Check-in: {formatDate(booking.checkIn)}</p>
                    <p>Check-out: {formatDate(booking.expectedCheckOut)}</p>
                  </div>
                </div>
                {booking.additionalGuests && booking.additionalGuests.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold">Weitere Gäste:</p>
                    <ul className="list-disc list-inside">
                      {booking.additionalGuests.map((guest, index) => (
                        <li key={index}>
                          {guest.firstName} {guest.lastName} (Geb.: {formatDate(guest.birthDate)})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

