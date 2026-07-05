'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Percent, Info } from 'lucide-react'
import type { OwnerPayout } from '@/types/payment'
import { cn } from '@/lib/utils'
import { useAppFormat } from '@/hooks/useAppFormat'

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
  const t = useTranslations('payments.commission')
  const { formatCurrency } = useAppFormat()

  return (
    <Card className={cn('border-dashed', className)}>
      <CardHeader className={compact ? 'pb-2' : undefined}>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Percent className="h-4 w-4 text-muted-foreground" />
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <Line label={t('grossCollected')} value={grossAmount} formatCurrency={formatCurrency} />
        <Line
          label={t('platformFee', { rate: commissionRate })}
          value={-commissionAmount}
          muted
          formatCurrency={formatCurrency}
        />
        <div className="flex justify-between border-t pt-2 font-semibold">
          <span>{t('yourNet')}</span>
          <span className="text-primary">{formatCurrency(netAmount)}</span>
        </div>
        <p className="flex items-start gap-1 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3 w-3 shrink-0" />
          {t('hint')}
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
  formatCurrency,
}: {
  label: string
  value: number
  muted?: boolean
  formatCurrency: (n: number) => string
}) {
  const prefix = value < 0 ? '−' : ''
  const abs = Math.abs(value)
  return (
    <div className="flex justify-between">
      <span className={muted ? 'text-muted-foreground' : undefined}>{label}</span>
      <span className={muted ? 'text-muted-foreground' : 'font-medium'}>
        {prefix}
        {formatCurrency(abs)}
      </span>
    </div>
  )
}

export function CommissionRateBadge({ rate }: { rate: number }) {
  const t = useTranslations('payments.commission')
  return (
    <Badge variant="secondary" className="font-normal">
      {t('rateBadge', { rate })}
    </Badge>
  )
}
