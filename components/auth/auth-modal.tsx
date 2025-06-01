"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/shared/login-form"
import { RegisterForm } from "@/components/shared/register-form"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string>("login")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white border-gray-200">
        {/* Header */}
        <div className="relative bg-amber-500 px-6 py-8 text-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-amber-600 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Vitajte v ESPACERO</h2>
            <p className="text-amber-100">
              {activeTab === "login" ? "Prihláste sa do svojho účtu" : "Vytvorte si nový účet a začnite rezervovať"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="login"
                className="rounded-md data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Prihlásenie
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="rounded-md data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                Registrácia
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0">
              <LoginForm onSuccess={onClose} />
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <RegisterForm onSuccess={() => setActiveTab("login")} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Prihlásením súhlasíte s našimi{" "}
            <a href="/legal" className="text-amber-600 hover:text-amber-700 font-medium">
              Podmienkami používania
            </a>{" "}
            a{" "}
            <a href="/legal" className="text-amber-600 hover:text-amber-700 font-medium">
              Zásadami ochrany údajov
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
