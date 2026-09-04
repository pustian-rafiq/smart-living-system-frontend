import { apiRequest } from './client'
import type { ApiResult } from './http'
import type { Property } from '@/types/property'
import type { Hotel } from '@/types/hotel'
import type { Mess } from '@/types/mess'

export type DiscoverCategory = 'all' | 'mess' | 'apartment' | 'hostel' | 'hotel'

export interface DiscoverFeed {
  featured: Property[]
  listings: Property[]
  apartments: Property[]
  hotels: Hotel[]
  messes: Mess[]
  newThisWeek: Property[]
  sponsoredLabel: string
  generatedAt: string
}

export interface DiscoverSearchResult {
  category: DiscoverCategory | string
  listings: Property[]
  hotels: Hotel[]
  messes: Mess[]
}

export async function fetchDiscoverFeed(
  limit = 8,
): Promise<ApiResult<DiscoverFeed>> {
  return apiRequest<DiscoverFeed>(`/discover/?limit=${limit}`, { auth: false })
}

export async function fetchDiscoverSearch(params: {
  category?: DiscoverCategory
  city?: string
  area?: string
  q?: string
  availableOnly?: boolean
}): Promise<ApiResult<DiscoverSearchResult>> {
  const search = new URLSearchParams()
  if (params.category) search.set('category', params.category)
  if (params.city) search.set('city', params.city)
  if (params.area) search.set('area', params.area)
  if (params.q) search.set('q', params.q)
  if (params.availableOnly === false) search.set('availableOnly', 'false')
  const qs = search.toString()
  return apiRequest<DiscoverSearchResult>(
    qs ? `/discover/search/?${qs}` : '/discover/search/',
    { auth: false },
  )
}

export async function confirmDiscoverItem(
  targetType: 'listing' | 'hotel' | 'mess',
  id: string,
): Promise<ApiResult<{ confirmed: boolean; id: string }>> {
  return apiRequest('/discover/confirm/', {
    method: 'POST',
    body: { targetType, id },
  })
}

export type HeartbeatPublic = {
  token: string
  targetType: string
  targetId: string
  name: string
  city: string
  status: string
  expiresAt: string
  respondedAt: string | null
  expired: boolean
  alreadyResponded: boolean
}

export async function fetchHeartbeatPing(
  token: string,
): Promise<ApiResult<HeartbeatPublic>> {
  return apiRequest(`/heartbeat/${encodeURIComponent(token)}/`, { auth: false })
}

export async function respondHeartbeatPing(
  token: string,
  action: 'available' | 'full',
): Promise<ApiResult<HeartbeatPublic>> {
  return apiRequest(`/heartbeat/${encodeURIComponent(token)}/`, {
    method: 'POST',
    auth: false,
    body: { action },
  })
}

export async function reportDiscoverItem(
  targetType: 'listing' | 'hotel' | 'mess',
  id: string,
): Promise<ApiResult<{ reported: boolean; id: string }>> {
  return apiRequest('/discover/report/', {
    method: 'POST',
    auth: false,
    body: { targetType, id },
  })
}

export async function fetchNearbyPOIs(
  lat: number,
  lng: number,
  radius = 1500,
): Promise<ApiResult<import('@/types/living').NearbyPOIResponse>> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radius: String(radius),
  })
  return apiRequest(`/discover/pois/?${params}`, { auth: false })
}

export async function fetchAreas(
  city?: string,
): Promise<ApiResult<import('@/types/living').AreaListItem[]>> {
  const params = new URLSearchParams()
  if (city) params.set('city', city)
  const qs = params.toString()
  return apiRequest(qs ? `/discover/areas/?${qs}` : '/discover/areas/', {
    auth: false,
  })
}

export async function fetchAreaCompare(
  areas: string[],
  city?: string,
): Promise<ApiResult<import('@/types/living').AreaCompareResult>> {
  const params = new URLSearchParams({ areas: areas.join(',') })
  if (city) params.set('city', city)
  return apiRequest(`/discover/areas/compare/?${params}`, { auth: false })
}
