'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Percent, Info } from 'lucide-react'
import type { OwnerPayout } from '@/types/payment'
import { cn } from '@/lib/utils'

interface CommissionBreakdownCardProps {
  grossAmount: number
  commissionRate: number
  commissionAmount: number
  netAmount: number
  className?: string
  compact?: boolean
}

export function CommissionBreakdownCard({
  grossAmount,
  commissionRate,
  commissionAmount,
  netAmount,
  className,
  compact,
}: CommissionBreakdownCardProps) {
  return (
    <Card className={cn('border-dashed', className)}>
      <CardHeader className={compact ? 'pb-2' : undefined}>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Percent className="h-4 w-4 text-muted-foreground" />
          Commission breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <Line label="Gross collected" value={grossAmount} />
        <Line
          label={`Platform fee (${commissionRate}%)`}
          value={-commissionAmount}
          muted
        />
        <div className="flex justify-between border-t pt-2 font-semibold">
          <span>Your net</span>
          <span className="text-primary">৳{netAmount.toLocaleString()}</span>
        </div>
        <p className="flex items-start gap-1 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          Rate set by platform admin. Digital payouts settle in 2–3 business days.
        </p>
      </CardContent>
    </Card>
  )
}

export function CommissionBreakdownInline({ payout }: { payout: OwnerPayout }) {
  return (
    <CommissionBreakdownCard
      grossAmount={payout.grossAmount}
      commissionRate={payout.commissionRate}
      commissionAmount={payout.commissionAmount}
      netAmount={payout.netAmount}
      compact
    />
  )
}

function Line({
  label,
  value,
  muted,
}: {
  label: string
  value: number
  muted?: boolean
}) {
  const prefix = value < 0 ? '−' : ''
  const abs = Math.abs(value)
  return (
    <div className="flex justify-between">
      <span className={muted ? 'text-muted-foreground' : undefined}>{label}</span>
      <span className={muted ? 'text-muted-foreground' : 'font-medium'}>
        {prefix}৳{abs.toLocaleString()}
      </span>
    </div>
  )
}

export function CommissionRateBadge({ rate }: { rate: number }) {
  return (
    <Badge variant="secondary" className="font-normal">
      {rate}% platform fee
    </Badge>
  )
}
