import type {
  ScheduledPayment,
  PaymentSchedule,
  PaymentTransaction,
  PayBillInput,
  PaymentMethod,
} from '@/types/payment'
import { markBillPaid } from './mockBills'
import { addOwnerPayoutFromTransaction } from './mockPayouts'
import { getDemoOwnerId } from '@/lib/api/demoUser'

export let mockPaymentTransactions: PaymentTransaction[] = [
  {
    id: 'pt1',
    userId: 'r1',
    billId: 'bill1',
    billName: 'January 2024 — Green Valley Apartments',
    propertyName: 'Green Valley Apartments',
    tenantName: 'Rahim Uddin',
    amount: 12000,
    paymentMethod: 'bKash',
    accountNumber: '01711111111',
    transactionId: 'BKS-20240103-88421',
    status: 'completed',
    createdAt: '2024-01-03T10:15:00Z',
    completedAt: '2024-01-03T10:15:12Z',
  },
  {
    id: 'pt2',
    userId: 'r1',
    billId: 'bill2',
    billName: 'February 2024 — Green Valley Apartments',
    propertyName: 'Green Valley Apartments',
    tenantName: 'Rahim Uddin',
    amount: 12000,
    paymentMethod: 'Nagad',
    accountNumber: '01711111111',
    transactionId: 'NGD-20240202-55102',
    status: 'completed',
    createdAt: '2024-02-02T09:40:00Z',
    completedAt: '2024-02-02T09:40:08Z',
  },
]

