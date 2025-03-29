import { PropertyCard } from "@/components/tenantDataManagementComponents/PropertyCard"
import { Navbar } from "@/components/tenantDataManagementComponents/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import propertiesData from "../data/properties.json"

export default function PropertiesPage({ searchParams,}: {searchParams?: { country?: string }}) {
  const country = searchParams?.country

  // Filter properties based on country parameter
  const filteredProperties = country
    ? propertiesData.filter((property) => property.address.country === country)
    : propertiesData

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{country ? `Immobilien in ${country}` : "Immobilien Übersicht"}</h1>
          <div className="flex space-x-3">
            <Link href="/tenantDataManagement/properties/generate-link">
                <Button className="bg-[#A8C947] text-white hover:bg-[#97B83B]">Link generieren</Button>
            </Link>
            <Link href="/tenantDataManagement/properties/add">
              <Button className="bg-[#A8C947] text-white hover:bg-[#97B83B]">Immobilie hinzufügen</Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  )
}

