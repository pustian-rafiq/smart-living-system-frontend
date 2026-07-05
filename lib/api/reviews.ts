import type { PropertyReview, ReviewFormData, ReviewSummary } from '@/types/review'
import {
  addOwnerResponse,
  addReview,
  getReviewSummary,
  getReviewsByProperty,
} from '@/data/mockReviews'
import { getDemoRenterId } from './demoUser'
import { mockDelay, ok, err, type ApiResult } from './http'

export async function fetchPropertyReviews(
  propertyId: string
): Promise<ApiResult<PropertyReview[]>> {
  await mockDelay()
  return ok(getReviewsByProperty(propertyId))
}

export async function fetchReviewSummary(
  propertyId: string
): Promise<ApiResult<ReviewSummary>> {
  await mockDelay(120)
  return ok(getReviewSummary(propertyId))
}

export async function createPropertyReview(
  propertyId: string,
  data: ReviewFormData,
  userName = 'Rahim Uddin'
): Promise<ApiResult<PropertyReview>> {
  await mockDelay()
  if (data.rating < 1 || data.rating > 5) {
    return err('Rating must be between 1 and 5', 'INVALID_RATING')
  }
  if (!data.comment.trim() || data.comment.trim().length < 10) {
    return err('Please write at least 10 characters', 'INVALID_COMMENT')
  }
  const existing = getReviewsByProperty(propertyId)
  const userId = getDemoRenterId()
  if (existing.some(r => r.userId === userId)) {
    return err('You already reviewed this property', 'DUPLICATE_REVIEW')
  }
  const review = addReview({
    propertyId,
    userId,
    userName,
    rating: data.rating,
    comment: data.comment.trim(),
    stayDurationMonths: data.stayDurationMonths,
    verifiedStay: Boolean(data.stayDurationMonths && data.stayDurationMonths >= 1),
  })
  return ok(review)
}

export async function respondToReview(
  reviewId: string,
  response: string
): Promise<ApiResult<PropertyReview>> {
  await mockDelay()
  if (!response.trim()) return err('Response is required')
  const updated = addOwnerResponse(reviewId, response.trim())
  if (!updated) return err('Review not found', 'NOT_FOUND')
  return ok(updated)
}
