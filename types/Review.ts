export interface Review {
  id: string
  rating: number
  title?: string
  comment?: string
  language?: string
  created_at?: string
  reviewer?: {
    name?: string
    country?: string
  }
}
