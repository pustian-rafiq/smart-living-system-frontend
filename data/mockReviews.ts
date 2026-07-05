import type { PropertyReview, ReviewSummary } from '@/types/review'
import { syncPropertyRatings } from '@/data/mockProperties'

export let mockReviews: PropertyReview[] = [
  {
    id: 'rev1',
    propertyId: '1',
    userId: 'renter5',
    userName: 'Tanvir Hasan',
    rating: 5,
    comment:
      'Very clean mess and meals are on time. Owner is responsive. Best option near Mirpur for students.',
    createdAt: '2024-11-10T08:00:00Z',
    stayDurationMonths: 8,
    verifiedStay: true,
    ownerResponse:
      'Thank you Tanvir! We always try to keep everything clean and on schedule.',
    ownerResponseDate: '2024-11-11T10:00:00Z',
  },
  {
    id: 'rev2',
    propertyId: '1',
    userId: 'renter6',
    userName: 'Sakib Ahmed',
    rating: 4,
    comment:
      'Good WiFi and security. Shared seat is comfortable. Slightly noisy on weekends.',
    createdAt: '2024-10-02T12:30:00Z',
    stayDurationMonths: 4,
    verifiedStay: true,
  },
  {
    id: 'rev3',
    propertyId: '1',
    userId: 'renter7',
    userName: 'Imran Hossain',
    rating: 5,
    comment: 'Verified listing, photos match reality. Booking was smooth.',
    createdAt: '2024-09-15T09:00:00Z',
    stayDurationMonths: 6,
    verifiedStay: true,
  },
  {
    id: 'rev4',
    propertyId: '2',
    userId: 'renter8',
    userName: 'Nusrat Jahan',
    rating: 5,
    comment:
      'Family-friendly apartment in Uttara. Lift and parking work well. Owner is trustworthy.',
    createdAt: '2024-12-01T14:00:00Z',
    stayDurationMonths: 12,
    verifiedStay: true,
    ownerResponse: 'Glad your family is comfortable. Welcome anytime.',
    ownerResponseDate: '2024-12-02T08:00:00Z',
  },
  {
    id: 'rev5',
    propertyId: '2',
    userId: 'renter9',
    userName: 'Farhan Kabir',
    rating: 4,
    comment: 'Spacious rooms and good water supply. Rent is fair for the area.',
    createdAt: '2024-08-20T11:00:00Z',
    stayDurationMonths: 10,
    verifiedStay: true,
  },
  {
    id: 'rev6',
    propertyId: '3',
    userId: 'renter10',
    userName: 'Rafiul Islam',
    rating: 3,
    comment: 'Location is great for DU students but meals could be better.',
    createdAt: '2024-07-05T16:00:00Z',
    stayDurationMonths: 3,
    verifiedStay: false,
  },
  {
    id: 'rev7',
    propertyId: '4',
    userId: 'renter11',
    userName: 'Ayesha Siddiqua',
    rating: 5,
    comment:
      'Safe ladies hostel with strict rules. Parents will feel confident. Highly recommended.',
    createdAt: '2024-11-22T10:00:00Z',
    stayDurationMonths: 7,
    verifiedStay: true,
  },
  {
    id: 'rev8',
    propertyId: '5',
    userId: 'renter12',
    userName: 'Mahmud Hasan',
    rating: 4,
    comment: 'Premium Banani location. Worth the rent if you work nearby.',
    createdAt: '2024-10-18T13:00:00Z',
    stayDurationMonths: 5,
    verifiedStay: true,
  },
  {
    id: 'rev9',
    propertyId: '7',
    userId: 'renter5',
    userName: 'Mohammad Ali',
    rating: 5,
    comment: 'Stayed a full year. Transparent billing and helpful owner.',
    createdAt: '2025-01-05T09:00:00Z',
    stayDurationMonths: 12,
    verifiedStay: true,
  },
  {
    id: 'rev10',
    propertyId: '8',
    userId: 'renter13',
    userName: 'Shila Akter',
    rating: 4,
    comment: 'Clean rooms and good security. Booking process was easy.',
    createdAt: '2024-09-28T15:00:00Z',
    stayDurationMonths: 6,
    verifiedStay: true,
  },
]

function refreshPropertyRatings(): void {
  const byProperty: Record<string, number[]> = {}
  for (const r of mockReviews) {
    if (!byProperty[r.propertyId]) byProperty[r.propertyId] = []
    byProperty[r.propertyId].push(r.rating)
  }
  const ratings: Record<string, { rating: number; reviewCount: number }> = {}
  for (const [id, list] of Object.entries(byProperty)) {
    const avg = list.reduce((a, b) => a + b, 0) / list.length
    ratings[id] = {
      rating: Math.round(avg * 10) / 10,
      reviewCount: list.length,
    }
  }
  syncPropertyRatings(ratings)
}

// Initial sync
refreshPropertyRatings()

export function getReviewsByProperty(propertyId: string): PropertyReview[] {
  return mockReviews
    .filter(r => r.propertyId === propertyId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

export function getReviewSummary(propertyId: string): ReviewSummary {
  const reviews = getReviewsByProperty(propertyId)
  const distribution: ReviewSummary['distribution'] = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  }
  for (const r of reviews) {
    const key = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5
    distribution[key] += 1
  }
  const totalReviews = reviews.length
  const averageRating =
    totalReviews === 0
      ? 0
      : Math.round(
          (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews) * 10
        ) / 10
  return { averageRating, totalReviews, distribution }
}

export function addReview(
  review: Omit<PropertyReview, 'id' | 'createdAt'>
): PropertyReview {
  const created: PropertyReview = {
    ...review,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  mockReviews = [created, ...mockReviews]
  refreshPropertyRatings()
  return created
}

export function addOwnerResponse(
  reviewId: string,
  response: string
): PropertyReview | null {
  const idx = mockReviews.findIndex(r => r.id === reviewId)
  if (idx === -1) return null
  const updated = {
    ...mockReviews[idx],
    ownerResponse: response,
    ownerResponseDate: new Date().toISOString(),
  }
  mockReviews = [
    ...mockReviews.slice(0, idx),
    updated,
    ...mockReviews.slice(idx + 1),
  ]
  return updated
}
