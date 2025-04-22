"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch('/tenantDataManagement/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        // Speichere den Token im LocalStorage
        if (data.data && typeof data.data === 'string') {
          localStorage.setItem('token', data.data);
        } else if (data.data && data.data.token) {
          localStorage.setItem('token', data.data.token);
        } else if (data.data && data.data.message) {
          localStorage.setItem('token', data.data.message);
        }
        router.push("./properties")
      } else {
        setError(data.message || "Ungültiger Benutzername oder Passwort")
      }
    } catch (error) {
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.")
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold mb-2">Log in</h1>
        <p className="text-gray-600">To access your account</p>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-gray-600" htmlFor="username">
            Benutzername
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Benutzername"
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

        <Button 
          type="button" 
          onClick={handleSubmit}
          className="w-full bg-[#A8C947] hover:bg-[#97B83B] text-white"
        >
          LOG IN
        </Button>
      </form>
    </div>
  )
}