export type PropertyType = 'mess' | 'apartment' | 'hostel' | 'hotel'
export type Gender = 'male' | 'female' | 'mixed' | null
export type SeatType = 'single' | 'shared' | null
export type MealPlan = 'breakfast' | 'lunch' | 'dinner' | 'all' | null
export type FurnishingStatus =
  | 'furnished'
  | 'unfurnished'
  | 'semi-furnished'
  | null
export type VerificationStatus = 'verified' | 'pending' | 'unverified'
export type ListingStatus = 'draft' | 'published' | 'paused' | 'rejected'

export interface Property {
  id: string
  name: string
  type: PropertyType
  rent: number
  area: string
  address: string
  city: string
  latitude?: number
  longitude?: number
  available: boolean
  gender?: Gender
  seatType?: SeatType // For mess/hostel
  mealIncluded?: boolean // For mess
  mealPlan?: MealPlan // For mess
  mealCost?: number // For mess
  images: string[]
  videos?: string[] // Video walkthrough URLs
  videoThumbnail?: string // Video thumbnail image
  facilities: string[]
  nearbyFacilities?: string[] // bus stop, metro, hospital, university
  buildingAge?: number // in years
  floorLevel?: number
  furnishing?: FurnishingStatus
  parking?: boolean
  security?: boolean
  verified?: boolean
  verificationStatus?: VerificationStatus
  verifiedAt?: string // Date when verified
  description: string
  ownerId: string
  ownerName: string
  ownerPhone: string
  createdAt: string
  /** Instant book auto-approves; otherwise owner must accept */
  instantBook?: boolean
  /** Security deposit in months of rent */
  depositMonths?: number
  /** Public discovery visibility */
  published?: boolean
  listingStatus?: ListingStatus
  /** Cached rating (1–5), synced from reviews */
  rating?: number
  reviewCount?: number
  updatedAt?: string
  /** Paid featured boost — higher visibility in search */
  featured?: boolean
  featuredUntil?: string
  lastConfirmedAt?: string | null
  confirmedHoursAgo?: number | null
  stale?: boolean
  /** AI-computed match score (0–100), only present in AI match results */
  aiMatchScore?: number
  /** Live seats from mess ops when the listing is linked */
  openSeats?: number | null
  verificationScore?: import('./living').VerificationScore
  livingCost?: import('./living').LivingCost
  livingConditionScore?: import('./living').VerificationScore
  safetyScore?: import('./living').VerificationScore
  tourImages?: string[]
  cctv?: boolean | null
  streetLighting?: boolean | null
  addressVerified?: boolean
  photosVerified?: boolean
  rentVerified?: boolean
}

export interface PropertyListingInput {
  name: string
  type: PropertyType
  rent: number
  area: string
  address: string
  city: string
  latitude?: number
  longitude?: number
  available: boolean
  gender?: Gender
  seatType?: SeatType
  mealIncluded?: boolean
  mealPlan?: MealPlan
  mealCost?: number
  images: string[]
  videos?: string[]
  videoThumbnail?: string
  facilities: string[]
  nearbyFacilities?: string[]
  buildingAge?: number
  floorLevel?: number
  furnishing?: FurnishingStatus
  parking?: boolean
  security?: boolean
  description: string
  instantBook?: boolean
  depositMonths?: number
  published?: boolean
  listingStatus?: ListingStatus
}

export interface SearchFilters {
  propertyType: PropertyType | 'all'
  city?: string
  area?: string
  rentRange: [number, number]
  availableOnly: boolean
  gender: Gender
  seatType?: SeatType
  mealIncluded?: boolean
  mealPlan?: MealPlan
  nearbyFacilities?: string[]
  buildingAge?: number
  floorLevel?: number
  furnishing?: FurnishingStatus
  parking?: boolean
  security?: boolean
  verifiedOnly?: boolean
}
