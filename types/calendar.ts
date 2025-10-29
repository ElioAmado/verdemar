/**
 * Tipos e interfaces para el calendario de administración
 */

export type CalendarView = 'month' | 'week';
export type ViewMode = 'calendar' | 'list';
export type DayStatus = 'available' | 'booked' | 'checkout' | 'checkin';

export interface BookingInfo {
  id: number;
  clientName: string;
  status: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface DayInfo {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isBooked: boolean;
  bookings: BookingInfo[];
  status: DayStatus;
}

export interface CalendarStats {
  totalDays: number;
  bookedDays: number;
  availableDays: number;
  occupancyRate: number;
}
