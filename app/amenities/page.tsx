import Link from 'next/link';
import Image from 'next/image';
import {
  Wifi,
  Coffee,
  Tv,
  Snowflake,
  Utensils,
  Car,
  Shirt,
  MapPin,
  Users,
  Lock,
  Home,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';

export default function AmenitiesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-muted py-12">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-3xl font-bold sm:text-5xl mb-4">
              Servicios de Apartamentos Verde Mar
            </h1>
            <p className="text-muted-foreground md:text-lg max-w-xl mx-auto">
              Descubre todos los servicios que ofrecemos para hacer tu estancia cómoda y agradable en Es Pujols, Formentera.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-primary" />
                  WiFi gratis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Conexión gratuita en todo el alojamiento.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coffee className="h-5 w-5 text-primary" />
                  Cafetera
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Cafetera disponible en todos los apartamentos.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tv className="h-5 w-5 text-primary" />
                  TV de pantalla plana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Con canales vía satélite.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Snowflake className="h-5 w-5 text-primary" />
                  Aire acondicionado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Disponible en todos los alojamientos.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-primary" />
                  Cocina equipada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Incluye nevera, microondas y utensilios.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Parking gratis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Aparcamiento privado gratuito en las inmediaciones.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shirt className="h-5 w-5 text-primary" />
                  Servicio de lavandería
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Disponible bajo petición y con coste adicional.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Ubicación excelente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>A sólo 300 metros de la playa de Es Pujols.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Personal multilingüe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Atención en español, inglés e italiano.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Caja fuerte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Disponible para proteger tus pertenencias de valor.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Apartamentos familiares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Ideales para familias, con espacios amplios y cómodos.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
