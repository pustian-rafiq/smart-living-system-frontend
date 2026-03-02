export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed'

export interface Booking {
  id: string
  propertyId: string
  propertyName: string
  propertyType: 'mess' | 'apartment' | 'hostel' | 'hotel'
  propertyAddress: string
  propertyImage?: string
  renterId: string
  renterName: string
  renterPhone: string
  renterEmail?: string
  ownerId: string
  ownerName: string
  ownerPhone: string
  status: BookingStatus
  moveInDate?: string
  moveOutDate?: string
  duration?: number // in months
  rent: number
  deposit?: number
  totalAmount: number
  message?: string
  specialRequests?: string
  createdAt: string
  updatedAt: string
  approvedAt?: string
  rejectedAt?: string
  cancelledAt?: string
  rejectionReason?: string
}

export interface BookingFormData {
  moveInDate: string
  moveOutDate?: string
  duration?: number
  message?: string
  specialRequests?: string
  agreeToTerms: boolean
}
