import type { SearchHistory } from '@/types/favorites'

export const mockSearchHistory: SearchHistory[] = [
  {
    id: 'hist1',
    userId: 'user1',
    searchQuery: 'mess in mirpur',
    filters: {
      propertyType: 'mess',
      city: 'Dhaka',
      area: 'Mirpur-10',
      rentRange: [3000, 5000],
    },
    resultCount: 5,
    searchedAt: '2024-02-20T15:30:00Z',
  },
  {
    id: 'hist2',
    userId: 'user1',
    searchQuery: 'apartment gulshan',
    filters: {
      propertyType: 'apartment',
      city: 'Dhaka',
      area: 'Gulshan',
      rentRange: [10000, 20000],
    },
    resultCount: 3,
    searchedAt: '2024-02-19T11:20:00Z',
  },
  {
    id: 'hist3',
    userId: 'user1',
    filters: {
      propertyType: 'hostel',
      city: 'Dhaka',
      rentRange: [2000, 4000],
    },
    resultCount: 8,
    searchedAt: '2024-02-18T09:45:00Z',
  },
  {
    id: 'hist4',
    userId: 'user1',
    searchQuery: 'verified apartment',
    filters: {
      propertyType: 'apartment',
      verifiedOnly: true,
      rentRange: [8000, 15000],
    },
    resultCount: 4,
    searchedAt: '2024-02-17T16:10:00Z',
  },
  {
    id: 'hist5',
    userId: 'user1',
    filters: {
      propertyType: 'all',
      city: 'Dhaka',
      rentRange: [5000, 12000],
      availableOnly: true,
    },
    resultCount: 12,
    searchedAt: '2024-02-16T13:25:00Z',
  },
]

// Helper functions
export function getSearchHistoryByUserId(userId: string): SearchHistory[] {
  return mockSearchHistory
    .filter(history => history.userId === userId)
    .sort((a, b) => new Date(b.searchedAt).getTime() - new Date(a.searchedAt).getTime())
}

export function addSearchHistory(history: Omit<SearchHistory, 'id' | 'searchedAt'>): SearchHistory {
  const newHistory: SearchHistory = {
    id: `hist-${Date.now()}`,
    ...history,
    searchedAt: new Date().toISOString(),
  }
  mockSearchHistory.unshift(newHistory)
  // Keep only last 50 searches
  if (mockSearchHistory.length > 50) {
    mockSearchHistory.splice(50)
  }
  return newHistory
}

export function clearSearchHistory(userId: string): void {
  const indices = mockSearchHistory
    .map((h, i) => (h.userId === userId ? i : -1))
    .filter(i => i !== -1)
    .reverse()
  indices.forEach(i => mockSearchHistory.splice(i, 1))
}
