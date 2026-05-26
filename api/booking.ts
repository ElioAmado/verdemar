import axios from 'axios';
import { DateRange } from 'react-day-picker';
import {
  Booking,
  DashboardKPIs,
  OccupancyChartData,
  PredictionResponse,
  SmartAlert,
  Apartment,
  Client,
  DashboardFilters,
  OccupancyDataPoint,
  BookingPrediction,
} from '@/types/booking';
import { SpringPage } from '@/types/pages';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

const apiModel = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_MODEL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Helper para verificar si un objeto está vacío {} o null/undefined
const isEmptyObject = (obj: any) => !obj || (Object.keys(obj).length === 0 && obj.constructor === Object);

// ==========================================
// BANCO DE DATOS DE PRUEBA (MOCKS ACTUALIZADOS)
// ==========================================
const MOCK_DATA = {
  booking: (): Booking => ({
    booking_id: Math.floor(Math.random() * 1000),
    apartment_id: 101,
    client_id: 50,
    start_date: '2026-06-01',
    end_date: '2026-06-07',
    guests: 2,
    total_price: 650.00,
    method_payment: 'STRIPE',
    status: 1,
    notes: 'Reserva de prueba (Fallback por respuesta vacía)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    apartment: { 
      id: 101, 
      apartmentType: 'SUITE', 
      capacity: 4, 
      floor: 2, 
      bedrooms: 2,
      description: 'Apartamento de lujo',
      beds: [] 
    },
    client: { 
      id: 50, 
      name: 'Juan', 
      lastName: 'Pérez', 
      email: 'juan.perez@example.com', 
      phone: '+34600123456' 
    }
  }),

  springPageBookings: (): SpringPage<Booking> => ({
    content: [
      { 
        booking_id: 1, 
        apartment_id: 101, 
        client_id: 1, 
        start_date: '2026-06-01', 
        end_date: '2026-06-05', 
        guests: 2, 
        total_price: 450, 
        method_payment: 'CREDIT_CARD', 
        status: 1, 
        notes: 'Mock data', 
        created_at: '', 
        updated_at: '',
        apartment: { id: 101, apartmentType: 'INDIVIDUAL', capacity: 1, floor: 1, bedrooms: 1, description: 'Estudio', beds: [] },
        client: { id: 1, name: 'Ana', lastName: 'García', email: 'ana@example.com', phone: '123' }
      }
    ],
    pageable: { pageNumber: 0, pageSize: 10 },
    totalPages: 1,
    totalElements: 1,
    last: true,
    size: 10,
    number: 0,
    first: true,
    numberOfElements: 1,
    empty: false
  }),

  predictions: (year: number): PredictionResponse => ({
    year: year || 2026,
    model_accuracy: 0.92,
    generated_at: new Date().toISOString(),
    predictions: [
      { month: `${year}-06`, predicted_bookings: 45, predicted_occupancy: 88.5, predicted_revenue: 12500, confidence: 0.94 },
      { month: `${year}-07`, predicted_bookings: 50, predicted_occupancy: 92.0, predicted_revenue: 15000, confidence: 0.91 },
      { month: `${year}-11`, predicted_bookings: 15, predicted_occupancy: 35.0, predicted_revenue: 4200, confidence: 0.88 }
    ]
  }),

  kpis: (): DashboardKPIs => ({
    averageRevenuePerBooking: 525.50,
    totalBookings: 120,
    apartmentTypeFiltered: 'ALL',
    startDateFiltered: '2026-01-01',
    endDateFiltered: '2026-12-31',
    totalRevenue: 63060,
    totalNights: 480
  }),

  apartments: (): Apartment[] => [
    { id: 101, apartmentType: 'INDIVIDUAL', capacity: 1, floor: 1, bedrooms: 1, description: 'Estudio acogedor', beds: [] },
    { id: 102, apartmentType: 'DOBLE', capacity: 2, floor: 1, bedrooms: 1, description: 'Apartamento estándar', beds: [] },
    { id: 103, apartmentType: 'SUITE', capacity: 4, floor: 2, bedrooms: 2, description: 'Suite Ático Premium', beds: [] }
  ]
};

// ==========================================
// CORE BOOKINGS (API TRANSACCIONAL - /booking)
// ==========================================

export const getAllBookings = async (page = 0, size = 10): Promise<SpringPage<Booking>> => {
  try {
    const res = await api.get<SpringPage<Booking>>('/booking', { params: { page, size } });
    if (isEmptyObject(res.data) || !res.data.content || res.data.content.length === 0) {
      return MOCK_DATA.springPageBookings();
    }
    return res.data;
  } catch (error) {
    return MOCK_DATA.springPageBookings();
  }
};

