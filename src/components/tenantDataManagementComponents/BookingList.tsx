import type { Booking } from "@/app/tenantDataManagement/data/bookings"
import Link from "next/link"

export function BookingList({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="mt-8">
      {bookings.map((booking, index) => (
        <Link href={`/tenantDataManagement/bookings/edit/${index}`} key={index}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg mb-4 bg-white hover:bg-gray-50 cursor-pointer">
            <div className="flex-1 min-w-[200px] mb-2 md:mb-0">
              <div className="text-sm font-semibold">Datum:</div>
              <div>
                {booking.startDate} - {booking.endDate}
              </div>
            </div>
            <div className="flex-1 min-w-[200px] mb-2 md:mb-0">
              <div className="text-sm font-semibold">Name:</div>
              <div>{booking.guestName}</div>
            </div>
            <div className="flex-1 min-w-[150px] mb-2 md:mb-0">
              <div className="text-sm font-semibold">Geb.:</div>
              <div>{booking.birthDate}</div>
            </div>
            <div className="flex-1 min-w-[150px]">
              <div className="text-sm font-semibold">Passnum:</div>
              <div>{booking.passportNumber}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

