'use client';

import { SiteFooter } from '@/components/site-footer';
import Image from 'next/image';
import {
  AirVent,
  ChevronRightIcon,
  CircleParking,
  MapPinIcon,
  StarIcon,
  UsersIcon,
  Vault,
} from 'lucide-react';

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
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { Apartment, getApartmentById } from '@/api/apartment';
import { get } from 'http';

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();
  const defaultDateRange: DateRange = {
    from: new Date(),
    to: undefined,
  };

  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);
  const [roomType, setRoomType] = useState<string>('');
  const [guests, setGuests] = useState<number>(1);
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    const fetchApartments = async () => {
      const results = await Promise.all([
        getApartmentById(1),
        getApartmentById(5),
      ]);
      setApartments(results);
    };

    fetchApartments();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    // Validamos y agregamos start
    if (dateRange.from instanceof Date && !isNaN(dateRange.from.getTime())) {
      params.append('start', dateRange.from.toISOString().split('T')[0]);
    } else {
      // Puedes poner un valor por defecto o manejar error
      console.warn('Fecha "from" inválida o no definida');
      // Por ejemplo: return; para no hacer la búsqueda sin fechas
    }

    // Validamos y agregamos end
    if (dateRange.to instanceof Date && !isNaN(dateRange.to.getTime())) {
      params.append('end', dateRange.to.toISOString().split('T')[0]);
    } else {
      console.warn('Fecha "to" inválida o no definida');
      alert('Por favor, selecciona una fecha de salida válida.');
      return; // Evitamos hacer la búsqueda sin fechas
    }

    // Validamos y agregamos tipo de habitación, con valor por defecto si quieres
    if (typeof roomType === 'string' && roomType.trim() !== '') {
      params.append('type', roomType);
    } else {
      console.warn('Tipo de habitación inválido o no definido');
    }

    // Validamos y agregamos cantidad de invitados, al menos 1
    const guestsNumber = Number(guests);
    if (!isNaN(guestsNumber) && guestsNumber > 0) {
      params.append('guests', guestsNumber.toString());
    } else {
      console.warn('Número de invitados inválido o no definido');
    }

    // Si quieres evitar hacer la búsqueda sin algunos parámetros claves,
    // puedes validar aquí antes de hacer router.push

    router.push(`/availability?${params.toString()}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative h-[600px]">
            <Image
              src="/placeholder.svg?height=600&width=1920"
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
              <div className="mt-8">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90"
                >
                  {t('home.hero.cta')}
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-5xl">
            <Card className="border shadow-lg">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('home.search.checkIn')}
                    </label>
                    <DatePickerWithRange onRangeChange={setDateRange} />
                    {/* <Calendar /> */}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('home.search.roomType')}
                    </label>
                    <RoomTypeSelector onChange={setRoomType} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('home.search.guests')}
                    </label>
                    <GuestCounter
                      onChange={(guests) => {
                        setGuests(guests); // guests = { adults: number, children: number }
                      }}
                    />

                  </div>
                  <div className="flex items-end">
                    <Button className="w-full" onClick={handleSearch} id="search-button">
                      {t('home.search.search')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container px-4 md:px-6 py-24 mt-20">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                {t('home.rooms.littleMsg')}
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                {t('home.rooms.title')}
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t('home.rooms.subtitle')}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-8 mt-12">
           {apartments.map((apto) => (
  <Card key={apto.id} className="overflow-hidden">
    <div className="relative h-48">
      <Image
        src={apto.imageUrl || "/placeholder.svg?height=300&width=500"}
        alt={apto.apartmentType}
        fill
        className="object-cover transition-transform hover:scale-105"
      />
    </div>
    <CardHeader>
      <CardTitle>{t(`roomSelector.${apto.apartmentType.toLowerCase()}`)}</CardTitle>
      <CardDescription>{apto.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-2 text-sm">
        <UsersIcon className="h-4 w-4" />
        <span>
          {apto.capacity} {t('home.rooms.guests')}
        </span>
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full">{t('common.bookNow')}</Button>
    </CardFooter>
  </Card>
))}

          </div>
          <div className="flex justify-center mt-12">
            <Button variant="outline" className="gap-2">
              {t('home.rooms.viewAll')}
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="bg-muted py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">
                  Hotel Amenities
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {t('home.amenities.title')}
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t('home.amenities.subtitle')}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Vault />
                </div>
                <h3 className="text-xl font-bold">
                  {t('home.amenities.safe')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.amenities.safeDesc')}
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-4 rounded-full">
                  <AirVent />
                </div>
                <h3 className="text-xl font-bold">{t('home.amenities.AC')}</h3>
                <p className="text-muted-foreground">
                  {t('home.amenities.ACDesc')}
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-4 rounded-full">
                  <CircleParking />
                </div>
                <h3 className="text-xl font-bold">
                  {t('home.amenities.dining')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.amenities.diningDesc')}
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-primary/10 p-4 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" x2="6" y1="1" y2="4" />
                    <line x1="10" x2="10" y1="1" y2="4" />
                    <line x1="14" x2="14" y1="1" y2="4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">
                  {t('home.amenities.service')}
                </h3>
                <p className="text-muted-foreground">
                  {t('home.amenities.serviceDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Continue with the rest of the page... */}
      </main>
      <SiteFooter />
    </div>
  );
}
