export type PaymentMethod =
  | 'bKash'
  | 'Nagad'
  | 'Rocket'
  | 'Bank Transfer'
  | 'Cash'
  | 'Card'

export type PaymentStatus =
  | 'scheduled'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface ScheduledPayment {
  id: string
  userId: string
  billId: string
  billName: string
  amount: number
  scheduledDate: string
  scheduledTime?: string
  paymentMethod: PaymentMethod
  accountNumber?: string
  transactionId?: string
  status: PaymentStatus
  reminderEnabled: boolean
  reminderDays: number[] // Days before scheduled date
  autoRetry: boolean
  maxRetries: number
  retryCount: number
  createdAt: string
  updatedAt: string
  completedAt?: string
  failureReason?: string
  metadata?: {
    [key: string]: any
  }
}

export interface PaymentSchedule {
  id: string
  userId: string
  name: string
  description?: string
  billId: string
  recurring: boolean
  frequency?: 'monthly' | 'weekly' | 'yearly'
  startDate: string
  endDate?: string
  amount: number
  paymentMethod: PaymentMethod
  reminderEnabled: boolean
  reminderDays: number[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/** Instant / Pay Now transaction (history ledger) */
export type PaymentTransactionStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'

export interface PaymentTransaction {
  id: string
  userId: string
  billId: string
  billName: string
  propertyName?: string
  tenantName?: string
  amount: number
  paymentMethod: PaymentMethod
  accountNumber?: string
  transactionId: string
  status: PaymentTransactionStatus
  failureReason?: string
  receiptNote?: string
  receiptFileName?: string
  createdAt: string
  completedAt?: string
}

export interface PayBillInput {
  billId: string
  billName: string
  propertyName?: string
  tenantName?: string
  amount: number
  paymentMethod: PaymentMethod
  accountNumber?: string
  userId: string
}

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'held'

/** Owner settlement line item after tenant payment */
export interface OwnerPayout {
  id: string
  ownerId: string
  billId: string
  billName: string
  tenantName: string
  propertyName: string
  grossAmount: number
  commissionRate: number
  commissionAmount: number
  netAmount: number
  paymentMethod: PaymentMethod
  transactionId: string
  status: PayoutStatus
  paidAt: string
  payoutDate?: string
}

export interface RecordCashPaymentInput {
  billId: string
  billName: string
  propertyName?: string
  tenantName: string
  amount: number
  receivedDate: string
  receivedBy?: string
  receiptNote?: string
  receiptFileName?: string
  ownerId: string
}

export interface OwnerPaymentAnalytics {
  totalCollected: number
  totalCommission: number
  netEarnings: number
  pendingPayouts: number
  paidPayouts: number
  collectionByMethod: { method: PaymentMethod; amount: number; count: number }[]
  monthlyTrend: { month: string; gross: number; net: number }[]
  commissionRate: number
}
