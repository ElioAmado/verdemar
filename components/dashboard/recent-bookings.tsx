'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Booking, BookingStatus } from '@/types/booking';
import { CalendarDays, Users } from 'lucide-react';

interface RecentBookingsProps {
  bookings: Booking[];
}

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  0: { label: 'Pendiente', className: 'bg-chart-3/20 text-chart-3 border-chart-3/30' },
  1: { label: 'Confirmada', className: 'bg-primary/20 text-primary border-primary/30' },
  2: { label: 'Cancelada', className: 'bg-destructive/20 text-destructive border-destructive/30' },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(value);
}

function getInitials(name: string, lastName: string): string {
  return `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function BookingItem({ booking }: { booking: Booking }) {
  const status = statusConfig[booking.status];
  
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
      <Avatar className="h-10 w-10 bg-primary/20">
        <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
          {booking.client ? getInitials(booking.client.name, booking.client.last_name) : 'NA'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground truncate">
            {booking.client ? `${booking.client.name} ${booking.client.last_name}` : 'Cliente desconocido'}
          </span>
          <Badge variant="outline" className={status.className}>
            {status.label}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {booking.guests} {booking.guests === 1 ? 'huésped' : 'huéspedes'}
          </span>
          {booking.apartment && (
            <span className="hidden sm:inline">
              {booking.apartment.type}
            </span>
          )}
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-semibold text-foreground">{formatCurrency(booking.total_price)}</p>
        <p className="text-xs text-muted-foreground">{booking.method_payment}</p>
      </div>
    </div>
  );
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  if (bookings.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Reservas Recientes</CardTitle>
          <CardDescription className="text-muted-foreground">
            Últimas reservas registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CalendarDays className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No hay reservas recientes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Reservas Recientes</CardTitle>
            <CardDescription className="text-muted-foreground">
              Últimas reservas registradas
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            {bookings.length} reservas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {bookings.map((booking) => (
          <BookingItem key={booking.booking_id} booking={booking} />
        ))}
      </CardContent>
    </Card>
  );
}
