export type SortOption = "price-asc" | "price-desc" | "capacity-asc" | "capacity-desc" | "floor-asc" | "floor-desc"

export interface ExtendedApartmentAvailability {
  apartment: {
    id: number
    apartmentType: string
    capacity: number
    floor: number
    bedrooms: number
    description?: string
  }
  available: boolean
  price?: number
  pricePerNight?: number
  loading?: boolean
  error?: string
}

export interface SearchFormData {
  startDate: string
  endDate: string
  type: string
  adults: string
  children: string
}
