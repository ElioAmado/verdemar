"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  DownloadIcon,
  HomeIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  PrinterIcon,
  ShareIcon,
  UsersIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useLanguage } from "@/contexts/language-context"

export default function ConfirmationPage() {
  const {t} = useLanguage()
  const [bookingDetails, setBookingDetails] = useState({
    id: "BK-" + Math.floor(10000 + Math.random() * 90000),
    apartment: {
      id: 1,
      name: "Apartamento Premium",
      image: "/apartments/1/index.jpg",
    },
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    guests: 2,
    totalPrice: 1299,
    client: {
      name: "Cliente",
      lastName: "Ejemplo",
      email: "cliente@ejemplo.com",
      phone: "+34 123 456 789",
    },
  })

  // Formatear fechas para mostrar
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  // Calcular duración de la estancia
  const calculateStayDuration = () => {
    const start = new Date(bookingDetails.startDate)
    const end = new Date(bookingDetails.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          {/* Success Message */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle2Icon className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">¡Reserva Confirmada!</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Gracias por tu reserva. Hemos enviado un correo electrónico de confirmación
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Booking Reference */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalles de la Reserva</CardTitle>
                  <CardDescription>Referencia: {bookingDetails.id}</CardDescription>
                </CardHeader>
                {/*<CardContent className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Check-in</div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <span className="font-medium">{formatDate(bookingDetails.startDate)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">A partir de las 15:00h</div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Check-out</div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <span className="font-medium">{formatDate(bookingDetails.endDate)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Hasta las 11:00h</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Duración de la estancia</div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4 text-primary" />
                        <span className="font-medium">{calculateStayDuration()} noches</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Huéspedes</div>
                      <div className="flex items-center gap-2">
                        <UsersIcon className="h-4 w-4 text-primary" />
                        <span className="font-medium">{bookingDetails.guests} personas</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Alojamiento</div>
                    <div className="flex items-center gap-2">
                      <HomeIcon className="h-4 w-4 text-primary" />
                      <span className="font-medium">{bookingDetails.apartment.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Calle Principal 123, Ciudad, CP 12345</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Información del cliente</div>
                    <div className="font-medium">
                      {bookingDetails.client.name} {bookingDetails.client.lastName}
                    </div>
                    <div className="flex items-center gap-2">
                      <MailIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{bookingDetails.client.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{bookingDetails.client.phone}</span>
                    </div>
                  </div>
                </CardContent> */}
                <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <PrinterIcon className="h-4 w-4" />
                      Imprimir
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <DownloadIcon className="h-4 w-4" />
                      Descargar PDF
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <ShareIcon className="h-4 w-4" />
                      Compartir
                    </Button>
                  </div>
                  <Badge variant="outline" className="px-3 py-1">
                    Confirmada
                  </Badge>
                </CardFooter>
              </Card>

              {/* What's Next */}
              <Card>
                <CardHeader>
                  <CardTitle>¿Qué sigue ahora?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Antes de tu llegada</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            Recibirás un correo electrónico con instrucciones detalladas para el check-in 24 horas antes
                            de tu llegada.
                          </li>
                          <li>Prepara tu identificación (DNI o pasaporte) para el registro.</li>
                          <li>
                            Si necesitas transporte desde el aeropuerto, contáctanos con al menos 48 horas de
                            antelación.
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Durante tu estancia</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Nuestro equipo de recepción está disponible 24/7 para cualquier consulta.</li>
                          <li>
                            Wifi gratuito disponible en todo el establecimiento (contraseña en la carpeta de
                            información).
                          </li>
                          <li>Servicio de limpieza diario incluido en tu reserva.</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Política de cancelación</AccordionTrigger>
                      <AccordionContent>
                        <p>
                          Cancelación gratuita hasta 48 horas antes de la llegada. Después de este período, se cobrará
                          el importe total de la reserva.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>¿Necesitas ayuda?</CardTitle>
                  <CardDescription>Estamos aquí para asistirte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="font-medium">Atención al cliente</div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4 text-primary" />
                        <span>{t("common.phone")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MailIcon className="h-4 w-4 text-primary" />
                        <span>{t("common.email")}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium">Emergencias 24/7</div>
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4 text-primary" />
                        <span>{t("common.phone_24h")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Contactar ahora
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* <Card>
                <Image
                  src={bookingDetails.apartment.image || "/placeholder.svg"}
                  alt={bookingDetails.apartment.name}
                  width={600}
                  height={400}
                  className="rounded-t-md object-cover"
                />
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <h2 className="text-xl font-semibold">{bookingDetails.apartment.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Ciudad, España</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Precio por noche</span>
                      <span>${(bookingDetails.totalPrice / calculateStayDuration()).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">x {calculateStayDuration()} noches</span>
                      <span>${bookingDetails.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Impuestos (incluidos)</span>
                      <span>${(bookingDetails.totalPrice * 0.21).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total pagado</span>
                      <span>${bookingDetails.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button variant="default" className="w-full">
                      Modificar reserva
                    </Button>
                  </div>
                </CardContent>
              </Card> */}

              <Card>
                <CardHeader>
                  <CardTitle>¿Qué te gustaría hacer?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <HomeIcon className="h-4 w-4" />
                    Volver al inicio
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Ver mis reservas
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    Explorar actividades
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Volver a la página principal
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
