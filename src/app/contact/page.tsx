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
import { useEffect } from 'react';
import { SiteFooter } from '@/components/site-footer';



// Declare google as a global variable for TypeScript
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
  var google: any;
}

export default function ContactPage() {
  const { t } = useLanguage();
  

  const Mapa = () => {
    useEffect(() => {
        // Evitar múltiples inclusiones
  const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`);
  if (existingScript) {
    if (window.google) {
      window.initMap(); // Ejecutar callback si ya está cargado
    }
    return;
  }
  
      // Define global initMap callback
      (window as any).initMap = function () {
        const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
          center: { lat: 38.722110140342515, lng: 1.4594708860911132 }, // Coordenadas de ejemplo: Formentera
          zoom: 15.5,
        });

        new google.maps.Marker({
          position: { lat: 38.722110140342515, lng: 1.4594708860911132 }, 
          map,
          title: "Apartamentos Verde Mar",
        });
      };

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_API_KEY_MAP}&callback=initMap&libraries=maps,marker&v=beta`;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
        delete (window as any).initMap;
      };
    }, []);

    return <div id="map" style={{ height: "400px", width: "100%" }} />;
  };

  return (
    <div className="flex min-h-screen flex-col">
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
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold">{t('contact.email')}</h3>
                        <p className="text-muted-foreground">aptosverdemar@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6">{t('contact.locationTitle')}</h2>
                  <div className="aspect-video relative rounded-xl overflow-hidden border">
                    <Mapa />
                  </div>
                </div>

                {/* <div>
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
                </div> */}
              </div>
            </div>
          </div>
        </section>

        {/* <section className="py-12 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-lg">
                  Find quick answers to common questions about our hotel and
                  services.
                </p>
              </div>
            </div>

            <Tabs defaultValue="general" className="w-full max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="reservations">Reservations</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      What are your check-in and check-out times?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Check-in time is 3:00 PM and check-out time is 12:00 PM.
                      Early check-in and late check-out may be available upon
                      request, subject to availability and additional charges.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Is airport transportation available?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Yes, we offer airport transportation services for our
                      guests. Please contact our concierge at least 24 hours in
                      advance to arrange pickup or drop-off.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Do you have parking facilities?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Yes, we offer both self-parking and valet parking options.
                      Self-parking is $25 per day, while valet parking is $35
                      per day with unlimited in-and-out privileges.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reservations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>How can I make a reservation?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Reservations can be made through our website, by calling
                      our reservations line at +1 (123) 456-7891, or by emailing
                      reservations@luxstayhotel.com.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>What is your cancellation policy?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Our standard cancellation policy allows for free
                      cancellation up to 48 hours before check-in. Cancellations
                      made within 48 hours of arrival may be subject to a charge
                      equivalent to one night's stay.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Do you require a deposit?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      A credit card is required to secure your reservation, but
                      no charges will be made until check-in unless specified by
                      a special rate or promotion.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amenities" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Is Wi-Fi available?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Yes, complimentary high-speed Wi-Fi is available
                      throughout the hotel, including all guest rooms and public
                      areas.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Do you have a fitness center?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Yes, our state-of-the-art fitness center is open 24 hours
                      a day and features modern cardio and strength training
                      equipment, as well as daily fitness classes.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Is breakfast included with the room?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Breakfast is included with some room rates. Please check
                      your reservation details or contact our reservations team
                      to add a breakfast package to your stay.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="policies" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Is the hotel pet-friendly?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Yes, we welcome pets under 25 pounds with a non-refundable
                      fee of $75 per stay. Please notify us in advance if you
                      plan to bring a pet.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>What is your smoking policy?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Apartamentos Verde Mar is a 100% non-smoking property.
                      Smoking is not permitted in any guest rooms or public
                      areas. A cleaning fee of $250 will be charged for smoking
                      in non-designated areas.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Do you have accessible rooms?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Yes, we offer ADA-compliant rooms with various
                      accessibility features. Please specify your requirements
                      when making a reservation to ensure we can accommodate
                      your needs.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section> */}

        {/* <section className="py-12">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">
              Need Immediate Assistance?
            </h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg mb-8">
              Our dedicated team is available 24/7 to assist with urgent
              inquiries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <Phone className="h-5 w-5" />
                Call Now
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Mail className="h-5 w-5" />
                Email Us
              </Button>
            </div>
          </div>
        </section> */}

      </main>
      <SiteFooter />
    </div>
  );
}
