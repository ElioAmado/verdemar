"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star } from "lucide-react"
import { Review } from "@/types/Review"


interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {/* Header con nombre y fecha */}
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base">
          <span>{review.reviewer?.name || "Anónimo"}</span>
          {review.created_at && (
            <span className="text-xs text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="pt-3 space-y-3">
        {/* Rating con estrellita */}
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="font-medium">{review.rating}/10</span>
        </div>

        {/* Título si lo hay */}
        {review.title && (
          <p className="text-sm font-semibold">{review.title}</p>
        )}

        {/* Comentario */}
        {review.comment && (
          <p className="text-sm text-muted-foreground">{review.comment}</p>
        )}

        {/* País del revisor */}
        {review.reviewer?.country && (
          <Badge variant="secondary">{review.reviewer.country}</Badge>
        )}
      </CardContent>
    </Card>
  )
}
