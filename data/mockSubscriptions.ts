import { mockFlats } from './mockBuildings'
import { mockProperties } from './mockProperties'
import type { PlanTier, OwnerSubscription } from '@/types/subscription'

/** In-memory owner subscription (demo) */
let ownerSubscriptions: Record<string, OwnerSubscription> = {
  owner1: {
    ownerId: 'owner1',
    planTier: 'free',
    billingCycleStart: '2026-07-01',
    billingCycleEnd: '2026-07-31',
    flatsUsed: mockFlats.length,
    activeFeaturedListings: mockProperties.filter(p => p.featured).length,
  },
}

export function getOwnerSubscription(ownerId: string): OwnerSubscription {
  const existing = ownerSubscriptions[ownerId]
  if (existing) {
    return {
      ...existing,
      flatsUsed: mockFlats.length,
      activeFeaturedListings: mockProperties.filter(
        p => p.ownerId === ownerId && p.featured
      ).length,
    }
  }
  const sub: OwnerSubscription = {
    ownerId,
    planTier: 'free',
    billingCycleStart: new Date().toISOString().slice(0, 10),
    billingCycleEnd: new Date(Date.now() + 30 * 86400000)
      .toISOString()
      .slice(0, 10),
    flatsUsed: mockFlats.length,
    activeFeaturedListings: 0,
  }
  ownerSubscriptions[ownerId] = sub
  return sub
}

export function setOwnerPlanTier(ownerId: string, tier: PlanTier): OwnerSubscription {
  const sub = getOwnerSubscription(ownerId)
  const updated: OwnerSubscription = {
    ...sub,
    planTier: tier,
    billingCycleStart: new Date().toISOString().slice(0, 10),
    billingCycleEnd: new Date(Date.now() + 30 * 86400000)
      .toISOString()
      .slice(0, 10),
  }
  ownerSubscriptions[ownerId] = updated
  return updated
}

export function incrementFeaturedCount(ownerId: string): void {
  const sub = getOwnerSubscription(ownerId)
  ownerSubscriptions[ownerId] = {
    ...sub,
    activeFeaturedListings: sub.activeFeaturedListings + 1,
  }
}
