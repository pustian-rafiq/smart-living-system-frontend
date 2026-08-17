import type { PropertyReview, ReviewFormData, ReviewSummary } from '@/types/review'
import { apiRequest } from './client'
import type { ApiResult } from './http'

export async function fetchPropertyReviews(
  propertyId: string,
): Promise<ApiResult<PropertyReview[]>> {
  return apiRequest<PropertyReview[]>(`/properties/${propertyId}/reviews/`, {
    auth: false,
  })
}

export async function fetchReviewSummary(
  propertyId: string,
): Promise<ApiResult<ReviewSummary>> {
  return apiRequest<ReviewSummary>(
    `/properties/${propertyId}/reviews/summary/`,
    { auth: false },
  )
}

export async function createPropertyReview(
  propertyId: string,
  data: ReviewFormData,
  _userName?: string,
): Promise<ApiResult<PropertyReview>> {
  return apiRequest<PropertyReview>(`/properties/${propertyId}/reviews/`, {
    method: 'POST',
    body: {
      rating: data.rating,
      comment: data.comment,
      stayDurationMonths: data.stayDurationMonths,
    },
  })
}

export async function respondToReview(
  reviewId: string,
  response: string,
  propertyId?: string,
): Promise<ApiResult<PropertyReview>> {
  if (!propertyId) {
    return {
      ok: false,
      error: 'propertyId is required to respond to a review',
      code: 'INVALID',
    }
  }
  return apiRequest<PropertyReview>(
    `/properties/${propertyId}/reviews/${reviewId}/respond/`,
    {
      method: 'POST',
      body: { response },
    },
  )
}
