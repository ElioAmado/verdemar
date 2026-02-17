'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApartmentType, apartmentTypeLabels } from '@/types/apartmentType';
import { Bed, Check, X, Users } from 'lucide-react';

interface ApartmentTypeCardProps {
  type: ApartmentType;
  price: number;
  available: boolean;
  nights: number;
  startDate: string;
  endDate: string;
  guests: number;
}

export function ApartmentTypeCard({
  type,
  price,
  available,
  nights,
  startDate,
  endDate,
  guests,
}: ApartmentTypeCardProps) {
  const router = useRouter();
  const totalPrice = price * nights;
  const bedrooms = type === ApartmentType.ONE_BEDROOM ? 1 : 2;
  const maxCapacity = type === ApartmentType.ONE_BEDROOM ? 3 : 6;

  const handleReserve = () => {
    const params = new URLSearchParams({
      type,
      startDate,
      endDate,
      guests: String(guests),
      price: String(price),
      totalPrice: String(totalPrice),
      nights: String(nights),
    });
    router.push(`/payment?${params.toString()}`);
  };

  return (
    <Card className={`overflow-hidden transition-all ${!available ? 'opacity-60' : 'hover:shadow-lg hover:border-primary/50'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl text-foreground">
            Apartamento de {bedrooms} {bedrooms === 1 ? 'Dormitorio' : 'Dormitorios'}
          </CardTitle>
          <Badge variant={available ? 'default' : 'secondary'}>
            {available ? (
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                Disponible
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <X className="h-3 w-3" />
                No disponible
              </span>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4" />
            <span className="text-sm">{apartmentTypeLabels[type]}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="text-sm">Hasta {maxCapacity} personas</span>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-bold text-foreground">
                {price.toFixed(2)}€
              </span>
              <span className="text-sm text-muted-foreground"> / noche</span>
            </div>
            {nights > 0 && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {nights} {nights === 1 ? 'noche' : 'noches'}
                </p>
                <p className="text-lg font-semibold text-foreground">
                  Total: {totalPrice.toFixed(2)}€
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          disabled={!available}
          onClick={handleReserve}
        >
          {available ? `Reservar Apartamento de ${bedrooms} ${bedrooms === 1 ? 'Dormitorio' : 'Dormitorios'}` : 'No disponible'}
        </Button>
      </CardFooter>
    </Card>
  );
}
