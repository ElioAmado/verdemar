import axios from 'axios';
import { DateRange } from 'react-day-picker';
import {
  Booking,
  DashboardKPIs,
  OccupancyChartData,
  PredictionResponse,
  SmartAlert,
  Apartment,
  DashboardFilters,
  OccupancyDataPoint,
  BookingPrediction,
} from '@/types/booking';
import { SpringPage } from '@/types/pages';

// Instancia unificada de Axios compartida para todo el módulo
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiModel = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_MODEL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});
// ==========================================
// CORE BOOKINGS (API TRANSACCIONAL - /booking)
// ==========================================

// ✅ Obtener todas las reservas (Paginado)
export const getAllBookings = async (page = 0, size = 10): Promise<SpringPage<Booking>> => {
  const res = await api.get<SpringPage<Booking>>('/booking', {
    params: { page, size }
  });
  return res.data;
};

// ✅ Obtener una reserva por ID
export const getBookingById = async (id: number): Promise<Booking> => {
  const res = await api.get<Booking>(`/booking/${id}`);
  return res.data;
};

// ✅ Crear una nueva reserva
export const createBooking = async (booking: Booking): Promise<Booking> => {
  const res = await api.post<Booking>('/booking', booking);
  return res.data;
};

// ✅ Actualizar una reserva
export const updateBooking = async (id: number, booking: Booking): Promise<Booking> => {
  const res = await api.put<Booking>(`/booking/${id}`, booking);
  return res.data;
};

// ✅ Eliminar una reserva
export const deleteBooking = async (id: number): Promise<void> => {
  await api.delete(`/booking/${id}`);
};

// ✅ Obtener el precio total entre dos fechas para un apartamento
export const getTotalPrice = async (
  apartmentId: number,
  startDate: string,
  endDate: string
): Promise<number> => {
  const res = await api.get<number>('/booking/check', {
    params: { apartmentId, startDate, endDate },
  });
  return res.data;
};

// ✅ Obtener rangos de fechas reservadas por apartamento
export const getDatesByApartmentId = async (apartmentId: number): Promise<DateRange[]> => {
  const res = await api.get<DateRange[]>(`/booking/getDates/${apartmentId}`);
  return res.data;
};

// ✅ Obtener reservas de un apartamento para un mes y año específicos
export const getDatesByMonth = async (
  apartmentId: number,
  month: number,
  year: number
): Promise<any> => {
  const res = await api.get(`/booking/getDates/${apartmentId}/${month}/${year}`);
  return res.data;
};


// ==========================================
// ANALÍTICA Y ML DASHBOARD (/dashboard)
// ==========================================

// ✅ Obtener predicciones de Machine Learning para un año específico
export const fetchPredictions = async (year: number): Promise<PredictionResponse> => {
  const res = await apiModel.get<PredictionResponse>('/bookings/predict-next-12-months', {
    params: { year }
  });
  return res.data;
};

// ✅ Obtener los KPIs principales del Dashboard con filtros aplicados
export const fetchDashboardKPIs = async (filters: DashboardFilters): Promise<DashboardKPIs> => {
  const params: Record<string, string> = {
    start_date: filters.date_range.start,
    end_date: filters.date_range.end,
  };
  if (filters.apartment_type !== 'ALL') {
    params.apartment_type = filters.apartment_type;
  }

  const res = await api.get<DashboardKPIs>('/dashboard/kpis', { params });
  return res.data;
};

// ✅ Obtener datos de la gráfica de ocupación real e histórica
export const fetchOccupancyData = async (filters: DashboardFilters): Promise<OccupancyChartData> => {
  const params: Record<string, string> = {
    start_date: filters.date_range.start,
    end_date: filters.date_range.end,
  };
  if (filters.apartment_type !== 'ALL') {
    params.apartment_type = filters.apartment_type;
  }

  const res = await api.get<OccupancyChartData>('/dashboard/occupancy', { params });
  return res.data;
};

// ✅ Obtener listado de últimas reservas añadidas al sistema
export const fetchRecentBookings = async (limit: number = 10): Promise<Booking[]> => {
  const res = await api.get<Booking[]>('/dashboard/recent', {
    params: { limit }
  });
  return res.data;
};

// ✅ Obtener listado de todos los apartamentos activos
export const fetchApartments = async (): Promise<Apartment[]> => {
  const res = await api.get<Apartment[]>('/dashboard/apartments');
  return res.data;
};


// ==========================================
// PROCESAMIENTO DE DATOS EN FRONTEND (LOGICA PURA)
// ==========================================

// ✅ Generador de alertas analizando las métricas predictivas reales devueltas por el Backend
export function generateSmartAlerts(predictions: PredictionResponse): SmartAlert[] {
  const alerts: SmartAlert[] = [];
  const now = new Date();

  predictions.predictions.forEach((prediction, index) => {
    // Alerta de alta demanda
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

    // Alerta de baja ocupación
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

// ✅ Función auxiliar para formatear la fecha de las alertas
function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return `${months[parseInt(month) - 1]} ${year}`;
}

// ✅ Fusionar datos históricos reales con proyecciones futuras de la IA
export function combineRealAndPredictedData(
  realData: OccupancyDataPoint[],
  predictions: BookingPrediction[]
): OccupancyDataPoint[] {
  // Clonamos profundamente o mapeamos para evitar mutar el estado original directamente
  const combined: OccupancyDataPoint[] = realData.map(d => ({ ...d }));
  
  predictions.forEach(pred => {
    // Buscamos si el mes/fecha de la predicción ya existe en los datos reales
    const existingIndex = combined.findIndex(d => d.date === pred.month);
    
    if (existingIndex >= 0) {
      // Si ya existe el día/mes, le inyectamos la predicción correspondiente
      combined[existingIndex].occupancy_predicted = pred.predicted_occupancy;
    } else {
      // Si no existe (es una fecha futura), creamos el nodo de predicción pura
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

  // Ordenamos cronológicamente por fecha de forma ascendente
  return combined.sort((a, b) => a.date.localeCompare(b.date));
}