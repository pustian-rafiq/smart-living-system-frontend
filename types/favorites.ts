export interface Favorite {
  id: string
  userId: string
  propertyId: string
  propertyName: string
  propertyType: 'mess' | 'apartment' | 'hostel' | 'hotel'
  propertyImage?: string
  propertyRent: number
  propertyArea: string
  propertyCity: string
  addedAt: string
  notes?: string
}

export interface SearchHistory {
  id: string
  userId: string
  searchQuery?: string
  filters: {
    propertyType?: string
    city?: string
    area?: string
    rentRange?: [number, number]
    [key: string]: any
  }
  resultCount: number
  searchedAt: string
}
