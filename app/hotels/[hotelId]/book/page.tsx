'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookingCalendar } from '@/components/hotel/BookingCalendar'
import { BookingForm } from '@/components/hotel/BookingForm'
import { RoomCard } from '@/components/hotel/RoomCard'
import { mockHotels, getRoomsByHotelId, mockBookings } from '@/data/mockHotels'
import { differenceInDays, addDays, format } from 'date-fns'
import type { BookingFormData } from '@/components/hotel/BookingForm'
import type { Room } from '@/types/hotel'

export default function HotelBookingPage() {
  const params = useParams()
  const router = useRouter()
  const hotelId = params.hotelId as string

  const hotel = mockHotels.find(h => h.id === hotelId)
  const rooms = hotel ? getRoomsByHotelId(hotelId) : []
  const availableRooms = rooms.filter(r => r.available)

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined)
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined)
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)

  const totalPrice = useMemo(() => {
    if (!selectedRoom || !checkIn || !checkOut) return 0

    const nights = differenceInDays(checkOut, checkIn)
    if (nights <= 0) return 0

    return selectedRoom.basePrice * nights
  }, [selectedRoom, checkIn, checkOut])

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

  const handleBookingSubmit = async (data: BookingFormData) => {
    if (!selectedRoom || !checkIn || !checkOut) {
      alert('Please select a room and dates')
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      alert(`Booking confirmed! Total: ৳${totalPrice.toLocaleString()}`)
      router.push('/my-bookings')
    }, 1500)
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Back
          </Button>
          <h1 className="text-2xl font-bold mb-2">Book {hotel.name}</h1>
          <p className="text-muted-foreground">
            Complete your booking in a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Select Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Step 1: Select Dates</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingCalendar
                  bookings={mockBookings}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onCheckInSelect={date => setCheckIn(date)}
                  onCheckOutSelect={date => setCheckOut(date)}
                  roomId={selectedRoom?.id}
                />
              </CardContent>
            </Card>

            {/* Step 2: Select Room */}
            <Card>
              <CardHeader>
                <CardTitle>Step 2: Select Room</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableRooms.map(room => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      selected={selectedRoom?.id === room.id}
                      showSelectButton
                      onSelect={room => setSelectedRoom(room)}
                    />
                  ))}
                  {availableRooms.length === 0 && (
                    <p className="text-center text-muted-foreground">
                      No rooms available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Guest Information */}
            <BookingForm
              onSubmit={handleBookingSubmit}
              defaultCheckIn={
                checkIn ? format(checkIn, 'yyyy-MM-dd') : undefined
              }
              defaultCheckOut={
                checkOut ? format(checkOut, 'yyyy-MM-dd') : undefined
              }
              defaultGuests={guests}
              loading={loading}
            />
          </div>

          {/* Sidebar - Booking Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">{hotel.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {hotel.area}, {hotel.city}
                  </p>
                </div>

                {selectedRoom && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Room:</span>
                      <span className="font-medium">
                        Room {selectedRoom.roomNumber}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium capitalize">
                        {selectedRoom.type}
                      </span>
                    </div>
                  </div>
                )}

                {checkIn && checkOut && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Check-in:</span>
                      <span className="font-medium">
                        {format(checkIn, 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Check-out:</span>
                      <span className="font-medium">
                        {format(checkOut, 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nights:</span>
                      <span className="font-medium">
                        {differenceInDays(checkOut, checkIn)} night(s)
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Room Price:</span>
                    <span className="font-medium">
                      {selectedRoom
                        ? `৳${selectedRoom.basePrice.toLocaleString()}/night`
                        : 'Select room'}
                    </span>
                  </div>
                  {checkIn && checkOut && selectedRoom && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Total Nights:
                      </span>
                      <span className="font-medium">
                        {differenceInDays(checkOut, checkIn)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-primary">
                      ৳{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {selectedRoom && checkIn && checkOut && (
                  <Button
                    className="w-full"
                    onClick={() => {
                      // Trigger form submission
                      const form = document.querySelector('form')
                      form?.requestSubmit()
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
