'use client'

import { useState, useMemo } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookingCard } from '@/components/booking/BookingCard'
import { BookingConfirmation } from '@/components/booking/BookingConfirmation'
import { mockBookings, getBookingsByRenter } from '@/data/mockBookings'
import type { Booking, BookingStatus } from '@/types/booking'
import { Calendar, Filter } from 'lucide-react'

export default function MyBookingsPage() {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>(
    'all'
  )
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Get current user ID (in real app, this would come from auth)
  const currentUserId = 'renter1' // Mock user ID

  const userBookings = useMemo(() => {
    const bookings = getBookingsByRenter(currentUserId)
    if (selectedStatus === 'all') return bookings
    return bookings.filter(b => b.status === selectedStatus)
  }, [currentUserId, selectedStatus])

  const handleCancel = (bookingId: string) => {
    // In real app, this would call an API
    alert(`Cancel booking ${bookingId}?`)
  }

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    // Could open a detail dialog here
  }

  const upcomingBookings = userBookings.filter(
    b => b.status === 'approved' || b.status === 'pending'
  )
  const pastBookings = userBookings.filter(
    b =>
      b.status === 'completed' ||
      b.status === 'cancelled' ||
      b.status === 'rejected'
  )

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">My Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your property booking requests and history
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedStatus}
              onValueChange={value =>
                setSelectedStatus(value as BookingStatus | 'all')
              }
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Bookings Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold text-muted-foreground">
                    No upcoming bookings
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your upcoming bookings will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={handleCancel}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold text-muted-foreground">
                    No past bookings
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your booking history will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Booking Confirmation Dialog */}
        <BookingConfirmation
          booking={selectedBooking}
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
        />
      </div>
    </Layout>
  )
}
