'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { PaymentTransaction } from '@/types/payment'
import { format } from 'date-fns'
import { CheckCircle2, XCircle, Clock, Receipt } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaymentHistoryCardProps {
  payment: PaymentTransaction
  onViewReceipt?: (payment: PaymentTransaction) => void
  className?: string
}

const statusConfig: Record<
  PaymentTransaction['status'],
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  completed: {
    label: 'Completed',
    className:
      'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200',
    icon: CheckCircle2,
  },
  failed: {
    label: 'Failed',
    className:
      'bg-red-100 text-red-900 border-red-200 dark:bg-red-950/40 dark:text-red-200',
    icon: XCircle,
  },
  processing: {
    label: 'Processing',
    className:
      'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200',
    icon: Clock,
  },
  pending: {
    label: 'Pending',
    className:
      'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/40 dark:text-slate-200',
    icon: Clock,
  },
}

export function PaymentHistoryCard({
  payment,
  onViewReceipt,
  className,
}: PaymentHistoryCardProps) {
  const status = statusConfig[payment.status]
  const StatusIcon = status.icon

  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">
            {payment.billName}
          </CardTitle>
          <Badge variant="outline" className={cn('shrink-0', status.className)}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {status.label}
          </Badge>
        </div>
        {payment.propertyName && (
          <p className="text-sm text-muted-foreground">{payment.propertyName}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end justify-between">
          <div className="text-sm text-muted-foreground">
            <p>{payment.paymentMethod}</p>
            {payment.accountNumber && (
              <p className="text-xs">•••• {payment.accountNumber.slice(-4)}</p>
            )}
          </div>
          <p className="text-xl font-bold text-primary">
            ৳{payment.amount.toLocaleString()}
          </p>
        </div>

        <div className="rounded-md bg-muted/50 px-3 py-2 text-xs">
          <p className="font-medium">Txn: {payment.transactionId}</p>
          <p className="mt-1 text-muted-foreground">
            {format(new Date(payment.completedAt || payment.createdAt), 'PPp')}
          </p>
        </div>

        {payment.failureReason && (
          <p className="text-sm text-destructive">{payment.failureReason}</p>
        )}

        {payment.status === 'completed' && onViewReceipt && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onViewReceipt(payment)}
          >
            <Receipt className="mr-2 h-4 w-4" />
            View receipt
          </Button>
        )}
        {payment.status === 'pending' && (
          <p className="text-center text-xs text-muted-foreground">
            Awaiting owner confirmation (cash)
          </p>
        )}
      </CardContent>
    </Card>
  )
}
