'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAvailableApartments, Apartment} from '@/api/apartment';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function AvailabilityPage() {
  const searchParams = useSearchParams();
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const startDate = searchParams.get('start');
      const endDate = searchParams.get('end');
      // const guests = searchParams.get('guests');
      const type = searchParams.get('type');

      const data = await getAvailableApartments({ startDate, endDate, type });
      setApartments(data);
    };

    fetchData();
  }, [searchParams]);

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Disponibilidad</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apartments.map((apt) => (
          <Card key={apt.id}>
            <div className="relative h-48">
              {/*<Image
                src={apt.image || '/placeholder.svg'}
                alt={apt.name}
                fill
                className="object-cover"
              />*/}
            </div>
            <CardHeader>
              <CardTitle>{apt.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Capacidad: {apt.capacity}</p>
              <p>Precio: </p>
              <Button className="mt-4 w-full">Reservar</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
