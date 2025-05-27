import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';
import { DatePickerWithRange } from '@/components/date-range-picker';
import { RoomTypeSelector } from '@/components/room-type-selector';
import { GuestCounter } from '@/components/guest-counter';
import { useLanguage } from '@/contexts/language-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

export default function RoomsSearch() {
    const { t } = useLanguage();
    const defaultDateRange: DateRange = {
        from: new Date(),
        to: undefined,
    };
    const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);
    const [roomType, setRoomType] = useState<string>('');
    const [guests, setGuests] = useState<number>(1);
    const router = useRouter();

    const handleSearch = () => {
        const params = new URLSearchParams();

        // Validamos y agregamos start
        if (dateRange.from instanceof Date && !isNaN(dateRange.from.getTime())) {
            params.append('start', dateRange.from.toISOString().split('T')[0]);
        } else {
            // Puedes poner un valor por defecto o manejar error
            console.warn('Fecha "from" inválida o no definida');
            // Por ejemplo: return; para no hacer la búsqueda sin fechas
        }

        // Validamos y agregamos end
        if (dateRange.to instanceof Date && !isNaN(dateRange.to.getTime())) {
            params.append('end', dateRange.to.toISOString().split('T')[0]);
        } else {
            console.warn('Fecha "to" inválida o no definida');
            alert('Por favor, selecciona una fecha de salida válida.');
            return; // Evitamos hacer la búsqueda sin fechas
        }

        // Validamos y agregamos tipo de habitación, con valor por defecto si quieres
        if (typeof roomType === 'string' && roomType.trim() !== '') {
            params.append('type', roomType);
        } else {
            console.warn('Tipo de habitación inválido o no definido');
        }

        // Validamos y agregamos cantidad de invitados, al menos 1
        const guestsNumber = Number(guests);
        if (!isNaN(guestsNumber) && guestsNumber > 0) {
            params.append('guests', guestsNumber.toString());
        } else {
            console.warn('Número de invitados inválido o no definido');
        }

        // Si quieres evitar hacer la búsqueda sin algunos parámetros claves,
        // puedes validar aquí antes de hacer router.push

        router.push(`/availability?${params.toString()}`);
    };
    return (
        <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-5xl">
            <Card className="border shadow-lg">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {t('home.search.checkIn')}
                            </label>
                            <DatePickerWithRange onRangeChange={setDateRange} />
                            {/* <Calendar /> */}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {t('home.search.roomType')}
                            </label>
                            <RoomTypeSelector onChange={setRoomType} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {t('home.search.guests')}
                            </label>
                            <GuestCounter
                                onChange={(guests) => {
                                    setGuests(guests); // guests = { adults: number, children: number }
                                }}
                            />

                        </div>
                        <div className="flex items-end">
                            <Button className="w-full" onClick={handleSearch} id="search-button">
                                {t('home.search.search')}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};