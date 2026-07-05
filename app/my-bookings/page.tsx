'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  EmptyState,
  LoadingState,
} from '@/components/page'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { BookingCard } from '@/components/booking/BookingCard'
import { BookingDetailDialog } from '@/components/booking/BookingDetailDialog'
import { useMockQuery } from '@/hooks/useMockQuery'
import {
  fetchBookingsForRenter,
  patchBookingStatus,
} from '@/lib/api/bookings'
import { getDemoRenterId } from '@/lib/api/demoUser'
import type { Booking, BookingStatus } from '@/types/booking'
import { Calendar, Search } from 'lucide-react'

export default function MyBookingsPage() {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>(
    'all'
  )
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const load = useCallback(() => {
    return fetchBookingsForRenter(getDemoRenterId())
  }, [tick])

  const { data: bookings, loading, error, refetch } = useMockQuery(load)

  const filtered =
    bookings?.filter(b =>
      selectedStatus === 'all' ? true : b.status === selectedStatus
    ) || []

  const upcomingBookings = filtered.filter(
    b => b.status === 'approved' || b.status === 'pending'
  )
  const pastBookings = filtered.filter(
    b =>
      b.status === 'completed' ||
      b.status === 'cancelled' ||
      b.status === 'rejected'
  )

  const openDetail = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetail(true)
  }

  const confirmCancel = async () => {
    if (!cancelTarget || !cancelReason.trim()) return
    setActionError(null)
    const result = await patchBookingStatus(
      cancelTarget.id,
      'cancelled',
      cancelReason.trim()
    )
    if (!result.ok) {
      setActionError(result.error)
      return
    }
    setCancelTarget(null)
    setCancelReason('')
    setShowDetail(false)
    setTick(t => t + 1)
    refetch()
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="My bookings"
          description="Track requests, instant bookings, and stay history."
          actions={
            <Button asChild variant="outline">
              <Link href="/search">
                <Search className="mr-2 h-4 w-4" />
                Find housing
              </Link>
            </Button>
          }
        />

        <div className="mb-6 flex flex-wrap items-center gap-3">
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
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading && <LoadingState label="Loading bookings…" />}
        {error && (
          <EmptyState
            title="Could not load bookings"
            description={error}
            icon={Calendar}
          >
            <Button onClick={() => refetch()}>Retry</Button>
          </EmptyState>
        )}

        {!loading && !error && (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6 space-y-4">
              {upcomingBookings.length === 0 ? (
                <EmptyState
                  title="No upcoming bookings"
                  description="Search verified mess, hostel, and apartment listings to book."
                  icon={Calendar}
                >
                  <Button asChild>
                    <Link href="/search">Browse listings</Link>
                  </Button>
                </EmptyState>
              ) : (
                upcomingBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={id => {
                      const b = upcomingBookings.find(x => x.id === id)
                      if (b) setCancelTarget(b)
                    }}
                    onViewDetails={openDetail}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6 space-y-4">
              {pastBookings.length === 0 ? (
                <EmptyState
                  title="No past bookings"
                  description="Completed, cancelled, and rejected bookings appear here."
                  icon={Calendar}
                />
              ) : (
                pastBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onViewDetails={openDetail}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}

        <BookingDetailDialog
          booking={selectedBooking}
          open={showDetail}
          onOpenChange={setShowDetail}
          role="renter"
          onCancel={b => {
            setShowDetail(false)
            setCancelTarget(b)
          }}
        />

        <Dialog
          open={Boolean(cancelTarget)}
          onOpenChange={open => {
            if (!open) {
              setCancelTarget(null)
              setCancelReason('')
              setActionError(null)
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel booking</DialogTitle>
              <DialogDescription>
                Tell the owner why you are cancelling. Pending and approved
                bookings can be cancelled.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cancel-reason">Reason</Label>
                <Textarea
                  id="cancel-reason"
                  className="mt-2"
                  rows={4}
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="e.g. Found another place closer to campus"
                />
              </div>
              {actionError && (
                <p className="text-sm text-destructive">{actionError}</p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCancelTarget(null)}
                >
                  Keep booking
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  disabled={!cancelReason.trim()}
                  onClick={confirmCancel}
                >
                  Confirm cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </Layout>
  )
}
