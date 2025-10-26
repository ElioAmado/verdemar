import { apartments } from '@/consts/apartaments';
// src/types/price.ts
import { Apartment } from "./apartment";

/**
 * Represents a daily price associated with a specific apartment.
 */
export interface Price {
  /** The apartment this price belongs to */
  apartment: Apartment;

  /** The specific date this price applies to (ISO string format: YYYY-MM-DD) */
  date: string;

  /** The price value, stored as a decimal number */
  price: number;
}

export interface CreatePriceRequest {
  apartmentId: number
  date: string
  price: number
}

export interface UpdatePriceRequest {
  apartmentId: number
  date: string
  price: number
}
