'use client';
import { amenities } from '@/consts/amenities';
import { useLanguage } from '@/contexts/language-context';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function AmenitiesPage() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted py-12">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-3xl font-bold sm:text-5xl mb-4">
              {t('home.amenities.title')}
            </h1>
            <p className="text-muted-foreground md:text-lg max-w-xl mx-auto">
              {t('home.amenities.subtitle')}
            </p>
          </div>
        </section>

        {/* Amenities Grid */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {amenities.map((amenity, index) => {
                const IconComponent = amenity.icon;
                return (
                  <Card
                    key={index}
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md bg-white/80 backdrop-blur-sm"
                  >
                    <CardHeader className="pb-4">
                      <div
                        className={`w-16 h-16 rounded-2xl ${amenity.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className={`h-8 w-8 ${amenity.color}`} />
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {amenity.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {amenity.description}
                      </p>
                      <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Incluido
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
