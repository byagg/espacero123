export interface Venue {
  id: string
  host_id: string
  name: string
  description: string | null
  category: string | null
  address: string
  city: string
  postal_code: string | null
  latitude: number | null
  longitude: number | null
  capacity: number
  price_per_hour: number
  images: string[]
  amenities: string[]
  rules: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}
