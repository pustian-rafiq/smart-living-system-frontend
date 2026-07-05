'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { OwnerPayout } from '@/types/payment'
import { format } from 'date-fns'
import { markPayoutSettled } from '@/data/mockPayouts'
import { cn } from '@/lib/utils'

interface PayoutLedgerTableProps {
  payouts: OwnerPayout[]
  onUpdated?: () => void
}

const statusStyle: Record<
  OwnerPayout['status'],
  { label: string; className: string }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-900 border-amber-200',
  },
  processing: {
    label: 'Processing',
    className: 'bg-blue-100 text-blue-900 border-blue-200',
  },
  paid: {
    label: 'Settled',
    className: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  },
  held: {
    label: 'On hold',
    className: 'bg-red-100 text-red-900 border-red-200',
  },
}

export function PayoutLedgerTable({
  payouts,
  onUpdated,
}: PayoutLedgerTableProps) {
  if (payouts.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          No payout records yet. They appear when tenants pay bills.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {payouts.map(payout => {
        const st = statusStyle[payout.status]
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
                  {st.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <Cell label="Gross" value={`৳${payout.grossAmount.toLocaleString()}`} />
                <Cell
                  label={`Fee (${payout.commissionRate}%)`}
                  value={`−৳${payout.commissionAmount.toLocaleString()}`}
                />
                <Cell
                  label="Net"
                  value={`৳${payout.netAmount.toLocaleString()}`}
                  highlight
                />
                <Cell label="Method" value={payout.paymentMethod} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{payout.transactionId}</span>
                <span>
                  {format(new Date(payout.paidAt), 'PP')}
                  {payout.payoutDate &&
                    ` · Settled ${format(new Date(payout.payoutDate), 'PP')}`}
                </span>
              </div>
              {payout.status === 'pending' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    markPayoutSettled(payout.id)
                    onUpdated?.()
                  }}
                >
                  Mark as settled (demo)
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
