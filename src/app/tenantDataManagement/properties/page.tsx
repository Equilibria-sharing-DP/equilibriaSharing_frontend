import { PropertyCard } from "@/components/tenantDataManagementComponents/PropertyCard"
import propertiesData from "../data/properties.json"

export default function PropertiesPage() {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Immobilien Übersicht</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propertiesData.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  )
}

