"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, User, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface RegisterFormProps {
  onSuccess: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()

  const passwordRequirements = [
    { text: "Minimálne 6 znakov", met: password.length >= 6 },
    { text: "Obsahuje číslo", met: /\d/.test(password) },
    { text: "Obsahuje veľké písmeno", met: /[A-Z]/.test(password) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Heslá sa nezhodujú")
      return
    }

    if (!agreeToTerms) {
      setError("Musíte súhlasiť s podmienkami používania")
      return
    }

    // Kontrola požiadaviek na heslo
    if (password.length < 6) {
      setError("Heslo musí mať aspoň 6 znakov")
      return
    }

    if (!/\d/.test(password)) {
      setError("Heslo musí obsahovať aspoň jedno číslo")
      return
    }

    if (!/[A-Z]/.test(password)) {
      setError("Heslo musí obsahovať aspoň jedno veľké písmeno")
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await signUp(email, password, {
        full_name: fullName,
        user_role: "guest",
      })

      if (error) throw error

      // Úspešná registrácia
      onSuccess()
    } catch (err) {
      console.error("Chyba pri registrácii:", err)
      setError(err instanceof Error ? err.message : "Registrácia zlyhala. Skúste to znova s iným emailom.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Vytvorte si nový účet</h3>
        <p className="text-gray-600 text-sm">Začnite rezervovať priestory už dnes</p>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-gray-700 font-medium">
            Celé meno
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="fullName"
              placeholder="Vaše meno a priezvisko"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="pl-10 border-gray-300 bg-white h-12"
              required
            />
          </div>
        </div>

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
          <Label htmlFor="password" className="text-gray-700 font-medium">
            Heslo
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 border-gray-300 bg-white h-12"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Password Requirements */}
          {password && (
            <div className="mt-2 space-y-1">
              {passwordRequirements.map((req, index) => (
                <div key={index} className="flex items-center text-xs">
                  <CheckCircle className={`h-3 w-3 mr-2 ${req.met ? "text-green-500" : "text-gray-300"}`} />
                  <span className={req.met ? "text-green-600" : "text-gray-500"}>{req.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
            Potvrdiť heslo
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10 border-gray-300 bg-white h-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-red-600">Heslá sa nezhodujú</p>
          )}
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
            className="mt-1 border-gray-300 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
          />
          <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
            Súhlasím s{" "}
            <a href="/legal" className="text-amber-600 hover:text-amber-700 font-medium">
              Podmienkami používania
            </a>{" "}
            a{" "}
            <a href="/legal" className="text-amber-600 hover:text-amber-700 font-medium">
              Zásadami ochrany údajov
            </a>
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-amber-500 text-white h-12 font-semibold border-amber-500"
          disabled={isLoading || !agreeToTerms}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vytváram účet...
            </>
          ) : (
            "Vytvoriť účet"
          )}
        </Button>
      </form>
    </div>
  )
}
