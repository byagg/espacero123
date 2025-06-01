"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BookingForm } from "./booking-form"

interface Venue {
  id: string
  name: string
  price_per_hour: number
  capacity: number
  address: string
  city: string
}

interface BookingModalProps {
  open: boolean
  onClose: () => void
  venue: Venue
}

export function BookingModal({ open, onClose, venue }: BookingModalProps) {
  const [step, setStep] = useState<"form" | "confirmation">("form")

  const handleBookingSuccess = () => {
    setStep("confirmation")
  }

  const handleClose = () => {
    setStep("form")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{step === "form" ? `Rezervácia - ${venue.name}` : "Rezervácia odoslaná"}</DialogTitle>
        </DialogHeader>

        {step === "form" ? (
          <BookingForm venue={venue} onSuccess={handleBookingSuccess} onCancel={handleClose} />
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Rezervácia bola odoslaná!</h3>
            <p className="text-gray-600 mb-6">
              Vaša rezervácia bola úspešne odoslaná hostiteľovi. Budete kontaktovaný do 24 hodín.
            </p>
            <button
              onClick={handleClose}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Zavrieť
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
