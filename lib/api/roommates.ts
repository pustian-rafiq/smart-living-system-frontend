import type {
  RoommateMatchResult,
  RoommateProfile,
  RoommateProfileInput,
} from '@/types/living'
import { apiRequest } from './client'
import type { ApiResult } from './http'

export async function fetchRoommateProfile(): Promise<
  ApiResult<RoommateProfile | null>
> {
  return apiRequest('/account/roommate-profile/')
}

export async function saveRoommateProfile(
  data: RoommateProfileInput,
): Promise<ApiResult<RoommateProfile>> {
  return apiRequest('/account/roommate-profile/', {
    method: 'PUT',
    body: data,
  })
}

export async function fetchRoommateBrowse(
  city?: string,
): Promise<ApiResult<RoommateProfile[]>> {
  const params = new URLSearchParams()
  if (city) params.set('city', city)
  const qs = params.toString()
  return apiRequest(qs ? `/roommates/?${qs}` : '/roommates/', { auth: false })
}

export async function fetchRoommateMatches(
  limit = 20,
): Promise<ApiResult<RoommateMatchResult>> {
  return apiRequest(`/roommates/match/?limit=${limit}`)
}
