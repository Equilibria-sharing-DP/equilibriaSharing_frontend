"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/tenantDataManagementComponents/navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PropertyFormData {
  name: string
  type: string
  description: string
  address: {
    city: string
    country: string
    postalCode: string
    street: string
    houseNumber: string
    addressAdditional: string
  }
  maxGuests: string
  pricePerNight: string
  pictureUrls: string[]
}

export default function AddPropertyPage() {
  const router = useRouter()
  const [pictureUrl, setPictureUrl] = useState("")
  const [formData, setFormData] = useState<PropertyFormData>({
    name: "",
    type: "",
    description: "",
    address: {
      city: "",
      country: "",
      postalCode: "",
      street: "",
      houseNumber: "",
      addressAdditional: "",
    },
    maxGuests: "",
    pricePerNight: "",
    pictureUrls: [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof typeof formData] as Record<string, any>),
          [child]: value,
        },
      })
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would typically save the property data to your backend
    console.log("Property data to save:", formData)

    // For now, just navigate back to the properties page
    router.push("/tenantDataManagement/properties")
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Grundinformationen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
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
                <label className="block text-sm font-medium mb-1">Typ</label>
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
                <label className="block text-sm font-medium mb-1">Beschreibung</label>
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
                <label className="block text-sm font-medium mb-1">Stadt</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="z.B. Vienna"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Land</label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  placeholder="z.B. Austria"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postleitzahl</label>
                <input
                  type="text"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleChange}
                  placeholder="z.B. 1220"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Straße</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="z.B. Donaustadtstraße"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hausnummer</label>
                <input
                  type="text"
                  name="address.houseNumber"
                  value={formData.address.houseNumber}
                  onChange={handleChange}
                  placeholder="z.B. 19"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Zusatz</label>
                <input
                  type="text"
                  name="address.addressAdditional"
                  value={formData.address.addressAdditional}
                  onChange={handleChange}
                  placeholder="z.B. Top 13"
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
                <label className="block text-sm font-medium mb-1">Maximale Gästeanzahl</label>
                <input
                  type="number"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleChange}
                  placeholder="z.B. 5"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preis pro Nacht (€)</label>
                <input
                  type="number"
                  name="pricePerNight"
                  value={formData.pricePerNight}
                  onChange={handleChange}
                  placeholder="z.B. 27.0"
                  className="w-full p-2 border-2 border-[#A8C947] rounded-md"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Pictures */}
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
                <Button type="button" onClick={handleAddPicture} className="bg-[#A8C947] text-white hover:bg-[#97B83B]">
                  Hinzufügen
                </Button>
              </div>

              {formData.pictureUrls.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium">Hinzugefügte Bilder:</p>
                  <ul className="space-y-2">
                    {formData.pictureUrls.map((url, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <img
                            src={url || "/placeholder.svg"}
                            alt="Property"
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span className="text-sm truncate max-w-xs">{url}</span>
                        </div>
                        <Button
                          type="button"
                          onClick={() => handleRemovePicture(index)}
                          variant="destructive"
                          size="sm"
                        >
                          Entfernen
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#A8C947] text-white px-8 py-3 rounded-lg text-xl hover:bg-[#97B83B] transition-colors"
            >
              SPEICHERN
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

