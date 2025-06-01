import type { Venue } from "@/types"

export interface BookingFormData {
  venue_id: string
  date_from: string
  date_to: string
  guest_count: number
  total_price: number
  special_requests?: string
}

export interface BookingFormProps {
  venue: Venue
  onSubmit: (data: BookingFormData) => Promise<void>
  loading?: boolean
}
