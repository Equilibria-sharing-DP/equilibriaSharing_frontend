"use client"

import { useRouter } from "next/navigation"
import { BookingList } from "@/components/tenantDataManagementComponents/BookingList"
import { bookings } from "@/app/tenantDataManagement/data/bookings"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import propertiesData from "../../data/properties.json"

interface Property {
  id: number
  name: string
  type: string
  description: string
  address: {
    street: string
    houseNumber: number
    addressAdditional: string
    city: string
    postalCode: string
    country: string
  }
  maxGuests: number
  pricePerNight: number
  images: string[]
}

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)

  const [filterDates, setFilterDates] = useState({ startDate: "", endDate: "" })
  const [filteredBookings, setFilteredBookings] = useState(bookings)
  const [isFiltered, setIsFiltered] = useState(false)

  const applyFilter = () => {
    if (!filterDates.startDate && !filterDates.endDate) {
      setFilteredBookings(bookings)
      setIsFiltered(false)
      return
    }

    const filtered = bookings.filter((booking) => {
      // Convert date strings to comparable format
      const bookingStart = convertDateStringToDate(booking.startDate)
      const bookingEnd = convertDateStringToDate(booking.endDate)
      const filterStart = filterDates.startDate ? new Date(filterDates.startDate) : null
      const filterEnd = filterDates.endDate ? new Date(filterDates.endDate) : null

      // If only start date is provided
      if (filterStart && !filterEnd) {
        return bookingStart >= filterStart || bookingEnd >= filterStart
      }

      // If only end date is provided
      if (!filterStart && filterEnd) {
        return bookingStart <= filterEnd || bookingEnd <= filterEnd
      }

      // If both dates are provided
      if (filterStart && filterEnd) {
        // Check if booking period overlaps with filter period
        return bookingStart <= filterEnd && bookingEnd >= filterStart
      }

      return true
    })

    setFilteredBookings(filtered)
    setIsFiltered(true)
  }

  const resetFilter = () => {
    setFilterDates({ startDate: "", endDate: "" })
    setFilteredBookings(bookings)
    setIsFiltered(false)
  }

  // Helper function to convert DD.MM.YYYY to Date object
  const convertDateStringToDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split(".")
    return new Date(`${year}-${month}-${day}`)
  }

  useEffect(() => {
    const propertyId = Number(params.id)
    const foundProperty = propertiesData.find((p) => p.id === propertyId)

    if (foundProperty) {
      setProperty(foundProperty)
    } else {
      // If property not found, redirect to properties list
      router.push("/properties")
    }
  }, [params.id, router])

  if (!property) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-4">
            <Button
              onClick={() => router.push("/tenantDataManagement/properties")}
              className="mr-4 p-2 rounded-full bg-[#A8C947] text-white hover:bg-[#97B83B]"
              size="icon"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-4xl font-bold">{property.name.toUpperCase()}</h1>
          </div>
          <div className="text-xl mb-2">
            {property.address.country}, {property.address.city}
          </div>
          <div className="text-gray-600 mb-6">
            Adresse: {property.address.street} {property.address.houseNumber}
            {property.address.addressAdditional && `, ${property.address.addressAdditional}`}
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2">
              <Image
                src={property.images[0] || "/placeholder.svg"}
                alt={`${property.name} - Main view`}
                width={800}
                height={600}
                className="rounded-lg w-full h-[400px] object-cover"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <Image
                src={property.images[1] || "/placeholder.svg"}
                alt={`${property.name} - Secondary view`}
                width={400}
                height={300}
                className="rounded-lg w-full h-[190px] object-cover"
              />
              <Image
                src={property.images[2] || "/placeholder.svg"}
                alt={`${property.name} - Third view`}
                width={400}
                height={300}
                className="rounded-lg w-full h-[190px] object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-2xl font-bold">Buchungen</h2>
            <div className="mt-2 md:mt-0 flex flex-col md:flex-row gap-2 items-end">
              <div className="flex flex-col">
                <label htmlFor="startDate" className="text-sm text-foreground/70 dark:text-gray-300 mb-1">
                  Von
                </label>
                <input
                  id="startDate"
                  type="date"
                  className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-800 text-sm"
                  onChange={(e) => {
                    const newStartDate = e.target.value
                    setFilterDates((prev) => ({ ...prev, startDate: newStartDate }))
                  }}
                  value={filterDates.startDate}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="endDate" className="text-sm text-foreground/70 dark:text-gray-300 mb-1">
                  Bis
                </label>
                <input
                  id="endDate"
                  type="date"
                  className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-800 text-sm"
                  onChange={(e) => {
                    const newEndDate = e.target.value
                    setFilterDates((prev) => ({ ...prev, endDate: newEndDate }))
                  }}
                  value={filterDates.endDate}
                />
              </div>
              <Button onClick={applyFilter} className="bg-[#A8C947] text-white hover:bg-[#97B83B] h-8">
                Filter anwenden
              </Button>
              {isFiltered && (
                <Button onClick={resetFilter} variant="outline" className="h-8 border-gray-300 dark:border-gray-600">
                  Zurücksetzen
                </Button>
              )}
            </div>
          </div>

          <BookingList bookings={filteredBookings} />
        </div>
      </div>
    </div>
  )
}

