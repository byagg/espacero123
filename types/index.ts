export interface Venue {
  id: string
  name: string
  description: string
  location: string
  city: string
  address: string
  type: "restaurant" | "cafe" | "bar" | "event_hall" | "conference"
  price: number
  capacity: number
  images: string[]
  amenities: string[]
  rating: number
  reviews_count: number
  host_id: string
  is_active: boolean
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  venue_id: string
  date_from: string
  date_to: string
  guest_count: number
  total_price: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  special_requests?: string
  created_at: string
  venue?: Venue
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: "guest" | "host" | "admin"
  phone?: string
  created_at: string
}

export interface FilterOptions {
  search: string
  type: string
  date: string
  maxPrice: number
  city: string
}

export interface ChartData {
  name: string
  value: number
  color?: string
}
