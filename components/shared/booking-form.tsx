"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { useBookings } from "@/hooks/use-bookings"
import { Calendar, Users, Euro, Loader2 } from "lucide-react"
import { format, differenceInHours } from "date-fns"

interface Venue {
  id: string
  name: string
  price_per_hour: number
  capacity: number
  address: string
  city: string
}

interface BookingFormProps {
  venue: Venue
  onSuccess: () => void
  onCancel: () => void
}

export function BookingForm({ venue, onSuccess, onCancel }: BookingFormProps) {
  const { user } = useAuth()
  const { createBooking, loading } = useBookings()

  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    guestCount: 1,
    specialRequests: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.date) {
      newErrors.date = "Vyberte dátum"
    }

    if (!formData.startTime) {
      newErrors.startTime = "Vyberte čas začiatku"
    }

    if (!formData.endTime) {
      newErrors.endTime = "Vyberte čas ukončenia"
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(`${formData.date}T${formData.startTime}`)
      const end = new Date(`${formData.date}T${formData.endTime}`)

      if (end <= start) {
        newErrors.endTime = "Čas ukončenia musí byť po čase začiatku"
      }

      const duration = differenceInHours(end, start)
      if (duration < 2) {
        newErrors.endTime = "Minimálna doba prenájmu je 2 hodiny"
      }
    }

    if (formData.guestCount < 1) {
      newErrors.guestCount = "Počet hostí musí byť aspoň 1"
    }

    if (formData.guestCount > venue.capacity) {
      newErrors.guestCount = `Maximálny počet hostí je ${venue.capacity}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const calculateTotal = () => {
    if (!formData.startTime || !formData.endTime || !formData.date) return 0

    const start = new Date(`${formData.date}T${formData.startTime}`)
    const end = new Date(`${formData.date}T${formData.endTime}`)
    const hours = differenceInHours(end, start)

    return hours * venue.price_per_hour
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !user) return

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`)
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`)

    const bookingData = {
      venue_id: venue.id,
      guest_id: user.id,
      start_datetime: startDateTime.toISOString(),
      end_datetime: endDateTime.toISOString(),
      guest_count: formData.guestCount,
      total_price: calculateTotal(),
      special_requests: formData.specialRequests || null,
    }

    const { error } = await createBooking(bookingData)

    if (error) {
      setErrors({ submit: "Nastala chyba pri vytváraní rezervácie. Skúste to znova." })
    } else {
      onSuccess()
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const totalPrice = calculateTotal()
  const duration =
    formData.startTime && formData.endTime && formData.date
      ? differenceInHours(
          new Date(`${formData.date}T${formData.endTime}`),
          new Date(`${formData.date}T${formData.startTime}`),
        )
      : 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Venue Info */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-800 mb-2">{venue.name}</h3>
          <p className="text-gray-600 text-sm">
            {venue.address}, {venue.city}
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              Max. {venue.capacity} osôb
            </span>
            <span className="flex items-center">
              <Euro className="h-4 w-4 mr-1" />
              {venue.price_per_hour}€/hodina
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date">Dátum *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange("date", e.target.value)}
            min={format(new Date(), "yyyy-MM-dd")}
            className={errors.date ? "border-red-500" : ""}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        <div>
          <Label htmlFor="startTime">Čas začiatku *</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange("startTime", e.target.value)}
            className={errors.startTime ? "border-red-500" : ""}
          />
          {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
        </div>

        <div>
          <Label htmlFor="endTime">Čas ukončenia *</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => handleInputChange("endTime", e.target.value)}
            className={errors.endTime ? "border-red-500" : ""}
          />
          {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
        </div>
      </div>

      {/* Guest Count */}
      <div>
        <Label htmlFor="guestCount">Počet hostí *</Label>
        <Input
          id="guestCount"
          type="number"
          min="1"
          max={venue.capacity}
          value={formData.guestCount}
          onChange={(e) => handleInputChange("guestCount", Number.parseInt(e.target.value) || 1)}
          className={errors.guestCount ? "border-red-500" : ""}
        />
        {errors.guestCount && <p className="text-red-500 text-sm mt-1">{errors.guestCount}</p>}
      </div>

      {/* Special Requests */}
      <div>
        <Label htmlFor="specialRequests">Špeciálne požiadavky</Label>
        <Textarea
          id="specialRequests"
          placeholder="Napíšte nám o vašich špeciálnych požiadavkách..."
          value={formData.specialRequests}
          onChange={(e) => handleInputChange("specialRequests", e.target.value)}
          rows={3}
        />
      </div>

      {/* Price Summary */}
      {duration > 0 && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Súhrn rezervácie</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Trvanie:</span>
                <span>
                  {duration} {duration === 1 ? "hodina" : duration < 5 ? "hodiny" : "hodín"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cena za hodinu:</span>
                <span>€{venue.price_per_hour}</span>
              </div>
              <div className="flex justify-between">
                <span>Počet hostí:</span>
                <span>{formData.guestCount} osôb</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Celková cena:</span>
                <span className="text-amber-600">€{totalPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-gray-300 bg-white text-gray-700"
          disabled={loading}
        >
          Zrušiť
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-amber-500 text-white border-amber-500"
          disabled={loading || totalPrice === 0}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Odosielam...
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4 mr-2" />
              Odoslať rezerváciu
            </>
          )}
        </Button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Po odoslaní rezervácie vás bude kontaktovať hostiteľ do 24 hodín.
        <br />
        Platba prebieha priamo s hostiteľom.
      </div>
    </form>
  )
}
