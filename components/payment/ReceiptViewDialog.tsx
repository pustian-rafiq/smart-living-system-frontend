'use client'

import { useTranslations } from 'next-intl'
import type { Bill } from '@/types/bill'
import type { PaymentTransaction } from '@/types/payment'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Printer, Receipt } from 'lucide-react'
import { downloadPaymentReceipt } from '@/lib/download/paymentReceipt'
import { cn } from '@/lib/utils'
import { useAppFormat } from '@/hooks/useAppFormat'

interface ReceiptViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bill: Bill | null
  payment: PaymentTransaction | null
}

const statusLabelKeys: Record<
  PaymentTransaction['status'],
  { labelKey: string; className: string }
> = {
  completed: {
    labelKey: 'paid',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  pending: {
    labelKey: 'pending',
    className: 'bg-amber-100 text-amber-900 border-amber-200',
  },
  processing: {
    labelKey: 'processing',
    className: 'bg-blue-100 text-blue-900 border-blue-200',
  },
  failed: {
    labelKey: 'failed',
    className: 'bg-red-100 text-red-900 border-red-200',
  },
}

export function ReceiptViewDialog({
  open,
  onOpenChange,
  bill,
  payment,
}: ReceiptViewDialogProps) {
  const t = useTranslations('payments.receipt')
  const tc = useTranslations('common.status')
  const { formatCurrency, formatDateTime } = useAppFormat()

  if (!bill || !payment) return null

  const status = statusLabelKeys[payment.status]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {t('title')}
          </DialogTitle>
          <DialogDescription>
            {bill.month} {bill.year} · {bill.propertyName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={cn(status.className)}>
              {tc(status.labelKey)}
            </Badge>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(payment.amount)}
            </p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4 text-sm space-y-2">
            <Row label={t('transactionId')} value={payment.transactionId} mono />
            <Row label={t('paymentMethod')} value={payment.paymentMethod} />
            <Row
              label={t('date')}
              value={formatDateTime(payment.completedAt || payment.createdAt)}
            />
            <Row label={t('tenant')} value={bill.tenantName} />
            <Row label={t('property')} value={bill.propertyName} />
            {payment.accountNumber && (
              <Row
                label={t('account')}
                value={`•••• ${payment.accountNumber.slice(-4)}`}
              />
            )}
          </div>

          <div className="border-t pt-4 space-y-2">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              {t('billItems')}
            </p>
            {bill.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.description}</span>
                <span className="font-medium">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>{t('total')}</span>
              <span>{formatCurrency(bill.amount)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => downloadPaymentReceipt(bill, payment, 'html')}
            >
              <Download className="mr-2 h-4 w-4" />
              {t('download')}
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadPaymentReceipt(bill, payment, 'print')}
            >
              <Printer className="mr-2 h-4 w-4" />
              {t('print')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Row({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('text-right font-medium', mono && 'font-mono text-xs')}>
        {value}
      </span>
    </div>
  )
}
