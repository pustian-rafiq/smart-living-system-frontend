'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Star, Verified } from 'lucide-react'
import { FeaturedBadge } from '@/components/monetization/FeaturedBadge'
import { RatingDisplay } from './RatingDisplay'
import type { Hotel } from '@/types/hotel'
import Image from 'next/image'
import Link from 'next/link'

interface HotelCardProps {
  hotel: Hotel
  onViewDetails?: (hotel: Hotel) => void
}

export function HotelCard({ hotel, onViewDetails }: HotelCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(hotel)
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted sm:h-56">
        {!imageError && hotel.images[0] ? (
          <Image
            src={hotel.images[0]}
            alt={hotel.name}
            fill
            className="object-cover transition-transform hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
            <span className="text-4xl">🏨</span>
          </div>
        )}
        <div className="absolute right-2 top-2 flex flex-col gap-2">
          {hotel.verified && (
            <Badge variant="default" className="bg-background/90 backdrop-blur">
              <Verified className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          )}
          {hotel.featured && <FeaturedBadge />}
        </div>
        {hotel.starRating && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-background/90 px-2 py-1 backdrop-blur">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{hotel.starRating}</span>
          </div>
        )}
      </div>

      <CardContent className="p-4 sm:p-5">
        {/* Title and Type */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold leading-tight sm:text-xl">
            {hotel.name}
          </h3>
          <p className="text-xs text-muted-foreground capitalize sm:text-sm">
            {hotel.type.replace('-', ' ')}
          </p>
        </div>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-2">
          <RatingDisplay rating={hotel.averageRating} size="sm" />
          <span className="text-xs text-muted-foreground">
            ({hotel.totalReviews} reviews)
          </span>
        </div>

        {/* Location */}
        <div className="mb-4 flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="line-clamp-1">
            {hotel.area}, {hotel.city}
          </span>
        </div>

        {/* Amenities (first 3) */}
        {hotel.amenities.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {hotel.amenities.slice(0, 3).map((amenity, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {hotel.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{hotel.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Availability */}
        <div className="mb-4 text-sm">
          <span className="text-muted-foreground">Available Rooms: </span>
          <span className="font-semibold">
            {hotel.availableRooms} / {hotel.totalRooms}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleViewDetails}
            asChild
          >
            <Link href={`/hotels/${hotel.id}`}>View Details</Link>
          </Button>
          <Button className="flex-1" asChild>
            <Link href={`/hotels/${hotel.id}/book`}>Book Now</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
