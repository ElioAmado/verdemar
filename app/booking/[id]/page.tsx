import Link from "next/link"
import Image from "next/image"
import { ArrowLeftIcon, CalendarIcon, CreditCardIcon, MapPinIcon, StarIcon, UsersIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { GuestCounter } from "@/components/guest-counter"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { SiteHeader } from "@/components/site-header"

export default function BookingPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the room details based on the ID
  const roomDetails = {
    id: params.id,
    name: "Executive Suite",
    description: "Spacious accommodation with separate living area",
    price: 299,
    image: "/placeholder.svg?height=400&width=600",
    capacity: 3,
    rating: 4.9,
    reviews: 85,
    features: ["King-size bed", "55 m²", "Ocean view", "Free WiFi", "Living room", "Mini bar"],
  }

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
              Back to Rooms
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Complete Your Booking</h1>
                <p className="text-muted-foreground mt-2">Please fill in your details to confirm your reservation.</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Your Stay Details</CardTitle>
                  <CardDescription>Confirm your dates and guest information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Check-in / Check-out</Label>
                      <DatePickerWithRange />
                    </div>
                    <div className="space-y-2">
                      <Label>Guests</Label>
                      <GuestCounter />
                    </div>
                  </div>

                  <div>
                    <Label>Special Requests (Optional)</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                      placeholder="Let us know if you have any special requests or requirements"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Guest Information</CardTitle>
                  <CardDescription>Enter your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Enter your address" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" placeholder="State/Province" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">Zip/Postal Code</Label>
                      <Input id="zip" placeholder="Zip/Postal Code" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="Country" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>Secure payment processing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup defaultValue="card" className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2">
                        <CreditCardIcon className="h-4 w-4" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name-on-card">Name on Card</Label>
                      <Input id="name-on-card" placeholder="Enter the name on your card" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="save-card" />
                    <Label htmlFor="save-card">Save card for future bookings</Label>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary underline">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button size="lg" className="w-full">
                  Complete Booking
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Your credit card will not be charged until check-in. Cancellation policy applies.
                </p>
              </div>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                  <CardDescription>Review your reservation details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={roomDetails.image || "/placeholder.svg"}
                        alt={roomDetails.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{roomDetails.name}</h3>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <StarIcon className="h-4 w-4 fill-primary" />
                        <span>
                          {roomDetails.rating} ({roomDetails.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <UsersIcon className="h-4 w-4" />
                        <span>Up to {roomDetails.capacity} Guests</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Apr 2 - Apr 9, 2025 (7 nights)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <UsersIcon className="h-4 w-4" />
                      <span>2 Adults, 1 Child</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPinIcon className="h-4 w-4" />
                      <span>123 Luxury Avenue, City Center</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">${roomDetails.price} x 7 nights</span>
                      <span>${roomDetails.price * 7}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes (12%)</span>
                      <span>${Math.round(roomDetails.price * 7 * 0.12)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service fee</span>
                      <span>$150</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${roomDetails.price * 7 + Math.round(roomDetails.price * 7 * 0.12) + 150}</span>
                  </div>

                  <div className="bg-muted p-3 rounded-md text-sm">
                    <p className="font-medium">Cancellation Policy</p>
                    <p className="text-muted-foreground mt-1">
                      Free cancellation until 48 hours before check-in. After that, the first night is non-refundable.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-muted">
        <div className="container px-4 md:px-6 py-6">
          <div className="text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} LuxStay Hotel. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
