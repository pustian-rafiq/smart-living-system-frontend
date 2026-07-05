export type PlanTier = 'free' | 'basic' | 'premium'

export interface SubscriptionPlan {
  tier: PlanTier
  name: string
  price: number
  maxFlats: number
  features: string[]
  highlighted?: boolean
}

export interface OwnerSubscription {
  ownerId: string
  planTier: PlanTier
  billingCycleStart: string
  billingCycleEnd: string
  flatsUsed: number
  activeFeaturedListings: number
}

export interface FeaturedBoostOption {
  id: string
  label: string
  durationDays: number
  price: number
  description: string
}

export interface FlatLimitStatus {
  used: number
  max: number
  atLimit: boolean
  nearLimit: boolean
  planTier: PlanTier
  planName: string
}

export interface BookingCommission {
  grossAmount: number
  commissionRate: number
  commissionAmount: number
  netAmount: number
}
