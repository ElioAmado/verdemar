'use client';
import type React from 'react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

// Definición local de la interfaz si no deseas importarla externamente
export interface CalendarProps {
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  onRangeChange?: (range: { from: Date | null; to: Date | undefined }) => void;
  numberOfMonths?: number;
}

const Calendar: React.FC<CalendarProps> = ({
  initialStartDate = null,
  initialEndDate = null,
  onRangeChange,
  numberOfMonths = 1,
}) => {
  const { t } = useLanguage();
  const daysOfWeek: string[] = t('calendar.daysOfWeek');
  const monthNames: string[] = t('calendar.monthNames');

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);

  // Sincronizar estado si las props cambian externamente (ej. limpiar filtros)
  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleDateClick = (day: number, month: number, year: number) => {
    const selectedDate = new Date(year, month, day);

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

  const isInRange = (day: number, month: number, year: number): boolean => {
    if (!startDate || !endDate) return false;
    const current = new Date(year, month, day).getTime();
    return current > startDate.getTime() && current < endDate.getTime();
  };

  const isSameDay = (date: Date | null, day: number, month: number, year: number): boolean => {
    return (
      !!date &&
      date.getDate() === day &&
      date.getMonth() === month &&
      date.getFullYear() === year
    );
  };

  const isToday = (day: number, month: number, year: number): boolean => {
    const currentDate = new Date();
    return (
      currentDate.getDate() === day &&
      currentDate.getMonth() === month &&
      currentDate.getFullYear() === year
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

  const renderMonth = (monthIndex: number, position: 'single' | 'first' | 'last' | 'middle') => {
    // Calcular el mes y año real basándose en el desplazamiento indexado
    let realMonth = currentMonth + monthIndex;
    let realYear = currentYear;

    if (realMonth > 11) {
      realYear += Math.floor(realMonth / 12);
      realMonth = realMonth % 12;
    }

    // Corregido: .getDay() del día 1 para saber dónde arranca la cuadrícula (0 = Domingo)
    const firstDayOfMonth = new Date(realYear, realMonth, 1).getDay();
    const daysInMonth = getDaysInMonth(realMonth, realYear);

    return (
      <div className="calendar-month w-[280px]">
        <div className="flex items-center justify-between mb-4 h-8">
          {/* Mostrar flecha izquierda solo en el primer mes visible */}
          {(position === 'single' || position === 'first') ? (
            <button
              onClick={prevMonth}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : <div className="w-7" />}

          <h2 className="font-medium text-sm capitalize">
            {monthNames[realMonth]} {realYear}
          </h2>

          {/* Mostrar flecha derecha solo en el último mes visible */}
          {(position === 'single' || position === 'last') ? (
            <button
              onClick={nextMonth}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : <div className="w-7" />}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-xs font-medium text-gray-400 h-8 flex items-center justify-center">
              {day.slice(0, 2)}
            </div>
          ))}

          {/* Espacios vacíos del inicio de mes */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9 w-9" />
          ))}

          {/* Días del mes */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isStart = isSameDay(startDate, day, realMonth, realYear);
            const isEnd = isSameDay(endDate, day, realMonth, realYear);
            const inRange = isInRange(day, realMonth, realYear);
            const dayIsToday = isToday(day, realMonth, realYear);

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDateClick(day, realMonth, realYear)}
                className={cn(
                  'h-9 w-9 text-sm transition-all flex items-center justify-center',
                  'hover:bg-gray-100 rounded-full',
                  dayIsToday && !isStart && !isEnd && !inRange && 'border border-emerald-500 text-emerald-600',
                  inRange && 'bg-emerald-50 text-emerald-800 rounded-none hover:bg-emerald-100',
                  isStart && 'bg-emerald-600 text-white hover:bg-emerald-700 rounded-full',
                  isEnd && 'bg-emerald-600 text-white hover:bg-emerald-700 rounded-full',
                  // Estilos para conectar visualmente el rango de selección
                  isStart && endDate && 'rounded-r-none',
                  isEnd && startDate && 'rounded-l-none'
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
    <div className="calendar-container p-4 bg-white rounded-lg shadow-md border border-gray-100">
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
        {numberOfMonths === 1 ? (
          renderMonth(0, 'single')
        ) : (
          Array.from({ length: numberOfMonths }).map((_, i) => {
            const position = i === 0 ? 'first' : i === numberOfMonths - 1 ? 'last' : 'middle';
            return <div key={i}>{renderMonth(i, position)}</div>;
          })
        )}
      </div>
    </div>
  );
};

export default Calendar;