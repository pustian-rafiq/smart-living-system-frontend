'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type AvailabilityTone = 'soft' | 'solid'

interface AvailabilityBadgeProps {
  available: boolean
  /** soft = light surfaces; solid = on photos / dark overlays (always high contrast) */
  tone?: AvailabilityTone
  availableLabel?: string
  occupiedLabel?: string
  className?: string
}

const softStyles = {
  available:
    'border-emerald-200 bg-emerald-100 text-emerald-900 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200',
  occupied:
    'border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200',
} as const

const solidStyles = {
  available:
    'border-emerald-700/40 bg-emerald-600 text-white shadow-md hover:bg-emerald-600 dark:border-emerald-500/40 dark:bg-emerald-500 dark:text-white',
  occupied:
    'border-slate-800/40 bg-slate-800 text-white shadow-md hover:bg-slate-800 dark:border-slate-600/40 dark:bg-slate-700 dark:text-white',
} as const

/**
 * Reusable availability pill for listings, rooms, flats, and map popups.
 * Use `tone="solid"` on top of images so text stays readable without hover.
 */
export function AvailabilityBadge({
  available,
  tone = 'soft',
  availableLabel = 'Available',
  occupiedLabel = 'Occupied',
  className,
}: AvailabilityBadgeProps) {
  const styles = tone === 'solid' ? solidStyles : softStyles
  const key = available ? 'available' : 'occupied'

  return (
    <Badge
      variant="outline"
      className={cn(
        'text-xs font-semibold capitalize',
        styles[key],
        className
      )}
    >
      {available ? availableLabel : occupiedLabel}
    </Badge>
  )
}
