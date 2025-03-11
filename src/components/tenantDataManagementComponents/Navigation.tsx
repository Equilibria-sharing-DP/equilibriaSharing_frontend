"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const router = useRouter()

  const handleLogout = () => {
    // Hier würden Sie die Logout-Logik implementieren
    // z.B. Token löschen, Session beenden, etc.
    router.push("/tenantDataManagement/login")
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex justify-between items-center">
        <li>
          <Link href="/" className="text-xl font-bold">
            Immobilien Verwaltung
          </Link>
        </li>
        <li>
          <Button onClick={handleLogout} variant="ghost">
            Abmelden
          </Button>
        </li>
      </ul>
    </nav>
  )
}

