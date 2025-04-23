"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { accommodationService } from "@/services/accommodationService"
import { ArrowLeft, Loader2, Plus, X } from "lucide-react"

interface Accommodation {
  id: number
  name: string
  type: string
  description: string
  maxGuests: string
  pricePerNight: string
  pictureUrls: string[]
  street: string
  houseNumber: string
  postalCode: string
  city: string
  country: string
  addressAdditional?: string
}

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Accommodation>({
    id: parseInt(params.id),
    name: "",
    type: "",
    description: "",
    maxGuests: "",
    pricePerNight: "",
    pictureUrls: [],
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    country: "",
  })

  useEffect(() => {
    const loadAccommodation = async () => {
      try {
        const data = await accommodationService.getAccommodationById(parseInt(params.id))
        setFormData({
          ...data,
          maxGuests: data.maxGuests.toString(),
          pricePerNight: data.pricePerNight.toString(),
        })
        setError(null)
      } catch (err) {
        console.error("Fehler beim Laden der Immobilie:", err)
        setError("Fehler beim Laden der Immobilie. Bitte versuchen Sie es später erneut.")
      } finally {
        setLoading(false)
      }
    }

    loadAccommodation()
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddPictureUrl = () => {
    setFormData((prev) => ({
      ...prev,
      pictureUrls: [...prev.pictureUrls, ""],
    }))
  }

  const handleRemovePictureUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pictureUrls: prev.pictureUrls.filter((_, i) => i !== index),
    }))
  }

  const handlePictureUrlChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      pictureUrls: prev.pictureUrls.map((url, i) => (i === index ? value : url)),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const submitData = {
        ...formData,
        maxGuests: parseInt(formData.maxGuests),
        pricePerNight: parseFloat(formData.pricePerNight),
      }

      await accommodationService.updateAccommodation(parseInt(params.id), submitData)
      router.push(`/tenantDataManagement/properties/${params.id}`)
    } catch (err) {
      console.error("Fehler beim Speichern:", err)
      setError("Fehler beim Speichern der Änderungen. Bitte versuchen Sie es später erneut.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button
          onClick={() => router.push(`/tenantDataManagement/properties/${params.id}`)}
          className="mr-4 p-2 rounded-full bg-[#A8C947] text-white hover:bg-[#97B83B]"
          size="icon"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-3xl font-bold">Immobilie bearbeiten</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Grundinformationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name der Immobilie</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Typ</Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxGuests">Maximale Gästeanzahl</Label>
                <Input
                  id="maxGuests"
                  name="maxGuests"
                  type="number"
                  value={formData.maxGuests}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="pricePerNight">Preis pro Nacht (€)</Label>
                <Input
                  id="pricePerNight"
                  name="pricePerNight"
                  type="number"
                  step="0.01"
                  value={formData.pricePerNight}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Adresse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="street">Straße</Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="houseNumber">Hausnummer</Label>
                <Input
                  id="houseNumber"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="postalCode">PLZ</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="city">Stadt</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="country">Land</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="addressAdditional">Zusätzliche Adressinformationen</Label>
              <Input
                id="addressAdditional"
                name="addressAdditional"
                value={formData.addressAdditional || ""}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bilder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.pictureUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => handlePictureUrlChange(index, e.target.value)}
                  placeholder="Bild-URL eingeben"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemovePictureUrl(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleAddPictureUrl}
            >
              <Plus className="h-4 w-4 mr-2" />
              Bild-URL hinzufügen
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/tenantDataManagement/properties/${params.id}`)}
          >
            Abbrechen
          </Button>
          <Button
            type="submit"
            className="bg-[#A8C947] text-white hover:bg-[#97B83B]"
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Speichern"}
          </Button>
        </div>
      </form>
    </div>
  )
} 