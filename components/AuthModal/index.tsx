"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle } from "lucide-react"
import type { AuthModalProps } from "./types"
import { useToast } from "@/hooks/use-toast"

export function AuthModal({ isOpen, onClose, onLogin, onRegister }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const validateLogin = () => {
    const newErrors: Record<string, string> = {}

    if (!loginData.email) {
      newErrors.email = "Email je povinný"
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Neplatný formát emailu"
    }

    if (!loginData.password) {
      newErrors.password = "Heslo je povinné"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRegister = () => {
    const newErrors: Record<string, string> = {}

    if (!registerData.name) {
      newErrors.name = "Meno je povinné"
    }

    if (!registerData.email) {
      newErrors.email = "Email je povinný"
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = "Neplatný formát emailu"
    }

    if (!registerData.password) {
      newErrors.password = "Heslo je povinné"
    } else if (registerData.password.length < 6) {
      newErrors.password = "Heslo musí mať aspoň 6 znakov"
    }

    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Heslá sa nezhodujú"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateLogin()) return

    setLoading(true)
    try {
      await onLogin(loginData.email, loginData.password)
      onClose()
      toast({
        title: "Úspešné prihlásenie",
        description: "Vitajte späť!",
      })
    } catch (error) {
      toast({
        title: "Chyba prihlásenia",
        description: "Nesprávny email alebo heslo",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateRegister()) return

    setLoading(true)
    try {
      await onRegister({
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
      })
      onClose()
      toast({
        title: "Úspešná registrácia",
        description: "Váš účet bol vytvorený. Vitajte!",
      })
    } catch (error) {
      toast({
        title: "Chyba registrácie",
        description: "Nepodarilo sa vytvoriť účet. Skúste to znovu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-gray-800">Prihlásenie do ESPACERO</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Prihlásenie</TabsTrigger>
            <TabsTrigger value="register">Registrácia</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">
                  Email *
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="vas@email.com"
                    className={`pl-9 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    required
                    aria-describedby={errors.email ? "login-email-error" : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="login-email-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">
                  Heslo *
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Vaše heslo"
                    className={`pl-9 pr-9 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                    required
                    aria-describedby={errors.password ? "login-password-error" : undefined}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Skryť heslo" : "Zobraziť heslo"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p id="login-password-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium"
              >
                {loading ? "Prihlasovanie..." : "Prihlásiť sa"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="register-name" className="text-sm font-medium text-gray-700">
                  Celé meno *
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-name"
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ján Novák"
                    className={`pl-9 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                    required
                    aria-describedby={errors.name ? "register-name-error" : undefined}
                  />
                </div>
                {errors.name && (
                  <p id="register-name-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                  Email *
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="vas@email.com"
                    className={`pl-9 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    required
                    aria-describedby={errors.email ? "register-email-error" : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="register-email-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="register-phone" className="text-sm font-medium text-gray-700">
                  Telefón
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-phone"
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+421 900 123 456"
                    className="pl-9 border-gray-300"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                  Heslo *
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Minimálne 6 znakov"
                    className={`pl-9 pr-9 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                    required
                    aria-describedby={errors.password ? "register-password-error" : undefined}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Skryť heslo" : "Zobraziť heslo"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p id="register-password-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="register-confirm-password" className="text-sm font-medium text-gray-700">
                  Potvrdiť heslo *
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Zopakujte heslo"
                    className={`pl-9 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                    required
                    aria-describedby={errors.confirmPassword ? "register-confirm-password-error" : undefined}
                  />
                </div>
                {errors.confirmPassword && (
                  <p id="register-confirm-password-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium"
              >
                {loading ? "Registrovanie..." : "Registrovať sa"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
