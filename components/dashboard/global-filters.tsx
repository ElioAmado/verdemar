"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { DashboardFilters, ApartmentType } from "@/types/booking";
import { cn } from "@/lib/utils";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format, subDays, subMonths, startOfMonth, endOfMonth, addDays, addMonths, startOfYear } from "date-fns";
import { es } from "date-fns/locale";

interface GlobalFiltersProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  loading?: boolean;
}

// Se agregaron los presets que tenías en el switch pero faltaban en el menú
const datePresets = [
  { label: "Últimos 7 días", value: "7d" },
  { label: "Últimos 30 días", value: "30d" },
  { label: "Este mes", value: "this_month" },
  { label: "Mes anterior", value: "last_month" },
  { label: "Próximos 30 días", value: "next_30d" },
  { label: "Próximos 90 días", value: "next_90d" },
  { label: "Año en curso (YTD)", value: "year_to_date" },
  { label: "Vista Amplia (3m atrás/adelante)", value: "3m" },
  { label: "Personalizado", value: "custom" },
];

const apartmentTypeLabels: Record<ApartmentType, string> = {
  [ApartmentType.STUDIO]: "Estudio",
  [ApartmentType.ONE_BEDROOM]: "1 Habitación",
  [ApartmentType.TWO_BEDROOM]: "2 Habitaciones",
  [ApartmentType.PENTHOUSE]: "Penthouse",
  [ApartmentType.SUITE]: "Suite",
};

export function GlobalFilters({
  filters,
  onFiltersChange,
  loading = false,
}: GlobalFiltersProps) {
  const [datePreset, setDatePreset] = useState<string>("30d");
  const [showCustomDates, setShowCustomDates] = useState(false);

  const handleDatePresetChange = (preset: string) => {
    setDatePreset(preset);
    const today = new Date();
    
    // Usamos variables locales mutables para el switch
    let start: Date = today;
    let end: Date = today;

    switch (preset) {
      // --- Pasado ---
      case "7d":
        start = subDays(today, 7);
        end = today;
        break;
      case "30d":
        start = subDays(today, 30);
        end = today;
        break;
      case "this_month":
        start = startOfMonth(today);
        end = endOfMonth(today);
        break;
      case "last_month": { // <-- Llaves agregadas para aislar el bloque del case
        const lastMonth = subMonths(today, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      }

      // --- Futuro (Predicciones) ---
      case "next_30d":
        start = today;
        end = addDays(today, 30);
        break;
      case "next_90d":
        start = today;
        end = addMonths(today, 3);
        break;
      case "year_to_date":
        start = startOfYear(today);
        end = today; // Corregido: YTD va desde inicio de año hasta HOY
        break;
      
      // --- Mixtos (Histórico + Predicción) ---
      case "3m":
        start = subMonths(today, 3);
        end = addMonths(today, 3);
        break;
        
      case "custom":
        setShowCustomDates(true);
        return; // Detiene la ejecución aquí para que el usuario elija a mano
        
      default:
        start = subDays(today, 30);
        end = today;
    }

    // Si no es custom, guardamos los rangos automáticos
    setShowCustomDates(false);
    onFiltersChange({
      ...filters,
      date_range: {
        start: format(start, "yyyy-MM-dd"),
        end: format(end, "yyyy-MM-dd"),
      },
    });
  };

  const handleApartmentTypeToggle = (type: ApartmentType) => {
    const currentTypes = filters.apartment_types;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];

    onFiltersChange({
      ...filters,
      apartment_types: newTypes,
    });
  };

  const clearFilters = () => {
    setDatePreset("30d");
    setShowCustomDates(false);
    onFiltersChange({
      date_range: {
        start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
        end: format(new Date(), "yyyy-MM-dd"),
      },
      apartment_types: [],
      booking_status: [],
      include_predictions: true,
      comparison_period: "PREVIOUS_PERIOD",
    });
  };

  const hasActiveFilters =
    filters.apartment_types.length > 0 || filters.booking_status.length > 0;

  // Control de renderizado seguro para evitar errores de "Invalid Date"
  const renderPeriodText = () => {
    if (!filters?.date_range?.start || !filters?.date_range?.end) return "Sin rango seleccionado";
    try {
      const startText = format(new Date(filters.date_range.start), "dd MMM yyyy", { locale: es });
      const endText = format(new Date(filters.date_range.end), "dd MMM yyyy", { locale: es });
      return `${startText} — ${endText}`;
    } catch (e) {
      return "Rango de fechas inválido";
    }
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Filter className="h-4 w-4 text-primary" />
            Filtros
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="mr-1 h-3 w-3" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Rango de fechas
          </label>
          <Select value={datePreset} onValueChange={handleDatePresetChange}>
            <SelectTrigger className="h-9 bg-muted">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              {datePresets.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showCustomDates && (
            <div className="flex items-center gap-2 pt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 flex-1 justify-start bg-muted text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.date_range.start
                      ? format(new Date(filters.date_range.start), "dd MMM yyyy", { locale: es })
                      : "Inicio"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.date_range.start ? new Date(filters.date_range.start) : undefined}
                    onSelect={(date) =>
                      date &&
                      onFiltersChange({
                        ...filters,
                        date_range: {
                          ...filters.date_range,
                          start: format(date, "yyyy-MM-dd"),
                        },
                      })
                    }
                  />
                </PopoverContent>
              </Popover>
              <span className="text-muted-foreground">—</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 flex-1 justify-start bg-muted text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.date_range.end
                      ? format(new Date(filters.date_range.end), "dd MMM yyyy", { locale: es })
                      : "Fin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.date_range.end ? new Date(filters.date_range.end) : undefined}
                    onSelect={(date) =>
                      date &&
                      onFiltersChange({
                        ...filters,
                        date_range: {
                          ...filters.date_range,
                          end: format(date, "yyyy-MM-dd"),
                        },
                      })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <p className="text-xs text-muted-foreground italic">
            {renderPeriodText()}
          </p>
        </div>

        {/* Apartment Type Filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Tipo de apartamento
          </label>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(apartmentTypeLabels).map(([type, label]) => (
              <Badge
                key={type}
                variant={filters.apartment_types.includes(type as ApartmentType) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all hover:bg-primary/20",
                  filters.apartment_types.includes(type as ApartmentType)
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent hover:border-primary/50"
                )}
                onClick={() => handleApartmentTypeToggle(type as ApartmentType)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Include Predictions Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground">
            Incluir predicciones IA
          </label>
          <Button
            variant={filters.include_predictions ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() =>
              onFiltersChange({
                ...filters,
                include_predictions: !filters.include_predictions,
              })
            }
          >
            {filters.include_predictions ? "Activo" : "Inactivo"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}