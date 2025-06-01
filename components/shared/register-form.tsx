"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic here
    console.log("Registration data:", { fullName, email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        id="fullName"
        name="fullName"
        placeholder="Meno a priezvisko"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="border-gray-300"
        required
        aria-label="Meno a priezvisko"
      />

      <Input
        type="email"
        id="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border-gray-300"
        required
        aria-label="Email"
      />

      <Input
        type="password"
        id="password"
        name="password"
        placeholder="Heslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border-gray-300"
        required
        aria-label="Heslo"
      />

      <Button type="submit">Registrovať sa</Button>
    </form>
  )
}
