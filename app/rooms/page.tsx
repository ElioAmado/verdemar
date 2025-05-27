'use client';
import Link from 'next/link';
import Image from 'next/image';
import { StarIcon, UsersIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/date-range-picker';
import { RoomTypeSelector } from '@/components/room-type-selector';
import { GuestCounter } from '@/components/guest-counter';
import { SiteHeader } from '@/components/site-header';
import { useLanguage } from '@/contexts/language-context';

export default function RoomsPage() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-muted py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {t('rooms.title')}
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  {t('rooms.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4 md:px-6">
            <Card className="mb-12">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('rooms.filters.dates')}
                    </label>
                    <DatePickerWithRange />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('rooms.filters.roomType')}
                    </label>
                    <RoomTypeSelector />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('rooms.filters.guests')}
                    </label>
                    <GuestCounter />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">{t('rooms.filters.search')}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Este bloque deberías repetirlo con un array de habitaciones para evitar duplicación */}
              <RoomCard
                image="/placeholder.svg?height=400&width=600"
                title={t('rooms.cards.deluxe.title')}
                description={t('rooms.cards.deluxe.description')}
                guests="2"
                rating="4.8 (120 reviews)"
                features={[
                  t('rooms.features.king'),
                  '35 m²',
                  t('rooms.features.cityView'),
                  t('rooms.features.wifi'),
                  t('rooms.features.ac'),
                  t('rooms.features.tv'),
                ]}
                price="199"
              />
              {/* Repite el componente RoomCard con los datos traducidos para cada habitación */}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function RoomCard({ image, title, description, guests, rating, features, price }: any) {
  const { t } = useLanguage();
  return (
    <Card className="overflow-hidden">
      <div className="relative h-64">
        <Image src={image} alt={title} fill className="object-cover transition-transform hover:scale-105" />
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <UsersIcon className="h-4 w-4" />
            <span>{guests} {t('rooms.guests')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <StarIcon className="h-4 w-4 fill-primary" />
            <span>{rating}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {features.map((f: string, i: number) => (
              <div key={i}>• {f}</div>
            ))}
          </div>
          <p className="text-2xl font-bold">
            ${price}
            <span className="text-sm font-normal text-muted-foreground">/noche</span>
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">{t('rooms.book')}</Button>
      </CardFooter>
    </Card>
  );
}
