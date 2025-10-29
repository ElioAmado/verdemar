/**
 * Funciones de utilidad para el calendario
 */

import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  parseISO,
  startOfDay,
} from 'date-fns';
import type { DefaultDateRange } from '@/types/defaultDateRange';
import type {
  DayInfo,
  BookingInfo,
  CalendarView,
  DayStatus,
} from '@/types/calendar';
import { STATUS_CONFIG } from '@/constants/calendar';

/**
 * Genera las clases CSS para una celda del calendario
 */
export function getDayClassName(dayInfo: DayInfo): string {
  const baseClasses =
    'relative p-2 min-h-[80px] border border-border/50 transition-colors hover:bg-muted/50';

  const statusClasses = STATUS_CONFIG[dayInfo.status].bgClass;
  const monthClasses = !dayInfo.isCurrentMonth ? 'opacity-40' : '';
  const todayClasses = dayInfo.isToday ? 'ring-2 ring-primary' : '';

  return `${baseClasses} ${statusClasses} ${monthClasses} ${todayClasses}`;
}

/**
 * Calcula los días visibles en el calendario según la vista
 */
export function getCalendarDays(
  currentDate: Date,
  calendarView: CalendarView
): Date[] {
  const start =
    calendarView === 'month'
      ? startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
      : startOfWeek(currentDate, { weekStartsOn: 1 });

  const end =
    calendarView === 'month'
      ? endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
      : endOfWeek(currentDate, { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end });
}

/**
 * Procesa la información de un día específico
 */
export function processDayInfo(
  date: Date,
  currentDate: Date,
  calendarView: CalendarView,
  dateRanges: DefaultDateRange[]
): DayInfo {
  const isCurrentMonth =
    calendarView === 'month' ? isSameMonth(date, currentDate) : true;
  const isToday = isSameDay(date, new Date());

  const dayBookings = dateRanges.filter((range) => {
    const start = range.from ? parseISO(range.from) : null;
    const end = range.to ? parseISO(range.to) : start;
    if (!start || !end) return false;
    return isWithinInterval(startOfDay(date), {
      start: startOfDay(start),
      end: startOfDay(end),
    });
  });

  const isBooked = dayBookings.length > 0;

  let status: DayStatus = 'available';
  if (isBooked) {
    const hasCheckIn = dayBookings.some(
      (range) => range.from && isSameDay(parseISO(range.from), date)
    );
    const hasCheckOut = dayBookings.some(
      (range) => range.to && isSameDay(parseISO(range.to), date)
    );

    if (hasCheckIn && hasCheckOut) {
      status = 'booked';
    } else if (hasCheckIn) {
      status = 'checkin';
    } else if (hasCheckOut) {
      status = 'checkout';
    } else {
      status = 'booked';
    }
  }

  const bookings: BookingInfo[] = dayBookings.map((range, index) => ({
    id: index + 1,
    clientName: `Cliente ${index + 1}`,
    status: 'CONFIRMED',
    checkIn: range.from || '',
    checkOut: range.to || '',
    guests: 2,
  }));

  return {
    date,
    isCurrentMonth,
    isToday,
    isBooked,
    bookings,
    status,
  };
}

/**
 * Calcula las estadísticas del mes
 */
export function calculateMonthStats(
  currentDate: Date,
  dateRanges: DefaultDateRange[]
) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const bookedDays = monthDays.filter((day) =>
    dateRanges.some((range) => {
      const start = range.from ? parseISO(range.from) : null;
      const end = range.to ? parseISO(range.to) : start;
      if (!start || !end) return false;
      return isWithinInterval(startOfDay(day), {
        start: startOfDay(start),
        end: startOfDay(end),
      });
    })
  ).length;

  const occupancyRate =
    monthDays.length > 0 ? (bookedDays / monthDays.length) * 100 : 0;

  return {
    totalDays: monthDays.length,
    bookedDays,
    availableDays: monthDays.length - bookedDays,
    occupancyRate,
  };
}
