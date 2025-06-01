import type { Venue } from "./venue"

export interface Booking {
  id: string
  venue_id: string
  guest_id: string
  start_datetime: string
  end_datetime: string
  guest_count: number
  total_price: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  special_requests: string | null
  created_at: string
  updated_at: string
  venue?: Venue
}
