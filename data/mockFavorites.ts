import type { Favorite } from '@/types/favorites'

export const mockFavorites: Favorite[] = [
  {
    id: 'fav1',
    userId: 'user1',
    propertyId: '1',
    propertyName: 'Green Valley Mess',
    propertyType: 'mess',
    propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    propertyRent: 3500,
    propertyArea: 'Mirpur-10',
    propertyCity: 'Dhaka',
    addedAt: '2024-02-15T10:00:00Z',
    notes: 'Good location, near university',
  },
  {
    id: 'fav2',
    userId: 'user1',
    propertyId: '2',
    propertyName: 'Sunshine Apartment',
    propertyType: 'apartment',
    propertyImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    propertyRent: 15000,
    propertyArea: 'Uttara',
    propertyCity: 'Dhaka',
    addedAt: '2024-02-18T14:30:00Z',
  },
  {
    id: 'fav3',
    userId: 'user1',
    propertyId: '7',
    propertyName: 'Family Apartment',
    propertyType: 'apartment',
    propertyImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
    propertyRent: 12000,
    propertyArea: 'Gulshan',
    propertyCity: 'Dhaka',
    addedAt: '2024-02-20T09:15:00Z',
    notes: 'Perfect for family',
  },
]

// Helper functions
export function getFavoritesByUserId(userId: string): Favorite[] {
  return mockFavorites.filter(fav => fav.userId === userId)
}

export function isPropertyFavorite(userId: string, propertyId: string): boolean {
  return mockFavorites.some(fav => fav.userId === userId && fav.propertyId === propertyId)
}

export function getFavoriteById(id: string): Favorite | undefined {
  return mockFavorites.find(fav => fav.id === id)
}
