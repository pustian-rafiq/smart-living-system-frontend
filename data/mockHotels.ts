import type { Hotel, Room, Booking, Review, RoomPricing } from '@/types/hotel'

export const mockHotels: Hotel[] = [
  {
    id: 'h1',
    name: 'Grand Plaza Hotel',
    type: 'hotel',
    starRating: 4,
    ownerId: 'owner1',
    ownerName: 'Ahmed Rahman',
    ownerPhone: '+8801712345001',
    ownerEmail: 'ahmed@grandplaza.com',
    address: '123 Main Street, Road 5',
    area: 'Gulshan',
    city: 'Dhaka',
    latitude: 23.8103,
    longitude: 90.4125,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
    ],
    description: 'Luxury hotel in the heart of Gulshan with modern amenities and excellent service. Perfect for business and leisure travelers.',
    amenities: ['WiFi', 'AC', 'Parking', 'Restaurant', 'Gym', 'Swimming Pool', 'Spa', 'Room Service', 'Laundry', 'Airport Shuttle'],
    checkInTime: '14:00',
    checkOutTime: '12:00',
    minimumStay: 1,
    licenseNumber: 'HTL-2024-001',
    verified: true,
    featured: true,
    averageRating: 4.5,
    totalReviews: 128,
    totalRooms: 50,
    availableRooms: 15,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: 'h2',
    name: 'Comfort Guest House',
    type: 'guest-house',
    starRating: 3,
    ownerId: 'owner2',
    ownerName: 'Fatima Begum',
    ownerPhone: '+8801712345002',
    ownerEmail: 'fatima@comfortgh.com',
    address: '45 Park Avenue, Block C',
    area: 'Dhanmondi',
    city: 'Dhaka',
    latitude: 23.7465,
    longitude: 90.3760,
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
    ],
    description: 'Cozy guest house in Dhanmondi area. Affordable accommodation with clean rooms and friendly staff.',
    amenities: ['WiFi', 'AC', 'Parking', 'Restaurant', 'Laundry'],
    checkInTime: '13:00',
    checkOutTime: '11:00',
    minimumStay: 1,
    verified: true,
    featured: false,
    averageRating: 4.0,
    totalReviews: 45,
    totalRooms: 20,
    availableRooms: 8,
    createdAt: '2024-01-05',
    updatedAt: '2024-01-20',
  },
  {
    id: 'h3',
    name: 'Seaside Resort',
    type: 'resort',
    starRating: 5,
    ownerId: 'owner3',
    ownerName: 'Karim Uddin',
    ownerPhone: '+8801712345003',
    ownerEmail: 'karim@seasideresort.com',
    address: 'Beach Road, Cox\'s Bazar',
    area: 'Cox\'s Bazar',
    city: 'Cox\'s Bazar',
    latitude: 21.4272,
    longitude: 92.0058,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    ],
    description: 'Premium beachfront resort with stunning ocean views. Perfect for a relaxing vacation.',
    amenities: ['WiFi', 'AC', 'Parking', 'Restaurant', 'Bar', 'Swimming Pool', 'Beach Access', 'Spa', 'Gym', 'Water Sports'],
    checkInTime: '15:00',
    checkOutTime: '11:00',
    minimumStay: 2,
    verified: true,
    featured: true,
    averageRating: 4.8,
    totalReviews: 256,
    totalRooms: 100,
    availableRooms: 25,
    createdAt: '2023-12-01',
    updatedAt: '2024-01-10',
  },
  {
    id: 'h4',
    name: 'Budget Stay Inn',
    type: 'guest-house',
    starRating: 2,
    ownerId: 'owner4',
    ownerName: 'Hasan Ali',
    ownerPhone: '+8801712345004',
    address: '78 Market Street',
    area: 'Mirpur',
    city: 'Dhaka',
    latitude: 23.8067,
    longitude: 90.3683,
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    ],
    description: 'Affordable guest house for budget travelers. Clean and comfortable rooms.',
    amenities: ['WiFi', 'AC', 'Parking'],
    checkInTime: '12:00',
    checkOutTime: '10:00',
    minimumStay: 1,
    verified: false,
    featured: false,
    averageRating: 3.5,
    totalReviews: 32,
    totalRooms: 15,
    availableRooms: 10,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-25',
  },
  {
    id: 'h5',
    name: 'Business Hotel Dhaka',
    type: 'hotel',
    starRating: 4,
    ownerId: 'owner5',
    ownerName: 'Rashid Ahmed',
    ownerPhone: '+8801712345005',
    ownerEmail: 'rashid@businesshotel.com',
    address: '200 Corporate Avenue',
    area: 'Banani',
    city: 'Dhaka',
    latitude: 23.7949,
    longitude: 90.4034,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    ],
    description: 'Modern business hotel with conference facilities. Ideal for corporate travelers.',
    amenities: ['WiFi', 'AC', 'Parking', 'Restaurant', 'Conference Room', 'Business Center', 'Gym', 'Room Service'],
    checkInTime: '14:00',
    checkOutTime: '12:00',
    minimumStay: 1,
    verified: true,
    featured: false,
    averageRating: 4.2,
    totalReviews: 89,
    totalRooms: 75,
    availableRooms: 20,
    createdAt: '2023-11-15',
    updatedAt: '2024-01-18',
  },
]

