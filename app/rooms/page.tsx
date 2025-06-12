'use client';

import { useEffect, useState } from 'react';
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

import { SiteHeader } from '@/components/site-header';
import RoomsSearch from '@/components/rooms-search';

import { useLanguage } from '@/contexts/language-context';
import { Apartment, getAllApartments } from '@/api/apartment';

export default function RoomsPage() {
  const { t } = useLanguage();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllApartments()
      .then(setApartments)
      .finally(() => setLoading(false));
  }, []);

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
            <RoomsSearch />
            <br />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <p>{t('rooms.loading')}</p>
              ) : apartments.length === 0 ? (
                <p>{t('rooms.noResults')}</p>
              ) : (
                apartments.map((apartment) => (
                  <RoomCard
                    key={apartment.id}
                    image={`/apartments/${apartment.id}/index.jpg`} // imagen por defecto, se puede mejorar
                    title={`${t('rooms.apartmentnumber')} ${apartment.id}`}
                    description={`${t(`${apartment.apartmentType}`)}`}
                    guests={apartment.capacity}
                    rating="4.8 (120 reviews)"
                    features={[
                      `${apartment.bedrooms} ${t('rooms.features.bedrooms')}`,
                      `${apartment.floor}º ${t('rooms.features.floor')}`,
                      t('rooms.features.wifi'),
                      t('rooms.features.ac'),
                      t('rooms.features.tv'),
                    ]}
                    price={(apartment.capacity * 50).toFixed(0)} // ejemplo de precio
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

interface RoomCardProps {
  image: string;
  title: string;
  description: string;
  guests: number;
  rating: string;
  features: string[];
  price: string;
}

function RoomCard({
  image,
  title,
  description,
  guests,
  rating,
  features,
  price,
}: RoomCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden">
      <div className="relative h-64">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
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
            {features.map((f, i) => (
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
