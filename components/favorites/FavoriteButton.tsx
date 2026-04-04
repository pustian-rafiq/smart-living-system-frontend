'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { mockFavorites, isPropertyFavorite } from '@/data/mockFavorites'
import type { Property } from '@/types/property'

interface FavoriteButtonProps {
  property: Property
  userId: string
  onToggle?: (isFavorite: boolean) => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'icon' | 'lg'
  className?: string
}

export function FavoriteButton({
  property,
  userId,
  onToggle,
  variant = 'outline',
  size = 'icon',
  className,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    setIsFavorite(isPropertyFavorite(userId, property.id))
  }, [userId, property.id])

  const handleToggle = () => {
    const newIsFavorite = !isFavorite

    if (newIsFavorite) {
      // Add to favorites
      const newFavorite = {
        id: `fav-${Date.now()}`,
        userId,
        propertyId: property.id,
        propertyName: property.name,
        propertyType: property.type,
        propertyImage: property.images[0],
        propertyRent: property.rent,
        propertyArea: property.area,
        propertyCity: property.city,
        addedAt: new Date().toISOString(),
      }
      mockFavorites.push(newFavorite)
    } else {
      // Remove from favorites
      const index = mockFavorites.findIndex(
        fav => fav.userId === userId && fav.propertyId === property.id
      )
      if (index > -1) {
        mockFavorites.splice(index, 1)
      }
    }

    setIsFavorite(newIsFavorite)
    onToggle?.(newIsFavorite)
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      className={className}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
      />
      {size !== 'icon' && (
        <span className="ml-2">{isFavorite ? 'Saved' : 'Save'}</span>
      )}
    </Button>
  )
}
