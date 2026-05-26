'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, SlidersHorizontal } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DashboardFilters, ApartmentType } from '@/types/booking';
import { useState, useEffect } from 'react';
import Calendar from '@/components/calendar'; // Asegúrate de que apunte a tu archivo corregido de arriba

interface DashboardFiltersProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
}

export function DashboardFiltersComponent({ filters, onFiltersChange }: DashboardFiltersProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: filters.date_range.start ? parseISO(filters.date_range.start) : null,
    to: filters.date_range.end ? parseISO(filters.date_range.end) : null,
  });

  useEffect(() => {
    setDateRange({
      from: filters.date_range.start ? parseISO(filters.date_range.start) : null,
      to: filters.date_range.end ? parseISO(filters.date_range.end) : null,
    });
  }, [filters.date_range.start, filters.date_range.end]);

  const handleYearChange = (year: string) => {
    onFiltersChange({
      ...filters,
      year: parseInt(year),
    });
  };

  const handleApartmentTypeChange = (type: string) => {
    onFiltersChange({
      ...filters,
      apartment_type: type as ApartmentType | 'ALL',
    });
  };

  const handleCalendarRangeChange = (range: { from: Date | null; to: Date | undefined }) => {
    const fromDate = range.from;
    const toDate = range.to || null;

    setDateRange({ from: fromDate, to: toDate });

    // Se actualiza el estado global de forma reactiva en cada paso de selección
    onFiltersChange({
      ...filters,
      date_range: {
        start: fromDate ? format(fromDate, 'yyyy-MM-dd') : '',
        end: toDate ? format(toDate, 'yyyy-MM-dd') : '',
      },
    });
  };

  const availableYears = [2025, 2026, 2027, 2028, 2029];

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="flex items-center gap-2 text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        <span className="text-sm font-medium">Filtros:</span>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {/* Selector de Año */}
        <Select value={filters.year.toString()} onValueChange={handleYearChange}>
          <SelectTrigger className="w-[120px] bg-secondary border-border">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Selector de Tipo de Apartamento */}
        <Select value={filters.apartment_type} onValueChange={handleApartmentTypeChange}>
          <SelectTrigger className="w-[160px] bg-secondary border-border">
            <SelectValue placeholder="Tipo apartamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los tipos</SelectItem>
            <SelectItem value="INDIVIDUAL">Individual</SelectItem>
            <SelectItem value="DOBLE">Doble</SelectItem>
            <SelectItem value="SUITE">Suite</SelectItem>
          </SelectContent>
        </Select>

        {/* Selector de Rango de Fechas */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal bg-secondary border-border min-w-[240px]",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd MMM", { locale: es })} -{" "}
                    {format(dateRange.to, "dd MMM yyyy", { locale: es })}
                  </>
                ) : (
                  format(dateRange.from, "dd MMM yyyy", { locale: es })
                )
              ) : (
                <span>Seleccionar fechas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-none" align="start">
            <Calendar
              initialStartDate={dateRange.from}
              initialEndDate={dateRange.to}
              onRangeChange={handleCalendarRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}