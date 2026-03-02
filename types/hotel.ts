export type HotelType = 'hotel' | 'guest-house' | 'resort'
export type RoomType = 'single' | 'double' | 'suite' | 'family'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'checked-in' | 'checked-out'
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'partial'

export interface Room {
  id: string
  hotelId: string
  roomNumber: string
  type: RoomType
  floor: number
  capacity: number // max guests
  basePrice: number // per night
  amenities: string[]
  images: string[]
  description: string
  available: boolean
}

export interface RoomPricing {
  roomId: string
  date: string // YYYY-MM-DD
  price: number
  isWeekend: boolean
  isSpecialOffer: boolean
  offerPrice?: number
}

export interface Review {
  id: string
  hotelId: string
  bookingId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number // 1-5
  comment: string
  images?: string[]
  createdAt: string
  ownerResponse?: string
  ownerResponseDate?: string
}

export interface Booking {
  id: string
  hotelId: string
  roomId: string
  userId: string
  guestName: string
  guestPhone: string
  guestEmail?: string
  checkIn: string // YYYY-MM-DD
  checkOut: string // YYYY-MM-DD
  checkInTime?: string // HH:mm
  checkOutTime?: string // HH:mm
  guests: number
  status: BookingStatus
  paymentStatus: PaymentStatus
  totalAmount: number
  advanceAmount: number
  remainingAmount: number
  paymentMethod?: 'bkash' | 'nagad' | 'rocket' | 'card' | 'cash'
  transactionId?: string
  specialRequests?: string
  createdAt: string
  updatedAt: string
}

export interface Hotel {
  id: string
  name: string
  type: HotelType
  starRating?: number // 1-5
  ownerId: string
  ownerName: string
  ownerPhone: string
  ownerEmail?: string
  address: string
  area: string
  city: string
  latitude?: number
  longitude?: number
  images: string[]
  description: string
  amenities: string[] // WiFi, AC, Parking, Restaurant, etc.
  checkInTime: string // HH:mm
  checkOutTime: string // HH:mm
  minimumStay: number // nights
  licenseNumber?: string
  licenseDocument?: string
  verified: boolean
  featured: boolean
  averageRating: number // 0-5
  totalReviews: number
  totalRooms: number
  availableRooms: number
  createdAt: string
  updatedAt: string
}

export interface HotelSearchFilters {
  city?: string
  area?: string
  hotelType?: HotelType | 'all'
  minPrice?: number
  maxPrice?: number
  minRating?: number
  amenities?: string[]
  roomType?: RoomType | 'all'
  checkIn?: string
  checkOut?: string
  guests?: number
}
