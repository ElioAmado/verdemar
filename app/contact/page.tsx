import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-muted py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contact Us</h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  We're here to assist you with any questions or special requests you may have.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Enter your last name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Enter your phone number" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="What is your message regarding?" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide details about your inquiry"
                      className="min-h-[150px]"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold">Address</h3>
                        <p className="text-muted-foreground">123 Luxury Avenue, City Center</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold">Phone</h3>
                        <p className="text-muted-foreground">+1 (123) 456-7890</p>
                        <p className="text-muted-foreground">Reservations: +1 (123) 456-7891</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold">Email</h3>
                        <p className="text-muted-foreground">info@luxstayhotel.com</p>
                        <p className="text-muted-foreground">reservations@luxstayhotel.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6">Our Location</h2>
                  <div className="aspect-video relative rounded-xl overflow-hidden border">
                    <Image
                      src="/placeholder.svg?height=400&width=600&text=Map"
                      alt="Hotel location map"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6">Hours of Operation</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Front Desk</span>
                      <span className="text-muted-foreground">24 hours, 7 days a week</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Concierge</span>
                      <span className="text-muted-foreground">7:00 AM - 11:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Azure Restaurant</span>
                      <span className="text-muted-foreground">6:30 AM - 10:30 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Skyline Lounge</span>
                      <span className="text-muted-foreground">4:00 PM - 1:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Spa & Wellness</span>
                      <span className="text-muted-foreground">9:00 AM - 8:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter">Frequently Asked Questions</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-lg">
                  Find quick answers to common questions about our hotel and services.
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
                    <CardTitle>What are your check-in and check-out times?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Check-in time is 3:00 PM and check-out time is 12:00 PM. Early check-in and late check-out may be
                      available upon request, subject to availability and additional charges.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Is airport transportation available?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Yes, we offer airport transportation services for our guests. Please contact our concierge at
                      least 24 hours in advance to arrange pickup or drop-off.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Do you have parking facilities?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Yes, we offer both self-parking and valet parking options. Self-parking is $25 per day, while
                      valet parking is $35 per day with unlimited in-and-out privileges.
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
                      Reservations can be made through our website, by calling our reservations line at +1 (123)
                      456-7891, or by emailing reservations@luxstayhotel.com.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>What is your cancellation policy?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Our standard cancellation policy allows for free cancellation up to 48 hours before check-in.
                      Cancellations made within 48 hours of arrival may be subject to a charge equivalent to one night's
                      stay.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Do you require a deposit?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      A credit card is required to secure your reservation, but no charges will be made until check-in
                      unless specified by a special rate or promotion.
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
                      Yes, complimentary high-speed Wi-Fi is available throughout the hotel, including all guest rooms
                      and public areas.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Do you have a fitness center?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Yes, our state-of-the-art fitness center is open 24 hours a day and features modern cardio and
                      strength training equipment, as well as daily fitness classes.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Is breakfast included with the room?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Breakfast is included with some room rates. Please check your reservation details or contact our
                      reservations team to add a breakfast package to your stay.
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
                      Yes, we welcome pets under 25 pounds with a non-refundable fee of $75 per stay. Please notify us
                      in advance if you plan to bring a pet.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>What is your smoking policy?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      LuxStay Hotel is a 100% non-smoking property. Smoking is not permitted in any guest rooms or
                      public areas. A cleaning fee of $250 will be charged for smoking in non-designated areas.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Do you have accessible rooms?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Yes, we offer ADA-compliant rooms with various accessibility features. Please specify your
                      requirements when making a reservation to ensure we can accommodate your needs.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Need Immediate Assistance?</h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg mb-8">
              Our dedicated team is available 24/7 to assist with urgent inquiries.
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
