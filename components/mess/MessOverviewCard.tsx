'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Users, DollarSign, MapPin, Phone } from 'lucide-react'
import type { Mess } from '@/types/mess'
import Image from 'next/image'
import { useState } from 'react'

interface MessOverviewCardProps {
  mess: Mess
  onAssignStudent: (mess: Mess) => void
}

export function MessOverviewCard({ mess, onAssignStudent }: MessOverviewCardProps) {
  const [imageError, setImageError] = useState(false)
  const occupancyRate = ((mess.totalSeats - mess.availableSeats) / mess.totalSeats) * 100

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted sm:h-56">
        {!imageError && mess.images[0] ? (
          <Image
            src={mess.images[0]}
            alt={mess.name}
            fill
            className="object-cover transition-transform hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
            <span className="text-5xl">🏠</span>
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Badge variant="outline" className="bg-background/90 backdrop-blur">
            {mess.gender === 'male' ? 'Male' : mess.gender === 'female' ? 'Female' : 'Mixed'}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">{mess.name}</CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{mess.address}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Total Seats</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{mess.totalSeats}</p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Available</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-primary">
              {mess.availableSeats}
            </p>
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

        {/* Monthly Fee */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Monthly Fee</p>
              <p className="text-xl font-bold text-primary">
                ৳{mess.monthlyFee.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Facilities */}
        {mess.facilities.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Facilities
            </p>
            <div className="flex flex-wrap gap-1.5">
              {mess.facilities.slice(0, 4).map((facility, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {facility}
                </Badge>
              ))}
              {mess.facilities.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{mess.facilities.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Owner Contact */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm text-muted-foreground">Owner</p>
            <p className="font-medium">{mess.ownerName}</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={`tel:${mess.ownerPhone}`}>
              <Phone className="mr-2 h-4 w-4" />
              Call
            </a>
          </Button>
        </div>

        {/* Action Button */}
        <Button
          className="w-full"
          onClick={() => onAssignStudent(mess)}
          disabled={mess.availableSeats === 0}
        >
          Assign Student
        </Button>
      </CardContent>
    </Card>
  )
}
