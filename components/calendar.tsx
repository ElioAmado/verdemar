'use client';
import type React from 'react';
import { useState } from 'react';
import type { CalendarProps } from './date-range-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

const Calendar: React.FC<CalendarProps> = ({
  initialStartDate = null,
  initialEndDate = null,
  onRangeChange,
  numberOfMonths = 1,
}) => {
  const { t } = useLanguage();
  const daysOfWeek: string[] = t('calendar.daysOfWeek');

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleDateClick = (day: number, monthStep: number) => {
    const yearStep = monthStep === -11 ? 1 : 0;
    const realYear = currentYear + yearStep;
    const realMonth = currentMonth + monthStep;
    const selectedDate = new Date(realYear, realMonth, day);

    if (!startDate || (startDate && endDate)) {
      setStartDate(selectedDate);
      setEndDate(null);
      if (onRangeChange) onRangeChange({ from: selectedDate, to: undefined });
    } else if (selectedDate <= startDate) {
      setStartDate(selectedDate);
      setEndDate(null);
      if (onRangeChange) onRangeChange({ from: selectedDate, to: undefined });
    } else {
      setEndDate(selectedDate);
      if (onRangeChange) onRangeChange({ from: startDate, to: selectedDate });
    }
  };

  const isInRange = (day: number, monthStep: number): boolean => {
    const yearStep = monthStep === -11 ? 1 : 0;
    if (!startDate || !endDate) return false;
    const current = new Date(
      currentYear + yearStep,
      currentMonth + monthStep,
      day
    ).getTime();
    return current > startDate.getTime() && current < endDate.getTime();
  };

  const isSameDay = (
    date: Date | null,
    day: number,
    monthStep: number
  ): boolean => {
    const yearStep = monthStep === -11 ? 1 : 0;
    return (
      !!date &&
      date.getDate() === day &&
      date.getMonth() === currentMonth + monthStep &&
      date.getFullYear() === currentYear + yearStep
    );
  };

  const isToday = (day: number, monthStep: number): boolean => {
    const yearStep = monthStep === -11 ? 1 : 0;
    const currentDate = new Date();
    return (
      currentDate.getDate() === day &&
      currentDate.getMonth() === currentMonth + monthStep &&
      currentDate.getFullYear() === currentYear + yearStep
    );
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = t('calendar.monthNames');

  const renderMonth = (monthStep: number, changeMonth = 0) => {
    let yearStep = 0;
    if (currentMonth + monthStep > 11) {
      yearStep = 1;
      monthStep = -11;
    }
    const realYear = currentYear + yearStep;
    const realMonth = currentMonth + monthStep;
    const firstDayOfMonth = new Date(realYear, realMonth, 0).getDay();
    const daysInMonth = getDaysInMonth(realMonth, realYear);

    const showPrevMonth = () => {
      if (changeMonth === 1 || changeMonth === 0) {
        return (
          <button
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        );
      } else {
        return <div></div>;
      }
    };

    const showNextMonth = () => {
      if (changeMonth === 2 || changeMonth === 0) {
        return (
          <button
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        );
      } else {
        return <div></div>;
      }
    };

    return (
      <div className="calendar-month">
        <div className="flex items-center justify-between mb-4">
          {showPrevMonth()}
          <h2 className="font-medium text-base">
            {monthNames[realMonth]} {realYear}
          </h2>
          {showNextMonth()}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-xs font-medium text-gray-500 h-8 flex items-center justify-center"
            >
              {day.slice(0, 2)}
            </div>
          ))}

          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isStart = isSameDay(startDate, day, monthStep);
            const isEnd = isSameDay(endDate, day, monthStep);
            const inRange = isInRange(day, monthStep);
            const dayIsToday = isToday(day, monthStep);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day, monthStep)}
                className={cn(
                  'h-9 w-9 rounded-full flex items-center justify-center text-sm transition-all',
                  'hover:bg-gray-100',
                  dayIsToday &&
                    !isStart &&
                    !isEnd &&
                    !inRange &&
                    'border border-emerald-500 text-emerald-600',
                  isStart && 'bg-emerald-600 text-white hover:bg-emerald-700',
                  isEnd && 'bg-emerald-600 text-white hover:bg-emerald-700',
                  inRange &&
                    'bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
                  isStart && inRange && 'rounded-l-full rounded-r-none',
                  isEnd && inRange && 'rounded-r-full rounded-l-none'
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container p-4 bg-white rounded-lg shadow-sm border">
      <div
        className={cn(
          'grid gap-6',
          numberOfMonths === 1
            ? 'grid-cols-1'
            : numberOfMonths === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {numberOfMonths === 1
          ? renderMonth(0, 0)
          : Array.from({ length: numberOfMonths }).map((_, i) => (
              <div key={i}>{renderMonth(i, i + 1)}</div>
            ))}
      </div>
    </div>
  );
};

export default Calendar;
