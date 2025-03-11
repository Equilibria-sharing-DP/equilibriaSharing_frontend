"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import type { Booking } from "@/app/tenantDataManagement/data/bookings"
import Link from "next/link"
import { MoreVertical, FileText, FileSpreadsheet, FileDown, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function BookingList({ bookings }: { bookings: Booking[] }) {
  const handleExport = (format: string, bookingId: number) => {
    // Hier können Sie die Export-Logik implementieren
    console.log(`Exporting booking ${bookingId} as ${format}`)
  }

  const handleRemoveBooking = (bookingId: number) => {
    // Here you would implement the logic to remove a booking
    console.log(`Removing booking ${bookingId}`)
  }

  return (
    <div className="mt-8 space-y-4">
      {bookings.map((booking, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg mb-4 bg-card dark:bg-gray-800/50 hover:bg-accent/50 dark:hover:bg-gray-800/70 transition-colors"
        >
          <Link href={`/tenantDataManagement/bookings/edit/${index}`} className="flex-grow cursor-pointer">            
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
              <div className="flex-1 min-w-[200px] mb-2 md:mb-0">
                <div className="text-sm font-semibold text-foreground dark:text-gray-200">Datum:</div>
                <div className="text-foreground/90 dark:text-gray-300">
                  {booking.startDate} - {booking.endDate}
                </div>
              </div>
              <div className="flex-1 min-w-[200px] mb-2 md:mb-0">
                <div className="text-sm font-semibold text-foreground dark:text-gray-200">Name:</div>
                <div className="text-foreground/90 dark:text-gray-300">{booking.guestName}</div>
              </div>
              <div className="flex-1 min-w-[150px] mb-2 md:mb-0">
                <div className="text-sm font-semibold text-foreground dark:text-gray-200">Geb.:</div>
                <div className="text-foreground/90 dark:text-gray-300">{booking.birthDate}</div>
              </div>
              <div className="flex-1 min-w-[150px]">
                <div className="text-sm font-semibold text-foreground dark:text-gray-200">Passnum:</div>
                <div className="text-foreground/90 dark:text-gray-300">{booking.passportNumber}</div>
              </div>
            </div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-accent/50 dark:hover:bg-gray-700">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => handleExport("pdf", index)}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Als PDF exportieren</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv", index)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <span>Als CSV exportieren</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel", index)}>
                <FileDown className="mr-2 h-4 w-4" />
                <span>Als Excel exportieren</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleRemoveBooking(index)}
                className="text-red-500 hover:text-red-700 focus:text-red-700"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Buchung entfernen</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  )
}

