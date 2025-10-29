import { Apartment } from './apartment';
import { Client } from './client';

export interface Booking {
  id?: number;
  clientId?: number; // sigue siendo útil si a veces usas solo el ID
  client?: Client;
  guests: number;
  apartmentId?: number;
  apartment?: Apartment;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  notes?: string;
}
