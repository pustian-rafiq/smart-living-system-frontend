export type PlanTier = 'free' | 'basic' | 'premium'

export type OwnerModuleKey = 'mess' | 'apartment' | 'hotel'

export interface SubscriptionPlan {
  tier: PlanTier
  name: string
  price: number
  maxFlats: number
  maxMesses: number
  maxHotels: number
  features: string[]
  highlighted?: boolean
}

export interface OwnerSubscription {
  ownerId: string
  planTier: PlanTier
  billingCycleStart: string
  billingCycleEnd: string
  flatsUsed: number
  messesUsed?: number
  hotelsUsed?: number
  activeFeaturedListings: number
}

export interface FeaturedBoostOption {
  id: string
  label: string
  durationDays: number
  price: number
  description: string
}

export interface ModuleLimitStatus {
  used: number
  max: number
  atLimit: boolean
  nearLimit: boolean
}

/** Legacy apartment-only shape — still returned by /flat-limit/. */
export interface FlatLimitStatus {
  used: number
  max: number
  atLimit: boolean
  nearLimit: boolean
  planTier: PlanTier
  planName: string
}

/** Multi-module usage from /subscriptions/usage/. */
export interface OwnerUsageStatus {
  planTier: PlanTier
  planName: string
  enabledVerticals: OwnerModuleKey[]
  primaryFocus: string
  mess: ModuleLimitStatus
  apartment: ModuleLimitStatus
  hotel: ModuleLimitStatus
  /** Legacy flat fields (= apartment module). */
  used: number
  max: number
  atLimit: boolean
  nearLimit: boolean
}

export interface BookingCommission {
  grossAmount: number
  commissionRate: number
  commissionAmount: number
  netAmount: number
}
