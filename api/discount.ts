// Mock API functions for discount management
// In a real app, these would call your Java backend

import { apartments } from "@/consts/apartaments"

export interface Discount {
  id: number
  startDate: string
  endDate: string
  discount: number
  isPercentage: boolean
  apartmentIds: number[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function getAllApartmentIds(): Promise<number[]> {
  // Mock data - replace with actual API call
  return apartments.map((apt) => apt.id)
}

export async function getDiscountsByApartmentId(apartmentId: number): Promise<Discount[]> {
  // Mock data - replace with actual API call to your Java backend
  // GET /api/discounts?apartmentId={apartmentId}
  try {
    const response = await fetch(`${API_BASE_URL}/api/discounts?apartmentId=${apartmentId}`)
    if (!response.ok) {
      throw new Error("Failed to fetch discounts")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching discounts:", error)
    // Return mock data for development
    return []
  }
}

export async function getAllDiscounts(): Promise<Discount[]> {
  // Mock data - replace with actual API call
  // GET /api/discounts
  return []
}
