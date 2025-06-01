'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWithinInterval,
  format,
  addMonths,
  subMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { getAllIds } from '@/api/apartment';
import { getDatesByApartmentId, DateRange } from '@/api/booking';

export default function AdminCalendarPage() {
  const router = useRouter();
  const [apartmentIds, setApartmentIds] = useState<number[]>([]);
  const [selectedApartmentId, setSelectedApartmentId] = useState<number | null>(null);
  const [dateRanges, setDateRanges] = useState<DateRange[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    getAllIds().then(setApartmentIds).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedApartmentId !== null) {
      getDatesByApartmentId(selectedApartmentId)
        .then(setDateRanges)
        .catch(console.error);
    } else {
      setDateRanges([]);
    }
  }, [selectedApartmentId]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const isDayBooked = (date: Date): boolean => {
    return dateRanges.some((range) => {
      const start = range.from ? new Date(range.from) : null;
      const end = range.to ? new Date(range.to) : start;
      if (!start || !end) return false;
      return isWithinInterval(date, { start, end });
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Calendario de reservas</h1>
        <button
          onClick={() => router.push('/admin/bookings')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ver reservas
        </button>
      </div>

      {/* Selector de apartamento */}
      <div className="mb-6">
        <label className="mr-2 font-semibold">Apartamento:</label>
        <select
          value={selectedApartmentId ?? ''}
          onChange={(e) =>
            setSelectedApartmentId(e.target.value ? Number(e.target.value) : null)
          }
          className="border rounded p-2"
        >
          <option value="">Selecciona un apartamento</option>
          {apartmentIds.map((id) => (
            <option key={id} value={id}>
              Apartamento #{id}
            </option>
          ))}
        </select>
      </div>

      {selectedApartmentId ? (
        <>
          {/* Navegación de mes */}
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="text-xl">
              ←
            </button>
            <h2 className="text-2xl font-bold">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h2>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="text-xl">
              →
            </button>
          </div>

          {/* Cabecera del calendario */}
          <div className="grid grid-cols-7 text-center font-semibold border-b pb-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Días del mes */}
          <div className="grid grid-cols-7 text-center gap-2 pt-2">
            {Array(
              startOfMonth(currentDate).getDay() === 0
                ? 6
                : startOfMonth(currentDate).getDay() - 1
            )
              .fill(null)
              .map((_, i) => <div key={`empty-${i}`} />)}

            {daysInMonth.map((day) => {
              const booked = isDayBooked(day);
              return (
                <div
                  key={day.toISOString()}
                  className={`p-2 rounded text-sm ${
                    booked ? 'bg-red-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  {format(day, 'd')}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-gray-500 mt-4">Selecciona un apartamento para ver sus reservas.</p>
      )}
    </div>
  );
}
