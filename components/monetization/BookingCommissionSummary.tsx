'use client'

import { CommissionBreakdownCard } from '@/components/payment/CommissionBreakdownCard'
import { CommissionRateBadge } from '@/components/payment/CommissionBreakdownCard'
import { calculateBookingCommission } from '@/lib/monetization/commission'
import { cn } from '@/lib/utils'

interface BookingCommissionSummaryProps {
  totalAmount: number
  className?: string
  compact?: boolean
  showBadge?: boolean
}

export function BookingCommissionSummary({
  totalAmount,
  className,
  compact = true,
  showBadge = true,
}: BookingCommissionSummaryProps) {
  const breakdown = calculateBookingCommission(totalAmount)

  return (
    <div className={cn('space-y-2', className)}>
      {showBadge && (
        <div className="flex justify-end">
          <CommissionRateBadge rate={breakdown.commissionRate} />
        </div>
      )}
      <CommissionBreakdownCard
        grossAmount={breakdown.grossAmount}
        commissionRate={breakdown.commissionRate}
        commissionAmount={breakdown.commissionAmount}
        netAmount={breakdown.netAmount}
        compact={compact}
      />
    </div>
  )
}

/** Single-line commission hint for booking cards */
export function BookingCommissionInline({
  totalAmount,
}: {
  totalAmount: number
}) {
  const { commissionRate, netAmount } = calculateBookingCommission(totalAmount)
  return (
    <p className="text-xs text-muted-foreground">
      Your net after {commissionRate}% fee:{' '}
      <span className="font-medium text-foreground">
        ৳{netAmount.toLocaleString()}
      </span>
    </p>
  )
}
