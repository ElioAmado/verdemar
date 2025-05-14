import { StarIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TestimonialProps {
  quote: string;
  author: string;
  location: string;
  rating: number;
}

export function Testimonial({
  quote,
  author,
  location,
  rating,
}: TestimonialProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={`h-4 w-4 ${i < rating ? 'fill-primary text-primary' : 'text-muted'}`}
            />
          ))}
        </div>
        <blockquote className="text-lg flex-grow">"{quote}"</blockquote>
        <div className="mt-4 pt-4 border-t">
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-muted-foreground">{location}</div>
        </div>
      </CardContent>
    </Card>
  );
}
