import type { Property } from '@/types/property'
import {
  mockProperties,
  getCities,
  getAreasByCity,
} from '@/data/mockProperties'
import { mockDelay, ok, type ApiResult } from './http'

export async function fetchProperties(): Promise<ApiResult<Property[]>> {
  await mockDelay()
  return ok([...mockProperties])
}

export async function fetchPropertyById(
  id: string
): Promise<ApiResult<Property | null>> {
  await mockDelay()
  const found = mockProperties.find(p => p.id === id) ?? null
  return ok(found)
}

/** Featured listings for browse / marketing surfaces */
export async function fetchFeaturedProperties(
  limit = 9
): Promise<ApiResult<Property[]>> {
  await mockDelay()
  const verifiedFirst = [...mockProperties].sort((a, b) => {
    const va = a.verified ? 1 : 0
    const vb = b.verified ? 1 : 0
    return vb - va
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
