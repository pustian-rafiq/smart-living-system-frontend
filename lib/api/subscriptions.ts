import {
  getOwnerSubscription,
  setOwnerPlanTier,
  incrementFeaturedCount,
} from '@/data/mockSubscriptions'
import { updateProperty } from '@/data/mockProperties'
import { getPlanByTier } from '@/lib/monetization/plans'
import { FEATURED_BOOST_OPTIONS } from '@/lib/monetization/boostOptions'
import { getDemoOwnerId } from './demoUser'
import { mockDelay, ok, err, type ApiResult } from './http'
import type {
  FlatLimitStatus,
  OwnerSubscription,
  PlanTier,
} from '@/types/subscription'

export async function fetchOwnerSubscription(
  ownerId?: string
): Promise<ApiResult<OwnerSubscription>> {
  await mockDelay()
  const id = ownerId || getDemoOwnerId()
  return ok(getOwnerSubscription(id))
}

export async function fetchFlatLimitStatus(
  ownerId?: string
): Promise<ApiResult<FlatLimitStatus>> {
  await mockDelay(100)
  const id = ownerId || getDemoOwnerId()
  const sub = getOwnerSubscription(id)
  const plan = getPlanByTier(sub.planTier)
  const max = plan.maxFlats
  const used = sub.flatsUsed
  const unlimited = max < 0

  return ok({
    used,
    max,
    atLimit: !unlimited && used >= max,
    nearLimit: !unlimited && used >= Math.max(1, Math.floor(max * 0.8)),
    planTier: sub.planTier,
    planName: plan.name,
  })
}

export async function upgradeOwnerPlan(
  tier: PlanTier,
  ownerId?: string
): Promise<ApiResult<OwnerSubscription>> {
  await mockDelay(400)
  const id = ownerId || getDemoOwnerId()
  if (tier === 'free') return err('Already on free plan or downgrade via support')
  const plan = getPlanByTier(tier)
  const updated = setOwnerPlanTier(id, tier)
  return ok({ ...updated, planTier: plan.tier })
}

export async function purchaseFeaturedBoost(
  listingId: string,
  boostId: string,
  ownerId?: string
): Promise<ApiResult<{ featuredUntil: string }>> {
  await mockDelay(500)
  const id = ownerId || getDemoOwnerId()
  const boost = FEATURED_BOOST_OPTIONS.find(b => b.id === boostId)
  if (!boost) return err('Invalid boost option')

  const until = new Date()
  until.setDate(until.getDate() + boost.durationDays)
  const featuredUntil = until.toISOString().slice(0, 10)

  const updated = updateProperty(listingId, {
    featured: true,
    featuredUntil,
  })
  if (!updated) return err('Listing not found', 'NOT_FOUND')
  if (updated.ownerId !== id) {
    return err('You can only boost your own listings', 'FORBIDDEN')
  }

  incrementFeaturedCount(id)
  return ok({ featuredUntil })
}

export { FEATURED_BOOST_OPTIONS }
