"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, User, Mail, Lock, Phone, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Heslá sa nezhodujú")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Heslo musí mať aspoň 6 znakov")
      setLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        phone: formData.phone,
        user_role: "client", // Default role
      })

      if (signUpError) {
        setError("Nastala chyba pri registrácii. Skúste to znovu.")
        return
      }

      if (data?.user) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess?.()
        }, 2000)
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError("Nastala chyba pri registrácii. Skúste to znovu.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Registrácia bola úspešná! Môžete sa teraz prihlásiť.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">Celé meno</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="pl-10"
            placeholder="Vaše celé meno"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="pl-10"
            placeholder="vas@email.sk"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefón</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="pl-10"
            placeholder="+421 xxx xxx xxx"
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Heslo</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="pl-10"
            placeholder="Minimálne 6 znakov"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Potvrdiť heslo</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="pl-10"
            placeholder="Zopakujte heslo"
            required
            disabled={loading}
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Registruje sa...
          </>
        ) : (
          "Zaregistrovať sa"
        )}
      </Button>

      <div className="text-center text-sm text-gray-600">
        Registráciou súhlasíte s{" "}
        <a href="/legal" className="text-amber-600 hover:text-amber-700">
          podmienkami používania
        </a>
      </div>
    </form>
  )
}
