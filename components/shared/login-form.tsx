"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { data, error } = await signIn(email, password)
      if (error) throw error

      // Úspešné prihlásenie
      onSuccess()
    } catch (err) {
      console.error("Chyba pri prihlásení:", err)
      setError(
        err instanceof Error
          ? err.message
          : "Prihlásenie zlyhalo. Skontrolujte svoje prihlasovacie údaje a skúste to znova.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Prihláste sa do svojho účtu</h3>
        <p className="text-gray-600 text-sm">Zadajte svoje prihlasovacie údaje</p>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Emailová adresa
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="vas@email.sk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 border-gray-300 bg-white h-12"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Heslo
            </Label>
            <button type="button" className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors">
              Zabudnuté heslo?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 border-gray-300 bg-white h-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-amber-500 text-white h-12 font-semibold border-amber-500"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Prihlasovanie...
            </>
          ) : (
            "Prihlásiť sa"
          )}
        </Button>
      </form>

      {/* Test accounts info */}
      <div className="mt-6 border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600 mb-2 font-medium">Testovacie účty:</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>Pre vytvorenie testovacieho účtu použite registráciu</p>
          <p>Alebo sa prihláste s existujúcim účtom</p>
        </div>
      </div>
    </div>
  )
}
