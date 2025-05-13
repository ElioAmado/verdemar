import Link from 'next/link';
import Image from 'next/image';
import {
  Coffee,
  Dumbbell,
  MapPin,
  Utensils,
  Wifi,
  Wine,
  Car,
  Waves,
  Shirt,
  Users,
  Briefcase,
  Palmtree,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiteHeader } from '@/components/site-header';

export default function AmenitiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-muted py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Hotel Amenities & Services
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Discover our world-class facilities and services designed to
                  make your stay unforgettable.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-xl">
                  <TabsTrigger value="all">All Amenities</TabsTrigger>
                  <TabsTrigger value="wellness">Wellness</TabsTrigger>
                  <TabsTrigger value="dining">Dining</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="space-y-16">
                {/* Wellness Section */}
                <div>
                  <h2 className="text-2xl font-bold mb-8 text-center">
                    Wellness & Recreation
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card>
                      <div className="relative h-48">
                        <Image
                          src="/placeholder.svg?height=300&width=500"
                          alt="Infinity Pool"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Waves className="h-5 w-5 text-primary" />
                          Infinity Pool
                        </CardTitle>
                        <CardDescription>
                          Open daily from 7:00 AM to 10:00 PM
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Our stunning infinity pool offers breathtaking views
                          of the surrounding landscape. Relax in the sun
                          loungers or take a refreshing dip.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <div className="relative h-48">
                        <Image
                          src="/placeholder.svg?height=300&width=500"
                          alt="Luxury Spa"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Palmtree className="h-5 w-5 text-primary" />
                          Luxury Spa
                        </CardTitle>
                        <CardDescription>
                          Open daily from 9:00 AM to 8:00 PM
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Indulge in our range of spa treatments designed to
                          rejuvenate your body and mind. From massages to
                          facials, our skilled therapists will ensure your
                          relaxation.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <div className="relative h-48">
                        <Image
                          src="/placeholder.svg?height=300&width=500"
                          alt="Fitness Center"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Dumbbell className="h-5 w-5 text-primary" />
                          Fitness Center
                        </CardTitle>
                        <CardDescription>Open 24 hours</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Stay fit during your stay with our state-of-the-art
                          fitness center featuring modern equipment, personal
                          trainers, and daily fitness classes.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Dining Section */}
                <div>
                  <h2 className="text-2xl font-bold mb-8 text-center">
                    Dining & Entertainment
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card>
                      <div className="relative h-48">
                        <Image
                          src="/placeholder.svg?height=300&width=500"
                          alt="Gourmet Restaurant"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Utensils className="h-5 w-5 text-primary" />
                          Azure Restaurant
                        </CardTitle>
                        <CardDescription>
                          Breakfast: 6:30 AM - 10:30 AM | Dinner: 6:00 PM -
                          10:30 PM
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Experience fine dining at our signature restaurant
                          featuring international cuisine prepared by our
                          award-winning chefs using locally sourced ingredients.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <div className="relative h-48">
                        <Image
                          src="/placeholder.svg?height=300&width=500"
                          alt="Rooftop Bar"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wine className="h-5 w-5 text-primary" />
                          Skyline Lounge
                        </CardTitle>
                        <CardDescription>
                          Open daily from 4:00 PM to 1:00 AM
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Enjoy handcrafted cocktails and panoramic views at our
                          rooftop bar. The perfect spot to unwind after a day of
                          exploration or business.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <div className="relative h-48">
                        <Image
                          src="/placeholder.svg?height=300&width=500"
                          alt="Café"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Coffee className="h-5 w-5 text-primary" />
                          Breeze Café
                        </CardTitle>
                        <CardDescription>
                          Open daily from 7:00 AM to 7:00 PM
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Our casual café offers light meals, pastries, and
                          specialty coffees throughout the day. Perfect for a
                          quick bite or informal meeting.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Services Section */}
                <div>
                  <h2 className="text-2xl font-bold mb-8 text-center">
                    Premium Services
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wifi className="h-5 w-5 text-primary" />
                          Complimentary Wi-Fi
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Stay connected with high-speed internet access
                          available throughout the hotel, including all guest
                          rooms and public areas.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Car className="h-5 w-5 text-primary" />
                          Valet Parking & Airport Transfer
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Enjoy convenient valet parking service and luxury
                          airport transfers upon request. Our concierge can
                          arrange transportation to any destination.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shirt className="h-5 w-5 text-primary" />
                          Laundry & Dry Cleaning
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Our express laundry and dry cleaning service ensures
                          your clothes are cleaned, pressed, and returned to
                          your room within 24 hours.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          24/7 Concierge
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Our dedicated concierge team is available around the
                          clock to assist with restaurant reservations, tour
                          bookings, and special requests.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-primary" />
                          Business Center
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Our fully equipped business center offers computers,
                          printing services, and private meeting rooms for your
                          professional needs.
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          Tour & Activity Planning
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Let us help you explore the area with customized tour
                          itineraries, activity recommendations, and exclusive
                          access to local attractions.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="wellness" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <Card>
                    <div className="relative h-48">
                      <Image
                        src="/placeholder.svg?height=300&width=500"
                        alt="Infinity Pool"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Waves className="h-5 w-5 text-primary" />
                        Infinity Pool
                      </CardTitle>
                      <CardDescription>
                        Open daily from 7:00 AM to 10:00 PM
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Our stunning infinity pool offers breathtaking views of
                        the surrounding landscape. Relax in the sun loungers or
                        take a refreshing dip.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <div className="relative h-48">
                      <Image
                        src="/placeholder.svg?height=300&width=500"
                        alt="Luxury Spa"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palmtree className="h-5 w-5 text-primary" />
                        Luxury Spa
                      </CardTitle>
                      <CardDescription>
                        Open daily from 9:00 AM to 8:00 PM
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Indulge in our range of spa treatments designed to
                        rejuvenate your body and mind. From massages to facials,
                        our skilled therapists will ensure your relaxation.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <div className="relative h-48">
                      <Image
                        src="/placeholder.svg?height=300&width=500"
                        alt="Fitness Center"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-primary" />
                        Fitness Center
                      </CardTitle>
                      <CardDescription>Open 24 hours</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Stay fit during your stay with our state-of-the-art
                        fitness center featuring modern equipment, personal
                        trainers, and daily fitness classes.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="dining" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <Card>
                    <div className="relative h-48">
                      <Image
                        src="/placeholder.svg?height=300&width=500"
                        alt="Gourmet Restaurant"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-primary" />
                        Azure Restaurant
                      </CardTitle>
                      <CardDescription>
                        Breakfast: 6:30 AM - 10:30 AM | Dinner: 6:00 PM - 10:30
                        PM
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Experience fine dining at our signature restaurant
                        featuring international cuisine prepared by our
                        award-winning chefs using locally sourced ingredients.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <div className="relative h-48">
                      <Image
                        src="/placeholder.svg?height=300&width=500"
                        alt="Rooftop Bar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wine className="h-5 w-5 text-primary" />
                        Skyline Lounge
                      </CardTitle>
                      <CardDescription>
                        Open daily from 4:00 PM to 1:00 AM
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Enjoy handcrafted cocktails and panoramic views at our
                        rooftop bar. The perfect spot to unwind after a day of
                        exploration or business.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <div className="relative h-48">
                      <Image
                        src="/placeholder.svg?height=300&width=500"
                        alt="Café"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Coffee className="h-5 w-5 text-primary" />
                        Breeze Café
                      </CardTitle>
                      <CardDescription>
                        Open daily from 7:00 AM to 7:00 PM
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Our casual café offers light meals, pastries, and
                        specialty coffees throughout the day. Perfect for a
                        quick bite or informal meeting.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="services" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wifi className="h-5 w-5 text-primary" />
                        Complimentary Wi-Fi
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Stay connected with high-speed internet access available
                        throughout the hotel, including all guest rooms and
                        public areas.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5 text-primary" />
                        Valet Parking & Airport Transfer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Enjoy convenient valet parking service and luxury
                        airport transfers upon request. Our concierge can
                        arrange transportation to any destination.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shirt className="h-5 w-5 text-primary" />
                        Laundry & Dry Cleaning
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Our express laundry and dry cleaning service ensures
                        your clothes are cleaned, pressed, and returned to your
                        room within 24 hours.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        24/7 Concierge
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Our dedicated concierge team is available around the
                        clock to assist with restaurant reservations, tour
                        bookings, and special requests.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        Business Center
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Our fully equipped business center offers computers,
                        printing services, and private meeting rooms for your
                        professional needs.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Tour & Activity Planning
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Let us help you explore the area with customized tour
                        itineraries, activity recommendations, and exclusive
                        access to local attractions.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2 space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">
                  Experience Luxury at Every Turn
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  At Apartamentos Verde Mar, we believe that exceptional
                  amenities and services are the foundation of an unforgettable
                  stay. From the moment you arrive until your departure, our
                  dedicated team is committed to providing you with the highest
                  level of comfort and convenience.
                </p>
                <p className="text-muted-foreground md:text-lg">
                  Whether you're traveling for business or leisure, our
                  comprehensive range of facilities ensures that all your needs
                  are met with the utmost care and attention to detail.
                </p>
                <Button size="lg" className="mt-2">
                  Book Your Stay
                </Button>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 right-4 bottom-4 border-2 border-primary rounded-lg" />
                  <Image
                    src="/placeholder.svg?height=500&width=600"
                    alt="Hotel amenities"
                    width={600}
                    height={500}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted">
        <div className="container px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold"
              >
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="Logo"
                  width={32}
                  height={32}
                />
                <span>Apartamentos Verde Mar</span>
              </Link>
              <p className="text-muted-foreground">
                Experience luxury and comfort in the heart of the city.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="rounded-full">
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
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
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
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span className="sr-only">Instagram</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
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
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Home
                </Link>
                <Link
                  href="/rooms"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Rooms & Suites
                </Link>
                <Link
                  href="/dining"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Dining
                </Link>
                <Link
                  href="/spa"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Spa & Wellness
                </Link>
                <Link
                  href="/events"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Events
                </Link>
                <Link
                  href="/gallery"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Gallery
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <address className="not-italic space-y-2 text-muted-foreground">
                <p>Camp D'es Pou 3877, Es Pujols </p>
                <p>+34 626 70 39 85</p>
                <p>aptosverdemar@gmail.com</p>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-muted-foreground mb-4">
                Subscribe to receive special offers and updates.
              </p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
                <Button className="w-full">Subscribe</Button>
              </form>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Apartamentos Verde Mar. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
