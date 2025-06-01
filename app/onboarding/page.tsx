"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Calendar, Bell, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const { user } = useAuth()

  const steps = [
    {
      icon: Search,
      title: "Vyhľadajte priestor",
      description:
        "Použite naše filtre na nájdenie ideálneho priestoru pre vašu udalosť. Môžete filtrovať podľa typu, lokality, ceny a dátumu.",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      icon: Calendar,
      title: "Rezervujte termín",
      description: "Vyberte si dátum a čas, zadajte počet hostí a odošlite rezerváciu. Dostanete okamžité potvrdenie.",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      icon: Bell,
      title: "Sledujte rezervácie",
      description: "V profile môžete sledovať všetky vaše rezervácie, upravovať ich alebo zrušiť podľa potreby.",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      icon: CheckCircle,
      title: "Užite si udalosť",
      description: "Príďte v stanovený čas a užite si perfektne zorganizovanú udalosť v krásnom priestore.",
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Vitajte v ESPACERO{user ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Naučte sa, ako jednoducho nájsť a rezervovať perfektný priestor pre vašu udalosť
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white border-gray-200 shadow-xl mb-8">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <currentStepData.icon className="h-8 w-8 text-amber-500 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">{currentStepData.title}</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">{currentStepData.description}</p>

                {/* Step-specific tips */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-800 mb-2">💡 Tip:</h3>
                  <p className="text-amber-700 text-sm">
                    {currentStep === 0 && "Použite mapu na zobrazenie priestorov vo vašej blízkosti"}
                    {currentStep === 1 && "Rezervácie môžete vykonať až 6 mesiacov vopred"}
                    {currentStep === 2 && "Zapnite si notifikácie pre dôležité aktualizácie"}
                    {currentStep === 3 && "Nezabudnite prísť 15 minút pred začiatkom"}
                  </p>
                </div>
              </div>

              <div className="relative">
                <img
                  src={currentStepData.image || "/placeholder.svg"}
                  alt={currentStepData.title}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="border-amber-500 text-amber-600 hover:bg-amber-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Späť
          </Button>

          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Krok {currentStep + 1} z {steps.length}
            </p>
          </div>

          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep} className="bg-amber-500 hover:bg-amber-600 text-white">
              Ďalej
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Link href="/venues">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                Začať prehliadať
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/venues">
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Search className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Prehliadať priestory</h3>
                <p className="text-gray-600 text-sm">Nájdite priestor pre vašu udalosť</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile">
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Moje rezervácie</h3>
                <p className="text-gray-600 text-sm">Spravujte vaše rezervácie</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/host">
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Bell className="h-8 w-8 text-amber-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Pridať priestor</h3>
                <p className="text-gray-600 text-sm">Začnite zarábať prenájmom</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
