'use client';

import { useLanguage } from '@/contexts/language-context';
import Image from 'next/image';
import {
  Wifi,
  Coffee,
  Tv,
  Snowflake,
  Utensils,
  Car,
  Shirt,
  MapPin,
  Users,
  Lock,
  Home,
  Bath,
  Landmark,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function AmenitiesPage() {
  const { t } = useLanguage();

  const services = [
    { icon: <Wifi className="h-5 w-5 text-primary" />, title: t('amenities.wifi'), desc: t('amenities.wifiDesc') },
    { icon: <Coffee className="h-5 w-5 text-primary" />, title: t('amenities.coffee'), desc: t('amenities.coffeeDesc') },
    { icon: <Tv className="h-5 w-5 text-primary" />, title: t('amenities.tv'), desc: t('amenities.tvDesc') },
    { icon: <Snowflake className="h-5 w-5 text-primary" />, title: t('amenities.ac'), desc: t('amenities.acDesc') },
    { icon: <Utensils className="h-5 w-5 text-primary" />, title: t('amenities.kitchen'), desc: t('amenities.kitchenDesc') },
    { icon: <Car className="h-5 w-5 text-primary" />, title: t('amenities.parking'), desc: t('amenities.parkingDesc') },
    { icon: <Shirt className="h-5 w-5 text-primary" />, title: t('amenities.laundry'), desc: t('amenities.laundryDesc') },
    { icon: <MapPin className="h-5 w-5 text-primary" />, title: t('amenities.location'), desc: t('amenities.locationDesc') },
    { icon: <Users className="h-5 w-5 text-primary" />, title: t('amenities.staff'), desc: t('amenities.staffDesc') },
    { icon: <Lock className="h-5 w-5 text-primary" />, title: t('amenities.safe'), desc: t('amenities.safeDesc') },
    { icon: <Home className="h-5 w-5 text-primary" />, title: t('amenities.family'), desc: t('amenities.familyDesc') },
    { icon: <Landmark className="h-5 w-5 text-primary" />, title: t('amenities.balcony'), desc: t('amenities.balconyDesc') },
    { icon: <Bath className="h-5 w-5 text-primary" />, title: t('amenities.bathroom'), desc: t('amenities.bathroomDesc') },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-muted py-12">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-3xl font-bold sm:text-5xl mb-4">
              {t('amenities.title')}
            </h1>
            <p className="text-muted-foreground md:text-lg max-w-xl mx-auto">
              {t('amenities.subtitle')}
            </p>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {service.icon}
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
