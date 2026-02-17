'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApartmentAvailability } from '@/api/apartment';
import { apartmentTypeLabels } from '@/types/apartmentType';
import { Bed, Check, X } from 'lucide-react';

interface ApartmentResultCardProps {
  data: ApartmentAvailability;
  nights: number;
  onReserve?: (apartmentId: number) => void;
}

export function ApartmentResultCard({
  data,
  nights,
  onReserve,
}: ApartmentResultCardProps) {
  const { apartment, available } = data;
  const totalPrice = apartment.price * nights;

  return (
    <Card className={`overflow-hidden transition-all ${!available ? 'opacity-60' : 'hover:shadow-lg'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-foreground">{apartment.name}</CardTitle>
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
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Bed className="h-4 w-4" />
          <span className="text-sm">
            {apartmentTypeLabels[apartment.type]}
          </span>
        </div>

        {apartment.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {apartment.description}
          </p>
        )}

        <div className="pt-2 border-t">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold text-foreground">
                €{apartment.price}
              </span>
              <span className="text-sm text-muted-foreground"> / noche</span>
            </div>
            {nights > 0 && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {nights} {nights === 1 ? 'noche' : 'noches'}
                </p>
                <p className="font-semibold text-foreground">
                  Total: €{totalPrice}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={!available}
          onClick={() => available && onReserve?.(apartment.id)}
        >
          {available ? 'Reservar' : 'No disponible'}
        </Button>
      </CardFooter>
    </Card>
  );
}
