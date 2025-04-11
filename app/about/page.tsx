import Link from "next/link"
import Image from "next/image"
import { Award, Clock, Heart, MapPin, Star, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative h-[400px]">
            <Image
              src="/placeholder.svg?height=400&width=1920"
              alt="Hotel exterior"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container px-4 md:px-6 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
                About LuxStay Hotel
              </h1>
              <p className="mx-auto max-w-[700px] text-white/90 md:text-xl mt-4">
                A legacy of luxury and exceptional hospitality since 1995
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Story</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">A Tradition of Excellence</h2>
                <p className="text-muted-foreground md:text-lg">
                  Founded in 1995 by the visionary hotelier Jonathan Maxwell, LuxStay Hotel began as a boutique
                  establishment with just 20 rooms. With a commitment to personalized service and attention to detail,
                  the hotel quickly gained a reputation for excellence.
                </p>
                <p className="text-muted-foreground md:text-lg">
                  Over the years, we've expanded our facilities while maintaining the intimate atmosphere and
                  personalized service that made us famous. Today, LuxStay Hotel stands as a symbol of luxury
                  hospitality, welcoming guests from around the world.
                </p>
                <p className="text-muted-foreground md:text-lg">
                  Our philosophy is simple: create memorable experiences through exceptional service, luxurious
                  accommodations, and attention to every detail. This commitment has earned us numerous accolades and
                  the loyalty of our guests, many of whom return year after year.
                </p>
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 right-4 bottom-4 border-2 border-primary rounded-lg" />
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Hotel founder"
                  width={600}
                  height={600}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Our Values</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">What Drives Us</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-lg">
                  Our core values guide every decision we make and every interaction we have with our guests.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-background">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Excellence</h3>
                  <p className="text-muted-foreground">
                    We strive for excellence in everything we do, from the cleanliness of our rooms to the quality of
                    our service.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Passion</h3>
                  <p className="text-muted-foreground">
                    Our team is passionate about hospitality and dedicated to creating memorable experiences for every
                    guest.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Respect</h3>
                  <p className="text-muted-foreground">
                    We treat our guests, our team members, and our environment with the utmost respect and
                    consideration.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Innovation</h3>
                  <p className="text-muted-foreground">
                    We continuously seek new ways to enhance our services and facilities to exceed our guests'
                    expectations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Team</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Meet the Leadership</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-lg">
                  Our experienced leadership team is dedicated to upholding our tradition of excellence.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-48 h-48 rounded-full overflow-hidden">
                  <Image src="/placeholder.svg?height=200&width=200&text=CEO" alt="CEO" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Emily Richardson</h3>
                  <p className="text-primary">Chief Executive Officer</p>
                  <p className="text-muted-foreground mt-2">
                    With over 20 years of experience in luxury hospitality, Emily leads our team with vision and
                    passion.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-48 h-48 rounded-full overflow-hidden">
                  <Image src="/placeholder.svg?height=200&width=200&text=COO" alt="COO" fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Michael Chen</h3>
                  <p className="text-primary">Chief Operations Officer</p>
                  <p className="text-muted-foreground mt-2">
                    Michael ensures that every aspect of our operations meets our high standards of excellence.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-48 h-48 rounded-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=200&text=Chef"
                    alt="Executive Chef"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Sofia Martinez</h3>
                  <p className="text-primary">Executive Chef</p>
                  <p className="text-muted-foreground mt-2">
                    Award-winning chef Sofia creates culinary masterpieces that delight our guests' palates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Milestones</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Journey</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-lg">
                  Key moments in our history that have shaped LuxStay Hotel into what it is today.
                </p>
              </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="w-px h-full bg-border mt-2"></div>
                </div>
                <div className="space-y-2 pb-8">
                  <h3 className="text-xl font-bold">1995</h3>
                  <p className="text-muted-foreground">
                    LuxStay Hotel opens its doors with 20 rooms, founded by Jonathan Maxwell with a vision to create a
                    new standard in luxury hospitality.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="w-px h-full bg-border mt-2"></div>
                </div>
                <div className="space-y-2 pb-8">
                  <h3 className="text-xl font-bold">2003</h3>
                  <p className="text-muted-foreground">
                    Major expansion adds 50 more rooms, a luxury spa, and our signature Azure Restaurant, establishing
                    LuxStay as a premier destination.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="w-px h-full bg-border mt-2"></div>
                </div>
                <div className="space-y-2 pb-8">
                  <h3 className="text-xl font-bold">2010</h3>
                  <p className="text-muted-foreground">
                    LuxStay receives its first five-star rating and begins international expansion with properties in
                    major European cities.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="w-px h-full bg-border mt-2"></div>
                </div>
                <div className="space-y-2 pb-8">
                  <h3 className="text-xl font-bold">2018</h3>
                  <p className="text-muted-foreground">
                    Complete renovation of our flagship property introduces cutting-edge technology while preserving our
                    classic elegance.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Today</h3>
                  <p className="text-muted-foreground">
                    LuxStay Hotel Group now comprises 15 properties worldwide, each embodying our commitment to luxury,
                    comfort, and exceptional service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2 space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Location</div>
                <h2 className="text-3xl font-bold tracking-tighter">Perfectly Situated</h2>
                <p className="text-muted-foreground md:text-lg">
                  Located in the heart of the city, LuxStay Hotel offers easy access to major attractions, business
                  districts, and transportation hubs.
                </p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>123 Luxury Avenue, City Center</span>
                </div>
                <p className="text-muted-foreground">
                  Just 20 minutes from International Airport and a 5-minute walk to Central Station, our location
                  combines convenience with the tranquility of our beautifully landscaped grounds.
                </p>
                <Button className="mt-2">Get Directions</Button>
              </div>
              <div className="md:w-1/2">
                <div className="aspect-video relative rounded-xl overflow-hidden border">
                  <Image
                    src="/placeholder.svg?height=400&width=600&text=Map"
                    alt="Hotel location map"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Experience Our Legacy of Luxury</h2>
            <p className="max-w-[700px] mx-auto md:text-lg mb-8">
              Join the thousands of guests who have made LuxStay Hotel their home away from home.
            </p>
            <Button size="lg" variant="secondary">
              Book Your Stay
            </Button>
          </div>
        </section>
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
                  Home
                </Link>
                <Link href="/rooms" className="text-muted-foreground hover:text-foreground">
                  Rooms & Suites
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
                  Gallery
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <address className="not-italic space-y-2 text-muted-foreground">
                <p>123 Luxury Avenue, City Center</p>
                <p>+1 (123) 456-7890</p>
                <p>info@luxstayhotel.com</p>
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
            <p>&copy; {new Date().getFullYear()} LuxStay Hotel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
