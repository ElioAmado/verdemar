'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, StarIcon, UsersIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/date-range-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { SiteHeader } from '@/components/site-header';

import { getBookingById, updateBooking } from '@/api/booking';
import { createClient, Client } from '@/api/client';
import { Booking } from '@/types/booking';
import { Apartment } from '@/types/apartment';
import { useLanguage } from '@/contexts/language-context';
import handleStripeCheckout from './component/handleStripeCheckout';
import { getApartmentById } from '@/api/apartment';

export default function BookingPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientInfo, setClientInfo] = useState<Client>({
    name: '',
    lastName: '',
    email: '',
    phone: '',
  });
  let error: String | null = null;

  useEffect(() => {
    async function fetchBooking() {
      const storedId = localStorage.getItem('pendingBookingId');
      console.log('Stored Booking ID:', storedId);

      const id = Number(storedId);
      if (isNaN(id)) return setLoading(false);

      try {
        const bookingData = await getBookingById(id);
        setApartment(await getApartmentById(bookingData.apartmentId!));
        setBooking(bookingData);
      } catch (error) {
        console.error('Error fetching booking:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, []);

  const handleConfirmBooking = async () => {
    try {
      if (!booking) return;

      const newClient = await createClient(clientInfo);

      const updatedBooking: Booking = {
        ...booking,
        status: 'CONFIRMED',
        apartmentId: booking.apartment?.id,
        clientId: newClient.id,
      };

      await updateBooking(updatedBooking.id!, updatedBooking);
      localStorage.removeItem('pendingBookingId');
      router.push('/confirmation');
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert(t('booking.error'));
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-muted-foreground">
        {t('booking.loading')}
      </div>
    );
  }

  if (!booking || !apartment) {
    console.log(booking);
    return (
      <div className="text-center mt-20 text-destructive">
        {t('booking.not_found')}
      </div>
    );
  }

  const roomDetails = {
    name: `${t('rooms.apartmentnumber')} ${apartment.id}`,
    description: apartment.description,
    price: booking.totalPrice ?? 0,
    image: `/apartments/${apartment.id}/index.jpg`,
    capacity: apartment.capacity,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-6">
            <Link
              href="/rooms"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              {t('booking.back')}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {t('booking.title')}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {t('booking.subtitle')}
                </p>
              </div>

              {/* Stay Details */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('booking.stay_title')}</CardTitle>
                  <CardDescription>
                    {t('booking.stay_description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>{t('booking.dates')}</Label>
                      <DatePickerWithRange
                        readOnly
                        initialRange={{
                          from: new Date(booking.startDate),
                          to: new Date(booking.endDate),
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">
                        {t('booking.guests')}
                      </Label>
                      <div className="flex items-center gap-2 text-base font-medium">
                        <UsersIcon className="h-4 w-4 text-primary" />
                        <span>{booking.guests}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>{t('booking.notes')}</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-2"
                      placeholder={t('booking.notes_placeholder')}
                      defaultValue={booking.notes || ''}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Guest Information */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('booking.guest_title')}</CardTitle>
                  <CardDescription>
                    {t('booking.guest_description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">{t('form.first_name')}</Label>
                      <Input
                        id="first-name"
                        value={clientInfo.name}
                        onChange={(e) =>
                          setClientInfo({ ...clientInfo, name: e.target.value })
                        }
                        placeholder={t('form.first_name_placeholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">{t('form.last_name')}</Label>
                      <Input
                        id="last-name"
                        value={clientInfo.lastName}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            lastName: e.target.value,
                          })
                        }
                        placeholder={t('form.last_name_placeholder')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('form.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={clientInfo.email}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            email: e.target.value,
                          })
                        }
                        placeholder={t('form.email_placeholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('form.phone')}</Label>
                      <Input
                        id="phone"
                        value={clientInfo.phone}
                        onChange={(e) =>
                          setClientInfo({
                            ...clientInfo,
                            phone: e.target.value,
                          })
                        }
                        placeholder={t('form.phone_placeholder')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  if (booking?.totalPrice && booking?.id) {
                    handleStripeCheckout(
                      booking.totalPrice,
                      booking.id.toString()
                    );
                  } else {
                    alert(t('booking.missing_info'));
                  }
                }}
              >
                {t('booking.confirm')}
              </Button>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <Card>
                <Image
                  src={roomDetails.image}
                  alt={roomDetails.name}
                  width={600}
                  height={400}
                  className="rounded-t-md object-cover"
                />
                <CardContent className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {roomDetails.name}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      {roomDetails.description}
                    </p>
                  </div>

                  <div className="text-lg font-semibold">
                    ${roomDetails.price} {t('common.total')}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
