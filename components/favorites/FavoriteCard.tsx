'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  MapPin,
  DollarSign,
  Trash2,
  Share2,
  Eye,
  FileText,
} from 'lucide-react'
import { format } from 'date-fns'
import Image from 'next/image'
import type { Favorite } from '@/types/favorites'

interface FavoriteCardProps {
  favorite: Favorite
  onRemove: (id: string) => void
  onView: (propertyId: string) => void
  onShare?: (favorite: Favorite) => void
  onAddNote?: (id: string, note: string) => void
}

export function FavoriteCard({
  favorite,
  onRemove,
  onView,
  onShare,
}: FavoriteCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {favorite.propertyImage ? (
          <Image
            src={favorite.propertyImage}
            alt={favorite.propertyName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
            <span className="text-4xl">🏠</span>
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Badge
            variant="secondary"
            className="bg-background/90 backdrop-blur capitalize"
          >
            {favorite.propertyType}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title */}
        <h3 className="mb-2 text-lg font-semibold line-clamp-1">
          {favorite.propertyName}
        </h3>

        {/* Location */}
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">
            {favorite.propertyArea}, {favorite.propertyCity}
          </span>
        </div>

        {/* Rent */}
        <div className="mb-3 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">
            ৳{favorite.propertyRent.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>

        {/* Notes */}
        {favorite.notes && (
          <div className="mb-3 rounded border-l-2 border-primary/50 bg-muted/50 p-2">
            <p className="text-xs text-muted-foreground mb-1">Notes:</p>
            <p className="text-sm">{favorite.notes}</p>
          </div>
        )}

        {/* Added Date */}
        <p className="mb-3 text-xs text-muted-foreground">
          Added {format(new Date(favorite.addedAt), 'MMM dd, yyyy')}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onView(favorite.propertyId)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          {onShare && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onShare(favorite)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onRemove(favorite.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
