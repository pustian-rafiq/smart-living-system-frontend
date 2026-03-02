export type PropertyType = 'mess' | 'apartment' | 'hostel' | 'hotel'
export type Gender = 'male' | 'female' | 'mixed' | null
export type SeatType = 'single' | 'shared' | null
export type MealPlan = 'breakfast' | 'lunch' | 'dinner' | 'all' | null
export type FurnishingStatus = 'furnished' | 'unfurnished' | 'semi-furnished' | null
export type VerificationStatus = 'verified' | 'pending' | 'unverified'

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
  ownerName: string
  ownerPhone: string
  createdAt: string
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
