'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, SlidersHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DashboardFilters, ApartmentType } from '@/types/booking';
import { useState } from 'react';

interface DashboardFiltersProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
}

export function DashboardFiltersComponent({ filters, onFiltersChange }: DashboardFiltersProps) {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(filters.date_range.start),
    to: new Date(filters.date_range.end),
  });

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

  const availableYears = [2025, 2026, 2027, 2028, 2029];

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="flex items-center gap-2 text-muted-foreground">
        <SlidersHorizontal className="h-4 w-4" />
        <span className="text-sm font-medium">Filtros:</span>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {/* Year Selector */}
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

        {/* Apartment Type Selector */}
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

        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal bg-secondary border-border",
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
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={(range) => {
                setDateRange({ from: range?.from, to: range?.to });
                if (range?.from && range?.to) {
                  onFiltersChange({
                    ...filters,
                    date_range: {
                      start: format(range.from, 'yyyy-MM-dd'),
                      end: format(range.to, 'yyyy-MM-dd'),
                    },
                  });
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
