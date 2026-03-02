import type { Booking, BookingStatus } from '@/types/booking'

export const mockBookings: Booking[] = [
  {
    id: '1',
    propertyId: '1',
    propertyName: 'Green Valley Mess',
    propertyType: 'mess',
    propertyAddress: 'House 45, Road 7, Block C, Mirpur-10, Dhaka',
    propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    renterId: 'renter1',
    renterName: 'Rahim Uddin',
    renterPhone: '+8801711111111',
    renterEmail: 'rahim@example.com',
    ownerId: 'owner1',
    ownerName: 'Abdul Karim',
    ownerPhone: '+8801712345678',
    status: 'pending',
    moveInDate: '2024-03-01',
    duration: 6,
    rent: 3500,
    deposit: 7000,
    totalAmount: 28000,
    message: 'I am a student at DU. Looking for a clean and quiet place.',
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
  },
  {
    id: '2',
    propertyId: '2',
    propertyName: 'Sunshine Apartment',
    propertyType: 'apartment',
    propertyAddress: 'Flat 4B, Building 12, Sector 7, Uttara, Dhaka',
    propertyImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    renterId: 'renter2',
    renterName: 'Fatima Begum',
    renterPhone: '+8801722222222',
    renterEmail: 'fatima@example.com',
    ownerId: 'owner2',
    ownerName: 'Fatima Begum',
    ownerPhone: '+8801712345679',
    status: 'approved',
    moveInDate: '2024-02-20',
    duration: 12,
    rent: 15000,
    deposit: 30000,
    totalAmount: 210000,
    message: 'Family of 3. Need a safe and secure place.',
    createdAt: '2024-02-10T14:20:00Z',
    updatedAt: '2024-02-12T09:15:00Z',
    approvedAt: '2024-02-12T09:15:00Z',
  },
  {
    id: '3',
    propertyId: '3',
    propertyName: 'Student Hub Mess',
    propertyType: 'mess',
    propertyAddress: 'House 23, Road 27, Dhanmondi, Dhaka',
    propertyImage: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7c8?w=800',
    renterId: 'renter3',
    renterName: 'Karim Ahmed',
    renterPhone: '+8801733333333',
    ownerId: 'owner3',
    ownerName: 'Rashid Ahmed',
    ownerPhone: '+8801712345680',
    status: 'rejected',
    moveInDate: '2024-03-15',
    duration: 3,
    rent: 3200,
    deposit: 6400,
    totalAmount: 16000,
    message: 'Looking for short-term accommodation.',
    rejectionReason: 'Not available for short-term rental.',
    createdAt: '2024-02-18T11:00:00Z',
    updatedAt: '2024-02-19T16:30:00Z',
    rejectedAt: '2024-02-19T16:30:00Z',
  },
  {
    id: '4',
    propertyId: '4',
    propertyName: 'Ladies Hostel',
    propertyType: 'hostel',
    propertyAddress: 'House 12, Road 8, Block A, Mohammadpur, Dhaka',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    renterId: 'renter4',
    renterName: 'Sultana Khatun',
    renterPhone: '+8801744444444',
    ownerId: 'owner4',
    ownerName: 'Nazma Khatun',
    ownerPhone: '+8801712345681',
    status: 'cancelled',
    moveInDate: '2024-03-01',
    duration: 6,
    rent: 4000,
    deposit: 8000,
    totalAmount: 32000,
    message: 'Need accommodation for university.',
    createdAt: '2024-02-20T08:00:00Z',
    updatedAt: '2024-02-22T10:00:00Z',
    approvedAt: '2024-02-21T12:00:00Z',
    cancelledAt: '2024-02-22T10:00:00Z',
  },
  {
    id: '5',
    propertyId: '7',
    propertyName: 'Family Apartment',
    propertyType: 'apartment',
    propertyAddress: 'Flat 5C, Building 20, Road 45, Gulshan, Dhaka',
    propertyImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    renterId: 'renter5',
    renterName: 'Mohammad Ali',
    renterPhone: '+8801755555555',
    ownerId: 'owner7',
    ownerName: 'Rahman Mia',
    ownerPhone: '+8801712345684',
    status: 'completed',
    moveInDate: '2024-01-01',
    moveOutDate: '2024-12-31',
    duration: 12,
    rent: 12000,
    deposit: 24000,
    totalAmount: 168000,
    message: 'Long-term rental for family.',
    createdAt: '2023-12-15T10:00:00Z',
    updatedAt: '2024-12-31T23:59:59Z',
    approvedAt: '2023-12-18T14:00:00Z',
  },
]

// Helper functions
export function getBookingsByRenter(renterId: string): Booking[] {
  return mockBookings.filter(b => b.renterId === renterId)
}

export function getBookingsByOwner(ownerId: string): Booking[] {
  return mockBookings.filter(b => b.ownerId === ownerId)
}

export function getBookingsByStatus(status: BookingStatus): Booking[] {
  return mockBookings.filter(b => b.status === status)
}

export function getBookingsByProperty(propertyId: string): Booking[] {
  return mockBookings.filter(b => b.propertyId === propertyId)
}

export function addBooking(booking: Booking): void {
  mockBookings.push(booking)
}

export function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  rejectionReason?: string
): void {
  const booking = mockBookings.find(b => b.id === bookingId)
  if (booking) {
    booking.status = status
    booking.updatedAt = new Date().toISOString()
    if (status === 'approved') {
      booking.approvedAt = new Date().toISOString()
    } else if (status === 'rejected') {
      booking.rejectedAt = new Date().toISOString()
      if (rejectionReason) {
        booking.rejectionReason = rejectionReason
      }
    } else if (status === 'cancelled') {
      booking.cancelledAt = new Date().toISOString()
    }
  }
}
