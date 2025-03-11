import { NextResponse } from "next/server"

const validUsers = [
  { email: "akoenig@equilibria.com", password: "Koenig123" },
  { email: "cfojtl@equilibria.com", password: "Fojtl123" },
  { email: "chauser@equilibria.com", password: "Hauser123" },
]

export async function POST(request: Request) {
  const { email, password } = await request.json()

  const user = validUsers.find((u) => u.email === email && u.password === password)

  if (user) {
    // In a real application, you would generate and return a JWT token here
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  }
}