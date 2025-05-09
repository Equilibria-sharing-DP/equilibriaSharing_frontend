import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { username, password } = await request.json()

  try {
    console.log("Versuche Verbindung zum Backend herzustellen...")
    const response = await fetch('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, password }),
    })

    console.log("Backend-Antwort Status:", response.status)

    // Lese die Antwort zuerst als Text
    const responseText = await response.text()
    console.log("Backend-Antwort Text:", responseText)

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: responseText || "Invalid credentials" },
        { status: 401 }
      )
    }

    // Der Token kommt direkt als Text vom Backend
    return NextResponse.json({ 
      success: true, 
      data: responseText // Der Token wird direkt weitergeleitet
    })
    
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("Fehler beim Verbinden zum Backend:", message)
    return NextResponse.json(
      { success: false, message: "Server error", details: message },
      { status: 500 }
    )
  }
}