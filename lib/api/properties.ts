import type { Property, PropertyListingInput } from '@/types/property'
import {
  addProperty,
  getCities,
  getAreasByCity,
  getPropertyById,
  getPropertiesByOwner,
  getPublishedProperties,
  mockProperties,
  updateProperty,
} from '@/data/mockProperties'
// Side-effect: attach review ratings to properties
import '@/data/mockReviews'
import { getDemoOwnerId } from './demoUser'
import { mockDelay, ok, err, type ApiResult } from './http'

export async function fetchProperties(): Promise<ApiResult<Property[]>> {
  await mockDelay()
  return ok(getPublishedProperties())
}

export async function fetchPropertyById(
  id: string
): Promise<ApiResult<Property | null>> {
  await mockDelay()
  const found = getPropertyById(id) ?? null
  return ok(found)
}

/** Featured listings for browse / marketing surfaces */
export async function fetchFeaturedProperties(
  limit = 9
): Promise<ApiResult<Property[]>> {
  await mockDelay()
  const verifiedFirst = [...getPublishedProperties()].sort((a, b) => {
    const score = (p: Property) =>
      (p.featured ? 4 : 0) +
      (p.verified ? 2 : 0) +
      (p.rating || 0) +
      (p.instantBook ? 0.5 : 0)
    return score(b) - score(a)
  })
  return ok(verifiedFirst.slice(0, limit))
}

export async function fetchPropertyMeta(): Promise<
  ApiResult<{ cities: string[]; areasByCity: Record<string, string[]> }>
> {
  await mockDelay()
  const cities = getCities()
  const areasByCity: Record<string, string[]> = {}
  for (const c of cities) {
    areasByCity[c] = getAreasByCity(c)
  }
  return ok({ cities, areasByCity })
}

/** Similar listings for recommendations (city/type/rent proximity) */
export async function fetchRecommendations(
  propertyId: string,
  limit = 4
): Promise<ApiResult<Property[]>> {
  await mockDelay(200)
  const current = getPropertyById(propertyId)
  if (!current) return ok([])

  const scored = getPublishedProperties()
    .filter(p => p.id !== propertyId && p.available)
    .map(p => {
      let score = 0
      if (p.city === current.city) score += 3
      if (p.area === current.area) score += 2
      if (p.type === current.type) score += 2
      if (p.gender && p.gender === current.gender) score += 1
      const rentDiff = Math.abs(p.rent - current.rent) / Math.max(current.rent, 1)
      score += Math.max(0, 2 - rentDiff * 4)
      if (p.verified) score += 0.5
      if (p.rating) score += p.rating / 5
      return { p, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.p)

  return ok(scored)
}

export async function fetchOwnerListings(
  ownerId?: string
): Promise<ApiResult<Property[]>> {
  await mockDelay()
  const id = ownerId || getDemoOwnerId()
  return ok(getPropertiesByOwner(id))
}

export async function createListing(
  input: PropertyListingInput
): Promise<ApiResult<Property>> {
  await mockDelay()
  if (!input.name.trim()) return err('Listing name is required')
  if (!input.city.trim() || !input.area.trim()) {
    return err('City and area are required')
  }
  if (input.rent < 500) return err('Rent must be at least ৳500')
  if (!input.images.length) return err('Add at least one photo')
  if (!input.description.trim() || input.description.trim().length < 20) {
    return err('Description must be at least 20 characters')
  }

  const ownerId = getDemoOwnerId()
  const ownerName =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('userName') || 'Property Owner'
      : 'Property Owner'
  const ownerPhone =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('loginPhone') || '+8801700000000'
      : '+8801700000000'

  const now = new Date().toISOString().slice(0, 10)
  const published = input.published ?? input.listingStatus === 'published'
  const property: Property = {
    ...input,
    id: `listing-${Date.now()}`,
    ownerId,
    ownerName,
    ownerPhone: ownerPhone.startsWith('+')
      ? ownerPhone
      : `+880${ownerPhone.replace(/^0/, '')}`,
    verified: false,
    verificationStatus: 'pending',
    published,
    listingStatus: input.listingStatus ?? (published ? 'published' : 'draft'),
    instantBook: input.instantBook ?? false,
    depositMonths:
      input.depositMonths ?? (input.type === 'apartment' ? 2 : 1),
    rating: 0,
    reviewCount: 0,
    createdAt: now,
    updatedAt: now,
  }

  addProperty(property)
  return ok(property)
}

export async function updateListing(
  id: string,
  patch: Partial<PropertyListingInput>
): Promise<ApiResult<Property>> {
  await mockDelay()
  const existing = getPropertyById(id)
  if (!existing) return err('Listing not found', 'NOT_FOUND')
  if (existing.ownerId !== getDemoOwnerId()) {
    return err('You can only edit your own listings', 'FORBIDDEN')
  }
  const updated = updateProperty(id, {
    ...patch,
    published:
      patch.listingStatus === 'published'
        ? true
        : patch.listingStatus === 'draft' || patch.listingStatus === 'paused'
          ? false
          : patch.published,
  })
  if (!updated) return err('Failed to update listing')
  return ok(updated)
}

export async function fetchPropertiesByIds(
  ids: string[]
): Promise<ApiResult<Property[]>> {
  await mockDelay(150)
  const list = ids
    .map(id => getPropertyById(id))
    .filter((p): p is Property => Boolean(p))
  return ok(list)
}

export function getAllMockProperties(): Property[] {
  return [...mockProperties]
}

/** Server/SSG helper — sync lookup for generateMetadata */
export { getPropertyById } from '@/data/mockProperties'
