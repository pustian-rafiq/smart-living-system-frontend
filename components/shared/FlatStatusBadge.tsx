'use client'

import { Badge } from '@/components/ui/badge'
import type { FlatStatus } from '@/types/building'
import { cn } from '@/lib/utils'

const statusStyles: Record<FlatStatus, string> = {
  available:
    'border-emerald-200 bg-emerald-100 text-emerald-900 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200',
  occupied:
    'border-blue-200 bg-blue-100 text-blue-900 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-200',
  maintenance:
    'border-orange-200 bg-orange-100 text-orange-900 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/80 dark:text-orange-200',
}

const statusLabels: Record<FlatStatus, string> = {
  available: 'Available',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
}

interface FlatStatusBadgeProps {
  status: FlatStatus
  className?: string
}

/** Reusable flat/unit status pill for cards, dialogs, and filters. */
export function FlatStatusBadge({ status, className }: FlatStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-semibold', statusStyles[status], className)}
    >
      {statusLabels[status]}
    </Badge>
  )
}