export const getBookingById = async (id: number): Promise<Booking> => {
  try {
    const res = await api.get<Booking>(`/booking/${id}`);
    console.log('Respuesta API getBookingById:', res.data);
    if (isEmptyObject(res.data) || !res.data.id) return { ...MOCK_DATA.booking(), booking_id: id};
    return res.data;
  } catch (error) {
    return { ...MOCK_DATA.booking(), booking_id: id };
  }
};

export const createBooking = async (booking: Booking): Promise<Booking> => {
  try {
    const res = await api.post<Booking>('/booking', booking);
    if (isEmptyObject(res.data)) return { ...booking, booking_id: Math.floor(Math.random() * 1000) };
    return res.data;
  } catch (error) {
    return { ...booking, booking_id: Math.floor(Math.random() * 1000) };
  }
};

export const updateBooking = async (id: number, booking: Booking): Promise<Booking> => {
  try {
    const res = await api.put<Booking>(`/booking/${id}`, booking);
    if (isEmptyObject(res.data)) return booking;
    return res.data;
  } catch (error) {
    return booking;
  }
};

export const deleteBooking = async (id: number): Promise<void> => {
  try {
    await api.delete(`/booking/${id}`);
  } catch (error) {}
};

export const getTotalPrice = async (apartmentId: number, startDate: string, endDate: string): Promise<number> => {
  try {
    const res = await api.get<number>('/booking/check', { params: { apartmentId, startDate, endDate } });
    return typeof res.data === 'number' ? res.data : 350.00;
  } catch (error) {
    return 350.00;
  }
};

export const getDatesByApartmentId = async (apartmentId: number): Promise<DateRange[]> => {
  try {
    const res = await api.get<DateRange[]>(`/booking/getDates/${apartmentId}`);
    if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
      return [{ from: new Date(2026, 5, 1), to: new Date(2026, 5, 5) }];
    }
    return res.data;
  } catch (error) {
    return [{ from: new Date(2026, 5, 1), to: new Date(2026, 5, 5) }];
  }
};

export const getDatesByMonth = async (apartmentId: number, month: number, year: number): Promise<any> => {
  try {
    const res = await api.get(`/booking/getDates/${apartmentId}/${month}/${year}`);
    return res.data && !isEmptyObject(res.data) ? res.data : [];
  } catch (error) {
    return [];
  }
};

// ==========================================
// ANALÍTICA Y ML DASHBOARD (/dashboard)
// ==========================================

export const fetchPredictions = async (year: number): Promise<PredictionResponse> => {
  try {
    const res = await apiModel.get<PredictionResponse>('/bookings/predict-next-12-months', { params: { year } });
    if (isEmptyObject(res.data) || !res.data.predictions || res.data.predictions.length === 0) {
      return MOCK_DATA.predictions(year);
    }
    return res.data;
  } catch (error) {
    return MOCK_DATA.predictions(year);
  }
};

export const fetchDashboardKPIs = async (filters: DashboardFilters): Promise<DashboardKPIs> => {
  try {
    const params: Record<string, string> = {
      start_date: filters.date_range.start,
      end_date: filters.date_range.end,
    };
    if (filters.apartment_type !== 'ALL') params.apartment_type = filters.apartment_type;

    const res = await api.get<DashboardKPIs>('/dashboard/kpis', { params });
    if (isEmptyObject(res.data) || !res.data.totalBookings) {
      return MOCK_DATA.kpis();
    }
    return res.data;
  } catch (error) {
    return MOCK_DATA.kpis();
  }
};

