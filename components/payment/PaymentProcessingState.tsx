'use client'

import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'

interface PaymentProcessingStateProps {
  methodLabel: string
  message?: string
}

export function PaymentProcessingState({
  methodLabel,
  message,
}: PaymentProcessingStateProps) {
  const t = useTranslations('payments.processing')
  const displayMessage = message ?? t('message')

  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <div>
        <p className="font-semibold">{t('title')}</p>
        <p className="text-sm text-muted-foreground">
          {displayMessage.replace('{method}', methodLabel)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t('connecting', { method: methodLabel })}
        </p>
      </div>
    </div>
  )
}
