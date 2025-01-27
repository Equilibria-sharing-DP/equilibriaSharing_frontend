import { BookingList } from "@/components/tenantDataManagementComponents/BookingList"
import { bookings } from "@/app/tenantDataManagement/data/bookings"
import Image from "next/image"


export default function PropertyDetailsPage() {
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">APARTMENT IN WIEN</h1>
          <div className="text-xl mb-2">Österreich, Wien</div>
          <div className="text-gray-600 mb-6">Adresse: Mariahilfer Straße 85, 1060 Wien</div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mariahilfer6-VMYPnDyh1wq8vfW3Sw4Qy3qC3dBreW.png"
                alt="Main apartment view"
                width={800}
                height={600}
                className="rounded-lg w-full h-[400px] object-cover"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mariahilfer3-PQD1N5eCluWAOL0cpzOBcqNSe4V2xi.png"
                alt="Living room"
                width={400}
                height={300}
                className="rounded-lg w-full h-[190px] object-cover"
              />
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mariahilfer2-NG0MWOF7Oqhs8oVv4gPhWsiEeVfS6F.png"
                alt="Bathroom"
                width={400}
                height={300}
                className="rounded-lg w-full h-[190px] object-cover"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">Buchungen</h2>
          <BookingList bookings={bookings} />
        </div>
      </div>
    </div>
  )
}

