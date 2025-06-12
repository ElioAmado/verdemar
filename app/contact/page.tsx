"use client";
import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiteHeader } from '@/components/site-header';
import { useLanguage } from '@/contexts/language-context';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <script async src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&callback=console.debug&libraries=maps,marker&v=beta">
    </script>
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-muted py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {t('contact.title')}
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  {t('contact.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">{t('contact.formTitle')}</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">{t('contact.firstName')}</Label>
                      <Input id="first-name" placeholder={t('contact.firstNamePlaceholder')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">{t('contact.lastName')}</Label>
                      <Input id="last-name" placeholder={t('contact.lastNamePlaceholder')} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('contact.email')}</Label>
                      <Input id="email" type="email" placeholder={t('contact.emailPlaceholder')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('contact.phone')}</Label>
                      <Input id="phone" placeholder={t('contact.phonePlaceholder')} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{t('contact.subject')}</Label>
                    <Input id="subject" placeholder={t('contact.subjectPlaceholder')} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('contact.message')}</Label>
                    <Textarea id="message" placeholder={t('contact.messagePlaceholder')} className="min-h-[150px]" />
                  </div>

                  <Button type="submit" className="w-full">
                    {t('contact.send')}
                  </Button>
                </form>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">{t('contact.infoTitle')}</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold">{t('contact.address')}</h3>
                        <p className="text-muted-foreground">
                          Camp D'es Pou 3877, Es Pujols
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold">{t('contact.phone')}</h3>
                        <p className="text-muted-foreground">+34 626 70 39 85</p>
                        <p className="text-muted-foreground">Reservations: +1 (123) 456-7891</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold">{t('contact.email')}</h3>
                        <p className="text-muted-foreground">aptosverdemar@gmail.com</p>
                        <p className="text-muted-foreground">reservations@luxstayhotel.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6">{t('contact.locationTitle')}</h2>
                  <div className="aspect-video relative rounded-xl overflow-hidden border">
                    <Image
                      src="/placeholder.svg?height=400&width=600&text=Map"
                      alt={t('contact.mapAlt')}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6">{t('contact.hoursTitle')}</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{t('contact.hours.frontDesk')}</span>
                      <span className="text-muted-foreground">{t('contact.hours.frontDeskHours')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t('contact.hours.concierge')}</span>
                      <span className="text-muted-foreground">{t('contact.hours.conciergeHours')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t('contact.hours.restaurant')}</span>
                      <span className="text-muted-foreground">{t('contact.hours.restaurantHours')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t('contact.hours.lounge')}</span>
                      <span className="text-muted-foreground">{t('contact.hours.loungeHours')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t('contact.hours.spa')}</span>
                      <span className="text-muted-foreground">{t('contact.hours.spaHours')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Aquí continúa la sección de FAQ que también puedes traducir de forma similar */}
      </main>
    </div>
  );
}
