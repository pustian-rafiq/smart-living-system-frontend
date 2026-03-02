'use client'

import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, MapPin, Star, TrendingUp, Users, Calendar } from 'lucide-react'
import { RatingDisplay } from '@/components/hotel/RatingDisplay'
import { mockHotels, getBookingsByHotelId } from '@/data/mockHotels'
import { format } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'

export default function MyHotelsPage() {
  // In real app, get from auth context
  const ownerId = 'owner1'
  const myHotels = mockHotels.filter(h => h.ownerId === ownerId)

  const getHotelStats = (hotelId: string) => {
    const bookings = getBookingsByHotelId(hotelId)
    const today = new Date()
    const thisMonth = bookings.filter(b => {
      const bookingDate = new Date(b.createdAt)
      return bookingDate.getMonth() === today.getMonth() &&
             bookingDate.getFullYear() === today.getFullYear()
    })
    
    return {
      totalBookings: bookings.length,
      thisMonthBookings: thisMonth.length,
      revenue: bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalAmount, 0),
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Hotels</h1>
            <p className="text-muted-foreground">
              Manage your hotels and bookings
            </p>
          </div>
          <Button asChild>
            <Link href="/my-hotels/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Hotel
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hotels</p>
                  <p className="text-2xl font-bold">{myHotels.length}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <Star className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">
                    {myHotels.reduce((sum, h) => sum + getHotelStats(h.id).totalBookings, 0)}
                  </p>
                </div>
                <div className="rounded-full bg-green-500/10 p-3">
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    ৳{myHotels.reduce((sum, h) => sum + getHotelStats(h.id).revenue, 0).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-full bg-blue-500/10 p-3">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hotels List */}
        {myHotels.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-semibold text-muted-foreground">
                No hotels found
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Add your first hotel to get started
              </p>
              <Button asChild className="mt-4">
                <Link href="/my-hotels/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Hotel
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myHotels.map(hotel => {
              const stats = getHotelStats(hotel.id)
              
              return (
                <Card key={hotel.id} className="overflow-hidden">
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    {hotel.images[0] ? (
                      <Image
                        src={hotel.images[0]}
                        alt={hotel.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-4xl">🏨</span>
                      </div>
                    )}
                    <div className="absolute right-2 top-2">
                      {hotel.verified && (
                        <Badge variant="default">Verified</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{hotel.name}</h3>
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{hotel.area}, {hotel.city}</span>
                    </div>
                    <div className="mb-4 flex items-center gap-2">
                      <RatingDisplay rating={hotel.averageRating} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        ({hotel.totalReviews} reviews)
                      </span>
                    </div>
                    
                    {/* Stats */}
                    <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Rooms</p>
                        <p className="font-semibold">{hotel.totalRooms}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Bookings</p>
                        <p className="font-semibold">{stats.totalBookings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="font-semibold">৳{(stats.revenue / 1000).toFixed(0)}k</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href={`/my-hotels/${hotel.id}/rooms`}>Manage</Link>
                      </Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <Link href={`/my-hotels/${hotel.id}/bookings`}>Bookings</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
