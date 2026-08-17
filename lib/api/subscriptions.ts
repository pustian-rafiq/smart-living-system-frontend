import { apiRequest } from './client'
import type { ApiResult } from './http'
import type {
  FlatLimitStatus,
  OwnerSubscription,
  PlanTier,
} from '@/types/subscription'
import { FEATURED_BOOST_OPTIONS } from '@/lib/monetization/boostOptions'

export async function fetchOwnerSubscription(
  _ownerId?: string,
): Promise<ApiResult<OwnerSubscription>> {
  return apiRequest<OwnerSubscription>('/subscriptions/mine/')
}

export async function fetchFlatLimitStatus(
  _ownerId?: string,
): Promise<ApiResult<FlatLimitStatus>> {
  return apiRequest<FlatLimitStatus>('/subscriptions/flat-limit/')
}

export async function upgradeOwnerPlan(
  tier: PlanTier,
  _ownerId?: string,
): Promise<ApiResult<OwnerSubscription>> {
  return apiRequest<OwnerSubscription>('/subscriptions/upgrade/', {
    method: 'POST',
    body: { tier },
  })
}

export async function purchaseFeaturedBoost(
  listingId: string,
  boostId: string,
  _ownerId?: string,
): Promise<ApiResult<{ featuredUntil: string }>> {
  return apiRequest<{ featuredUntil: string }>(
    '/subscriptions/featured-boost/',
    {
      method: 'POST',
      body: { listingId, boostId },
    },
  )
}

export { FEATURED_BOOST_OPTIONS }
