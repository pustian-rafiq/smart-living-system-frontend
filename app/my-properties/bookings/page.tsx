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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookingCard } from '@/components/booking/BookingCard'
import { BookingDetailDialog } from '@/components/booking/BookingDetailDialog'
import { BookingCalendar } from '@/components/booking/BookingCalendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useMockQuery } from '@/hooks/useMockQuery'
import {
  fetchBookingsForOwner,
  patchBookingStatus,
} from '@/lib/api/bookings'
import { getDemoOwnerId } from '@/lib/api/demoUser'
import type { Booking, BookingStatus } from '@/types/booking'
import { Calendar, CheckCircle2, Clock, Plus } from 'lucide-react'

export default function OwnerBookingsPage() {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>(
    'all'
  )
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const load = useCallback(
    () => fetchBookingsForOwner(getDemoOwnerId()),
    [tick]
  )
  const { data: bookings, loading, error, refetch } = useMockQuery(load)

  const ownerBookings =
    bookings?.filter(b =>
      selectedStatus === 'all' ? true : b.status === selectedStatus
    ) || []

  const pendingBookings = (bookings || []).filter(b => b.status === 'pending')
  const approvedBookings = (bookings || []).filter(b => b.status === 'approved')
  const allBookings = bookings || []

  const refresh = () => {
    setTick(t => t + 1)
    refetch()
  }

  const handleApprove = async (bookingId: string) => {
    setActionError(null)
    const result = await patchBookingStatus(bookingId, 'approved')
    if (!result.ok) {
      setActionError(result.error)
      return
    }
    setShowDetail(false)
    refresh()
  }

  const handleRejectConfirm = async () => {
    if (!selectedBooking || !rejectionReason.trim()) return
    setActionError(null)
    const result = await patchBookingStatus(
      selectedBooking.id,
      'rejected',
      rejectionReason.trim()
    )
    if (!result.ok) {
      setActionError(result.error)
      return
    }
    setShowRejectDialog(false)
    setRejectionReason('')
    setSelectedBooking(null)
    setShowDetail(false)
    refresh()
  }

  const handleComplete = async (booking: Booking) => {
    const result = await patchBookingStatus(booking.id, 'completed')
    if (!result.ok) {
      setActionError(result.error)
      return
    }
    setShowDetail(false)
    refresh()
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="Booking requests"
          description="Approve, reject, and track bookings for your listings."
          actions={
            <Button asChild variant="outline">
              <Link href="/my-listings">
                <Plus className="mr-2 h-4 w-4" />
                Manage listings
              </Link>
            </Button>
          }
        />

        {actionError && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {actionError}
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {approvedBookings.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allBookings.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
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

        {loading && <LoadingState label="Loading requests…" />}
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
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="pending">
                Pending ({pendingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedBookings.length})
              </TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="all">All ({ownerBookings.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6 space-y-4">
              {pendingBookings.length === 0 ? (
                <EmptyState
                  title="No pending requests"
                  description="New booking requests for your listings will show here."
                  icon={Clock}
                />
              ) : (
                pendingBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    showActions
                    onApprove={handleApprove}
                    onReject={id => {
                      const b = pendingBookings.find(x => x.id === id)
                      if (b) {
                        setSelectedBooking(b)
                        setShowRejectDialog(true)
                      }
                    }}
                    onViewDetails={b => {
                      setSelectedBooking(b)
                      setShowDetail(true)
                    }}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="approved" className="mt-6 space-y-4">
              {approvedBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onViewDetails={b => {
                    setSelectedBooking(b)
                    setShowDetail(true)
                  }}
                />
              ))}
            </TabsContent>

            <TabsContent value="calendar" className="mt-6">
              <BookingCalendar bookings={allBookings} />
            </TabsContent>

            <TabsContent value="all" className="mt-6 space-y-4">
              {ownerBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  showActions={booking.status === 'pending'}
                  onApprove={handleApprove}
                  onReject={id => {
                    const b = ownerBookings.find(x => x.id === id)
                    if (b) {
                      setSelectedBooking(b)
                      setShowRejectDialog(true)
                    }
                  }}
                  onViewDetails={b => {
                    setSelectedBooking(b)
                    setShowDetail(true)
                  }}
                />
              ))}
            </TabsContent>
          </Tabs>
        )}

        <BookingDetailDialog
          booking={selectedBooking}
          open={showDetail}
          onOpenChange={setShowDetail}
          role="owner"
          onApprove={b => handleApprove(b.id)}
          onReject={b => {
            setSelectedBooking(b)
            setShowDetail(false)
            setShowRejectDialog(true)
          }}
          onComplete={handleComplete}
        />

        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject booking request</DialogTitle>
              <DialogDescription>
                Provide a clear reason so the renter understands the decision.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Rejection reason</Label>
                <Textarea
                  id="reason"
                  placeholder="e.g. Seat already filled for this month"
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowRejectDialog(false)
                    setRejectionReason('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleRejectConfirm}
                  disabled={!rejectionReason.trim()}
                >
                  Reject booking
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </Layout>
  )
}
