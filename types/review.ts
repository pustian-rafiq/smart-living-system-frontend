export interface PropertyReview {
  id: string
  propertyId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  images?: string[]
  createdAt: string
  ownerResponse?: string
  ownerResponseDate?: string
  /** Stay type helps trust (e.g. lived 6 months) */
  stayDurationMonths?: number
  verifiedStay?: boolean
}

export interface ReviewSummary {
  averageRating: number
  totalReviews: number
  distribution: Record<1 | 2 | 3 | 4 | 5, number>
}

export interface ReviewFormData {
  rating: number
  comment: string
  stayDurationMonths?: number
}
