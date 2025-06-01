"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Users, Euro, AlertCircle } from "lucide-react"
import type { BookingFormProps } from "./types"
import { useToast } from "@/hooks/use-toast"

export function BookingForm({ venue, onSubmit, loading = false }: BookingFormProps) {
  const [formData, setFormData] = useState({
    date: "",
    timeFrom: "",
    timeTo: "",
    guestCount: 1,
    specialRequests: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.date) {
      newErrors.date = "Dátum je povinný"
    }
    if (!formData.timeFrom) {
      newErrors.timeFrom = "Čas začiatku je povinný"
    }
    if (!formData.timeTo) {
      newErrors.timeTo = "Čas konca je povinný"
    }
    if (formData.timeFrom && formData.timeTo && formData.timeFrom >= formData.timeTo) {
      newErrors.timeTo = "Čas konca musí byť po čase začiatku"
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

  const calculateDuration = () => {
    if (!formData.timeFrom || !formData.timeTo) return 0

    const start = new Date(`2000-01-01T${formData.timeFrom}`)
    const end = new Date(`2000-01-01T${formData.timeTo}`)

    return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60 * 60))
  }

  const calculateTotal = () => {
    const duration = calculateDuration()
    return duration * venue.price
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Chyba vo formulári",
        description: "Prosím, opravte chyby vo formulári",
        variant: "destructive",
      })
      return
    }

    try {
      await onSubmit({
        venue_id: venue.id,
        date_from: `${formData.date}T${formData.timeFrom}`,
        date_to: `${formData.date}T${formData.timeTo}`,
        guest_count: formData.guestCount,
        total_price: calculateTotal(),
        special_requests: formData.specialRequests || undefined,
      })

      toast({
        title: "Rezervácia odoslaná",
        description: "Vaša rezervácia bola úspešne odoslaná na schválenie",
      })
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa odoslať rezerváciu. Skúste to znovu.",
        variant: "destructive",
      })
    }
  }

  const duration = calculateDuration()
  const total = calculateTotal()

  return (
    <Card className="bg-white border-gray-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Calendar className="h-5 w-5 text-amber-600" />
          Rezervovať priestor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <Label htmlFor="date" className="text-sm font-medium text-gray-700">
              Dátum *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split("T")[0]}
              className={`mt-1 ${errors.date ? "border-red-500" : "border-gray-300"}`}
              aria-describedby={errors.date ? "date-error" : undefined}
            />
            {errors.date && (
              <p id="date-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.date}
              </p>
            )}
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeFrom" className="text-sm font-medium text-gray-700">
                Od *
              </Label>
              <Input
                id="timeFrom"
                type="time"
                value={formData.timeFrom}
                onChange={(e) => setFormData((prev) => ({ ...prev, timeFrom: e.target.value }))}
                className={`mt-1 ${errors.timeFrom ? "border-red-500" : "border-gray-300"}`}
                aria-describedby={errors.timeFrom ? "timeFrom-error" : undefined}
              />
              {errors.timeFrom && (
                <p id="timeFrom-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.timeFrom}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="timeTo" className="text-sm font-medium text-gray-700">
                Do *
              </Label>
              <Input
                id="timeTo"
                type="time"
                value={formData.timeTo}
                onChange={(e) => setFormData((prev) => ({ ...prev, timeTo: e.target.value }))}
                className={`mt-1 ${errors.timeTo ? "border-red-500" : "border-gray-300"}`}
                aria-describedby={errors.timeTo ? "timeTo-error" : undefined}
              />
              {errors.timeTo && (
                <p id="timeTo-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.timeTo}
                </p>
              )}
            </div>
          </div>

          {/* Guest Count */}
          <div>
            <Label htmlFor="guestCount" className="text-sm font-medium text-gray-700">
              Počet hostí *
            </Label>
            <Input
              id="guestCount"
              type="number"
              min="1"
              max={venue.capacity}
              value={formData.guestCount}
              onChange={(e) => setFormData((prev) => ({ ...prev, guestCount: Number.parseInt(e.target.value) || 1 }))}
              className={`mt-1 ${errors.guestCount ? "border-red-500" : "border-gray-300"}`}
              aria-describedby={errors.guestCount ? "guestCount-error" : undefined}
            />
            {errors.guestCount && (
              <p id="guestCount-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.guestCount}
              </p>
            )}
            <p className="text-gray-500 text-sm mt-1">Maximálna kapacita: {venue.capacity} osôb</p>
          </div>

          {/* Special Requests */}
          <div>
            <Label htmlFor="specialRequests" className="text-sm font-medium text-gray-700">
              Špeciálne požiadavky
            </Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => setFormData((prev) => ({ ...prev, specialRequests: e.target.value }))}
              placeholder="Napríklad: potrebujeme projektor, vegetariánske menu..."
              className="mt-1 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
              rows={3}
            />
          </div>

          {/* Summary */}
          {duration > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Súhrn rezervácie</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Trvanie:
                  </span>
                  <span>
                    {duration} {duration === 1 ? "hodina" : duration < 5 ? "hodiny" : "hodín"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Počet hostí:
                  </span>
                  <span>{formData.guestCount}</span>
                </div>
                <div className="flex justify-between font-semibold text-amber-700 border-t border-amber-200 pt-2 mt-2">
                  <span className="flex items-center gap-1">
                    <Euro className="h-4 w-4" />
                    Celková cena:
                  </span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || duration === 0}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium"
          >
            {loading ? "Odosielam..." : "Odoslať rezerváciu"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
