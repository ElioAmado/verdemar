"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronRightIcon, MapPinIcon, StarIcon, UsersIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { RoomTypeSelector } from "@/components/room-type-selector"
import { GuestCounter } from "@/components/guest-counter"
import { SiteHeader } from "@/components/site-header"
import { useLanguage } from "@/contexts/language-context"

export default function Home() {
  const { t } = useLanguage()

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
                {t("home.hero.title")}
              </h1>
              <p className="mx-auto max-w-[700px] text-white/90 md:text-xl mt-4">{t("home.hero.subtitle")}</p>
              <div className="mt-8">
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  {t("home.hero.cta")}
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
                      {t("home.search.checkIn")}
                    </label>
                    <DatePickerWithRange />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t("home.search.roomType")}
                    </label>
                    <RoomTypeSelector />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t("home.search.guests")}
                    </label>
                    <GuestCounter />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">{t("home.search.search")}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container px-4 md:px-6 py-24 mt-20">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Accommodations</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t("home.rooms.title")}</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t("home.rooms.subtitle")}
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Deluxe Room"
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{t("roomSelector.deluxe")}</CardTitle>
                <CardDescription>Perfect for solo travelers or couples</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <UsersIcon className="h-4 w-4" />
                  <span>2 {t("home.rooms.guests")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <StarIcon className="h-4 w-4 fill-primary" />
                  <span>4.8 (120 {t("home.rooms.reviews")})</span>
                </div>
                <p className="text-2xl font-bold mt-4">
                  $199<span className="text-sm font-normal text-muted-foreground">{t("home.rooms.night")}</span>
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">{t("common.bookNow")}</Button>
              </CardFooter>
            </Card>
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Executive Suite"
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{t("roomSelector.executive")}</CardTitle>
                <CardDescription>Spacious accommodation with separate living area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <UsersIcon className="h-4 w-4" />
                  <span>3 {t("home.rooms.guests")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <StarIcon className="h-4 w-4 fill-primary" />
                  <span>4.9 (85 {t("home.rooms.reviews")})</span>
                </div>
                <p className="text-2xl font-bold mt-4">
                  $299<span className="text-sm font-normal text-muted-foreground">{t("home.rooms.night")}</span>
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">{t("common.bookNow")}</Button>
              </CardFooter>
            </Card>
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="Presidential Suite"
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle>{t("roomSelector.presidential")}</CardTitle>
                <CardDescription>Our most luxurious accommodation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <UsersIcon className="h-4 w-4" />
                  <span>4 {t("home.rooms.guests")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <StarIcon className="h-4 w-4 fill-primary" />
                  <span>5.0 (42 {t("home.rooms.reviews")})</span>
                </div>
                <p className="text-2xl font-bold mt-4">
                  $499<span className="text-sm font-normal text-muted-foreground">{t("home.rooms.night")}</span>
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">{t("common.bookNow")}</Button>
              </CardFooter>
            </Card>
          </div>
          <div className="flex justify-center mt-12">
            <Button variant="outline" className="gap-2">
              {t("home.rooms.viewAll")}
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="bg-muted py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Hotel Amenities</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t("home.amenities.title")}</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t("home.amenities.subtitle")}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
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
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">{t("home.amenities.spa")}</h3>
                <p className="text-muted-foreground">{t("home.amenities.spaDesc")}</p>
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
                    <path d="M2 12h20" />
                    <path d="M2 12a10 10 0 0 1 20 0" />
                    <path d="M2 12a10 10 0 0 0 20 0" />
                    <path d="M12 2v20" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">{t("home.amenities.pool")}</h3>
                <p className="text-muted-foreground">{t("home.amenities.poolDesc")}</p>
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
                    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                    <line x1="6" x2="18" y1="17" y2="17" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">{t("home.amenities.dining")}</h3>
                <p className="text-muted-foreground">{t("home.amenities.diningDesc")}</p>
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
                <h3 className="text-xl font-bold">{t("home.amenities.service")}</h3>
                <p className="text-muted-foreground">{t("home.amenities.serviceDesc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Continue with the rest of the page... */}
      </main>
      <footer className="border-t bg-muted">
        <div className="container px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                <Image src="/placeholder.svg?height=32&width=32" alt="Logo" width={32} height={32} />
                <span>LuxStay Hotel</span>
              </Link>
              <p className="text-muted-foreground">Experience luxury and comfort in the heart of the city.</p>
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
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  {t("common.home")}
                </Link>
                <Link href="/rooms" className="text-muted-foreground hover:text-foreground">
                  {t("common.rooms")}
                </Link>
                <Link href="/dining" className="text-muted-foreground hover:text-foreground">
                  Dining
                </Link>
                <Link href="/spa" className="text-muted-foreground hover:text-foreground">
                  Spa & Wellness
                </Link>
                <Link href="/events" className="text-muted-foreground hover:text-foreground">
                  Events
                </Link>
                <Link href="/gallery" className="text-muted-foreground hover:text-foreground">
                  {t("common.gallery")}
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <address className="not-italic space-y-2 text-muted-foreground">
                <p className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  123 Luxury Avenue, City Center
                </p>
                <p className="flex items-center gap-2">
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
                    className="h-4 w-4"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  +1 (123) 456-7890
                </p>
                <p className="flex items-center gap-2">
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
                    className="h-4 w-4"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  info@luxstayhotel.com
                </p>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-muted-foreground mb-4">Subscribe to receive special offers and updates.</p>
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
            <p>{t("common.footer.copyright", { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
