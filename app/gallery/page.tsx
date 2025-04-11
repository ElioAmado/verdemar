import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"

export default function GalleryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-muted py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Photo Gallery</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Explore our luxurious hotel through our carefully curated collection of images.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full max-w-2xl">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="rooms">Rooms & Suites</TabsTrigger>
                  <TabsTrigger value="dining">Dining</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="exterior">Exterior</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={`all-${i}`} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={`/placeholder.svg?height=600&width=600&text=Gallery+Image+${i + 1}`}
                        alt={`Gallery image ${i + 1}`}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="rooms" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`room-${i}`} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={`/placeholder.svg?height=600&width=600&text=Room+Image+${i + 1}`}
                        alt={`Room image ${i + 1}`}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="dining" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`dining-${i}`} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={`/placeholder.svg?height=600&width=600&text=Dining+Image+${i + 1}`}
                        alt={`Dining image ${i + 1}`}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`amenity-${i}`} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={`/placeholder.svg?height=600&width=600&text=Amenity+Image+${i + 1}`}
                        alt={`Amenity image ${i + 1}`}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="exterior" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`exterior-${i}`} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={`/placeholder.svg?height=600&width=600&text=Exterior+Image+${i + 1}`}
                        alt={`Exterior image ${i + 1}`}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-12 bg-muted">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Experience the Luxury in Person</h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg mb-8">
              Photos can only capture a glimpse of what we offer. Visit us to experience the true luxury and comfort of
              LuxStay Hotel.
            </p>
            <Button size="lg">Book Your Stay Now</Button>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Virtual Tour</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Take a virtual walk through our hotel and explore our facilities from the comfort of your home.
              </p>
            </div>

            <div className="aspect-video relative rounded-xl overflow-hidden border">
              <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                <Button size="lg" className="gap-2">
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
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Start Virtual Tour
                </Button>
              </div>
              <Image
                src="/placeholder.svg?height=600&width=1200&text=Virtual+Tour"
                alt="Virtual tour thumbnail"
                fill
                className="object-cover"
              />
            </div>
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
