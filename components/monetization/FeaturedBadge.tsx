'use client'

import { Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface FeaturedBadgeProps {
  className?: string
  size?: 'sm' | 'md'
  showIcon?: boolean
}

export function FeaturedBadge({
  className,
  size = 'sm',
  showIcon = true,
}: FeaturedBadgeProps) {
  return (
    <Badge
      className={cn(
        'border-0 bg-amber-500 font-semibold text-white hover:bg-amber-500',
        size === 'sm' ? 'text-xs' : 'text-sm',
        className
      )}
    >
      {showIcon && <Sparkles className="mr-1 h-3 w-3" />}
      Featured
    </Badge>
  )
}

/** True if featured flag is set and not expired */
export function isListingFeatured(property: {
  featured?: boolean
  featuredUntil?: string
}): boolean {
  if (!property.featured) return false
  if (!property.featuredUntil) return true
  return new Date(property.featuredUntil) >= new Date()
}
