import type { Booking, BookingFormData, BookingStatus } from '@/types/booking'
import type { Property } from '@/types/property'
import {
  addBooking,
  getBookingById,
  getBookingConflict,
  getBookingsByOwner,
  getBookingsByRenter,
  mockBookings,
  updateBookingStatus,
} from '@/data/mockBookings'
import { getDemoRenterProfile } from './demoUser'
import { mockDelay, ok, err, type ApiResult } from './http'

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
  return ok(getBookingById(id) ?? null)
}

export async function createBooking(
  property: Property,
  data: BookingFormData & { moveInDate: string; moveOutDate?: string }
): Promise<ApiResult<Booking>> {
  await mockDelay()

  if (!property.available) {
    return err('This property is not available', 'UNAVAILABLE')
  }
  if (property.published === false || property.listingStatus === 'paused') {
    return err('This listing is not accepting bookings', 'UNPUBLISHED')
  }

  const renter = getDemoRenterProfile()
  const conflict = getBookingConflict(property.id, renter.id, property.type)
  if (conflict.conflict) {
    return err(conflict.message || 'Booking conflict', 'CONFLICT')
  }

  const duration = data.duration || 1
  const depositMonths = property.depositMonths ?? (property.type === 'apartment' ? 2 : 1)
  const deposit = property.rent * depositMonths
  const isInstant = Boolean(property.instantBook)
  const now = new Date().toISOString()

  const booking: Booking = {
    id: `booking-${Date.now()}`,
    propertyId: property.id,
    propertyName: property.name,
    propertyType: property.type,
    propertyAddress: `${property.address}, ${property.area}, ${property.city}`,
    propertyImage: property.images[0] || '',
    renterId: renter.id,
    renterName: renter.name,
    renterPhone: renter.phone,
    renterEmail: renter.email,
    ownerId: property.ownerId,
    ownerName: property.ownerName,
    ownerPhone: property.ownerPhone,
    bookingMode: isInstant ? 'instant' : 'request',
    moveInDate: data.moveInDate,
    moveOutDate: data.moveOutDate,
    duration,
    rent: property.rent,
    deposit,
    totalAmount: property.rent * duration + deposit,
    status: isInstant ? 'approved' : 'pending',
    message: data.message,
    specialRequests: data.specialRequests,
    createdAt: now,
    updatedAt: now,
    approvedAt: isInstant ? now : undefined,
  }

  addBooking(booking)
  return ok(booking)
}

export async function patchBookingStatus(
  bookingId: string,
  status: BookingStatus,
  reason?: string
): Promise<ApiResult<Booking>> {
  await mockDelay()
  const existing = getBookingById(bookingId)
  if (!existing) return err('Booking not found', 'NOT_FOUND')

  if (status === 'approved' && existing.status !== 'pending') {
    return err('Only pending bookings can be approved', 'INVALID_STATE')
  }
  if (status === 'rejected' && existing.status !== 'pending') {
    return err('Only pending bookings can be rejected', 'INVALID_STATE')
  }
  if (status === 'cancelled') {
    if (existing.status !== 'pending' && existing.status !== 'approved') {
      return err('This booking cannot be cancelled', 'INVALID_STATE')
    }
  }
  if (status === 'completed' && existing.status !== 'approved') {
    return err('Only approved bookings can be completed', 'INVALID_STATE')
  }
  if ((status === 'rejected' || status === 'cancelled') && !reason?.trim()) {
    return err('Please provide a reason', 'REASON_REQUIRED')
  }

  const updated = updateBookingStatus(bookingId, status, reason?.trim())
  if (!updated) return err('Failed to update booking')
  return ok(updated)
}

export async function fetchAllBookings(): Promise<ApiResult<Booking[]>> {
  await mockDelay()
  return ok([...mockBookings])
}
