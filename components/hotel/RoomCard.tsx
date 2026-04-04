'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Bed } from 'lucide-react'
import type { Room } from '@/types/hotel'
import Image from 'next/image'

interface RoomCardProps {
  room: Room
  onSelect?: (room: Room) => void
  showSelectButton?: boolean
  selected?: boolean
}

export function RoomCard({
  room,
  onSelect,
  showSelectButton = false,
  selected = false,
}: RoomCardProps) {
  const roomTypeLabels: Record<string, string> = {
    single: 'Single Room',
    double: 'Double Room',
    suite: 'Suite',
    family: 'Family Room',
  }

  return (
    <Card className={selected ? 'ring-2 ring-primary' : ''}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Image */}
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded bg-muted sm:h-32 sm:w-32">
            {room.images[0] ? (
              <Image
                src={room.images[0]}
                alt={room.roomNumber}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 96px, 128px"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Bed className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h4 className="font-semibold">Room {room.roomNumber}</h4>
                <p className="text-sm text-muted-foreground">
                  {roomTypeLabels[room.type]}
                </p>
              </div>
              <Badge variant={room.available ? 'default' : 'secondary'}>
                {room.available ? 'Available' : 'Occupied'}
              </Badge>
            </div>

            <div className="mb-2 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Max {room.capacity} guests</span>
              </div>
              <span>Floor {room.floor}</span>
            </div>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {room.amenities.slice(0, 3).map((amenity, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {room.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{room.amenities.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-primary">
                  ৳{room.basePrice.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">/night</span>
              </div>
              {showSelectButton && (
                <Button
                  size="sm"
                  variant={selected ? 'default' : 'outline'}
                  onClick={() => onSelect?.(room)}
                  disabled={!room.available}
                >
                  {selected ? 'Selected' : 'Select'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
