'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  EmptyState,
} from '@/components/page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookingCalendar } from '@/components/hotel/BookingCalendar'
import { BookingForm, type BookingFormData } from '@/components/hotel/BookingForm'
import { RoomCard } from '@/components/hotel/RoomCard'
import { BookingFeeBreakdown } from '@/components/hotel/BookingFeeBreakdown'
import { CancellationPolicyCard } from '@/components/hotel/CancellationPolicyCard'
import {
  HotelPaymentDialog,
  type HotelPaymentResult,
} from '@/components/hotel/HotelPaymentDialog'
import { DownloadInvoiceButton } from '@/components/hotel/DownloadInvoiceButton'
import {
  mockHotels,
  getRoomsByHotelId,
  mockBookings,
  addHotelBooking,
} from '@/data/mockHotels'
import { calculateBookingFees } from '@/lib/hotel/pricing'
import { getDemoRenterId } from '@/lib/api/demoUser'
import type { Booking, Room } from '@/types/hotel'
import { CheckCircle2, Hotel as HotelIcon } from 'lucide-react'
import Link from 'next/link'

export default function HotelBookingPage() {
  const params = useParams()
  const router = useRouter()
  const hotelId = params.hotelId as string

  const hotel = mockHotels.find(h => h.id === hotelId)
  const rooms = hotel ? getRoomsByHotelId(hotelId) : []
  const availableRooms = rooms.filter(r => r.available)

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [checkIn, setCheckIn] = useState<Date | undefined>()
  const [checkOut, setCheckOut] = useState<Date | undefined>()
  const [guests, setGuests] = useState(1)
  const [guestData, setGuestData] = useState<BookingFormData | null>(null)
  const [payOpen, setPayOpen] = useState(false)
  const [confirmed, setConfirmed] = useState<Booking | null>(null)

  const fees = useMemo(() => {
    if (!selectedRoom || !checkIn || !checkOut) {
      return calculateBookingFees(
        { basePrice: 0 } as Room,
        new Date(),
        new Date()
      )
    }
    return calculateBookingFees(selectedRoom, checkIn, checkOut, hotel)
  }, [selectedRoom, checkIn, checkOut, hotel])

  if (!hotel) {
    return (
      <Layout>
        <PageContainer>
          <EmptyState
            title="Hotel not found"
            description="This hotel may have been removed."
            icon={HotelIcon}
          >
            <Button asChild variant="outline">
              <Link href="/hotels">Back to hotels</Link>
            </Button>
          </EmptyState>
        </PageContainer>
      </Layout>
    )
  }

  const handleGuestSubmit = (data: BookingFormData) => {
    if (!selectedRoom || !checkIn || !checkOut) return
    setGuestData(data)
    setGuests(data.guests)
    setPayOpen(true)
  }

  const handlePaid = (payment: HotelPaymentResult) => {
    if (!selectedRoom || !checkIn || !checkOut || !guestData) return

    const booking: Booking = {
      id: `hb-${Date.now()}`,
      hotelId: hotel.id,
      roomId: selectedRoom.id,
      userId: getDemoRenterId(),
      guestName: guestData.guestName,
      guestPhone: guestData.guestPhone,
      guestEmail: guestData.guestEmail || undefined,
      checkIn: format(checkIn, 'yyyy-MM-dd'),
      checkOut: format(checkOut, 'yyyy-MM-dd'),
      checkInTime: hotel.checkInTime,
      checkOutTime: hotel.checkOutTime,
      guests: guestData.guests,
      status: 'confirmed',
      paymentStatus: payment.paymentMethod === 'cash' ? 'pending' : 'paid',
      totalAmount: fees.total,
      advanceAmount: payment.paidAmount,
      remainingAmount: fees.total - payment.paidAmount,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      specialRequests: guestData.specialRequests,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    addHotelBooking(booking)
    setConfirmed(booking)
    setPayOpen(false)
  }

  if (confirmed && selectedRoom && guestData) {
    const invoiceData = {
      hotel,
      room: selectedRoom,
      booking: confirmed,
      fees,
      guestName: guestData.guestName,
      guestPhone: guestData.guestPhone,
      guestEmail: guestData.guestEmail,
    }

    return (
      <Layout>
        <PageContainer>
          <div className="mx-auto max-w-lg space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Booking confirmed</h1>
              <p className="mt-1 text-muted-foreground">
                {hotel.name} · Room {selectedRoom.roomNumber}
              </p>
            </div>
            <Card className="text-left">
              <CardContent className="space-y-3 pt-6 text-sm">
                <p>
                  <strong>Booking ID:</strong> {confirmed.id}
                </p>
                <p>
                  <strong>Txn:</strong> {confirmed.transactionId}
                </p>
                <p>
                  <strong>Check-in:</strong> {confirmed.checkIn} (
                  {hotel.checkInTime})
                </p>
                <p>
                  <strong>Check-out:</strong> {confirmed.checkOut} (
                  {hotel.checkOutTime})
                </p>
                <BookingFeeBreakdown fees={fees} />
              </CardContent>
            </Card>
            <CancellationPolicyCard
              policy={hotel.cancellationPolicy}
              compact
              className="rounded-lg border p-4 text-left"
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <DownloadInvoiceButton data={invoiceData} className="flex-1" />
              <Button className="flex-1" asChild>
                <Link href="/my-bookings">My bookings</Link>
              </Button>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/hotels/${hotel.id}`}>Back to hotel</Link>
            </Button>
          </div>
        </PageContainer>
      </Layout>
    )
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title={`Book ${hotel.name}`}
          description="Select dates, room, guest details, then pay the advance."
          actions={
            <Button variant="ghost" onClick={() => router.back()}>
              ← Back
            </Button>
          }
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>1. Select dates</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingCalendar
                  bookings={mockBookings}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onCheckInSelect={setCheckIn}
                  onCheckOutSelect={setCheckOut}
                  roomId={selectedRoom?.id}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Select room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableRooms.map(room => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    selected={selectedRoom?.id === room.id}
                    showSelectButton
                    onSelect={setSelectedRoom}
                  />
                ))}
                {availableRooms.length === 0 && (
                  <p className="text-center text-muted-foreground">
                    No rooms available
                  </p>
                )}
              </CardContent>
            </Card>

            <BookingForm
              onSubmit={handleGuestSubmit}
              defaultCheckIn={
                checkIn ? format(checkIn, 'yyyy-MM-dd') : undefined
              }
              defaultCheckOut={
                checkOut ? format(checkOut, 'yyyy-MM-dd') : undefined
              }
              defaultGuests={guests}
            />

            <CancellationPolicyCard policy={hotel.cancellationPolicy} />
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">{hotel.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {hotel.area}, {hotel.city}
                  </p>
                </div>
                {selectedRoom && (
                  <div className="border-t pt-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room</span>
                      <span className="font-medium">
                        {selectedRoom.roomNumber} · {selectedRoom.type}
                      </span>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <span className="text-muted-foreground">Base rate</span>
                      <span>
                        ৳{selectedRoom.basePrice.toLocaleString()}/night
                      </span>
                    </div>
                  </div>
                )}
                {checkIn && checkOut && (
                  <div className="border-t pt-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in</span>
                      <span>{format(checkIn, 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <span className="text-muted-foreground">Check-out</span>
                      <span>{format(checkOut, 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                )}
                <div className="border-t pt-3">
                  <BookingFeeBreakdown fees={fees} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Weekend and seasonal rates may apply. VAT and service charge
                  included in total.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <HotelPaymentDialog
          open={payOpen}
          onOpenChange={setPayOpen}
          fees={fees}
          hotelName={hotel.name}
          onPaid={handlePaid}
        />
      </PageContainer>
    </Layout>
  )
}
