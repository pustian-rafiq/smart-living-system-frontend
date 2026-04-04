'use client'

import { useState, useMemo } from 'react'
import { Layout } from '@/components/layout/Layout'
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
import { mockBookings, getBookingsByOwner } from '@/data/mockBookings'
import type { Booking, BookingStatus } from '@/types/booking'
import { Calendar, Filter, CheckCircle2, XCircle, Clock } from 'lucide-react'
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

export default function OwnerBookingsPage() {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>(
    'all'
  )
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  // Get current owner ID (in real app, this would come from auth)
  const currentOwnerId = 'owner1' // Mock owner ID

  const ownerBookings = useMemo(() => {
    const bookings = getBookingsByOwner(currentOwnerId)
    if (selectedStatus === 'all') return bookings
    return bookings.filter(b => b.status === selectedStatus)
  }, [currentOwnerId, selectedStatus])

  const handleApprove = (bookingId: string) => {
    // In real app, this would call an API
    alert(`Approve booking ${bookingId}?`)
  }

  const handleReject = (bookingId: string) => {
    const booking = ownerBookings.find(b => b.id === bookingId)
    if (booking) {
      setSelectedBooking(booking)
      setShowRejectDialog(true)
    }
  }

  const handleRejectConfirm = () => {
    if (selectedBooking && rejectionReason.trim()) {
      // In real app, this would call an API
      alert(
        `Reject booking ${selectedBooking.id} with reason: ${rejectionReason}`
      )
      setShowRejectDialog(false)
      setRejectionReason('')
      setSelectedBooking(null)
    }
  }

  const pendingBookings = ownerBookings.filter(b => b.status === 'pending')
  const approvedBookings = ownerBookings.filter(b => b.status === 'approved')
  const allBookings = ownerBookings

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Booking Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage booking requests for your properties
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
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
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Approved ({approvedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              All ({allBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold text-muted-foreground">
                    No pending bookings
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    New booking requests will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    showActions={true}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            {approvedBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold text-muted-foreground">
                    No approved bookings
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {approvedBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    showActions={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <BookingCalendar
              bookings={allBookings}
              onDateClick={(date, bookings) => {
                if (bookings.length > 0) {
                  // Could open a dialog showing bookings for that date
                  console.log(`Bookings on ${date.toDateString()}:`, bookings)
                }
              }}
            />
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            {allBookings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold text-muted-foreground">
                    No bookings
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {allBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    showActions={booking.status === 'pending'}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Booking Request</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this booking request.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Rejection Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="e.g., Property is no longer available, dates not suitable..."
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
                  Reject Booking
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
