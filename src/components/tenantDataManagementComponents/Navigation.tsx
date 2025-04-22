"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const router = useRouter()

  const handleLogout = () => {
    // Hier können wir später Token oder Session-Daten löschen
    // Zum Beispiel: localStorage.removeItem('token')
    
    // Zur Login-Seite weiterleiten
    router.push("/tenantDataManagement/login")
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex justify-between items-center">
        <li>
          <Link href="/tenantDataManagement/properties" className="text-xl font-bold">
            Immobilien Verwaltung
          </Link>
        </li>
        <li>
          <Button 
            onClick={handleLogout} 
            variant="ghost"
            className="hover:bg-gray-700"
          >
            Abmelden
          </Button>
        </li>
      </ul>
    </nav>
  )
}

