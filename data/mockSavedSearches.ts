import type { SavedSearch } from '@/types/savedSearch'

export const mockSavedSearches: SavedSearch[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Mess in Mirpur',
    filters: {
      propertyType: 'mess',
      city: 'Dhaka',
      area: 'Mirpur-10',
      rentRange: [3000, 5000],
      availableOnly: true,
      gender: 'male',
      seatType: 'shared',
      mealIncluded: true,
      mealPlan: 'all',
      nearbyFacilities: ['University', 'Bus Stop'],
      parking: true,
      security: true,
      verifiedOnly: true,
    },
    isActive: true,
    lastChecked: '2024-02-20T10:00:00Z',
    matchCount: 3,
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2024-02-20T10:00:00Z',
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Apartment in Gulshan',
    filters: {
      propertyType: 'apartment',
      city: 'Dhaka',
      area: 'Gulshan',
      rentRange: [10000, 20000],
      availableOnly: true,
      gender: null,
      furnishing: 'furnished',
      parking: true,
      security: true,
      verifiedOnly: true,
    },
    isActive: true,
    lastChecked: '2024-02-19T14:30:00Z',
    matchCount: 2,
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-19T14:30:00Z',
  },
  {
    id: '3',
    userId: 'user1',
    name: 'Budget Hostel',
    filters: {
      propertyType: 'hostel',
      city: 'Dhaka',
      rentRange: [2000, 4000],
      availableOnly: true,
      gender: 'female',
      seatType: 'shared',
      parking: false,
      security: true,
    },
    isActive: false,
    lastChecked: '2024-02-18T16:00:00Z',
    matchCount: 5,
    createdAt: '2024-02-05T11:00:00Z',
    updatedAt: '2024-02-18T16:00:00Z',
  },
]

// Helper functions
export function getSavedSearchesByUserId(userId: string): SavedSearch[] {
  return mockSavedSearches.filter(search => search.userId === userId)
}

export function getActiveSavedSearches(userId: string): SavedSearch[] {
  return mockSavedSearches.filter(
    search => search.userId === userId && search.isActive
  )
}

export function getSavedSearchById(id: string): SavedSearch | undefined {
  return mockSavedSearches.find(search => search.id === id)
}
