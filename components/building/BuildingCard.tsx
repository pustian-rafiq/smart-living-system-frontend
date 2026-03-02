'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Building2, MapPin, Layers } from 'lucide-react'
import type { Building } from '@/types/building'
import { useRouter } from 'next/navigation'

interface BuildingCardProps {
  building: Building
}

export function BuildingCard({ building }: BuildingCardProps) {
  const router = useRouter()
  const occupancyRate = (building.occupiedFlats / building.totalFlats) * 100
  const availableFlats = building.totalFlats - building.occupiedFlats

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg sm:text-xl">{building.name}</CardTitle>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="line-clamp-1">{building.address}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Flats</p>
            <p className="text-lg font-semibold">{building.totalFlats}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Occupied</p>
            <p className="text-lg font-semibold">{building.occupiedFlats}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="text-lg font-semibold text-primary">{availableFlats}</p>
          </div>
        </div>

        {/* Occupancy Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Occupancy</span>
            <span className="font-medium">{occupancyRate.toFixed(0)}%</span>
          </div>
          <Progress value={occupancyRate} className="h-2" />
        </div>

        {/* Building Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Layers className="h-4 w-4" />
          <span>{building.totalFloors} Floors</span>
        </div>

        {/* Action Button */}
        <Button
          className="w-full"
          onClick={() => router.push(`/my-properties/buildings/${building.id}/flats`)}
        >
          View Flats
        </Button>
      </CardContent>
    </Card>
  )
}
