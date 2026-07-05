import type { Hotel, Booking, Room, Review, RoomPricing, HotelRegistrationInput } from '@/types/hotel'
import {
  mockHotels,
  mockRooms,
  mockBookings,
  mockReviews,
  mockRoomPricing,
  addHotel,
  updateHotelPricing,
  addHotelBooking,
  getRoomsByHotelId,
  getBookingsByHotelId,
  getBookingsByUserId,
  getReviewsByHotelId,
  getRoomPricing,
} from '@/data/mockHotels'
import { getDemoOwnerId, getDemoUserId } from './demoUser'
import { mockDelay, ok, err, type ApiResult } from './http'

export async function fetchHotels(): Promise<ApiResult<Hotel[]>> {
  await mockDelay()
  return ok([...mockHotels])
}

export async function fetchHotelById(
  id: string
): Promise<ApiResult<Hotel | undefined>> {
  await mockDelay(150)
  return ok(mockHotels.find(h => h.id === id))
}

export async function fetchOwnerHotels(
  ownerId?: string
): Promise<ApiResult<Hotel[]>> {
  await mockDelay()
  const id = ownerId || getDemoOwnerId()
  return ok(mockHotels.filter(h => h.ownerId === id))
}

export async function registerHotel(
  input: HotelRegistrationInput,
  ownerId?: string
): Promise<ApiResult<Hotel>> {
  await mockDelay(200)
  const hotel = addHotel(input, ownerId || getDemoOwnerId())
  return ok(hotel)
}

export async function patchHotelPricing(
  hotelId: string,
  rules: Parameters<typeof updateHotelPricing>[1]
): Promise<ApiResult<Hotel>> {
  await mockDelay(150)
  const updated = updateHotelPricing(hotelId, rules)
  if (!updated) return err('Hotel not found', 'NOT_FOUND')
  return ok(updated)
}

export async function fetchHotelRooms(
  hotelId: string
): Promise<ApiResult<Room[]>> {
  await mockDelay()
  return ok(getRoomsByHotelId(hotelId))
}

export async function fetchHotelBookings(
  hotelId: string
): Promise<ApiResult<Booking[]>> {
  await mockDelay()
  return ok(getBookingsByHotelId(hotelId))
}

export async function fetchUserHotelBookings(
  userId?: string
): Promise<ApiResult<Booking[]>> {
  await mockDelay()
  return ok(getBookingsByUserId(userId || getDemoUserId()))
}

export async function createHotelBooking(
  booking: Booking
): Promise<ApiResult<Booking>> {
  await mockDelay(200)
  return ok(addHotelBooking(booking))
}

export async function fetchHotelReviews(
  hotelId: string
): Promise<ApiResult<Review[]>> {
  await mockDelay()
  return ok(getReviewsByHotelId(hotelId))
}

export async function fetchRoomPricing(
  hotelId: string,
  roomId: string
): Promise<ApiResult<RoomPricing | undefined>> {
  await mockDelay(100)
  return ok(getRoomPricing(hotelId, roomId))
}

/** Sync list for layouts / server metadata */
export function getHotelsSync(): Hotel[] {
  return [...mockHotels]
}

export { mockRooms, mockBookings, mockRoomPricing, getBookingsByHotelId }
