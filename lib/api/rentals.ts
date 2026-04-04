import type { Booking } from '@/types/booking'
import { getBookingsByRenter } from '@/data/mockBookings'
import { mockDelay, ok, type ApiResult } from './http'

export type RentalSummary = {
  booking: Booking
  /** UI label: active | upcoming | past | pending */
  phase: 'pending' | 'active' | 'upcoming' | 'past' | 'declined'
}

function classify(booking: Booking): RentalSummary['phase'] {
  if (booking.status === 'pending') return 'pending'
  if (booking.status === 'rejected') return 'declined'
  if (booking.status === 'cancelled') return 'declined'
  if (booking.status === 'completed') return 'past'
  if (booking.status === 'approved') {
    const now = new Date()
    const moveIn = booking.moveInDate ? new Date(booking.moveInDate) : null
    if (moveIn && moveIn > now) return 'upcoming'
    return 'active'
  }
  return 'past'
}

/** Renter-centric view of booking requests and stays */
export async function fetchRentalSummariesForRenter(
  renterId: string
): Promise<ApiResult<RentalSummary[]>> {
  await mockDelay()
  const bookings = getBookingsByRenter(renterId)
  const summaries: RentalSummary[] = bookings.map(booking => ({
    booking,
    phase: classify(booking),
  }))
  summaries.sort(
    (a, b) =>
      new Date(b.booking.updatedAt).getTime() -
      new Date(a.booking.updatedAt).getTime()
  )
  return ok(summaries)
}
