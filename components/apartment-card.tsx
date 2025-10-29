'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Users, Bed, Euro, MapPin, CheckCircle, XCircle } from 'lucide-react';
import type { ExtendedApartmentAvailability } from '@/types/availability';
import { useLanguage } from '@/contexts/language-context';

interface ApartmentCardProps {
  apartment: ExtendedApartmentAvailability;
  onReserve: (apartmentId: number) => void;
}

export function ApartmentCard({ apartment, onReserve }: ApartmentCardProps) {
  const { t } = useLanguage();
  const {
    apartment: apt,
    available,
    price,
    pricePerNight,
    loading: priceLoading,
    error: priceError,
  } = apartment;

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-lg ${!available ? 'opacity-75' : ''}`}
    >
      <div className="relative h-48">
        <Image
          src={`/apartments/${apt.id}/index.jpg`}
          alt={`Apartamento ${apt.id}`}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3">
          <Badge
            variant={available ? 'default' : 'destructive'}
            className="shadow-sm"
          >
            {available ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" /> Disponible
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" /> No disponible
              </>
            )}
          </Badge>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="shadow-sm">
            Apartamento {apt.id}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="capitalize">{t(apt.apartmentType)}</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            Piso {apt.floor}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Apartment Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{apt.capacity} huéspedes</span>
          </div>
        </div>

        {/* Description */}
        {apt.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {apt.description}
          </p>
        )}

        <Separator />

        {/* Pricing */}
        <div className="space-y-2">
          {priceLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          ) : priceError ? (
            <div className="text-sm text-destructive">{priceError}</div>
          ) : (
            <>
              {pricePerNight && (
                <div className="text-sm text-muted-foreground">
                  {pricePerNight.toFixed(2)} € por noche
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  {price?.toFixed(2)} € total
                </span>
              </div>
            </>
          )}
        </div>

        {/* Reserve Button */}
        <Button
          className="w-full"
          onClick={() => onReserve(apt.id)}
          disabled={!available || priceLoading || !!priceError}
          variant={available ? 'default' : 'secondary'}
        >
          {!available
            ? 'No disponible'
            : priceLoading
              ? 'Calculando precio...'
              : priceError
                ? 'Error en precio'
                : 'Reservar ahora'}
        </Button>
      </CardContent>
    </Card>
  );
}
