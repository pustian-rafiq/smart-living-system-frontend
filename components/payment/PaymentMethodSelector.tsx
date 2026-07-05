'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CHECKOUT_PAYMENT_METHODS } from '@/lib/payment/constants'
import type { PaymentMethod } from '@/types/payment'
import { cn } from '@/lib/utils'

interface PaymentMethodSelectorProps {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
  /** Hide card until gateway is integrated */
  excludeMethods?: PaymentMethod[]
  className?: string
}

export function PaymentMethodSelector({
  value,
  onChange,
  excludeMethods = [],
  className,
}: PaymentMethodSelectorProps) {
  const methods = CHECKOUT_PAYMENT_METHODS.filter(
    m => !excludeMethods.includes(m.id)
  )

  return (
    <div className={className}>
      <Label className="mb-2 block">Payment method</Label>
      <RadioGroup
        value={value}
        onValueChange={v => onChange(v as PaymentMethod)}
        className="space-y-2"
      >
        {methods.map(m => (
          <label
            key={m.id}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
              value === m.id && 'border-primary bg-primary/5'
            )}
          >
            <RadioGroupItem value={m.id} id={`pay-${m.id}`} className="mt-0.5" />
            <div>
              <p className="font-medium">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.hint}</p>
            </div>
          </label>
        ))}
      </RadioGroup>
    </div>
  )
}

export function getPaymentMethodOption(method: PaymentMethod) {
  return CHECKOUT_PAYMENT_METHODS.find(m => m.id === method)
}
