"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { accommodationService } from "@/services/accommodationService"

interface PropertyFormData {
  name: string
  type: string
  description: string
  street: string
  houseNumber: string
  postalCode: string
  city: string
  country: string
  addressAdditional: string
  maxGuests: string
  pricePerNight: string
  pictureUrls: string[]
}

export default function AddPropertyPage() {
  const router = useRouter()
  const [pictureUrl, setPictureUrl] = useState("")
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<PropertyFormData>({
    name: "",
    type: "",
    description: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    country: "",
    addressAdditional: "",
    maxGuests: "",
    pricePerNight: "",
    pictureUrls: [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Spezielle Behandlung für numerische Felder
    if (name === "maxGuests") {
      // Erlaube nur positive ganze Zahlen
      const newValue = value.replace(/[^0-9]/g, '')
      setFormData({
        ...formData,
        [name]: newValue,
      })
    } else if (name === "pricePerNight") {
      // Erlaube Dezimalzahlen mit maximal 2 Nachkommastellen
      const newValue = value.replace(/[^0-9.]/g, '')
      if (newValue === '' || /^\d*\.?\d{0,2}$/.test(newValue)) {
        setFormData({
          ...formData,
          [name]: newValue,
        })
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleAddPicture = () => {
    if (pictureUrl.trim()) {
      setFormData({
        ...formData,
        pictureUrls: [...formData.pictureUrls, pictureUrl],
      })
      setPictureUrl("")
    }
  }

  const handleRemovePicture = (index: number) => {
    setFormData({
      ...formData,
      pictureUrls: formData.pictureUrls.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validierung der Pflichtfelder
      const requiredFields = [
        'name', 'type', 'description', 'street', 'houseNumber',
        'postalCode', 'city', 'country', 'maxGuests', 'pricePerNight'
      ]

      const missingFields = requiredFields.filter(field => !formData[field as keyof PropertyFormData])
      
      if (missingFields.length > 0) {
        setError(`Bitte füllen Sie alle Pflichtfelder aus: ${missingFields.join(', ')}`)
        return
      }

      // Validiere numerische Werte
      const maxGuests = parseInt(formData.maxGuests)
      const pricePerNight = parseFloat(formData.pricePerNight)

      if (isNaN(maxGuests) || maxGuests <= 0) {
        setError('Bitte geben Sie eine gültige Anzahl an Gästen ein')
        return
      }

      if (isNaN(pricePerNight) || pricePerNight <= 0) {
        setError('Bitte geben Sie einen gültigen Preis ein')
        return
      }

      // Erstelle das Objekt für das Backend mit konvertierten Zahlen
      const accommodationData = {
        ...formData,
        maxGuests: maxGuests,
        pricePerNight: pricePerNight
      }

      // Sende Daten an Backend
      await accommodationService.createAccommodation(accommodationData)
      
      // Erfolgsmeldung und Weiterleitung
      alert('Immobilie wurde erfolgreich hinzugefügt!')
      router.push("/tenantDataManagement/properties")
    } catch (err) {
      console.error('Fehler beim Speichern:', err)
      setError('Fehler beim Speichern der Immobilie. Bitte stellen Sie sicher, dass Sie eingeloggt sind.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button
            onClick={() => router.push("/tenantDataManagement/properties")}
            className="mr-4 p-2 rounded-full bg-[#A8C947] text-white hover:bg-[#97B83B]"
            size="icon"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-3xl font-bold">Neue Immobilie hinzufügen</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Grundinformationen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="z.B. Wien Donaustadt"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Typ *</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="z.B. Apartment"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Beschreibung *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Beschreiben Sie die Immobilie..."
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md h-24"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Adresse</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Stadt *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="z.B. Wien"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Land *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="z.B. Österreich"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postleitzahl *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="z.B. 1220"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Straße *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="z.B. Donaustadtstraße"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hausnummer *</label>
                <input
                  type="text"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleChange}
                  placeholder="z.B. 1"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Zusätzliche Adressinfo</label>
                <input
                  type="text"
                  name="addressAdditional"
                  value={formData.addressAdditional}
                  onChange={handleChange}
                  placeholder="z.B. Top 1"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Weitere Informationen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Maximale Gästeanzahl *</label>
                <input
                  type="text"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleChange}
                  placeholder="z.B. 4"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preis pro Nacht *</label>
                <input
                  type="text"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleChange}
                  placeholder="z.B. 99.99"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          {/* Picture URLs */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Bilder</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={pictureUrl}
                  onChange={(e) => setPictureUrl(e.target.value)}
                  placeholder="Bild-URL eingeben"
                  className="flex-1 p-2 border-2 border-[#A8C947] rounded-md"
                />
                <Button
                  type="button"
                  onClick={handleAddPicture}
                  className="bg-[#A8C947] text-white hover:bg-[#97B83B]"
                >
                  Hinzufügen
                </Button>
              </div>
              {formData.pictureUrls.length > 0 && (
                <div className="space-y-2">
                  {formData.pictureUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="flex-1 truncate">{url}</span>
                      <Button
                        type="button"
                        onClick={() => handleRemovePicture(index)}
                        variant="destructive"
                        size="sm"
                      >
                        Entfernen
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#A8C947] text-white hover:bg-[#97B83B]"
            disabled={loading}
          >
            {loading ? "Wird gespeichert..." : "Immobilie hinzufügen"}
          </Button>
        </form>
      </div>
    </div>
  )
}

