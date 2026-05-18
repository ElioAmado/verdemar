import axios from 'axios';
import { DateRange } from 'react-day-picker';
import { Booking } from '@/types/booking';
import { SpringPage } from '@/types/pages';

function getBookingBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    throw new Error('❌ NEXT_PUBLIC_API_BASE_URL is not defined');
  }
  return `${base}/booking`;
}

// ✅ Obtener todas las reservas
export const getAllBookings = async (page = 0, size = 10): Promise<SpringPage<Booking>> => {
  const res = await axios.get<SpringPage<Booking>>(getBookingBaseUrl(), {
    params: {
      page,
      size
    }
  });
  return res.data;
};

// ✅ Obtener una reserva por ID
export const getBookingById = async (id: number): Promise<Booking> => {
  const res = await axios.get<Booking>(`${getBookingBaseUrl()}/${id}`);
  return res.data;
};

// ✅ Crear una nueva reserva
export const createBooking = async (booking: Booking): Promise<Booking> => {
  const res = await axios.post<Booking>(getBookingBaseUrl(), booking);
  return res.data;
};

// ✅ Actualizar una reserva
export const updateBooking = async (
  id: number,
  booking: Booking
): Promise<Booking> => {
  const res = await axios.put<Booking>(`${getBookingBaseUrl()}/${id}`, booking);
  return res.data;
};

// ✅ Eliminar una reserva
export const deleteBooking = async (id: number): Promise<void> => {
  await axios.delete(`${getBookingBaseUrl()}/${id}`);
};

// ✅ Obtener el precio total entre dos fechas para un apartamento
export const getTotalPrice = async (
  apartmentId: number,
  startDate: string,
  endDate: string
): Promise<number> => {
  const res = await axios.get<number>(`${getBookingBaseUrl()}/check`, {
    params: { apartmentId, startDate, endDate },
  });
  return res.data;
};

export const getDatesByApartmentId = async (
  apartmentId: number
): Promise<DateRange[]> => {
  const res = await axios.get<DateRange[]>(
    `${getBookingBaseUrl()}/getDates/${apartmentId}`
  );
  return res.data;
};
