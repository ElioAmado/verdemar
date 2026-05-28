import { Apartment } from './apartment';
import { Client } from './client';

// ===========================
// ENUMS Y TIPOS AUXILIARES
// ===========================
export enum ApartmentType {
  STUDIO = 'STUDIO',
  ONE_BEDROOM = 'ONE_BEDROOM',
  TWO_BEDROOM = 'TWO_BEDROOM',
  PENTHOUSE = 'PENTHOUSE',
  SUITE = 'SUITE'
}

export enum BookingStatus {
  PENDING = 0,
  CONFIRMED = 1,
  CANCELLED = 2
}

export type PaymentMethod = 'CREDIT_CARD' | 'PAYPAL' | 'STRIPE' | 'CASH' | 'TRANSFER';

// ===========================
// INTERFACES BASE - MODELO DE DATOS
// ===========================
export interface Booking {
  booking_id: number;
  apartment_id: number;
  client_id: number;
  start_date: string;
  end_date: string;
  guests: number;
  total_price: number;
  method_payment: PaymentMethod;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  apartment?: Apartment;
  client?: Client;
}

// Interfaz extendida que pide tu frontend para los Check-ins cercanos
export interface BookingWithDetails extends Omit<Booking, 'booking_id' | 'start_date' | 'end_date' | 'guests'> {
  id: number; // Mapeado a booking_id en el mock de front
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  discount_applied: number | null;
}

export interface Price {
  apartment_id: number;
  date: string;
  price: number;
}

export interface Discount {
  id: number;
  discount: number;
  is_percentage: boolean;
  start_date: string;
  end_date: string;
}

// ===========================
// INTERFACES PARA PREDICCIONES Y GRÁFICAS
// ===========================
export interface OccupancyDataPoint {
  date: string;
  actual_occupancy_rate: number | null;
  actual_booked_apartments: number | null;
  actual_total_apartments: number;
  actual_revenue: number | null;
  predicted_occupancy_rate: number | null;
  predicted_booked_apartments: number | null;
  predicted_revenue: number | null;
  prediction_confidence: number | null;
  is_historical: boolean;
  is_prediction: boolean;
}

export interface OccupancyByType {
  apartment_type: ApartmentType;
  current_occupancy_rate: number;
  predicted_occupancy_rate: number;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  available_count: number;
  booked_count: number;
}

export interface PredictionAlert {
  id: string;
  type: 'HIGH_DEMAND' | 'PRICE_ADJUSTMENT' | 'LOW_DEMAND' | 'MAINTENANCE' | 'INFO';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  apartment_type: ApartmentType;
  message: string;
  recommendation: string;
  predicted_date: string;
  created_at: string;
  is_read: boolean;
}

// ===========================
// DASHBOARD Y FILTROS
// ===========================
export interface DashboardKPIs {
  averageRevenuePerBooking: number;
  totalBookings: number;
  apartmentTypeFiltered: string;
  startDateFiltered: string;
  endDateFiltered: string;
  totalRevenue: number;
  totalNights: number;
}

export interface DashboardFilters {
  date_range: {
    start: string;
    end: string;
  };
  apartment_types: ApartmentType[];
  booking_status: BookingStatus[];
  include_predictions: boolean;
  comparison_period: string;
}

