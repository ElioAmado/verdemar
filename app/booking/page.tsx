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

import { getBookingById, Booking, updateBooking } from "@/api/booking";
import { useLanguage } from "@/contexts/language-context";
import { useRouter } from "next/navigation";
import { Client, createClient } from "@/api/client";
import handleStripeCheckout from "./component/handleStripeCheckout";

export default function BookingPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [clientInfo, setClientInfo] = useState<Client>({
    name: "",
    lastName: "",
    email: "",
    phone: "",
  });


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

  const handleConfirmBooking = async () => {
    try {
      if (!booking) return;

      // 1. Crear el cliente
      const newClient = await createClient(clientInfo);

      // 2. Actualizar la reserva con el cliente y confirmar
      const updatedBooking = {
        ...booking,
        status: "CONFIRMED",
        apartmentId: booking.apartment?.id, // o booking.apartment si tu API lo acepta así
        clientId: newClient.id, // o client: newClient si tu API lo acepta así
      };

      await updateBooking(updatedBooking.id!, updatedBooking);
      localStorage.removeItem("pendingBookingId");
      router.push("/confirmation");
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("There was a problem confirming your booking.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-muted-foreground">
        Loading booking...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center mt-20 text-destructive">
        Booking not found.
      </div>
    );
  }

  if (!booking.apartment) {
    return (
      <div className="text-center mt-20 text-destructive">
        Apartment details not found for booking.
      </div>
    );
  }

  const apt = booking.apartment;
  const roomDetails = {
    id: apt.id ?? 0,
    name: "Apartamento " + apt.id,
    description: "Spacious accommodation with separate living area",
    price: 299,
    image: `/apartments/${apt.id}/index.jpg`,
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

              {/* Stay Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Stay Details</CardTitle>
                  <CardDescription>
                    Confirm your dates and guest information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Check-in / Check-out</Label>
                      <DatePickerWithRange
                        readOnly
                        initialRange={{
                          from: new Date(booking.startDate),
                          to: new Date(booking.endDate),
                        }}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Guests</Label>
                      <div className="flex items-center gap-2 text-base font-medium">
                        <UsersIcon className="h-4 w-4 text-primary" />
                        <span>{booking?.guests}</span>
                      </div>
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

              {/* Guest Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Guest Information</CardTitle>
                  <CardDescription>Enter your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="Enter your first name"
                        value={clientInfo.name}
                        onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Enter your last name"
                        value={clientInfo.lastName}
                        onChange={(e) => setClientInfo({ ...clientInfo, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={clientInfo.email}
                        onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        value={clientInfo.phone}
                        onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  if (booking?.totalPrice && booking?.id) {
                    handleStripeCheckout(booking.totalPrice, booking.id.toString());
                  } else {
                    alert("Booking is missing total price or ID.");
                  }
                }}
              >
                Confirm Booking
              </Button>

            </div>

            {/* Sidebar */}
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
                    <span>
                      {roomDetails.rating} ({roomDetails.reviews} reviews)
                    </span>
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
