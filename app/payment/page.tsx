'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient, Client } from '@/api/client';
import { createBooking } from '@/api/booking';

interface BookingData {
  apartmentId: number;
  startDate: string;
  endDate: string;
  guests: number;
}

interface ClientForm {
  name: string;
  lastName: string;
  phone: string;
  email: string;
}

export default function PaymentPage() {
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [client, setClient] = useState<ClientForm>({
    name: '',
    lastName: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('pendingBooking');
    if (stored) {
      const parsed: BookingData = JSON.parse(stored);
      setBooking(parsed);

      const start = new Date(parsed.startDate);
      const end = new Date(parsed.endDate);
      const nights = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      const basePrice = 100;
      setPrice(Math.round(nights * basePrice));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClient((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handlePayment = async () => {
  if (!booking) return;

  try {
    // 1. Crear cliente en el backend
    const savedClient: Client = await createClient(client);

    // 2. Crear reserva con clientId y datos de booking
    const newBooking = {
      clientId: savedClient.id!,
      apartmentId: booking.apartmentId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalPrice: price || 0,
      status: 'CONFIRMED', // o lo que uses por defecto
      notes: ''
    };

    await createBooking(newBooking);

    // 3. Limpiar y confirmar
    alert(`Reserva confirmada para ${savedClient.name} ${savedClient.lastName}`);
    localStorage.removeItem('pendingBooking');

  } catch (error) {
    console.error("Error en el proceso de pago:", error);
    alert("❌ Hubo un problema al confirmar la reserva.");
  }
};


  if (!booking) {
    return <p className="p-6">Cargando datos de reserva...</p>;
  }

  return (
    <main className="min-h-screen bg-muted/50 flex flex-col md:flex-row">
      {/* Panel lateral con detalles */}
      <aside className="w-full md:w-1/3 bg-white border-r shadow-sm p-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de reserva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div><strong>Entrada:</strong> {format(new Date(booking.startDate), 'dd/MM/yyyy')}</div>
            <div><strong>Salida:</strong> {format(new Date(booking.endDate), 'dd/MM/yyyy')}</div>
            <div><strong>Apartamento:</strong> {booking.apartmentId}</div>
            <div><strong>Huéspedes:</strong> {booking.guests}</div>
            <Separator />
            <div className="text-lg"><strong>Total:</strong> {price !== null ? `${price.toFixed(2)} €` : '—'}</div>
          </CardContent>
        </Card>
      </aside>

      {/* Formulario de cliente */}
      <section className="flex-1 p-6 flex flex-col justify-center items-center">
        <div className="max-w-md w-full space-y-6">
          <h1 className="text-2xl font-bold text-center">Finalizar pago</h1>
          <p className="text-center text-muted-foreground">
            Introduce tus datos para completar la reserva.
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" value={client.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="lastName">Apellidos</Label>
              <Input id="lastName" name="lastName" value={client.lastName} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" value={client.phone} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={client.email} onChange={handleChange} required />
            </div>
          </div>

          <Button className="w-full mt-4" onClick={handlePayment}>
            Pagar ahora {price ? `(${price.toFixed(2)} €)` : ''}
          </Button>
        </div>
      </section>
    </main>
  );
}
