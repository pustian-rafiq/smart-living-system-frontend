'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { OwnerPayout } from '@/types/payment'
import { settlePayout } from '@/lib/api/payments'
import { cn } from '@/lib/utils'
import { useAppFormat } from '@/hooks/useAppFormat'

interface PayoutLedgerTableProps {
  payouts: OwnerPayout[]
  onUpdated?: () => void
}

const statusLabelKeys: Record<
  OwnerPayout['status'],
  { labelKey: string; className: string }
> = {
  pending: {
    labelKey: 'pending',
    className: 'bg-amber-100 text-amber-900 border-amber-200',
  },
  processing: {
    labelKey: 'processing',
    className: 'bg-blue-100 text-blue-900 border-blue-200',
  },
  paid: {
    labelKey: 'settled',
    className: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  },
  held: {
    labelKey: 'onHold',
    className: 'bg-red-100 text-red-900 border-red-200',
  },
}

export function PayoutLedgerTable({
  payouts,
  onUpdated,
}: PayoutLedgerTableProps) {
  const t = useTranslations('payments.payoutLedger')
  const tc = useTranslations('common.status')
  const { formatCurrency, formatDate } = useAppFormat()

  if (payouts.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          {t('empty')}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {payouts.map(payout => {
        const st = statusLabelKeys[payout.status]
        return (
          <Card key={payout.id}>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{payout.billName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {payout.tenantName} · {payout.propertyName}
                  </p>
                </div>
                <Badge variant="outline" className={cn(st.className)}>
                  {tc(st.labelKey)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <Cell
                  label={t('gross')}
                  value={formatCurrency(payout.grossAmount)}
                />
                <Cell
                  label={t('fee', { rate: payout.commissionRate })}
                  value={`−${formatCurrency(payout.commissionAmount)}`}
                />
                <Cell
                  label={t('net')}
                  value={formatCurrency(payout.netAmount)}
                  highlight
                />
                <Cell label={t('method')} value={payout.paymentMethod} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{payout.transactionId}</span>
                <span>
                  {formatDate(payout.paidAt)}
                  {payout.payoutDate &&
                    ` · ${t('settled', { date: formatDate(payout.payoutDate) })}`}
                </span>
              </div>
              {payout.status === 'pending' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    settlePayout(payout.id).then(() => onUpdated?.())
                  }}
                >
                  {t('markSettled')}
                </Button>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function Cell({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn('font-semibold', highlight && 'text-primary')}>{value}</p>
    </div>
  )
}
