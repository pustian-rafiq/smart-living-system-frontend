import type { Favorite } from '@/types/favorites'
import type { Property } from '@/types/property'
import { apiRequest } from './client'
import { fetchPropertiesByIds } from './properties'
import type { ApiResult } from './http'
import { hasAuthTokens } from '@/utils/auth-tokens'

export async function fetchFavorites(
  _userId?: string,
): Promise<ApiResult<Favorite[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<Favorite[]>('/favorites/')
}

export async function fetchFavoriteProperties(
  _userId?: string,
): Promise<ApiResult<Property[]>> {
  const favs = await fetchFavorites()
  if (!favs.ok) return favs
  const ids = favs.data.map(f => f.propertyId)
  return fetchPropertiesByIds(ids)
}

export async function toggleFavorite(
  propertyId: string,
  _userId?: string,
  _property?: Property,
): Promise<ApiResult<{ added: boolean }>> {
  return apiRequest<{ added: boolean }>('/favorites/toggle/', {
    method: 'POST',
    body: { propertyId },
  })
}

export async function checkIsFavorite(
  propertyId: string,
  _userId?: string,
): Promise<ApiResult<boolean>> {
  if (!hasAuthTokens()) return { ok: true, data: false }
  return apiRequest<boolean>(
    `/favorites/check/?property_id=${encodeURIComponent(propertyId)}`,
  )
}
