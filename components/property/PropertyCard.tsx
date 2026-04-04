'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Phone, MapPin, Video, MessageCircle } from 'lucide-react'
import { VerificationBadge } from '@/components/property/VerificationBadge'
import { FavoriteButton } from '@/components/favorites/FavoriteButton'
import { useRouter } from 'next/navigation'
import type { Property } from '@/types/property'
import Image from 'next/image'

interface PropertyCardProps {
  property: Property
  onViewDetails: (property: Property) => void
  onCall: (phone: string) => void
}

export function PropertyCard({
  property,
  onViewDetails,
  onCall,
}: PropertyCardProps) {
  const [imageError, setImageError] = useState(false)
  const router = useRouter()

  const handleStartChat = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/messages?propertyId=${property.id}`)
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted sm:h-56">
        {!imageError && property.images[0] ? (
          <Image
            src={property.images[0]}
            alt={property.name}
            fill
            className="object-cover transition-transform hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
            <span className="text-4xl">🏠</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          <Badge
            variant={property.available ? 'default' : 'secondary'}
            className="bg-background/95 backdrop-blur-sm text-xs font-medium shadow-sm"
          >
            {property.available ? 'Available' : 'Occupied'}
          </Badge>
          {property.gender && (
            <Badge
              variant="outline"
              className="bg-background/95 backdrop-blur-sm text-xs font-medium shadow-sm"
            >
              {property.gender === 'male'
                ? 'Male'
                : property.gender === 'female'
                  ? 'Female'
                  : 'Mixed'}
            </Badge>
          )}
          {property.videos && property.videos.length > 0 && (
            <Badge
              variant="secondary"
              className="bg-background/95 backdrop-blur-sm text-xs font-medium shadow-sm"
            >
              <Video className="mr-1 h-3 w-3" />
              Video
            </Badge>
          )}
        </div>
        <div className="absolute right-2 bottom-2">
          {(property.verified !== undefined || property.verificationStatus) && (
            <VerificationBadge
              verified={property.verified}
              verificationStatus={property.verificationStatus}
              verifiedAt={property.verifiedAt}
            />
          )}
        </div>
      </div>

      <CardContent className="p-4 sm:p-5">
        {/* Title and Type */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold leading-tight sm:text-xl line-clamp-2">
            {property.name}
          </h3>
          <p className="text-xs text-muted-foreground capitalize sm:text-sm mt-0.5">
            {property.type}
          </p>
        </div>

        {/* Rent */}
        <div className="mb-3">
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="text-2xl font-bold text-primary sm:text-3xl">
              ৳{property.rent.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
          {property.mealIncluded && property.mealCost && (
            <p className="text-xs text-muted-foreground mt-1.5">
              + ৳{property.mealCost.toLocaleString()}/month for meals
            </p>
          )}
          {property.seatType && (
            <p className="text-xs text-muted-foreground mt-1 capitalize">
              {property.seatType} seat
            </p>
          )}
        </div>

        {/* Location */}
        <div className="mb-3 flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="line-clamp-1">
            {property.area}, {property.city}
          </span>
        </div>

        {/* Facilities (first 3) */}
        {property.facilities.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {property.facilities.slice(0, 3).map((facility, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs font-normal"
              >
                {facility}
              </Badge>
            ))}
            {property.facilities.length > 3 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{property.facilities.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
          <Button
            variant="outline"
            className="w-full sm:flex-1 text-sm font-medium"
            onClick={() => onViewDetails(property)}
          >
            View Details
          </Button>
          <Button
            className="w-full sm:flex-1 text-sm font-medium"
            onClick={() => onCall(property.ownerPhone)}
          >
            <Phone className="mr-1.5 h-4 w-4 shrink-0" />
            Call
          </Button>
          <FavoriteButton
            property={property}
            userId="user1" // In real app, get from auth
            size="icon"
            className="w-full sm:w-10 h-10 sm:shrink-0"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleStartChat}
            title="Start Chat"
            className="w-full sm:w-10 h-10 sm:shrink-0"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
