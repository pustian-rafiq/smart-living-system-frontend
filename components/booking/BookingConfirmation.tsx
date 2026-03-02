'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle2, Calendar, MapPin, Phone, Mail } from 'lucide-react'
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <DialogTitle>Booking Request Submitted!</DialogTitle>
              <DialogDescription>
                Your booking request has been sent to the property owner
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Details */}
          <div className="rounded-lg border p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Booking Details</h3>
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
                {booking.moveOutDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      <strong>Move-out:</strong>{' '}
                      {format(new Date(booking.moveOutDate), 'PPP')}
                    </span>
                  </div>
                )}
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
              <h3 className="font-semibold mb-2">Property Information</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{booking.propertyName}</p>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">
                    {booking.propertyAddress}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-muted-foreground">Monthly Rent:</span>
                  <span className="font-semibold text-lg">
                    ৳{booking.rent.toLocaleString()}
                  </span>
                </div>
                {booking.deposit && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Security Deposit:</span>
                    <span className="font-semibold">
                      ৳{booking.deposit.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Owner Contact */}
          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="font-semibold mb-3">Owner Contact</h3>
            <div className="space-y-2">
              <p className="font-medium">{booking.ownerName}</p>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${booking.ownerPhone}`}
                  className="text-primary hover:underline"
                >
                  {booking.ownerPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4">
            <p className="text-sm">
              <strong>Status:</strong> Your booking request is{' '}
              <span className="font-semibold text-yellow-700">pending</span>. The
              owner will review your request and respond within 24-48 hours.
            </p>
          </div>

          {/* Actions */}
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
                View My Bookings
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
