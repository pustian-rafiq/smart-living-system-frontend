'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  MapPin,
  Phone,
  Mail,
  Star,
  Verified,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Waves,
} from 'lucide-react'
import { RatingDisplay } from '@/components/hotel/RatingDisplay'
import { ReviewCard } from '@/components/hotel/ReviewCard'
import { RoomCard } from '@/components/hotel/RoomCard'
import { CancellationPolicyCard } from '@/components/hotel/CancellationPolicyCard'
import {
  mockHotels,
  getRoomsByHotelId,
  getReviewsByHotelId,
} from '@/data/mockHotels'
import Image from 'next/image'
import Link from 'next/link'

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-4 w-4" />,
  Parking: <Car className="h-4 w-4" />,
  Restaurant: <Utensils className="h-4 w-4" />,
  Gym: <Dumbbell className="h-4 w-4" />,
  'Swimming Pool': <Waves className="h-4 w-4" />,
}

export default function HotelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const hotelId = params.hotelId as string

  const hotel = mockHotels.find(h => h.id === hotelId)
  const rooms = hotel ? getRoomsByHotelId(hotelId) : []
  const reviews = hotel ? getReviewsByHotelId(hotelId) : []

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (!hotel) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-semibold text-muted-foreground">
                Hotel not found
              </p>
              <Button
                variant="outline"
                onClick={() => router.push('/hotels')}
                className="mt-4"
              >
                Back to Hotels
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          ← Back
        </Button>

        {/* Image Gallery */}
        <div className="mb-6">
          <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted sm:h-96">
            {hotel.images[selectedImageIndex] ? (
              <Image
                src={hotel.images[selectedImageIndex]}
                alt={hotel.name}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-6xl">🏨</span>
              </div>
            )}
          </div>
          {hotel.images.length > 1 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {hotel.images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-20 overflow-hidden rounded ${
                    selectedImageIndex === idx ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${hotel.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 25vw, 150px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold">{hotel.name}</h1>
                      {hotel.verified && (
                        <Badge variant="default">
                          <Verified className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                      {hotel.featured && (
                        <Badge variant="default" className="bg-yellow-500">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {hotel.area}, {hotel.city}
                        </span>
                      </div>
                      {hotel.starRating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{hotel.starRating} Star</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-4">
                  <RatingDisplay rating={hotel.averageRating} size="md" />
                  <span className="text-sm text-muted-foreground">
                    ({hotel.totalReviews} reviews)
                  </span>
                </div>

                <p className="mb-4 text-foreground">{hotel.description}</p>

                {/* Amenities */}
                <div>
                  <h3 className="mb-3 font-semibold">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {hotel.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        {amenityIcons[amenity] || (
                          <span className="h-4 w-4">•</span>
                        )}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rooms */}
            <Card>
              <CardHeader>
                <CardTitle>Available Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rooms
                    .filter(r => r.available)
                    .map(room => (
                      <RoomCard key={room.id} room={room} />
                    ))}
                  {rooms.filter(r => r.available).length === 0 && (
                    <p className="text-center text-muted-foreground">
                      No rooms available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <CancellationPolicyCard policy={hotel.cancellationPolicy} />

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                  {reviews.length === 0 && (
                    <p className="text-center text-muted-foreground">
                      No reviews yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Book Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Starting from</p>
                  <p className="text-2xl font-bold text-primary">
                    ৳{Math.min(...rooms.map(r => r.basePrice)).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">per night</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in:</span>
                    <span className="font-medium">{hotel.checkInTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out:</span>
                    <span className="font-medium">{hotel.checkOutTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum Stay:</span>
                    <span className="font-medium">
                      {hotel.minimumStay} night(s)
                    </span>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href={`/hotels/${hotelId}/book`}>Book Now</Link>
                </Button>

                <div className="pt-4 border-t">
                  <h4 className="mb-2 font-semibold text-sm">Contact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${hotel.ownerPhone}`}
                        className="text-primary hover:underline"
                      >
                        {hotel.ownerPhone}
                      </a>
                    </div>
                    {hotel.ownerEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${hotel.ownerEmail}`}
                          className="text-primary hover:underline"
                        >
                          {hotel.ownerEmail}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
