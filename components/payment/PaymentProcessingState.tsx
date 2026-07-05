'use client'

import { Loader2 } from 'lucide-react'

interface PaymentProcessingStateProps {
  methodLabel: string
  message?: string
}

export function PaymentProcessingState({
  methodLabel,
  message = 'Please wait while we connect to the payment gateway.',
}: PaymentProcessingStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <div>
        <p className="font-semibold">Processing payment…</p>
        <p className="text-sm text-muted-foreground">
          {message.replace('{method}', methodLabel)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Connecting to {methodLabel}
        </p>
      </div>
    </div>
  )
}