export const mockRooms: Room[] = [
  // Grand Plaza Hotel rooms
  { id: 'r1', hotelId: 'h1', roomNumber: '101', type: 'single', floor: 1, capacity: 1, basePrice: 3000, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'], description: 'Comfortable single room with city view', available: true },
  { id: 'r2', hotelId: 'h1', roomNumber: '102', type: 'double', floor: 1, capacity: 2, basePrice: 4500, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'], description: 'Spacious double room with balcony', available: true },
  { id: 'r3', hotelId: 'h1', roomNumber: '201', type: 'suite', floor: 2, capacity: 4, basePrice: 8000, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Living Room', 'Jacuzzi'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'], description: 'Luxury suite with separate living area', available: false },
  { id: 'r4', hotelId: 'h1', roomNumber: '301', type: 'family', floor: 3, capacity: 6, basePrice: 10000, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Kitchenette', 'Balcony'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'], description: 'Family room with kitchenette', available: true },
  
  // Comfort Guest House rooms
  { id: 'r5', hotelId: 'h2', roomNumber: '1', type: 'single', floor: 1, capacity: 1, basePrice: 1500, amenities: ['WiFi', 'AC', 'TV'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'], description: 'Basic single room', available: true },
  { id: 'r6', hotelId: 'h2', roomNumber: '2', type: 'double', floor: 1, capacity: 2, basePrice: 2500, amenities: ['WiFi', 'AC', 'TV'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'], description: 'Comfortable double room', available: true },
  
  // Seaside Resort rooms
  { id: 'r7', hotelId: 'h3', roomNumber: '101', type: 'double', floor: 1, capacity: 2, basePrice: 6000, amenities: ['WiFi', 'AC', 'TV', 'Ocean View', 'Balcony'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'], description: 'Ocean view double room', available: true },
  { id: 'r8', hotelId: 'h3', roomNumber: '201', type: 'suite', floor: 2, capacity: 4, basePrice: 12000, amenities: ['WiFi', 'AC', 'TV', 'Ocean View', 'Living Room', 'Jacuzzi'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'], description: 'Premium ocean view suite', available: true },
  { id: 'r9', hotelId: 'h3', roomNumber: '301', type: 'family', floor: 3, capacity: 6, basePrice: 15000, amenities: ['WiFi', 'AC', 'TV', 'Ocean View', 'Kitchenette', 'Balcony'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'], description: 'Family suite with ocean view', available: false },
]

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    hotelId: 'h1',
    roomId: 'r1',
    userId: 'user1',
    guestName: 'John Doe',
    guestPhone: '+8801711111111',
    guestEmail: 'john@example.com',
    checkIn: '2024-02-15',
    checkOut: '2024-02-17',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    guests: 1,
    status: 'confirmed',
    paymentStatus: 'paid',
    totalAmount: 6000,
    advanceAmount: 3000,
    remainingAmount: 3000,
    paymentMethod: 'bkash',
    transactionId: 'BK123456789',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: 'b2',
    hotelId: 'h3',
    roomId: 'r7',
    userId: 'user2',
    guestName: 'Jane Smith',
    guestPhone: '+8801722222222',
    guestEmail: 'jane@example.com',
    checkIn: '2024-02-20',
    checkOut: '2024-02-23',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    guests: 2,
    status: 'pending',
    paymentStatus: 'pending',
    totalAmount: 18000,
    advanceAmount: 0,
    remainingAmount: 18000,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25',
  },
]

export const mockReviews: Review[] = [
  {
    id: 'rev1',
    hotelId: 'h1',
    bookingId: 'b1',
    userId: 'user1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Excellent hotel with great service. Rooms are clean and staff is very helpful.',
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'],
    createdAt: '2024-01-18',
  },
  {
    id: 'rev2',
    hotelId: 'h1',
    bookingId: 'b2',
    userId: 'user2',
    userName: 'Jane Smith',
    rating: 4,
    comment: 'Good hotel, but could improve the breakfast quality.',
    createdAt: '2024-01-15',
    ownerResponse: 'Thank you for your feedback. We are working on improving our breakfast menu.',
    ownerResponseDate: '2024-01-16',
  },
  {
    id: 'rev3',
    hotelId: 'h3',
    bookingId: 'b3',
    userId: 'user3',
    userName: 'Mike Johnson',
    rating: 5,
    comment: 'Amazing resort! The ocean view is breathtaking. Highly recommended!',
    createdAt: '2024-01-10',
  },
]

export const mockRoomPricing: RoomPricing[] = [
  // Weekend pricing examples
  { roomId: 'r1', date: '2024-02-17', price: 3000, isWeekend: true, isSpecialOffer: false },
  { roomId: 'r1', date: '2024-02-18', price: 3000, isWeekend: false, isSpecialOffer: false },
  { roomId: 'r2', date: '2024-02-17', price: 5000, isWeekend: true, isSpecialOffer: false },
  { roomId: 'r2', date: '2024-02-18', price: 4500, isWeekend: false, isSpecialOffer: false },
]

// Helper functions
export function getRoomsByHotelId(hotelId: string): Room[] {
  return mockRooms.filter(room => room.hotelId === hotelId)
}

export function getBookingsByHotelId(hotelId: string): Booking[] {
  return mockBookings.filter(booking => booking.hotelId === hotelId)
}

export function getBookingsByUserId(userId: string): Booking[] {
  return mockBookings.filter(booking => booking.userId === userId)
}

export function getReviewsByHotelId(hotelId: string): Review[] {
  return mockReviews.filter(review => review.hotelId === hotelId)
}

export function getRoomPricing(roomId: string, date: string): RoomPricing | undefined {
  return mockRoomPricing.find(p => p.roomId === roomId && p.date === date)
}
