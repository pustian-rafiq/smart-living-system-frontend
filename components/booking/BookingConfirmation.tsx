'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BookingStatusBadge } from '@/components/booking/BookingStatusBadge'
import { CheckCircle2, Calendar, MapPin, Phone, Zap, Clock } from 'lucide-react'
import { format } from 'date-fns'
import type { Booking } from '@/types/booking'

interface BookingConfirmationProps {
  booking: Booking | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onViewBookings?: () => void
}

export function BookingConfirmation({
  booking,
  open,
  onOpenChange,
  onViewBookings,
}: BookingConfirmationProps) {
  if (!booking) return null

  const isInstant =
    booking.bookingMode === 'instant' || booking.status === 'approved'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full p-2 ${isInstant ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-amber-100 dark:bg-amber-900/40'}`}
            >
              {isInstant ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              ) : (
                <Clock className="h-6 w-6 text-amber-600" />
              )}
            </div>
            <div className="flex-1">
              <DialogTitle>
                {isInstant
                  ? 'Booking confirmed!'
                  : 'Booking request submitted'}
              </DialogTitle>
              <DialogDescription>
                {isInstant
                  ? 'Your seat/flat is reserved. Contact the owner to arrange move-in.'
                  : 'Your request was sent to the property owner for review.'}
              </DialogDescription>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {isInstant && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
              <Zap className="h-4 w-4 shrink-0" />
              Instant book — no owner approval needed
            </div>
          )}

          <div className="space-y-4 rounded-lg border p-4">
            <div>
              <h3 className="mb-2 font-semibold">Booking details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>Move-in:</strong>{' '}
                    {booking.moveInDate
                      ? format(new Date(booking.moveInDate), 'PPP')
                      : 'Not specified'}
                  </span>
                </div>
                {booking.duration && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Duration:</strong> {booking.duration} months
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="mb-2 font-semibold">Property</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{booking.propertyName}</p>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {booking.propertyAddress}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-muted-foreground">Monthly rent</span>
                  <span className="text-lg font-semibold">
                    ৳{booking.rent.toLocaleString()}
                  </span>
                </div>
                {booking.deposit != null && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Security deposit
                    </span>
                    <span className="font-semibold">
                      ৳{booking.deposit.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="font-medium">Total at move-in</span>
                  <span className="text-lg font-bold text-primary">
                    ৳{booking.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-3 font-semibold">Owner contact</h3>
            <p className="font-medium">{booking.ownerName}</p>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a
                href={`tel:${booking.ownerPhone}`}
                className="text-primary hover:underline"
              >
                {booking.ownerPhone}
              </a>
            </div>
          </div>

          {!isInstant && (
            <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4 dark:bg-amber-950/30">
              <p className="text-sm">
                Status is <strong>pending</strong>. Most owners in Bangladesh
                respond within 24–48 hours. You can cancel anytime before
                approval from My Bookings.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            {onViewBookings && (
              <Button className="flex-1" onClick={onViewBookings}>
                View my bookings
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