export const mockScheduledPayments: ScheduledPayment[] = [
  {
    id: 'sp1',
    userId: 'r1',
    billId: 'bill1',
    billName: 'Monthly Bill - January 2024',
    amount: 15000,
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0], // 3 days from now
    scheduledTime: '10:00',
    paymentMethod: 'bKash',
    accountNumber: '01712345678',
    status: 'scheduled',
    reminderEnabled: true,
    reminderDays: [1, 0],
    autoRetry: false,
    maxRetries: 0,
    retryCount: 0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sp2',
    userId: 'r1',
    billId: 'bill2',
    billName: 'Monthly Bill - February 2024',
    amount: 2500,
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0], // 7 days from now
    scheduledTime: '14:00',
    paymentMethod: 'Nagad',
    accountNumber: '01712345678',
    status: 'scheduled',
    reminderEnabled: true,
    reminderDays: [2, 1],
    autoRetry: true,
    maxRetries: 3,
    retryCount: 0,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sp3',
    userId: 'r1',
    billId: 'bill3',
    billName: 'Monthly Bill - December 2023',
    amount: 15000,
    scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0], // 5 days ago
    scheduledTime: '09:00',
    paymentMethod: 'bKash',
    accountNumber: '01712345678',
    status: 'completed',
    transactionId: 'TXN123456789',
    reminderEnabled: true,
    reminderDays: [1],
    autoRetry: false,
    maxRetries: 0,
    retryCount: 0,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sp4',
    userId: 'r1',
    billId: 'bill4',
    billName: 'Monthly Bill - November 2023',
    amount: 1800,
    scheduledDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    scheduledTime: '11:00',
    paymentMethod: 'Rocket',
    accountNumber: '01712345678',
    status: 'failed',
    reminderEnabled: true,
    reminderDays: [1],
    autoRetry: true,
    maxRetries: 3,
    retryCount: 3,
    failureReason: 'Insufficient balance',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockPaymentSchedules: PaymentSchedule[] = [
  {
    id: 'ps1',
    userId: 'r1',
    name: 'Monthly Rent Payment',
    description: 'Automatic monthly rent payment',
    billId: 'bill1',
    recurring: true,
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    amount: 15000,
    paymentMethod: 'bKash',
    reminderEnabled: true,
    reminderDays: [7, 3, 1],
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Helper functions
export function getScheduledPaymentsByUserId(
  userId: string,
  filters?: {
    status?: string
    limit?: number
  }
): ScheduledPayment[] {
  let payments = mockScheduledPayments.filter(p => p.userId === userId)

  if (filters?.status) {
    payments = payments.filter(p => p.status === filters.status)
  }

  // Sort by scheduled date (upcoming first)
  payments.sort(
    (a, b) =>
      new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
  )

  if (filters?.limit) {
    payments = payments.slice(0, filters.limit)
  }

  return payments
}

export function getScheduledPaymentById(
  paymentId: string
): ScheduledPayment | undefined {
  return mockScheduledPayments.find(p => p.id === paymentId)
}

export function getPaymentSchedulesByUserId(userId: string): PaymentSchedule[] {
  return mockPaymentSchedules
    .filter(schedule => schedule.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

export function addScheduledPayment(
  payment: Omit<ScheduledPayment, 'id' | 'createdAt' | 'updatedAt'>
): ScheduledPayment {
  const newPayment: ScheduledPayment = {
    ...payment,
    id: `sp${mockScheduledPayments.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockScheduledPayments.push(newPayment)
  return newPayment
}

export function updateScheduledPayment(
  paymentId: string,
  updates: Partial<ScheduledPayment>
): ScheduledPayment | undefined {
  const index = mockScheduledPayments.findIndex(p => p.id === paymentId)
  if (index === -1) return undefined

  mockScheduledPayments[index] = {
    ...mockScheduledPayments[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockScheduledPayments[index]
}

export function cancelScheduledPayment(paymentId: string): boolean {
  const payment = getScheduledPaymentById(paymentId)
  if (!payment || payment.status === 'completed') return false

  updateScheduledPayment(paymentId, { status: 'cancelled' })
  return true
}

export function addPaymentSchedule(
  schedule: Omit<PaymentSchedule, 'id' | 'createdAt' | 'updatedAt'>
): PaymentSchedule {
  const newSchedule: PaymentSchedule = {
    ...schedule,
    id: `ps${mockPaymentSchedules.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockPaymentSchedules.push(newSchedule)
  return newSchedule
}

export function updatePaymentSchedule(
  scheduleId: string,
  updates: Partial<PaymentSchedule>
): PaymentSchedule | undefined {
  const index = mockPaymentSchedules.findIndex(s => s.id === scheduleId)
  if (index === -1) return undefined

  mockPaymentSchedules[index] = {
    ...mockPaymentSchedules[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockPaymentSchedules[index]
}

export function deletePaymentSchedule(scheduleId: string): boolean {
  const index = mockPaymentSchedules.findIndex(s => s.id === scheduleId)
  if (index === -1) return false
  mockPaymentSchedules.splice(index, 1)
  return true
}

export function getPaymentTransactionsByUserId(
  userId: string
): PaymentTransaction[] {
  const normalized =
    userId === 'renter1' || userId === 'user1' ? 'r1' : userId
  return [...mockPaymentTransactions]
    .filter(t => t.userId === normalized || t.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

export function getPaymentTransactionByTxnId(
  transactionId: string
): PaymentTransaction | undefined {
  return mockPaymentTransactions.find(t => t.transactionId === transactionId)
}

function methodPrefix(method: PaymentMethod): string {
  switch (method) {
    case 'bKash':
      return 'BKS'
    case 'Nagad':
      return 'NGD'
    case 'Rocket':
      return 'RKT'
    case 'Cash':
      return 'CSH'
    case 'Card':
      return 'CRD'
    default:
      return 'BNK'
  }
}

function generateTransactionId(method: PaymentMethod): string {
  const stamp = Date.now().toString().slice(-8)
  const rand = Math.floor(Math.random() * 900 + 100)
  return `${methodPrefix(method)}-${stamp}-${rand}`
}

/**
 * Mock Pay Now flow. Simulates gateway delay and occasional failure.
 * TODO: Replace with real payment gateway SDK (bKash/Nagad/Rocket/SSLCommerz).
 */
export async function processBillPayment(
  input: PayBillInput & {
    receiptNote?: string
    receiptFileName?: string
  },
  options?: {
    forceFail?: boolean
    forceSuccess?: boolean
    skipPayout?: boolean
    ownerId?: string
  }
): Promise<PaymentTransaction> {
  const now = new Date().toISOString()
  const isCash = input.paymentMethod === 'Cash'

  const transaction: PaymentTransaction = {
    id: `pt-${Date.now()}`,
    userId: input.userId,
    billId: input.billId,
    billName: input.billName,
    propertyName: input.propertyName,
    tenantName: input.tenantName,
    amount: input.amount,
    paymentMethod: input.paymentMethod,
    accountNumber: input.accountNumber,
    transactionId: generateTransactionId(input.paymentMethod),
    status: 'processing',
    receiptNote: input.receiptNote,
    receiptFileName: input.receiptFileName,
    createdAt: now,
  }

  mockPaymentTransactions = [transaction, ...mockPaymentTransactions]

  await new Promise(resolve => setTimeout(resolve, 1400))

  const fail =
    options?.forceSuccess === true
      ? false
      : options?.forceFail === true ||
        (!isCash &&
          options?.forceFail !== false &&
          Math.random() < 0.12)

  if (fail) {
    const failed: PaymentTransaction = {
      ...transaction,
      status: 'failed',
      failureReason:
        'Payment declined. Insufficient balance or gateway timeout.',
      completedAt: new Date().toISOString(),
    }
    mockPaymentTransactions = mockPaymentTransactions.map(t =>
      t.id === transaction.id ? failed : t
    )
    return failed
  }

  // Renter-initiated cash stays pending until owner confirms
  if (isCash && !options?.forceSuccess) {
    const pending: PaymentTransaction = {
      ...transaction,
      status: 'pending',
      completedAt: new Date().toISOString(),
    }
    mockPaymentTransactions = mockPaymentTransactions.map(t =>
      t.id === transaction.id ? pending : t
    )
    return pending
  }

  markBillPaid(input.billId)
  const completed: PaymentTransaction = {
    ...transaction,
    status: 'completed',
    completedAt: new Date().toISOString(),
  }
  mockPaymentTransactions = mockPaymentTransactions.map(t =>
    t.id === transaction.id ? completed : t
  )

  if (!options?.skipPayout) {
    addOwnerPayoutFromTransaction(
      completed,
      options?.ownerId || getDemoOwnerId()
    )
  }

  return completed
}
