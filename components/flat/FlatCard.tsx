'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FlatStatusBadge } from '@/components/shared/FlatStatusBadge'
import { Home, User } from 'lucide-react'
import type { Flat } from '@/types/building'

interface FlatCardProps {
  flat: Flat
  onViewDetails: (flat: Flat) => void
}

export function FlatCard({ flat, onViewDetails }: FlatCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
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

            <div>
              <p className="text-xs text-muted-foreground">Monthly rent</p>
              <p className="text-xl font-bold text-primary">
                ৳{flat.rent.toLocaleString()}
              </p>
            </div>

            <FlatStatusBadge status={flat.status} className="w-fit" />

            {flat.renter && (
              <div className="flex items-center gap-2 rounded-md border p-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {flat.renter.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {flat.renter.phone}
                  </p>
                </div>
              </div>
            )}

            {(flat.area || flat.bedrooms || flat.bathrooms) && (
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {flat.area && <span>{flat.area} sqft</span>}
                {flat.bedrooms && <span>• {flat.bedrooms} beds</span>}
                {flat.bathrooms && <span>• {flat.bathrooms} baths</span>}
              </div>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => onViewDetails(flat)}
        >
          View details
        </Button>
      </CardContent>
    </Card>
  )
}
