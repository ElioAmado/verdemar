'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAvailableApartments, Apartment } from '@/api/apartment';
import { getTotalPrice, createBooking, Booking } from '@/api/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AvailabilityPage() {
  const searchParams = useSearchParams();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [prices, setPrices] = useState<Record<number, number>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const startDate = searchParams.get('start');
      const endDate = searchParams.get('end');
      const type = searchParams.get('type');

      if (!startDate || !endDate) return;

      const data = await getAvailableApartments({ type, startDate, endDate });
      setApartments(data);

      const newPrices: Record<number, number> = {};
      for (const apt of data) {
        let price = 0;
        try {
          price = await getTotalPrice(apt.id, startDate, endDate);
        } catch (error) {
          console.error(`Error fetching price for apartment ${apt.id}:`, error);
        }
        
        newPrices[apt.id] = price;
      }
      setPrices(newPrices);
    };

    fetchData();
  }, [searchParams]);

  const handleReserve = async (apartmentId: number) => {
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const adults = searchParams.get('adults');
    const children = searchParams.get('children');

    if (!start || !end || !adults) {
      alert('Por favor, selecciona fechas y número de huéspedes válidos.');
      return;
    }

    const totalPrice = prices[apartmentId];
    if (totalPrice === undefined) {
      alert('El precio total aún no está disponible.');
      return;
    }

    const booking: Booking = {
      guests: parseInt(adults, 10) + (children ? parseInt(children, 10) : 0),
      apartmentId: apartmentId,
      startDate: start,
      endDate: end,
      totalPrice: totalPrice,
      status: 'PENDING',
    };

    try {
      const created = await createBooking(booking);
      localStorage.setItem('pendingBookingId', JSON.stringify(created.id));
      router.push('/booking');
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      alert('Hubo un problema al crear la reserva. Intenta de nuevo.');
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Disponibilidad</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apartments.map((apt) => (
          <Card key={apt.id}>
            <div className="relative h-48">
              <Image
                src={`/apartments/${apt.id}/index.jpg`}
                alt={apt.apartmentType}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>Apartamento {apt.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Capacidad: {apt.capacity}</p>
              <p>
                Precio:{' '}
                {prices[apt.id] !== undefined
                  ? `${prices[apt.id].toFixed(2)} €`
                  : 'Calculando...'}
              </p>
              <Button className="mt-4 w-full" onClick={() => handleReserve(apt.id)}>
                Reservar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
