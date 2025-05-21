'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [roomType, setRoomType] = useState('');
  const [guests, setGuests] = useState('');
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const type = searchParams.get('type');
    const guestCount = searchParams.get('guests');

    if (start) setStartDate(start);
    if (end) setEndDate(end);
    if (type) setRoomType(type);
    if (guestCount) setGuests(guestCount);

    // Simular precio (ej. 100€/noche)
    if (start && end) {
      const nights =
        (new Date(end).getTime() - new Date(start).getTime()) /
        (1000 * 60 * 60 * 24);
      const basePrice = 100; // Precio por noche
      setPrice(Math.round(nights * basePrice));
    }
  }, [searchParams]);

  const handlePayment = () => {
    alert('Pago procesado con éxito');
    // Aquí integrarías Stripe, PayPal, etc.
  };

  return (
    <main className="min-h-screen bg-muted/50 flex flex-col md:flex-row">
      {/* Panel lateral con detalles */}
      <aside className="w-full md:w-1/3 bg-white border-r shadow-sm p-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de reserva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <strong>Entrada:</strong> {startDate ? format(new Date(startDate), 'dd/MM/yyyy') : '—'}
            </div>
            <div>
              <strong>Salida:</strong> {endDate ? format(new Date(endDate), 'dd/MM/yyyy') : '—'}
            </div>
            <div>
              <strong>Tipo de habitación:</strong> {roomType || '—'}
            </div>
            <div>
              <strong>Huéspedes:</strong> {guests || '—'}
            </div>
            <Separator />
            <div className="text-lg">
              <strong>Total:</strong>{' '}
              {price !== null ? `${price.toFixed(2)} €` : '—'}
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Contenido principal de pago */}
      <section className="flex-1 p-6 flex flex-col justify-center items-center">
        <div className="max-w-md w-full space-y-6">
          <h1 className="text-2xl font-bold text-center">Finalizar pago</h1>
          <p className="text-center text-muted-foreground">
            Introduce tus datos para completar la reserva.
          </p>
          {/* Aquí puedes añadir campos de tarjeta, nombre, etc. */}
          <Button className="w-full" onClick={handlePayment}>
            Pagar ahora {price ? `(${price.toFixed(2)} €)` : ''}
          </Button>
        </div>
      </section>
    </main>
  );
}
