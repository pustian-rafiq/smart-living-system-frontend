'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react'
import type { PaymentTransactionStatus } from '@/types/payment'

export type PaymentResultVariant = PaymentTransactionStatus | 'failed'

interface PaymentResultViewProps {
  variant: PaymentResultVariant
  title?: string
  description?: string
  transactionId?: string
  methodLabel?: string
  failureReason?: string
  onRetry?: () => void
  onDone?: () => void
  receiptAction?: React.ReactNode
  secondaryAction?: React.ReactNode
}

export function PaymentResultView({
  variant,
  title,
  description,
  transactionId,
  methodLabel,
  failureReason,
  onRetry,
  onDone,
  receiptAction,
  secondaryAction,
}: PaymentResultViewProps) {
  const t = useTranslations('payments.result')
  const tv = useTranslations('payments.resultView')
  const tc = useTranslations('common')

  const config = {
    completed: {
      icon: CheckCircle2,
      iconClass: 'text-emerald-600',
      bgClass: 'bg-emerald-100 dark:bg-emerald-950/50',
      defaultTitle: t('success'),
      defaultDescription: t('successDesc'),
    },
    pending: {
      icon: Clock,
      iconClass: 'text-amber-600',
      bgClass: 'bg-amber-100 dark:bg-amber-950/50',
      defaultTitle: t('pending'),
      defaultDescription: t('pendingDesc'),
    },
    failed: {
      icon: XCircle,
      iconClass: 'text-red-600',
      bgClass: 'bg-red-100 dark:bg-red-950/50',
      defaultTitle: t('failed'),
      defaultDescription: t('failedDesc'),
    },
    processing: {
      icon: Clock,
      iconClass: 'text-amber-600',
      bgClass: 'bg-amber-100 dark:bg-amber-950/50',
      defaultTitle: t('processingTitle'),
      defaultDescription: t('processingDesc'),
    },
  }

  const key = variant === 'failed' ? 'failed' : variant
  const c = config[key] ?? config.failed
  const Icon = c.icon

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <div className={`rounded-full p-3 ${c.bgClass}`}>
          <Icon className={`h-8 w-8 ${c.iconClass}`} />
        </div>
        <p className="text-lg font-semibold">{title ?? c.defaultTitle}</p>
        <p className="text-sm text-muted-foreground">
          {description ?? c.defaultDescription}
        </p>
        {failureReason && (
          <p className="text-sm text-destructive">{failureReason}</p>
        )}
      </div>

      {(transactionId || methodLabel) && (
        <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">
          {transactionId && (
            <>
              <p className="text-muted-foreground">{tv('transactionId')}</p>
              <p className="font-mono font-medium">{transactionId}</p>
            </>
          )}
          {methodLabel && (
            <>
              <p className="mt-2 text-muted-foreground">{tv('method')}</p>
              <p className="font-medium">{methodLabel}</p>
            </>
          )}
        </div>
      )}

      {receiptAction}

      <div className="flex flex-col gap-2">
        {secondaryAction}
        {variant === 'failed' && onRetry && (
          <div className="flex gap-2">
            {onDone && (
              <Button variant="outline" className="flex-1" onClick={onDone}>
                {tc('actions.close')}
              </Button>
            )}
            <Button className="flex-1" onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {tc('tryAgain')}
            </Button>
          </div>
        )}
        {variant !== 'failed' && onDone && (
          <Button onClick={onDone} className="w-full">
            {tv('done')}
          </Button>
        )}
      </div>
    </div>
  )
}

export function PaymentResultBackButton({ onClick }: { onClick: () => void }) {
  const tv = useTranslations('payments.resultView')

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2"
      onClick={onClick}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {tv('changeMethod')}
    </Button>
  )
}

/** Link to dedicated result page (shareable / bookmarkable) */
export function paymentResultHref(transactionId: string, status: string) {
  return `/payments/result?txn=${encodeURIComponent(transactionId)}&status=${status}`
}

export function PaymentHistoryLink({ onClick }: { onClick?: () => void }) {
  const tv = useTranslations('payments.resultView')

  return (
    <Button variant="outline" asChild className="w-full">
      <Link href="/payments" onClick={onClick}>
        {tv('viewHistory')}
      </Link>
    </Button>
  )
}
