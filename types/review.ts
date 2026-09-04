export const REVIEW_CATEGORIES = [
  'cleanliness',
  'security',
  'ownerBehaviour',
  'location',
  'valueForMoney',
] as const

export type ReviewCategory = (typeof REVIEW_CATEGORIES)[number]

export type CategoryRatings = Partial<Record<ReviewCategory, number>>

export interface PropertyReview {
  id: string
  propertyId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  cleanliness?: number | null
  security?: number | null
  ownerBehaviour?: number | null
  location?: number | null
  valueForMoney?: number | null
  comment: string
  images?: string[]
  createdAt: string
  ownerResponse?: string
  ownerResponseDate?: string
  stayDurationMonths?: number
  verifiedStay?: boolean
}

export interface ReviewSummary {
  averageRating: number
  totalReviews: number
  distribution: Record<1 | 2 | 3 | 4 | 5, number>
  categoryAverages?: Record<ReviewCategory, number | null>
}

export interface ReviewFormData {
  rating: number
  comment: string
  stayDurationMonths?: number
  cleanliness?: number
  security?: number
  ownerBehaviour?: number
  location?: number
  valueForMoney?: number
}
