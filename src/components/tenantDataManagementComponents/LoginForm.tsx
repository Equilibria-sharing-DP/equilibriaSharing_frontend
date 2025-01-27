"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const validUsers = [
    { email: "akoenig@equilibria.com", password: "Koenig123" },
    { email: "cfojtl@equilibria.com", password: "Fojtl123" },
    { email: "chauser@equilibria.com", password: "Hauser123" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const user = validUsers.find((u) => u.email === email && u.password === password)

    if (user) {
      router.push("./properties")
    } else {
      setError("Ungültige E-Mail oder Passwort")
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mb-2">Log in</h1>
        <p className="text-gray-600">To access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-gray-600" htmlFor="email">
            E-Mail
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@equilibria.com"
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-600" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-md pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" className="w-full bg-[#A8C947] hover:bg-[#97B83B] text-white">
          LOG IN
        </Button>
      </form>
    </div>
  )
}