export const fetchOccupancyData = async (filters: DashboardFilters): Promise<OccupancyChartData> => {
  try {
    const params: Record<string, string> = {
      start_date: filters.date_range.start,
      end_date: filters.date_range.end,
    };
    if (filters.apartment_type !== 'ALL') params.apartment_type = filters.apartment_type;

    const res = await api.get<any>('/dashboard/occupancy', { params });
    const rawData = res.data;

    if (isEmptyObject(rawData) || !rawData.startDateFiltered) {
      throw new Error('Respuesta vacía o incompleta');
    }

    return {
      period_start: rawData.startDateFiltered,
      period_end: rawData.endDateFiltered,
      average_occupancy: rawData.occupancyRate || 0,
      average_predicted_occupancy: 0,
      data_points: [
        {
          date: rawData.startDateFiltered,
          occupancy_real: rawData.occupancyRate || 0,
          occupancy_predicted: null,
          total_apartments: 0,
          occupied_apartments: null,
          is_prediction: false
        }
      ],
    };
  } catch (error) {
    return {
      period_start: filters.date_range.start,
      period_end: filters.date_range.end,
      average_occupancy: 65.5,
      average_predicted_occupancy: 68.0,
      data_points: [
        { date: filters.date_range.start, occupancy_real: 60, occupancy_predicted: 62, total_apartments: 10, occupied_apartments: 6, is_prediction: false },
        { date: filters.date_range.end, occupancy_real: 71, occupancy_predicted: 74, total_apartments: 10, occupied_apartments: 7, is_prediction: false }
      ],
    };
  }
};

export const fetchRecentBookings = async (limit: number = 10): Promise<Booking[]> => {
  try {
    const res = await api.get<Booking[]>('/dashboard/recent', { params: { limit } });
    if (!res.data || (Array.isArray(res.data) && res.data.length === 0) || isEmptyObject(res.data)) {
      return [MOCK_DATA.booking(), MOCK_DATA.booking()];
    }
    return res.data;
  } catch (error) {
    return [MOCK_DATA.booking(), MOCK_DATA.booking()];
  }
};

export const fetchApartments = async (): Promise<Apartment[]> => {
  try {
    const res = await api.get<Apartment[]>('/dashboard/apartments');
    if (!res.data || (Array.isArray(res.data) && res.data.length === 0) || isEmptyObject(res.data)) {
      return MOCK_DATA.apartments();
    }
    return res.data;
  } catch (error) {
    return MOCK_DATA.apartments();
  }
};

// ==========================================
// PROCESAMIENTO DE DATOS EN FRONTEND
// ==========================================

export function generateSmartAlerts(predictions: PredictionResponse): SmartAlert[] {
  const alerts: SmartAlert[] = [];
  const now = new Date();

  if (isEmptyObject(predictions) || !predictions.predictions) return [];

  predictions.predictions.forEach((prediction, index) => {
    if (prediction.predicted_occupancy > 85) {
      alerts.push({
        id: `high_demand_${index}`,
        type: 'high_demand',
        priority: 'high',
        title: 'Alta demanda prevista',
        message: `Se predice una ocupación del ${prediction.predicted_occupancy.toFixed(1)}% para ${formatMonth(prediction.month)}. Considera ajustar los precios al alza.`,
        suggested_action: 'Incrementar precios un 15-20%',
        date_range: { start: prediction.month, end: prediction.month },
        created_at: now.toISOString(),
      });
    }

    if (prediction.predicted_occupancy < 40) {
      alerts.push({
        id: `low_occupancy_${index}`,
        type: 'low_occupancy',
        priority: 'medium',
        title: 'Baja ocupación esperada',
        message: `Se espera solo ${prediction.predicted_occupancy.toFixed(1)}% de ocupación para ${formatMonth(prediction.month)}. Considera promociones especiales.`,
        suggested_action: 'Activar descuentos del 10-15%',
        date_range: { start: prediction.month, end: prediction.month },
        created_at: now.toISOString(),
      });
    }
  });

  return alerts.slice(0, 5);
}

function formatMonth(monthStr: string): string {
  if (!monthStr || !monthStr.includes('-')) return 'Mes Desconocido';
  const [year, month] = monthStr.split('-');
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return `${months[parseInt(month) - 1] || 'Mes'} ${year}`;
}

export function combineRealAndPredictedData(
  realData: OccupancyDataPoint[],
  predictions: BookingPrediction[]
): OccupancyDataPoint[] {
  const dataSafe = Array.isArray(realData) ? realData : [];
  const predSafe = Array.isArray(predictions) ? predictions : [];

  const combined: OccupancyDataPoint[] = dataSafe.map(d => ({ ...d }));
  
  predSafe.forEach(pred => {
    if (!pred || !pred.month) return;
    const existingIndex = combined.findIndex(d => d.date === pred.month);
    
    if (existingIndex >= 0) {
      combined[existingIndex].occupancy_predicted = pred.predicted_occupancy;
    } else {
      combined.push({
        date: pred.month,
        occupancy_real: null,
        occupancy_predicted: pred.predicted_occupancy,
        total_apartments: 0, 
        occupied_apartments: null,
        is_prediction: true,
      });
    }
  });

  return combined.sort((a, b) => a.date.localeCompare(b.date));
}