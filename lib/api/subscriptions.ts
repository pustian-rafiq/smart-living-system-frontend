import { apiRequest } from './client'
import type { ApiResult } from './http'
import type {
  FeaturedBoostOption,
  FlatLimitStatus,
  OwnerSubscription,
  OwnerUsageStatus,
  PlanTier,
  SubscriptionPlan,
} from '@/types/subscription'
import { FEATURED_BOOST_OPTIONS } from '@/lib/monetization/boostOptions'

export async function fetchOwnerSubscription(
  _ownerId?: string,
): Promise<ApiResult<OwnerSubscription>> {
  return apiRequest<OwnerSubscription>('/subscriptions/mine/')
}

export async function fetchSubscriptionPlans(): Promise<
  ApiResult<SubscriptionPlan[]>
> {
  return apiRequest<SubscriptionPlan[]>('/subscriptions/plans/')
}

export async function fetchFeaturedBoostOptions(): Promise<
  ApiResult<FeaturedBoostOption[]>
> {
  return apiRequest<FeaturedBoostOption[]>(
    '/subscriptions/featured-boost/options/',
  )
}

export async function fetchFlatLimitStatus(
  _ownerId?: string,
): Promise<ApiResult<FlatLimitStatus>> {
  return apiRequest<FlatLimitStatus>('/subscriptions/flat-limit/')
}

/** Per-module usage (mess / flats / hotels) for the logged-in owner. */
export async function fetchOwnerUsageStatus(
  _ownerId?: string,
): Promise<ApiResult<OwnerUsageStatus>> {
  return apiRequest<OwnerUsageStatus>('/subscriptions/usage/')
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

export type AdCampaign = {
  id: string
  name: string
  targetType: 'listing' | 'mess' | 'hotel'
  listingId?: string | null
  messId?: string | null
  hotelId?: string | null
  status: string
  startsAt: string
  endsAt: string
  dailyBudget: number
  bidAmount: number
  qualityScore: number
  rankScore: number
  impressions: number
  clicks: number
  spend: number
  vacancyFlash: boolean
  isLive: boolean
  createdAt: string
}

export type CampaignAnalytics = {
  totalCampaigns: number
  activeCampaigns: number
  impressions: number
  clicks: number
  spend: number
  vacancyFlashes: number
  slotCap: number
  slotsUsed: number
}

export async function fetchAdCampaigns(): Promise<ApiResult<AdCampaign[]>> {
  return apiRequest<AdCampaign[]>('/subscriptions/campaigns/')
}

export async function fetchCampaignAnalytics(): Promise<
  ApiResult<CampaignAnalytics>
> {
  return apiRequest<CampaignAnalytics>('/subscriptions/campaigns/analytics/')
}

export async function createAdCampaign(body: {
  name: string
  targetType: 'listing' | 'mess' | 'hotel'
  listingId?: string
  messId?: string
  hotelId?: string
  durationDays?: number
  dailyBudget?: number
  bidAmount?: number
}): Promise<ApiResult<AdCampaign>> {
  return apiRequest<AdCampaign>('/subscriptions/campaigns/', {
    method: 'POST',
    body,
  })
}

export async function endAdCampaign(
  id: string,
): Promise<ApiResult<AdCampaign>> {
  return apiRequest<AdCampaign>(`/subscriptions/campaigns/${id}/`, {
    method: 'PATCH',
    body: { status: 'ended' },
  })
}

export { FEATURED_BOOST_OPTIONS }
