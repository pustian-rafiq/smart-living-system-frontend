'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { checkIsFavorite, toggleFavorite } from '@/lib/api/favorites'
import type { Property } from '@/types/property'

interface FavoriteButtonProps {
  property: Property
  onToggle?: (isFavorite: boolean) => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'icon' | 'lg'
  className?: string
}

export function FavoriteButton({
  property,
  onToggle,
  variant = 'outline',
  size = 'icon',
  className,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkIsFavorite(property.id).then(result => {
      if (result.ok) setIsFavorite(result.data)
    })
  }, [property.id])

  const handleToggle = async () => {
    if (loading) return
    setLoading(true)
    const result = await toggleFavorite(property.id)
    setLoading(false)
    if (result.ok) {
      setIsFavorite(result.data.added)
      onToggle?.(result.data.added)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={loading}
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
