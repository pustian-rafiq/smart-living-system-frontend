'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookingCalendar } from '@/components/hotel/BookingCalendar'
import { mockHotels, getRoomsByHotelId, getBookingsByHotelId } from '@/data/mockHotels'

export default function BookingCalendarPage() {
  const params = useParams()
  const router = useRouter()
  const hotelId = params.hotelId as string

  const hotel = mockHotels.find(h => h.id === hotelId)
  const rooms = hotel ? getRoomsByHotelId(hotelId) : []
  const bookings = hotel ? getBookingsByHotelId(hotelId) : []

  const [selectedRoomId, setSelectedRoomId] = useState<string>('all')

  const filteredBookings = selectedRoomId === 'all' 
    ? bookings 
    : bookings.filter(b => b.roomId === selectedRoomId)

  if (!hotel) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-semibold text-muted-foreground">Hotel not found</p>
              <Button variant="outline" onClick={() => router.push('/my-hotels')} className="mt-4">
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
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-2">
            ← Back
          </Button>
          <h1 className="text-2xl font-bold mb-2">Booking Calendar</h1>
          <p className="text-muted-foreground">{hotel.name}</p>
        </div>

        {/* Room Selector */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Filter by Room:</label>
              <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rooms</SelectItem>
                  {rooms.map(room => (
                    <SelectItem key={room.id} value={room.id}>
                      Room {room.roomNumber} ({room.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Availability Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingCalendar
              bookings={filteredBookings}
              roomId={selectedRoomId === 'all' ? undefined : selectedRoomId}
            />
          </CardContent>
        </Card>

        {/* Booking List */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredBookings
                .filter(b => b.status !== 'cancelled' && b.status !== 'completed')
                .slice(0, 5)
                .map(booking => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded border p-3"
                  >
                    <div>
                      <p className="font-medium">{booking.guestName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.checkIn).toLocaleDateString()} -{' '}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">৳{booking.totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground capitalize">{booking.status}</p>
                    </div>
                  </div>
                ))}
              {filteredBookings.filter(b => b.status !== 'cancelled' && b.status !== 'completed').length === 0 && (
                <p className="text-center text-muted-foreground py-4">No upcoming bookings</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
