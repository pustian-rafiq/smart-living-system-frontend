'use client'

import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'

export function FreshnessBadge({
  lastConfirmedAt,
  confirmedHoursAgo,
  stale,
}: {
  lastConfirmedAt?: string | null
  confirmedHoursAgo?: number | null
  stale?: boolean
}) {
  if (confirmedHoursAgo == null && !lastConfirmedAt) return null
  const hours = confirmedHoursAgo ?? 0
  const label =
    hours < 1
      ? 'Confirmed just now'
      : hours < 24
        ? `Confirmed ${hours}h ago`
        : `Confirmed ${Math.floor(hours / 24)}d ago`

  return (
    <Badge
      variant="outline"
      className={
        stale
          ? 'border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200'
          : 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
      }
    >
      <Clock className="mr-1 h-3 w-3" />
      {stale ? `Needs update · ${label}` : label}
    </Badge>
  )
}
