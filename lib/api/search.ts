import type { SavedSearch } from '@/types/savedSearch'
import type { SearchHistory } from '@/types/favorites'
import type { Property, SearchFilters } from '@/types/property'
import {
  mockSavedSearches,
  getSavedSearchesByUserId,
  getSavedSearchById,
  getActiveSavedSearches,
} from '@/data/mockSavedSearches'
import { getPublishedProperties } from '@/data/mockProperties'
import {
  mockSearchHistory,
  getSearchHistoryByUserId,
  addSearchHistory,
  clearSearchHistory,
} from '@/data/mockSearchHistory'
import { getDemoUserId } from './demoUser'
import { mockDelay, ok, type ApiResult } from './http'

export async function fetchSavedSearches(
  userId?: string
): Promise<ApiResult<SavedSearch[]>> {
  await mockDelay()
  return ok(getSavedSearchesByUserId(userId || getDemoUserId()))
}

export async function createSavedSearch(
  search: SavedSearch
): Promise<ApiResult<SavedSearch>> {
  await mockDelay(150)
  mockSavedSearches.unshift(search)
  return ok(search)
}

export async function deleteSavedSearch(id: string): Promise<ApiResult<void>> {
  await mockDelay(100)
  const idx = mockSavedSearches.findIndex(s => s.id === id)
  if (idx >= 0) mockSavedSearches.splice(idx, 1)
  return ok(undefined)
}

export async function patchSavedSearch(
  id: string,
  updates: Partial<SavedSearch>
): Promise<ApiResult<SavedSearch | undefined>> {
  await mockDelay(100)
  const idx = mockSavedSearches.findIndex(s => s.id === id)
  if (idx < 0) return ok(undefined)
  mockSavedSearches[idx] = { ...mockSavedSearches[idx], ...updates }
  return ok(mockSavedSearches[idx])
}

export async function fetchSearchHistory(
  userId?: string
): Promise<ApiResult<SearchHistory[]>> {
  await mockDelay()
  return ok(getSearchHistoryByUserId(userId || getDemoUserId()))
}

export async function recordSearchHistory(
  entry: Omit<SearchHistory, 'id' | 'searchedAt'>
): Promise<ApiResult<SearchHistory>> {
  await mockDelay(50)
  return ok(addSearchHistory(entry))
}

export async function clearUserSearchHistory(
  userId?: string
): Promise<ApiResult<void>> {
  await mockDelay(100)
  clearSearchHistory(userId || getDemoUserId())
  return ok(undefined)
}

export async function deleteSearchHistoryEntry(
  id: string
): Promise<ApiResult<void>> {
  await mockDelay(100)
  const idx = mockSearchHistory.findIndex(h => h.id === id)
  if (idx >= 0) mockSearchHistory.splice(idx, 1)
  return ok(undefined)
}

export { getSavedSearchById }

export type SearchMatchNotification = {
  savedSearch: SavedSearch
  newMatches: Property[]
  matchCount: number
}

function propertyMatchesFilters(
  property: Property,
  filters: SearchFilters
): boolean {
  if (
    filters.propertyType !== 'all' &&
    property.type !== filters.propertyType
  ) {
    return false
  }
  if (filters.city && property.city !== filters.city) return false
  if (filters.area && property.area !== filters.area) return false
  if (
    property.rent < filters.rentRange[0] ||
    property.rent > filters.rentRange[1]
  ) {
    return false
  }
  if (filters.gender && property.gender && property.gender !== filters.gender) {
    return false
  }
  if (filters.verifiedOnly && !property.verified) return false
  if (filters.instantBook && !property.instantBook) return false
  return true
}

/** GET /search/notifications?userId= — new listing matches for saved searches */
export async function fetchSearchMatchNotifications(
  userId?: string
): Promise<ApiResult<SearchMatchNotification[]>> {
  await mockDelay(200)
  const uid = userId || getDemoUserId()
  const active = getActiveSavedSearches(uid)
  const properties = getPublishedProperties()
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

  const notifications: SearchMatchNotification[] = active
    .map(savedSearch => {
      const newMatches = properties.filter(
        p =>
          propertyMatchesFilters(p, savedSearch.filters) &&
          new Date(p.createdAt).getTime() > weekAgo
      )
      return {
        savedSearch,
        newMatches,
        matchCount: newMatches.length,
      }
    })
    .filter(n => n.matchCount > 0)

  return ok(notifications)
}
