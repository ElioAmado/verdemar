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

// ===========================
// INTERFACES BASE - MODELO DE DATOS
// ===========================

export type ApartmentType = 'INDIVIDUAL' | 'DOBLE' | 'SUITE';
export type BookingStatus = 0 | 1 | 2; // 0 = Pendiente, 1 = Confirmada, 2 = Cancelada
export type PaymentMethod = 'CREDIT_CARD' | 'PAYPAL' | 'STRIPE' | 'CASH' | 'TRANSFER';

export interface Apartment {
  apartment_id: number;
  type: ApartmentType;
  capacity: number;
  floor: number;
  description: string;
}

export interface Client {
  client_id: number;
  name: string;
  last_name: string;
  email: string;
  phone: string;
}

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
  // Relaciones opcionales
  apartment?: Apartment;
  client?: Client;
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

export interface ApartmentDiscount {
  discount_id: number;
  apartment_id: number;
}

// ===========================
// INTERFACES PARA PREDICCIONES ML
// ===========================

export interface BookingPrediction {
  month: string;           // Formato: "2027-01", "2027-02", etc.
  predicted_bookings: number;
  predicted_occupancy: number;  // Porcentaje 0-100
  predicted_revenue: number;
  confidence: number;      // Nivel de confianza 0-1
}

export interface PredictionResponse {
  year: number;
  predictions: BookingPrediction[];
  model_accuracy: number;
  generated_at: string;
}

// ===========================
// INTERFACES PARA GRÁFICA DE OCUPACIÓN
// ===========================

export interface OccupancyDataPoint {
  date: string;
  occupancy_real: number | null;        // null si es una predicción futura
  occupancy_predicted: number;           // Siempre tiene valor proyectado
  total_apartments: number;
  occupied_apartments: number | null;   // null si es futuro
  is_prediction: boolean;
}
export interface OccupancyChartData {
  data_points: OccupancyDataPoint[];
  period_start: string;
  period_end: string;
  average_occupancy: number;
  average_predicted_occupancy: number;
}

// ===========================
// INTERFACES PARA KPIs
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

// ===========================
// INTERFACES PARA ALERTAS INTELIGENTES
// ===========================

export type AlertType = 'high_demand' | 'low_occupancy' | 'price_suggestion' | 'maintenance' | 'info';
export type AlertPriority = 'high' | 'medium' | 'low';

export interface SmartAlert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  apartment_type?: ApartmentType;
  suggested_action?: string;
  date_range?: {
    start: string;
    end: string;
  };
  created_at: string;
}

// ===========================
// INTERFACES PARA FILTROS
// ===========================

export interface DashboardFilters {
  date_range: {
    start: string;
    end: string;
  };
  apartment_type: ApartmentType | 'ALL';
  year: number;
}

// ===========================
// ESTADO GLOBAL DEL DASHBOARD
// ===========================

export interface DashboardState {
  // Data
  kpis: DashboardKPIs | null;
  occupancy_data: OccupancyChartData | null;
  predictions: PredictionResponse | null;
  alerts: SmartAlert[];
  recent_bookings: Booking[];
  apartments: Apartment[];
  
  // UI State
  filters: DashboardFilters;
  is_loading: boolean;
  error: string | null;
  
  // Comparación temporal
  comparison_mode: 'month' | 'year' | 'custom';
}

// ===========================
// RESPUESTAS DE API
// ===========================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
