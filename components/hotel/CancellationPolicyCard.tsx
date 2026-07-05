'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CancellationPolicy } from '@/types/hotel'
import { DEFAULT_CANCELLATION } from '@/lib/hotel/pricing'
import { ShieldAlert } from 'lucide-react'

interface CancellationPolicyCardProps {
  policy?: CancellationPolicy
  className?: string
  compact?: boolean
}

/** Reusable cancellation / refund policy display. */
export function CancellationPolicyCard({
  policy = DEFAULT_CANCELLATION,
  className,
  compact = false,
}: CancellationPolicyCardProps) {
  const content = (
    <ul className="space-y-2 text-sm text-muted-foreground">
      <li>
        • Free cancellation up to{' '}
        <strong className="text-foreground">
          {policy.freeCancellationHours} hours
        </strong>{' '}
        before check-in (full refund).
      </li>
      <li>
        • Between {policy.partialRefundHours}–{policy.freeCancellationHours}{' '}
        hours: <strong className="text-foreground">{policy.partialRefundPercent}%</strong>{' '}
        refund.
      </li>
      <li>
        • Within {policy.noRefundWithinHours} hours of check-in:{' '}
        <strong className="text-foreground">no refund</strong>.
      </li>
      <li className="pt-1 text-foreground/90">{policy.summary}</li>
    </ul>
  )

  if (compact) {
    return <div className={className}>{content}</div>
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldAlert className="h-4 w-4" />
          Cancellation & refund policy
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}
