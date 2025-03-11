"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

const navItems = [
  { name: "Immobilien Ansicht", href: "/tenantDataManagement/properties" },
  { name: "Immobilien Österreich", href: "/tenantDataManagement/properties?country=Österreich" },
  { name: "Immobilien Italien", href: "/tenantDataManagement/properties?country=Italien" },
]

export function Navbar() {
  const [activeItem, setActiveItem] = useState("Immobilien Ansicht")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the theme UI
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const country = searchParams.get("country")
    if (pathname === "/tenantDataManagement/properties") {
      if (country === "Österreich") {
        setActiveItem("Immobilien Österreich")
      } else if (country === "Italien") {
        setActiveItem("Immobilien Italien")
      } else {
        setActiveItem("Immobilien Ansicht")
      }
    }
  }, [pathname, searchParams])

  const handleNavigation = (item: { name: string; href: string }) => {
    setActiveItem(item.name)
    router.push(item.href)
  }

  const handleLogout = () => {
    router.push("/tenantDataManagement/login")
  }

  return (
    <header className="bg-[#A8C947] p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/tenantDataManagement/properties" className="rounded-full overflow-hidden w-12 h-12 mr-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sharing.png-1lBT9Vx3mksu8daLtBHje4uyPFJy2S.png"
              alt="Equilibria Sharing Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </Link>
          <nav className="font-sans">
            <ul className="flex space-x-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`text-white hover:bg-[#8AB83B] transition-colors text-base font-bold px-2 py-1 rounded ${
                      activeItem === item.name ? "bg-[#8AB83B]" : ""
                    }`}
                    onClick={() => handleNavigation(item)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 w-10 rounded-full bg-[#A8C947] text-white hover:bg-[#8AB83B]">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value="light" className="cursor-pointer">
                <Sun className="mr-2 h-4 w-4" />
                <span>Light Mode</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark" className="cursor-pointer">
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark Mode</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system" className="cursor-pointer">
                <Monitor className="mr-2 h-4 w-4" />
                <span>System Theme</span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Abmelden</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

