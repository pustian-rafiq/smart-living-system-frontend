'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingDisplayProps {
  rating: number
  maxRating?: number
  showNumber?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function RatingDisplay({
  rating,
  maxRating = 5,
  showNumber = true,
  size = 'md',
  className,
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn('fill-yellow-400 text-yellow-400', sizeClasses[size])}
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className={cn('text-gray-300', sizeClasses[size])} />
            <Star
              className={cn(
                'absolute left-0 top-0 fill-yellow-400 text-yellow-400',
                sizeClasses[size]
              )}
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn('text-gray-300', sizeClasses[size])}
          />
        ))}
      </div>
      {showNumber && (
        <span
          className={cn(
            'ml-1 font-medium',
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
