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

export default function RoomsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-muted py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Our Rooms & Suites
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Discover our selection of luxurious accommodations designed
                  for your comfort and relaxation.
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
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Check-in / Check-out
                    </label>
                    <DatePickerWithRange />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Room Type
                    </label>
                    <RoomTypeSelector />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Guests
                    </label>
                    <GuestCounter />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">Search Availability</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Deluxe Room"
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Deluxe Room</CardTitle>
                  <CardDescription>
                    Perfect for solo travelers or couples
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <UsersIcon className="h-4 w-4" />
                      <span>2 Guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <StarIcon className="h-4 w-4 fill-primary" />
                      <span>4.8 (120 reviews)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>• King-size bed</div>
                      <div>• 35 m²</div>
                      <div>• City view</div>
                      <div>• Free WiFi</div>
                      <div>• Air conditioning</div>
                      <div>• Flat-screen TV</div>
                    </div>
                    <p className="text-2xl font-bold">
                      $199
                      <span className="text-sm font-normal text-muted-foreground">
                        /night
                      </span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Book Now</Button>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Executive Suite"
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Executive Suite</CardTitle>
                  <CardDescription>
                    Spacious accommodation with separate living area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <UsersIcon className="h-4 w-4" />
                      <span>3 Guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <StarIcon className="h-4 w-4 fill-primary" />
                      <span>4.9 (85 reviews)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>• King-size bed</div>
                      <div>• 55 m²</div>
                      <div>• Ocean view</div>
                      <div>• Free WiFi</div>
                      <div>• Living room</div>
                      <div>• Mini bar</div>
                    </div>
                    <p className="text-2xl font-bold">
                      $299
                      <span className="text-sm font-normal text-muted-foreground">
                        /night
                      </span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Book Now</Button>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Presidential Suite"
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Presidential Suite</CardTitle>
                  <CardDescription>
                    Our most luxurious accommodation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <UsersIcon className="h-4 w-4" />
                      <span>4 Guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <StarIcon className="h-4 w-4 fill-primary" />
                      <span>5.0 (42 reviews)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>• King-size bed</div>
                      <div>• 120 m²</div>
                      <div>• Panoramic view</div>
                      <div>• Private terrace</div>
                      <div>• Jacuzzi</div>
                      <div>• Butler service</div>
                    </div>
                    <p className="text-2xl font-bold">
                      $499
                      <span className="text-sm font-normal text-muted-foreground">
                        /night
                      </span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Book Now</Button>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Family Room"
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Family Room</CardTitle>
                  <CardDescription>
                    Comfortable space for the whole family
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <UsersIcon className="h-4 w-4" />
                      <span>5 Guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <StarIcon className="h-4 w-4 fill-primary" />
                      <span>4.7 (63 reviews)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>• 2 Queen beds</div>
                      <div>• 65 m²</div>
                      <div>• Garden view</div>
                      <div>• Free WiFi</div>
                      <div>• Kitchenette</div>
                      <div>• Game console</div>
                    </div>
                    <p className="text-2xl font-bold">
                      $349
                      <span className="text-sm font-normal text-muted-foreground">
                        /night
                      </span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Book Now</Button>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Ocean View Room"
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Ocean View Room</CardTitle>
                  <CardDescription>
                    Wake up to stunning ocean views
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <UsersIcon className="h-4 w-4" />
                      <span>2 Guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <StarIcon className="h-4 w-4 fill-primary" />
                      <span>4.9 (92 reviews)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>• Queen-size bed</div>
                      <div>• 40 m²</div>
                      <div>• Ocean view</div>
                      <div>• Private balcony</div>
                      <div>• Rain shower</div>
                      <div>• Breakfast included</div>
                    </div>
                    <p className="text-2xl font-bold">
                      $249
                      <span className="text-sm font-normal text-muted-foreground">
                        /night
                      </span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Book Now</Button>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Honeymoon Suite"
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader>
                  <CardTitle>Honeymoon Suite</CardTitle>
                  <CardDescription>
                    Romantic setting for special occasions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <UsersIcon className="h-4 w-4" />
                      <span>2 Guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <StarIcon className="h-4 w-4 fill-primary" />
                      <span>5.0 (76 reviews)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>• King-size bed</div>
                      <div>• 70 m²</div>
                      <div>• Panoramic view</div>
                      <div>• Private hot tub</div>
                      <div>• Champagne service</div>
                      <div>• Couples massage</div>
                    </div>
                    <p className="text-2xl font-bold">
                      $399
                      <span className="text-sm font-normal text-muted-foreground">
                        /night
                      </span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Book Now</Button>
                </CardFooter>
              </Card>
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
