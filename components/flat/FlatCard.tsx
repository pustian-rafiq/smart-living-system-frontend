'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Home, User } from 'lucide-react'
import type { Flat } from '@/types/building'
import { cn } from '@/lib/utils'

interface FlatCardProps {
  flat: Flat
  onViewDetails: (flat: Flat) => void
}

const statusConfig = {
  available: {
    label: 'Available',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800',
  },
  occupied: {
    label: 'Occupied',
    className:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  },
  maintenance: {
    label: 'Maintenance',
    className:
      'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  },
}

export function FlatCard({ flat, onViewDetails }: FlatCardProps) {
  const status = statusConfig[flat.status]

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            {/* Flat Number and Floor */}
            <div>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold">
                  Flat {flat.flatNumber}
                </h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Floor {flat.floor}
              </p>
            </div>

            {/* Rent */}
            <div>
              <p className="text-xs text-muted-foreground">Monthly Rent</p>
              <p className="text-xl font-bold text-primary">
                ৳{flat.rent.toLocaleString()}
              </p>
            </div>

            {/* Status Badge */}
            <Badge variant="outline" className={cn('w-fit', status.className)}>
              {status.label}
            </Badge>

            {/* Renter Info */}
            {flat.renter && (
              <div className="flex items-center gap-2 rounded-md border p-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {flat.renter.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {flat.renter.phone}
                  </p>
                </div>
              </div>
            )}

            {/* Flat Details */}
            {(flat.area || flat.bedrooms || flat.bathrooms) && (
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {flat.area && <span>{flat.area} sqft</span>}
                {flat.bedrooms && <span>• {flat.bedrooms} Beds</span>}
                {flat.bathrooms && <span>• {flat.bathrooms} Baths</span>}
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => onViewDetails(flat)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
