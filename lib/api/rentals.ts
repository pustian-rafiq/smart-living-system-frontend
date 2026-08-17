import type { Booking } from '@/types/booking'
import { fetchBookingsForRenter } from './bookings'
import type { ApiResult } from './http'
import { hasAuthTokens } from '@/utils/auth-tokens'

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
  _renterId?: string,
): Promise<ApiResult<RentalSummary[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  const result = await fetchBookingsForRenter()
  if (!result.ok) return result
  const summaries: RentalSummary[] = result.data.map(booking => ({
    booking,
    phase: classify(booking),
  }))
  summaries.sort(
    (a, b) =>
      new Date(b.booking.updatedAt).getTime() -
      new Date(a.booking.updatedAt).getTime(),
  )
  return { ok: true, data: summaries }
}
