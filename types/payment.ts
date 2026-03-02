export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer' | 'Cash' | 'Card'

export type PaymentStatus = 'scheduled' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

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
