'use client'

import { Badge } from '@/components/ui/badge'
import { BOOKING_STATUS_LABELS, type BookingStatus } from '@/types/booking'
import { cn } from '@/lib/utils'

const statusStyles: Record<BookingStatus, string> = {
  pending:
    'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800',
  approved:
    'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800',
  rejected:
    'bg-red-100 text-red-900 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800',
  cancelled:
    'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
  completed:
    'bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800',
}

interface BookingStatusBadgeProps {
  status: BookingStatus
  className?: string
}

export function BookingStatusBadge({
  status,
  className,
}: BookingStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', statusStyles[status], className)}
    >
      {BOOKING_STATUS_LABELS[status]}
    </Badge>
  )
}
