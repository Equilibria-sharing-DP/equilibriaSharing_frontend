"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/tenantDataManagementComponents/navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Check, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { accommodationService } from '@/services/accommodationService'

interface Accommodation {
  id: number;
  name: string;
  type: string;
  description: string;
  maxGuests: number;
  pricePerNight: number;
  pictureUrls: string[];
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  addressAdditional?: string;
}

export default function GenerateLinkPage() {
  const router = useRouter()
  const [selectedAccommodation, setSelectedAccommodation] = useState<string>("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [generatedLink, setGeneratedLink] = useState<string>("")
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadAccommodations()
  }, [])

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  const loadAccommodations = async () => {
    try {
      const data = await accommodationService.getAllAccommodations()
      setAccommodations(data)
      setError(null)
    } catch (err) {
      setError('Fehler beim Laden der Immobilien')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateLink = () => {
    if (!selectedAccommodation || !startDate || !endDate) {
      alert("Bitte wählen Sie eine Immobilie und einen Zeitraum aus")
      return
    }

    // Create an object with the selected data
    const linkData = {
      accommodationId: selectedAccommodation,
      startDate,
      endDate,
    }

    // Convert to JSON and then to Base64
    const jsonString = JSON.stringify(linkData)
    const base64String = btoa(jsonString)

    // Create a shareable link
    const baseUrl = window.location.origin
    const registrationLink = `${baseUrl}/tenantRegistration?data=${base64String}`
    setGeneratedLink(registrationLink)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink)
    setCopied(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={loadAccommodations} className="mt-4">
          Erneut versuchen
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <Button
            onClick={() => router.push("/tenantDataManagement/properties")}
            className="mr-4 p-2 rounded-full bg-[#A8C947] text-white hover:bg-[#97B83B]"
            size="icon"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-3xl font-bold">Link generieren</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Buchungslink erstellen</CardTitle>
            <CardDescription>
              Wählen Sie eine Immobilie und einen Zeitraum aus, um einen Buchungslink zu generieren.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="accommodation">Immobilie auswählen</Label>
              <Select
                value={selectedAccommodation}
                onValueChange={setSelectedAccommodation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie eine Immobilie" />
                </SelectTrigger>
                <SelectContent>
                  {accommodations.map((accommodation) => (
                    <SelectItem 
                      key={accommodation.id} 
                      value={accommodation.id.toString()}
                    >
                      {accommodation.name} - {accommodation.street} {accommodation.houseNumber}, {accommodation.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Von</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Bis</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  className="w-full"
                />
              </div>
            </div>

            <Button 
              onClick={handleGenerateLink}
              className="w-full bg-[#A8C947] text-white hover:bg-[#97B83B]"
            >
              Link generieren
            </Button>
          </CardContent>
        </Card>

        {generatedLink && (
          <Card>
            <CardHeader>
              <CardTitle>Generierter Link</CardTitle>
              <CardDescription>Teilen Sie diesen Link mit Ihren Gästen!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input value={generatedLink} readOnly className="flex-1 bg-gray-50 dark:bg-gray-800" />
                <Button onClick={handleCopyLink} variant="outline" size="icon" className="h-10 w-10">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Der Link enthält die ausgewählte Immobilie und den Zeitraum in verschlüsselter Form.
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

