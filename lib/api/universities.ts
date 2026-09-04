import { apiRequest } from './client'
import type { ApiResult } from './http'
import type { Property } from '@/types/property'

export type University = {
  slug: string
  name: string
  fullName: string
  city: string
  areas: string[]
  lat: number
  lng: number
}

export type UniversityDetail = {
  university: University
  category: string
  listings: Property[]
}

export async function fetchUniversities(): Promise<ApiResult<University[]>> {
  return apiRequest<University[]>('/universities/', { auth: false })
}

export async function fetchUniversityDetail(
  slug: string,
  category: string = 'mess',
): Promise<ApiResult<UniversityDetail>> {
  return apiRequest<UniversityDetail>(
    `/universities/${slug}/?category=${encodeURIComponent(category)}`,
    { auth: false },
  )
}
