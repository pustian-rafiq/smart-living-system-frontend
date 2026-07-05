import type { Favorite } from '@/types/favorite'
import type { Property } from '@/types/property'
import {
  mockFavorites,
  getFavoritesByUserId,
  isPropertyFavorite,
} from '@/data/mockFavorites'
import { fetchPropertiesByIds } from './properties'
import { getDemoUserId } from './demoUser'
import { mockDelay, ok, type ApiResult } from './http'

export async function fetchFavorites(
  userId?: string
): Promise<ApiResult<Favorite[]>> {
  await mockDelay()
  return ok(getFavoritesByUserId(userId || getDemoUserId()))
}

export async function fetchFavoriteProperties(
  userId?: string
): Promise<ApiResult<Property[]>> {
  await mockDelay()
  const favs = getFavoritesByUserId(userId || getDemoUserId())
  const ids = favs.map(f => f.propertyId)
  return fetchPropertiesByIds(ids)
}

export async function toggleFavorite(
  propertyId: string,
  userId?: string,
  property?: Property
): Promise<ApiResult<{ added: boolean }>> {
  await mockDelay(100)
  const uid = userId || getDemoUserId()
  const idx = mockFavorites.findIndex(
    f => f.userId === uid && f.propertyId === propertyId
  )
  if (idx >= 0) {
    mockFavorites.splice(idx, 1)
    return ok({ added: false })
  }
  mockFavorites.push({
    id: `fav-${Date.now()}`,
    userId: uid,
    propertyId,
    propertyName: property?.name ?? '',
    propertyType: property?.type ?? 'apartment',
    propertyImage: property?.images[0] ?? '',
    propertyRent: property?.rent ?? 0,
    propertyArea: property?.area ?? '',
    propertyCity: property?.city ?? '',
    addedAt: new Date().toISOString(),
  })
  return ok({ added: true })
}

export async function checkIsFavorite(
  propertyId: string,
  userId?: string
): Promise<ApiResult<boolean>> {
  await mockDelay(50)
  const uid = userId || getDemoUserId()
  return ok(isPropertyFavorite(uid, propertyId))
}
