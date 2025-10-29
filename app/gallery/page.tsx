'use client';
import Link from 'next/link';
import Image from 'next/image';
import { photos } from '@/consts/photos';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiteHeader } from '@/components/site-header';
import { useLanguage } from '@/contexts/language-context';
import { SiteFooter } from '@/components/site-footer';
import RoomsSearch from '@/components/rooms-search';

export default function GalleryPage() {
  const { t } = useLanguage();



  const categories = ['all', 'rooms', 'amenities'] as const;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted py-12">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-3xl font-bold sm:text-5xl">
              {t('gallery.title')}
            </h1>
            <p className="mt-4 max-w-[700px] mx-auto text-muted-foreground md:text-xl">
              {t('gallery.subtitle')}
            </p>
          </div>
        </section>

        {/* Tabs + Gallery */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
                {categories.map((cat) =>
                  <TabsTrigger key={cat} value={cat}>
                    {t(`gallery.${cat}`)}
                  </TabsTrigger>
                )}
              </TabsList>

              {categories.map((cat) => (
                <TabsContent key={cat} value={cat}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(cat === 'all'
                      ? photos
                      : photos.filter((p) => p.category === cat)
                    ).map((photo, idx) => (
                      <div
                        key={`${cat}-${idx}`}
                        className="relative aspect-square overflow-hidden rounded-lg"
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                        {photo.figcaption && (
                          <div className="absolute bottom-0 bg-black/50 text-white p-2 text-sm">
                            {photo.figcaption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
        <div className="container px-4 md:px-6 mb-12">
              <RoomsSearch></RoomsSearch>
        </div>
        

      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
);
}