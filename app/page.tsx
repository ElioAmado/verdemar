'use client';
import Image from 'next/image';
import {
  Vault,
  AirVent,
  CircleParking,
  CookingPot,
  UsersIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import RoomsSearch from '@/components/rooms-search';
import { ApartmentCard } from '@/components/apartment-card';
import { apartments } from '@/consts/apartaments';
import Link from 'next/link';

export default function Home() {
  const { t } = useLanguage();

  const idsToKeep = [1, 6];

  const filtered = apartments.filter((apartment) =>
    idsToKeep.includes(apartment.id)
  );


  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative h-[600px]">
            <Image
              src="/apartments/main/index.jpg"
              alt="Hotel exterior"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container px-4 md:px-6 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
                {t('home.hero.title')}
              </h1>
              <p className="mx-auto max-w-[700px] text-white/90 md:text-xl mt-4">
                {t('home.hero.subtitle')}
              </p>
              {/* <div className="mt-8">
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  {t('home.hero.cta')}
                </Button>
              </div> */}
            </div>
          </div>
           <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-5xl">
          <RoomsSearch />
          </div>
        </section>

        {/* Featured Apartments */}
        <section className="container px-4 md:px-6 py-24 mt-20">
          <div className="text-center space-y-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              {t('rooms.littleMsg')}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              {t('rooms.title')}
            </h2>
            <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t('rooms.subtitle')}
            </p>
          </div>

          <div className="grid max-w-5xl mx-auto grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {filtered.map((apartment) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                onReserve={(id) => console.log(`Reserve apartment ${id}`)}
              />
            ))}
          
          </div>

         {/* <div className="flex justify-center mt-12">
            <Link href="/rooms">
              <Button variant="outline" className="gap-2">
                {t('common.viewAll')}
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>*/}
        </section>

        {/* Amenities Section */}
        <section className="bg-muted py-24">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">
                Hotel Amenities
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                {t('home.amenities.title')}
              </h2>
              <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t('home.amenities.subtitle')}
              </p>
            </div>

            <div className="grid max-w-6xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {[
                {
                  icon: <Vault className="h-6 w-6 text-primary" />,
                  title: t('home.amenities.safe'),
                  desc: t('home.amenities.safeDesc'),
                },
                {
                  icon: <AirVent className="h-6 w-6 text-primary" />,
                  title: t('home.amenities.AC'),
                  desc: t('home.amenities.ACDesc'),
                },
                {
                  icon: <CircleParking className="h-6 w-6 text-primary" />,
                  title: t('home.amenities.parking'),
                  desc: t('home.amenities.parkingDesc'),
                },
                {
                  icon: <CookingPot className="h-6 w-6 text-primary" />,
                  title: t('home.amenities.kitchen'),
                  desc: t('home.amenities.kitchenDesc'),
                },
              ].map((amenity, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-3">
                  <div className="bg-primary/10 p-4 rounded-full">{amenity.icon}</div>
                  <h3 className="text-xl font-bold">{amenity.title}</h3>
                  <p className="text-muted-foreground">{amenity.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
