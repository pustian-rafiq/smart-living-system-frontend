export interface RentalHistory {
  id: string
  renterId: string
  propertyId: string
  propertyName: string
  propertyAddress: string
  flatNumber?: string
  moveInDate: string // ISO date string
  moveOutDate?: string // ISO date string
  monthlyRent: number
  status: 'completed' | 'ongoing' | 'terminated'
  terminationReason?: string
  ownerId: string
  ownerName: string
  ownerPhone: string
}

export interface PaymentHistory {
  id: string
  rentalHistoryId: string
  month: string
  year: number
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'partial'
  paidDate?: string // ISO date string
  dueDate: string // ISO date string
  paymentMethod?: 'cash' | 'bkash' | 'nagad' | 'bank' | 'other'
  notes?: string
}

export interface ComplaintHistory {
  id: string
  rentalHistoryId: string
  title: string
  description: string
  category: 'maintenance' | 'noise' | 'payment' | 'behavior' | 'other'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  createdAt: string // ISO date string
  resolvedAt?: string // ISO date string
  resolution?: string
}

export interface OwnerReference {
  id: string
  rentalHistoryId: string
  ownerId: string
  ownerName: string
  ownerPhone: string
  propertyName: string
  referenceText: string
  rating: number // 1-5
  wouldRentAgain: boolean
  createdAt: string // ISO date string
  verified: boolean
}

export interface OwnerRating {
  id: string
  rentalHistoryId: string
  ownerId: string
  ownerName: string
  overallRating: number // 1-5
  punctualityRating: number // 1-5 (payment punctuality)
  cleanlinessRating: number // 1-5
  behaviorRating: number // 1-5
  communicationRating: number // 1-5
  comment?: string
  createdAt: string // ISO date string
}

export interface RenterHistory {
  renterId: string
  renterName: string
  rentalHistories: RentalHistory[]
  paymentHistories: PaymentHistory[]
  complaintHistories: ComplaintHistory[]
  ownerReferences: OwnerReference[]
  ownerRatings: OwnerRating[]
  totalRentals: number
  averageRating: number
  totalComplaints: number
  resolvedComplaints: number
}
