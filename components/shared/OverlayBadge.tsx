'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface OverlayBadgeProps {
  children: React.ReactNode
  className?: string
}

/**
 * High-contrast pill for badges sitting on photos/maps.
 * Avoids white-on-white from overriding Badge `default` variant colors.
 */
export function OverlayBadge({ children, className }: OverlayBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-white/20 bg-white/95 text-xs font-semibold text-slate-900 shadow-md backdrop-blur-sm hover:bg-white/95 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-50 dark:hover:bg-slate-900/95',
        className
      )}
    >
      {children}
    </Badge>
  )
}
