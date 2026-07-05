'use client'

import { Badge } from '@/components/ui/badge'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

type InstantBookTone = 'soft' | 'solid'

interface InstantBookBadgeProps {
  tone?: InstantBookTone
  label?: string
  className?: string
}

/**
 * Reusable instant-book indicator for cards, detail pages, and booking flows.
 */
export function InstantBookBadge({
  tone = 'solid',
  label = 'Instant',
  className,
}: InstantBookBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'text-xs font-semibold',
        tone === 'solid'
          ? 'border-amber-700/30 bg-amber-500 text-white shadow-md hover:bg-amber-500'
          : 'border-amber-200 bg-amber-100 text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/80 dark:text-amber-200',
        className
      )}
    >
      <Zap className="mr-1 h-3 w-3" />
      {label}
    </Badge>
  )
}
