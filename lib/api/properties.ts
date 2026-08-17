import type { Property, PropertyListingInput } from '@/types/property'
import { apiRequest } from './client'
import type { ApiResult } from './http'

export async function fetchProperties(
  filters?: Record<string, string | number | boolean | undefined>,
): Promise<ApiResult<Property[]>> {
  const params = new URLSearchParams()
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === '') continue
      params.set(key, String(value))
    }
  }
  const qs = params.toString()
  const path = qs ? `/properties/?${qs}` : '/properties/'
  return apiRequest<Property[]>(path, { auth: false })
}

export async function fetchPropertyById(
  id: string,
): Promise<ApiResult<Property | null>> {
  const result = await apiRequest<Property>(`/properties/${id}/`, { auth: false })
  if (!result.ok) {
    if (result.code === 'NOT_FOUND') return { ok: true, data: null }
    return result
  }
  return result
}

export async function fetchFeaturedProperties(
  limit = 9,
): Promise<ApiResult<Property[]>> {
  return apiRequest<Property[]>(`/properties/featured/?limit=${limit}`, {
    auth: false,
  })
}

export async function fetchPropertyMeta(): Promise<
  ApiResult<{ cities: string[]; areasByCity: Record<string, string[]> }>
> {
  return apiRequest('/properties/meta/', { auth: false })
}

export async function fetchRecommendations(
  propertyId: string,
  limit = 4,
): Promise<ApiResult<Property[]>> {
  return apiRequest<Property[]>(
    `/properties/${propertyId}/recommendations/?limit=${limit}`,
    { auth: false },
  )
}

export async function fetchOwnerListings(
  _ownerId?: string,
): Promise<ApiResult<Property[]>> {
  return apiRequest<Property[]>('/properties/mine/')
}

export async function createListing(
  input: PropertyListingInput,
): Promise<ApiResult<Property>> {
  return apiRequest<Property>('/properties/', {
    method: 'POST',
    body: input,
  })
}

export async function updateListing(
  id: string,
  patch: Partial<PropertyListingInput>,
): Promise<ApiResult<Property>> {
  return apiRequest<Property>(`/properties/${id}/`, {
    method: 'PATCH',
    body: patch,
  })
}

export async function fetchPropertiesByIds(
  ids: string[],
): Promise<ApiResult<Property[]>> {
  if (!ids.length) return { ok: true, data: [] }
  return apiRequest<Property[]>('/properties/batch/', {
    method: 'POST',
    auth: false,
    body: { ids },
  })
}

/** @deprecated Prefer fetchProperties — kept for legacy SSG helpers */
export async function getAllMockProperties(): Promise<Property[]> {
  const result = await fetchProperties()
  return result.ok ? result.data : []
}

/** Sync stub for generateMetadata fallback — use client fetch in UI */
export function getPropertyById(_id: string): Property | undefined {
  return undefined
}
