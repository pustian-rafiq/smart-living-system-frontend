import type { SearchFilters } from '@/types/property'

export interface SavedSearch {
  id: string
  userId: string
  name: string
  filters: SearchFilters
  isActive: boolean
  lastChecked?: string
  matchCount?: number
  createdAt: string
  updatedAt: string
}
