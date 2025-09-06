'use client'

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, MapPin, Bed } from "lucide-react"
import type { Apartment } from "@/types/apartment"
import { useLanguage } from "@/contexts/language-context"

interface ApartmentCardProps {
  apartment: Apartment
  onReserve: (apartmentId: number) => void
}

export function ApartmentCard({ apartment, onReserve }: ApartmentCardProps) {
  const { t } = useLanguage()

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {/* Imagen del apartamento */}
      <div className="relative h-48">
        <Image
          src={`/apartments/${apartment.id}/index.jpg`}
          alt={`Apartamento ${apartment.id}`}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="shadow-sm">
            Apartamento {apartment.id}
          </Badge>
        </div>
      </div>

      {/* Título */}
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="capitalize">{t(apartment.apartmentType)}</span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            Piso {apartment.floor}
          </div>
        </CardTitle>
      </CardHeader>

      {/* Contenido */}
      <CardContent className="space-y-4">
        {/* Detalles */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{apartment.capacity} huéspedes</span>
          </div>
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-muted-foreground" />
            <span>{apartment.bedrooms} dormitorios</span>
          </div>
        </div>

        {/* Descripción */}
        {apartment.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {apartment.description}
          </p>
        )}

        {/* Botón de reserva */}
        {/* <Button className="w-full" onClick={() => onReserve(apartment.id)}>
          {t("common.bookNow")}
        </Button> */}
      </CardContent>
    </Card>
  )
}
