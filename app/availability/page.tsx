'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAvailableApartments, Apartment } from '@/api/apartment';
import { getTotalPrice } from '@/api/booking';
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
      const guests = searchParams.get('guests');
      const type = searchParams.get('type');

      if (!startDate || !endDate) return;

      const data = await getAvailableApartments({ type, startDate, endDate });
      setApartments(data);

      const newPrices: Record<number, number> = {};
      for (const apt of data) {
        const price = await getTotalPrice(apt.id, startDate, endDate);
        newPrices[apt.id] = price;
      }
      setPrices(newPrices);
    };

    fetchData();
  }, [searchParams]);

  const handleReserve = (apartmentId: number) => {
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const guests = searchParams.get('guests');

    const booking = {
      apartmentId,
      startDate: start,
      endDate: end,
      guests: guests ? parseInt(guests) : 1,
    };

    localStorage.setItem('pendingBooking', JSON.stringify(booking));
    router.push('/payment');
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
