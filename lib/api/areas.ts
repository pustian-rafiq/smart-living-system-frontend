import { apiRequest } from './client'
import type { ApiResult } from './http'
import type { Property } from '@/types/property'

export type AreaSeoEntry = {
  citySlug: string
  city: string
  areaSlug: string
  area: string
  path: string
}

export type AreaSeoDetail = {
  area: AreaSeoEntry & { path: string }
  category: string
  listings: Property[]
}

export type GeocodeResult = {
  lat: number
  lng: number
  displayName: string
  provider: string
}

export async function fetchAreaSeoList(): Promise<ApiResult<AreaSeoEntry[]>> {
  return apiRequest<AreaSeoEntry[]>('/areas/seo/', { auth: false })
}

export async function fetchAreaSeoDetail(
  citySlug: string,
  areaSlug: string,
  category: string = 'mess',
): Promise<ApiResult<AreaSeoDetail>> {
  return apiRequest<AreaSeoDetail>(
    `/areas/seo/${citySlug}/${areaSlug}/?category=${encodeURIComponent(category)}`,
    { auth: false },
  )
}

export async function geocodeAddress(input: {
  address?: string
  city?: string
  area?: string
}): Promise<ApiResult<GeocodeResult>> {
  const params = new URLSearchParams()
  if (input.address) params.set('address', input.address)
  if (input.city) params.set('city', input.city)
  if (input.area) params.set('area', input.area)
  return apiRequest<GeocodeResult>(`/discover/geocode/?${params}`, { auth: false })
}
