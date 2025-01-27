"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { bookings, type Booking } from "@/app/tenantDataManagement/data/bookings"
import Image from "next/image"
import { Plus } from "lucide-react"

export default function EditBookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)

  useEffect(() => {
    const bookingIndex = Number.parseInt(params.id)
    if (isNaN(bookingIndex) || bookingIndex < 0 || bookingIndex >= bookings.length) {
      router.push("/tenantDataManagement/properties/1")
    } else {
      setBooking(bookings[bookingIndex])
    }
  }, [params.id, router])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Here you would typically update the booking in your data store
    console.log("Updated booking:", booking)
    router.push("/tenantDataManagement/properties/1")
  }

  if (!booking) return <div>Loading...</div>

  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Property Header */}
        <div className="mb-8">
          <h1 className="text-[40px] font-bold tracking-tight">APARTMENT IN WIEN</h1>
          <p className="text-xl mb-2">Österreich, Wien</p>
          <p className="text-gray-600">Adresse: Mariahilfer Straße 85, 1060 Wien</p>

          {/* Image Gallery */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="col-span-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mariahilfer6-VMYPnDyh1wq8vfW3Sw4Qy3qC3dBreW.png"
                alt="Main apartment view"
                width={800}
                height={400}
                className="rounded-2xl w-full h-[300px] object-cover"
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mariahilfer3-PQD1N5eCluWAOL0cpzOBcqNSe4V2xi.png"
                alt="Living room"
                width={400}
                height={200}
                className="rounded-2xl w-full h-[142px] object-cover"
              />
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mariahilfer2-NG0MWOF7Oqhs8oVv4gPhWsiEeVfS6F.png"
                alt="Bathroom"
                width={400}
                height={200}
                className="rounded-2xl w-full h-[142px] object-cover"
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Travel Document Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Reisedokument</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xl mb-2">Nachname</label>
                <input
                  type="text"
                  value={booking.guestName.split(" ")[0] || ""}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      guestName: `${e.target.value} ${booking.guestName.split(" ")[1] || ""}`,
                    })
                  }
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xl mb-2">Vorname</label>
                <input
                  type="text"
                  value={booking.guestName.split(" ")[1] || ""}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      guestName: `${booking.guestName.split(" ")[0] || ""} ${e.target.value}`,
                    })
                  }
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xl mb-2">Staatsangehörigkeit</label>
                <input
                  type="text"
                  defaultValue="Österreich"
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xl mb-2">Reisepassnummer</label>
                <input
                  type="text"
                  value={booking.passportNumber}
                  onChange={(e) => setBooking({ ...booking, passportNumber: e.target.value })}
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xl mb-2">Geburtsort</label>
                <input
                  type="text"
                  defaultValue="Braunau am Inn"
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xl mb-2">Geschlecht</label>
                <input
                  type="text"
                  defaultValue="Männlich"
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xl mb-2">ausstellende Behörde</label>
                <input
                  type="text"
                  defaultValue="MBA 6/7"
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xl mb-2">Geburtsdatum</label>
                <input
                  type="text"
                  value={booking.birthDate}
                  onChange={(e) => setBooking({ ...booking, birthDate: e.target.value })}
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xl mb-2">Ausstellungsdatum</label>
                <input
                  type="text"
                  defaultValue="06.02.2017"
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xl mb-2">Gültig bis</label>
                <input
                  type="text"
                  defaultValue="06.02.2027"
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Addresse</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xl mb-2">Strasse</label>
                <input
                  type="text"
                  defaultValue="Gutensteinerstraße 3"
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xl mb-2">Postleitzahl</label>
                <input
                  type="text"
                  defaultValue="2751"
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xl mb-2">Ort</label>
                <input
                  type="text"
                  defaultValue="Wiener Neustadt"
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xl mb-2">Staat</label>
                <input
                  type="text"
                  defaultValue="Österreich"
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Fellow Travelers Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Mitreisende</h2>
            <button type="button" className="flex items-center gap-2 text-xl p-3 border-2 border-[#A8C947] rounded-lg">
              <Plus className="w-6 h-6" />
              Mitreisende hinzufügen
            </button>
          </div>

          {/* Arrival/Departure Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Ankunft/Abreise</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xl mb-2">Datum der Ankunft</label>
                <input
                  type="text"
                  value={booking.startDate}
                  onChange={(e) => setBooking({ ...booking, startDate: e.target.value })}
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xl mb-2">voraussichtlichen Abreise</label>
                <input
                  type="text"
                  value={booking.endDate}
                  onChange={(e) => setBooking({ ...booking, endDate: e.target.value })}
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xl mb-2">tatsächlichen Abreise</label>
                <input
                  type="text"
                  value={booking.endDate}
                  onChange={(e) => setBooking({ ...booking, endDate: e.target.value })}
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xl mb-2">Tourist Tax</label>
                <input
                  type="text"
                  defaultValue="34.72€"
                  className="w-full p-3 border-2 border-[#A8C947] rounded-lg"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#A8C947] text-white px-8 py-3 rounded-lg text-xl hover:bg-[#97B83B] transition-colors"
            >
              SPEICHERN
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

