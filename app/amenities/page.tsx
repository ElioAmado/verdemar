"use client"

import { useLanguage } from "@/contexts/language-context"
import {
  Wifi,
  Coffee,
  Tv,
  Snowflake,
  Utensils,
  Car,
  MapPin,
  Users,
  Lock,
  Home,
  Bath,
  Landmark,
  CheckCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function AmenitiesPage() {
  const { t } = useLanguage()

  const amenities = [
    { icon: Wifi, key: "wifi", color: "text-blue-500", bgColor: "bg-blue-50" },
    { icon: Coffee, key: "coffee", color: "text-amber-600", bgColor: "bg-amber-50" },
    { icon: Tv, key: "tv", color: "text-purple-500", bgColor: "bg-purple-50" },
    { icon: Snowflake, key: "air", color: "text-cyan-500", bgColor: "bg-cyan-50" },
    { icon: Utensils, key: "kitchen", color: "text-green-500", bgColor: "bg-green-50" },
    { icon: Car, key: "parking", color: "text-gray-600", bgColor: "bg-gray-50" },
    { icon: MapPin, key: "location", color: "text-red-500", bgColor: "bg-red-50" },
    { icon: Users, key: "staff", color: "text-indigo-500", bgColor: "bg-indigo-50" },
    { icon: Lock, key: "safe", color: "text-orange-500", bgColor: "bg-orange-50" },
    { icon: Home, key: "family", color: "text-pink-500", bgColor: "bg-pink-50" },
    { icon: Landmark, key: "balcony", color: "text-teal-500", bgColor: "bg-teal-50" },
    { icon: Bath, key: "bathroom", color: "text-violet-500", bgColor: "bg-violet-50" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted py-12">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-3xl font-bold sm:text-5xl mb-4">{t("amenities.title")}</h1>
            <p className="text-muted-foreground md:text-lg max-w-xl mx-auto">
              {t("amenities.subtitle")}
            </p>
          </div>
        </section>

        {/* Amenities Grid */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {amenities.map((amenity, index) => {
                const IconComponent = amenity.icon
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
                        {t(`amenities.items.${amenity.key}.title`)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {t(`amenities.items.${amenity.key}.description`)}
                      </p>
                      <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t("amenities.items.included")}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
