"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Address {
  street: string
  houseNumber: number
  addressAdditional: string
  city: string
  postalCode: string
  country: string
}

interface Property {
  id: number
  name: string
  type: string
  description: string
  address: Address
  maxGuests: number
  pricePerNight: number
  images: string[]
}

export function PropertyCard({ property }: { property: Property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentImageIndex((prevIndex) => (prevIndex === property.images.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? property.images.length - 1 : prevIndex - 1))
  }

  return (
    <Link href={`/tenantDataManagement/properties/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="relative pb-[56.25%]">
          <img
            src={property.images[currentImageIndex] || "/placeholder.svg"}
            alt={`${property.name} - Image ${currentImageIndex + 1}`}
            className="absolute h-full w-full object-cover"
          />
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/60 p-1 rounded-full shadow-md hover:bg-white transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4 text-gray-800" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/60 p-1 rounded-full shadow-md hover:bg-white transition-colors duration-200"
          >
            <ChevronRight className="w-4 h-4 text-gray-800" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            {property.images.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/60"}`}
              />
            ))}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{property.name}</h3>
          <p className="text-sm text-gray-600">
            {property.address.city}, {property.address.country}
          </p>
          <p className="text-sm text-gray-600">
            {property.address.street} {property.address.houseNumber}
            {property.address.addressAdditional && `, ${property.address.addressAdditional}`}
          </p>
          <p className="mt-2 text-sm text-gray-500">{property.type}</p>
          <p className="mt-2 text-sm text-gray-500">
            {new Date().getDate()}-{new Date().getDate() + 5}.{" "}
            {new Date().toLocaleString("default", { month: "short" })}
          </p>
          <p className="mt-2 text-lg font-bold">
            {property.pricePerNight}€
            <span className="text-sm font-normal text-gray-600"> / Nacht</span>
          </p>
        </div>
      </Card>
    </Link>
  )
}

