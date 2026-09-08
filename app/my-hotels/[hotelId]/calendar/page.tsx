'use client'

import { useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BookingCalendar } from '@/components/hotel/BookingCalendar'
import { fetchHotelById, fetchHotelRooms, fetchHotelBookings } from '@/lib/api/hotels'
import { useMockQuery } from '@/hooks/useMockQuery'

export default function BookingCalendarPage() {
  const t = useTranslations('hotels')
  const tc = useTranslations('common')
  const params = useParams()
  const router = useRouter()
  const hotelId = params.hotelId as string

  const loadHotel = useCallback(() => fetchHotelById(hotelId), [hotelId])
  const { data: hotel } = useMockQuery(loadHotel)

  const loadRooms = useCallback(() => fetchHotelRooms(hotelId), [hotelId])
  const { data: rooms } = useMockQuery(loadRooms)

  const loadBookings = useCallback(() => fetchHotelBookings(hotelId), [hotelId])
  const { data: bookings } = useMockQuery(loadBookings)

  const [selectedRoomId, setSelectedRoomId] = useState<string>('all')

  const filteredBookings =
    selectedRoomId === 'all'
      ? (bookings ?? [])
      : (bookings ?? []).filter(b => b.roomId === selectedRoomId)

  if (!hotel) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-semibold text-muted-foreground">
                {t('pricing.notFoundTitle')}
              </p>
              <Button
                variant="outline"
                onClick={() => router.push('/my-hotels')}
                className="mt-4"
              >
                {t('myHotels.backToHotels')}
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
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-2"
          >
            ← {tc('back')}
          </Button>
          <h1 className="text-2xl font-bold mb-2">
            {t('calendar.pageTitle')}
          </h1>
          <p className="text-muted-foreground">{hotel.name}</p>
        </div>

        {/* Room Selector */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <label className="text-sm font-medium">
                {t('calendar.filterByRoom')}
              </label>
              <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
                <SelectTrigger className="w-auto min-w-[7.5rem] flex-1 sm:w-[200px] sm:flex-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('calendar.allRooms')}</SelectItem>
                  {(rooms ?? []).map(room => (
                    <SelectItem key={room.id} value={room.id}>
                      {t('calendar.roomOption', {
                        number: room.roomNumber,
                        type: room.type,
                      })}
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
            <CardTitle>{t('calendar.availabilityCalendar')}</CardTitle>
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
            <CardTitle>{t('calendar.upcomingBookings')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredBookings
                .filter(
                  b => b.status !== 'cancelled' && b.status !== 'completed'
                )
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
                      <p className="font-semibold">
                        ৳{booking.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {booking.status}
                      </p>
                    </div>
                  </div>
                ))}
              {filteredBookings.filter(
                b => b.status !== 'cancelled' && b.status !== 'completed'
              ).length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  {t('calendar.noUpcoming')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
