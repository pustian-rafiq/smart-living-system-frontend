import type { PaymentMethod } from '@/types/payment'

export interface PaymentMethodOption {
  id: PaymentMethod
  label: string
  hint: string
  needsAccount: boolean
}

/** Shared checkout methods — TODO: wire real gateway per method in backend */
export const CHECKOUT_PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'bKash',
    label: 'bKash',
    hint: 'Pay with your bKash wallet',
    needsAccount: true,
  },
  {
    id: 'Nagad',
    label: 'Nagad',
    hint: 'Pay with your Nagad wallet',
    needsAccount: true,
  },
  {
    id: 'Rocket',
    label: 'Rocket',
    hint: 'Pay with Rocket (DBBL Mobile Banking)',
    needsAccount: true,
  },
  {
    id: 'Card',
    label: 'Debit / Credit Card',
    hint: 'Visa, Mastercard (gateway coming soon)',
    needsAccount: false,
  },
  {
    id: 'Cash',
    label: 'Cash',
    hint: 'Pay in person — pending until owner confirms',
    needsAccount: false,
  },
]

export const DEFAULT_COMMISSION_RATE = 5
