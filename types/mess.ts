export interface Student {
  id: string
  name: string
  phone: string
  email?: string
  studentId?: string
  university?: string
  seatNumber?: string
  joinedDate: string
  monthlyFee: number
}

export interface Notice {
  id: string
  title: string
  content: string
  date: string
  priority: 'high' | 'medium' | 'low'
  messId: string
  category?: 'general' | 'payment' | 'maintenance' | 'event' | 'announcement' | 'rule' | 'other'
  expiryDate?: string // ISO date string
  pdfUrl?: string // PDF file URL
  imageUrls?: string[] // Array of image URLs
  createdBy: string // User ID who created the notice
  createdAt: string // ISO date string
  acknowledgments?: NoticeAcknowledgment[] // List of user acknowledgments
}

export interface NoticeAcknowledgment {
  userId: string
  userName: string
  acknowledgedAt: string // ISO date string
}

export interface Mess {
  id: string
  name: string
  address: string
  city: string
  totalSeats: number
  availableSeats: number
  monthlyFee: number
  gender: 'male' | 'female' | 'mixed'
  facilities: string[]
  images: string[]
  description?: string
  ownerName: string
  ownerPhone: string
  createdAt: string
}

export interface Seat {
  id: string
  seatNumber: string
  roomNumber: string
  status: 'available' | 'occupied'
  studentId?: string
  messId: string
}
