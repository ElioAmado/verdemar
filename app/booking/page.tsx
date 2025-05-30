"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CreditCardIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { GuestCounter } from "@/components/guest-counter";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { SiteHeader } from "@/components/site-header";

import { getBookingById, Booking } from "@/api/booking";
import { useLanguage } from "@/contexts/language-context";

export default function BookingPage() {
  const { t } = useLanguage();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState({ adults: 1, children: 0 });

  useEffect(() => {
    async function fetchBooking() {
      const storedId = localStorage.getItem("pendingBookingId");
      if (!storedId) {
        setLoading(false);
        return;
      }

      const id = Number(storedId);
      if (isNaN(id)) {
        setLoading(false);
        return;
      }

      try {
        const bookingData = await getBookingById(id);
        setBooking(bookingData);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, []);

  console.log("Booking data:", booking);
  // Datos ficticios de habitación para el ejemplo (puedes traer los reales según booking.apartmentId)
  const roomDetails = {
    id: booking?.apartment.id ?? 0,
    name: "Apartamento " + booking?.apartment.id,
    description: "Spacious accommodation with separate living area",
    price: 299,
    image: "/placeholder.svg?height=400&width=600",
    capacity: 3,
    rating: 4.9,
    reviews: 85,
    features: [
      "King-size bed",
      "55 m²",
      "Ocean view",
      "Free WiFi",
      "Living room",
      "Mini bar",
    ],
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
              Back to Rooms
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
<h1 className="text-3xl font-bold tracking-tight">
  {t("booking.title")}
</h1>
<p className="text-muted-foreground mt-2">
  {t("booking.subtitle")}
</p>

              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Your Stay Details</CardTitle>
                  <CardDescription>
                    Confirm your dates and guest information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Aquí podrías pasar props a DatePickerWithRange y GuestCounter para mostrar datos iniciales si quieres */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Check-in / Check-out</Label>
                      <DatePickerWithRange
                        // Aquí podrías manejar fechas con estado, por ejemplo:
                        // initialRange={{ startDate: new Date(booking?.startDate), endDate: new Date(booking?.endDate) }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Guests</Label>
                       <GuestCounter value={guests} onChange={setGuests} />
                    </div>
                  </div>

                  <div>
                    <Label>Special Requests (Optional)</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                      placeholder="Let us know if you have any special requests or requirements"
                      defaultValue={booking?.notes || ""}
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
                  {/* Aquí puedes precargar campos si tienes datos del cliente */}
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
                      <Input id="name-on-card" placeholder="Name as on card" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full" size="lg">
                Confirm Booking
              </Button>
            </div>

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
                    <h2 className="text-xl font-semibold">{roomDetails.name}</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      {roomDetails.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span>{roomDetails.rating} ({roomDetails.reviews} reviews)</span>
                  </div>

                  <div className="text-lg font-semibold">
                    ${booking?.totalPrice ?? roomDetails.price} total
                  </div>

                  <Separator />

                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {roomDetails.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
