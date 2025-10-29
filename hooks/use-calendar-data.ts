'use client';

/**
 * Hook personalizado para manejar los datos procesados del calendario
 */

import { useMemo } from 'react';
import type { DefaultDateRange } from '@/types/defaultDateRange';
import type { CalendarView } from '@/types/calendar';
import {
  getCalendarDays,
  processDayInfo,
  calculateMonthStats,
} from '@/utils/calendar-helpers';

export function useCalendarData(
  currentDate: Date,
  calendarView: CalendarView,
  dateRanges: DefaultDateRange[]
) {
  const calendarDays = useMemo(
    () => getCalendarDays(currentDate, calendarView),
    [currentDate, calendarView]
  );

  const daysInfo = useMemo(
    () =>
      calendarDays.map((date) =>
        processDayInfo(date, currentDate, calendarView, dateRanges)
      ),
    [calendarDays, currentDate, calendarView, dateRanges]
  );

  const stats = useMemo(
    () => calculateMonthStats(currentDate, dateRanges),
    [currentDate, dateRanges]
  );

  return { daysInfo, stats };
}
