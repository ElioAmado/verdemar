import { apartments } from '@/constants/apartaments';
// src/types/price.ts
import { Apartment } from './apartment';

/**
 * Represents a daily price associated with a specific apartment.
 */
export interface Price {
  apartment?: Apartment
  date: string
  price: number
}


export interface CreatePriceRequest {
  apartmentId: number;
  date: string;
  price: number;
}

export interface UpdatePriceRequest {
  apartmentId: number;
  date: string;
  price: number;
}

export interface PriceStats {
  total: number
  averagePrice: number
  highestPrice: number
  lowestPrice: number
  totalRevenuePotential: number
  uniqueApartments: number
  pricesThisMonth: number
}

export type SortField = "date" | "price" | "apartment.id"
export type SortDirection = "asc" | "desc"
