import type { Booking, BookingStatus } from '@/types/booking'
import {
  mockBookings,
  getBookingsByRenter,
  getBookingsByOwner,
  updateBookingStatus,
} from '@/data/mockBookings'
import { mockDelay, ok, type ApiResult } from './http'

export async function fetchBookingsForRenter(
  renterId: string
): Promise<ApiResult<Booking[]>> {
  await mockDelay()
  return ok(getBookingsByRenter(renterId))
}

export async function fetchBookingsForOwner(
  ownerId: string
): Promise<ApiResult<Booking[]>> {
  await mockDelay()
  return ok(getBookingsByOwner(ownerId))
}

export async function fetchBookingById(
  id: string
): Promise<ApiResult<Booking | null>> {
  await mockDelay()
  const b = mockBookings.find(x => x.id === id) ?? null
  return ok(b)
}

export async function patchBookingStatus(
  bookingId: string,
  status: BookingStatus,
  rejectionReason?: string
): Promise<ApiResult<Booking | null>> {
  await mockDelay()
  updateBookingStatus(bookingId, status, rejectionReason)
  const updated = mockBookings.find(b => b.id === bookingId) ?? null
  return ok(updated)
}
