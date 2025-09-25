'use client';
import Image from 'next/image';
import {
  Vault,
  AirVent,
  CircleParking,
  CookingPot,
  Waves,
  MapPin,
  Home,
} from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { useLanguage } from '@/contexts/language-context';
import RoomsSearch from '@/components/rooms-search';
import { apartments } from '@/consts/apartaments';
import { Card, CardContent } from '@/components/ui/card';
import { Mapa } from '@/consts/maps';

export default function HomePage() {
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
            </div>
          </div>
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-5xl">
            <RoomsSearch />
          </div>
        </section>

        {/* Intro Section */}
        <section className="mt-20 bg-background">
          <div className="container mx-auto px-4">
            {/* Hero Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-6">
                <Waves className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">
                  Espujols, Formentera
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-serif text-balance mb-6 text-foreground">
                Apartamentos
                <span className="block text-primary">Verde Mar</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
                Un complejo exclusivo de 6 apartamentos turísticos en una
                ubicación privilegiada. A solo 150 metros de la playa y 5
                minutos del centro de Espujols, en un entorno rústico donde
                disfrutar de la tranquilidad mediterránea.
              </p>
            </div>

            {/* Location Highlights */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              <Card className="border-0 bg-card/50 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Waves className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">150m de la Playa</h3>
                  <p className="text-sm text-muted-foreground">
                    Acceso directo a las cristalinas aguas de Espujols
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold mb-2">A 5 minutos del centro</h3>
                  <p className="text-sm text-muted-foreground">
                    Caminata corta a restaurantes y servicios
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Zona Rústica</h3>
                  <p className="text-sm text-muted-foreground">
                    Tranquilidad en un entorno natural preservado
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center my-12">
            {t('home.map.title')}
          </h2>
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden border">
            <Mapa />
          </div>
        </div>


        {/* Amenities Section */}
        <section className=" mt-16 bg-muted py-24">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-2">
              {/* <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">
                Hotel Amenities
              </div> */}
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
                <div
                  key={idx}
                  className="flex flex-col items-center text-center space-y-3"
                >
                  <div className="bg-primary/10 p-4 rounded-full">
                    {amenity.icon}
                  </div>
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
