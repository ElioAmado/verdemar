import {
  Card,
  CardContent,
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

  const today = new Date();
  const oneWeekLater = new Date();
  oneWeekLater.setDate(today.getDate() + 7);
  const defaultDateRange: DateRange = {
    from: today,
    to: oneWeekLater,
  };
  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);
  const [roomType, setRoomType] = useState<string>('');
  const [guests, setGuests] = useState<{ adults: number; children: number }>({
    adults: 2,
    children: 0,
  });
  const router = useRouter();

const handleSearch = () => {
  const params = new URLSearchParams();

  if (dateRange.from instanceof Date && !isNaN(dateRange.from.getTime())) {
    params.append('arrival', dateRange.from.toISOString().split('T')[0]);
  } else {
    console.warn('Fecha "from" inválida o no definida');
    return;
  }

  if (dateRange.to instanceof Date && !isNaN(dateRange.to.getTime())) {
    params.append('departure', dateRange.to.toISOString().split('T')[0]);
  } else {
    console.warn('Fecha "to" inválida o no definida');
    alert('Por favor, selecciona una fecha de salida válida.');
    return;
  }

  if (typeof roomType === 'string' && roomType.trim() !== '') {
    params.append('type', roomType);
  }

  if (guests.adults >= 1) {
    params.append('adults', guests.adults.toString());
  }

  if (guests.children >= 0) {
    params.append('children', guests.children.toString());
  }

  // babies siempre en 0 (por si no lo usas todavía)
  params.append('babies', '0');

  // parámetros fijos
  params.append('orderby', 'price');
  params.append('view', 'grid');

  const url = `https://bookings.apartamentosverdemar-formentera.com/es/step-accommodation?id=OkhW482ggf4UV:DMSDaD4w&${params.toString()}`;

  router.push(url);
};

  return (
    <>

      <input id="idHotel" type="hidden" value="OkhW482ggf4UV:DMSDaD4w" />
      <Card className="border shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {t('home.search.checkIn')}
              </label>
              <DatePickerWithRange
                onRangeChange={(range: DateRange | undefined) => setDateRange(range ?? defaultDateRange)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {t('home.search.guests')}
              </label>
              <GuestCounter value={guests} onChange={setGuests} />
            </div>

            <div className="flex items-end">
              <Button className="w-full" onClick={handleSearch}>
                {t('home.search.search')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
    </>
  );
}
