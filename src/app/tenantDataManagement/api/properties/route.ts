import { NextResponse } from "next/server"

const properties = [
  {
    "id": 1,
    "name": "Villa Bella",
    "type": "Gewerblicher Vermieter",
    "description": "Luxurious hotel with panoramic sea views",
    "address": {
      "id": 5,
      "street": "Via Roma 123",
      "houseNumber": 13,
      "addressAdditional": "",
      "city": "Rom",
      "postalCode": 1000,
      "country": "Italy"
    },
    "maxGuests": 100,
    "pricePerNight": 1117.0
  },
  {
    "id": 2,
    "name": "Alpine Lodge",
    "type": "Gastgeberin ist Patricia",
    "description": "Cozy cabin in the mountains with ski-in ski-out access",
    "address": {
      "id": 6,
      "street": "Alpenstrasse",
      "houseNumber": 278,
      "addressAdditional": "Top 3",
      "city": "Ustrine",
      "postalCode": 6020,
      "country": "Kroatien"
    },
    "maxGuests": 5,
    "pricePerNight": 194.0
  },
  {
    "id": 3,
    "name": "Urban Retreat",
    "type": "Gastgeberin ist Igor",
    "description": "Modern apartment in the heart of the city",
    "address": {
      "id": 7,
      "street": "Hauptstrasse",
      "houseNumber": 789,
      "addressAdditional": "",
      "city": "Bošana",
      "postalCode": 1010,
      "country": "Kroatien"
    },
    "maxGuests": 4,
    "pricePerNight": 585.0
  }
]

export async function GET() {
  return NextResponse.json(properties)
}

