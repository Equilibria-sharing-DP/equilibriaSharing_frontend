"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/tenantDataManagementComponents/navbar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, Check } from "lucide-react"
import propertiesData from "@/app/tenantDataManagement/data/properties.json"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function GenerateLinkPage() {
  const router = useRouter()
  const [selectedProperty, setSelectedProperty] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const [copied, setCopied] = useState(false)

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [copied])

  const handleGenerateLink = () => {
    if (!selectedProperty || !startDate || !endDate) {
      alert("Bitte wählen Sie eine Immobilie und einen Zeitraum aus")
      return
    }

    // Create an object with the selected data
    const linkData = {
      propertyId: selectedProperty,
      startDate,
      endDate,
    }

    // Convert to JSON and then to Base64
    const jsonString = JSON.stringify(linkData)
    const base64String = btoa(jsonString)

    // Create a shareable link
    const baseUrl = window.location.origin
    const fullLink = `${baseUrl}/booking?data=${base64String}`

    setGeneratedLink(fullLink)
  }

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink)
      setCopied(true)
    }
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
              <Label htmlFor="property">Immobilie auswählen</Label>
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger id="property">
                  <SelectValue placeholder="Wählen Sie eine Immobilie" />
                </SelectTrigger>
                <SelectContent>
                  {propertiesData.map((property) => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      {property.name} - {property.address.city}, {property.address.country}
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
                  className="w-full"
                />
              </div>
            </div>

            <Button onClick={handleGenerateLink} className="w-full bg-[#A8C947] text-white hover:bg-[#97B83B]">
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

