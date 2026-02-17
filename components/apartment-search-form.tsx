'use client';

import React, { useEffect } from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApartmentType, apartmentTypeLabels } from '@/types/apartmentType';
import { CalendarIcon, Users, Search } from 'lucide-react';

interface SearchFormData {
  startDate: string;
  endDate: string;
  guests: number;
  apartmentType: ApartmentType | null;
}

interface ApartmentSearchFormProps {
  onSearch: (data: SearchFormData) => void;
  isLoading?: boolean;
  initialStartDate?: string;
  initialEndDate?: string;
  initialGuests?: number;
  autoSearch?: boolean;
}

export function ApartmentSearchForm({
  onSearch,
  isLoading,
  initialStartDate = '',
  initialEndDate = '',
  initialGuests = 1,
  autoSearch = false,
}: ApartmentSearchFormProps) {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [guests, setGuests] = useState(initialGuests);
  const initialType = initialGuests > 3 ? ApartmentType.TWO_BEDROOM : null;
  const [apartmentType, setApartmentType] = useState<ApartmentType | null>(
    initialType
  );
  const [hasAutoSearched, setHasAutoSearched] = useState(false);

  // Auto-search when component mounts with initial values
  useEffect(() => {
    if (autoSearch && !hasAutoSearched && initialStartDate && initialEndDate) {
      setHasAutoSearched(true);
      onSearch({
        startDate: initialStartDate,
        endDate: initialEndDate,
        guests: initialGuests,
        apartmentType: initialGuests > 3 ? ApartmentType.TWO_BEDROOM : null,
      });
    }
  }, [autoSearch, hasAutoSearched, initialStartDate, initialEndDate, initialGuests, onSearch]);

  // Si hay más de 3 personas, solo se puede seleccionar TWO_BEDROOM
  const availableTypes =
    guests > 3
      ? [ApartmentType.TWO_BEDROOM]
      : [ApartmentType.ONE_BEDROOM, ApartmentType.TWO_BEDROOM];

  // Si el tipo seleccionado ya no está disponible, resetearlo
  const handleGuestsChange = (newGuests: number) => {
    setGuests(newGuests);
    if (
      newGuests > 3 &&
      apartmentType === ApartmentType.ONE_BEDROOM
    ) {
      setApartmentType(ApartmentType.TWO_BEDROOM);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      startDate,
      endDate,
      guests,
      apartmentType,
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Search className="h-5 w-5" />
          Buscar Apartamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha de entrada */}
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Fecha de entrada
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={today}
                required
              />
            </div>

            {/* Fecha de salida */}
            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Fecha de salida
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || today}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Número de huéspedes */}
            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Número de personas
              </Label>
              <Select
                value={guests.toString()}
                onValueChange={(value) => handleGuestsChange(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'persona' : 'personas'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de apartamento */}
            <div className="space-y-2">
              <Label htmlFor="apartmentType" className="flex items-center gap-2">
                Tipo de apartamento
                {guests > 3 && (
                  <span className="text-xs text-muted-foreground">
                    (Solo 2 dormitorios disponible)
                  </span>
                )}
              </Label>
              <Select
                value={apartmentType || ''}
                onValueChange={(value) =>
                  setApartmentType(value as ApartmentType)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  {availableTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {apartmentTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Buscando...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Buscar disponibilidad
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
