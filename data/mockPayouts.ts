import type {
  OwnerPayout,
  OwnerPaymentAnalytics,
  PaymentMethod,
  PaymentTransaction,
  RecordCashPaymentInput,
} from '@/types/payment'
import { DEFAULT_COMMISSION_RATE } from '@/lib/payment/constants'
import { mockSystemSettings } from '@/data/mockAdmin'
import { getBillById, markBillPaid } from './mockBills'

export let mockOwnerPayouts: OwnerPayout[] = [
  {
    id: 'po1',
    ownerId: 'owner1',
    billId: 'bill1',
    billName: 'January 2024 — Green Valley Apartments',
    tenantName: 'Rahim Uddin',
    propertyName: 'Green Valley Apartments',
    grossAmount: 12000,
    commissionRate: 5,
    commissionAmount: 600,
    netAmount: 11400,
    paymentMethod: 'bKash',
    transactionId: 'BKS-20240103-88421',
    status: 'paid',
    paidAt: '2024-01-03T10:15:12Z',
    payoutDate: '2024-01-05T00:00:00Z',
  },
  {
    id: 'po2',
    ownerId: 'owner1',
    billId: 'bill2',
    billName: 'February 2024 — Green Valley Apartments',
    tenantName: 'Rahim Uddin',
    propertyName: 'Green Valley Apartments',
    grossAmount: 12000,
    commissionRate: 5,
    commissionAmount: 600,
    netAmount: 11400,
    paymentMethod: 'Nagad',
    transactionId: 'NGD-20240202-55102',
    status: 'paid',
    paidAt: '2024-02-02T09:40:08Z',
    payoutDate: '2024-02-04T00:00:00Z',
  },
  {
    id: 'po3',
    ownerId: 'owner1',
    billId: 'bill5',
    billName: 'February 2024 — Sunrise Mess',
    tenantName: 'Karim Hassan',
    propertyName: 'Sunrise Mess',
    grossAmount: 4500,
    commissionRate: 5,
    commissionAmount: 225,
    netAmount: 4275,
    paymentMethod: 'Rocket',
    transactionId: 'RKT-20240215-33102',
    status: 'pending',
    paidAt: '2024-02-15T14:20:00Z',
  },
]

function commissionRate(): number {
  return mockSystemSettings.commissionRate ?? DEFAULT_COMMISSION_RATE
}

export function calcCommission(gross: number, rate = commissionRate()) {
  const commissionAmount = Math.round((gross * rate) / 100)
  return {
    commissionRate: rate,
    commissionAmount,
    netAmount: gross - commissionAmount,
  }
}

export function addOwnerPayoutFromTransaction(
  txn: PaymentTransaction,
  ownerId: string
): OwnerPayout {
  const { commissionRate: rate, commissionAmount, netAmount } = calcCommission(
    txn.amount
  )
  const payout: OwnerPayout = {
    id: `po-${Date.now()}`,
    ownerId,
    billId: txn.billId,
    billName: txn.billName,
    tenantName: txn.tenantName || 'Tenant',
    propertyName: txn.propertyName || 'Property',
    grossAmount: txn.amount,
    commissionRate: rate,
    commissionAmount,
    netAmount,
    paymentMethod: txn.paymentMethod,
    transactionId: txn.transactionId,
    status: txn.paymentMethod === 'Cash' ? 'paid' : 'pending',
    paidAt: txn.completedAt || new Date().toISOString(),
    payoutDate:
      txn.paymentMethod === 'Cash' ? new Date().toISOString() : undefined,
  }
  mockOwnerPayouts = [payout, ...mockOwnerPayouts]
  return payout
}

export function getOwnerPayouts(ownerId: string): OwnerPayout[] {
  return [...mockOwnerPayouts]
    .filter(p => p.ownerId === ownerId)
    .sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
    )
}

export function getOwnerPaymentAnalytics(
  ownerId: string
): OwnerPaymentAnalytics {
  const payouts = getOwnerPayouts(ownerId)
  const rate = commissionRate()

  const totalCollected = payouts.reduce((s, p) => s + p.grossAmount, 0)
  const totalCommission = payouts.reduce((s, p) => s + p.commissionAmount, 0)
  const netEarnings = payouts.reduce((s, p) => s + p.netAmount, 0)
  const pendingPayouts = payouts
    .filter(p => p.status === 'pending' || p.status === 'processing')
    .reduce((s, p) => s + p.netAmount, 0)
  const paidPayouts = payouts
    .filter(p => p.status === 'paid')
    .reduce((s, p) => s + p.netAmount, 0)

  const methodMap = new Map<PaymentMethod, { amount: number; count: number }>()
  for (const p of payouts) {
    const cur = methodMap.get(p.paymentMethod) ?? { amount: 0, count: 0 }
    methodMap.set(p.paymentMethod, {
      amount: cur.amount + p.grossAmount,
      count: cur.count + 1,
    })
  }

  return {
    totalCollected,
    totalCommission,
    netEarnings,
    pendingPayouts,
    paidPayouts,
    commissionRate: rate,
    collectionByMethod: [...methodMap.entries()].map(([method, v]) => ({
      method,
      ...v,
    })),
    monthlyTrend: [
      { month: 'Jan', gross: 12000, net: 11400 },
      { month: 'Feb', gross: 16500, net: 15675 },
      { month: 'Mar', gross: 8500, net: 8075 },
    ],
  }
}

function generateCashTxnId(): string {
  return `CSH-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`
}

/** Owner records cash received at office / property */
export async function recordCashPayment(
  input: RecordCashPaymentInput,
  appendTransaction: (txn: PaymentTransaction) => void
): Promise<{ transaction: PaymentTransaction; payout: OwnerPayout }> {
  const bill = getBillById(input.billId)
  if (!bill) throw new Error('Bill not found')

  markBillPaid(input.billId, input.receivedDate)

  const now = new Date().toISOString()
  const transaction: PaymentTransaction = {
    id: `pt-cash-${Date.now()}`,
    userId: bill.tenantId,
    billId: input.billId,
    billName: input.billName,
    propertyName: input.propertyName,
    tenantName: input.tenantName,
    amount: input.amount,
    paymentMethod: 'Cash',
    transactionId: generateCashTxnId(),
    status: 'completed',
    receiptNote: input.receiptNote,
    receiptFileName: input.receiptFileName,
    createdAt: now,
    completedAt: now,
  }

  appendTransaction(transaction)
  const payout = addOwnerPayoutFromTransaction(transaction, input.ownerId)
  return { transaction, payout }
}

export function markPayoutSettled(payoutId: string): OwnerPayout | undefined {
  const idx = mockOwnerPayouts.findIndex(p => p.id === payoutId)
  if (idx === -1) return undefined
  mockOwnerPayouts[idx] = {
    ...mockOwnerPayouts[idx],
    status: 'paid',
    payoutDate: new Date().toISOString(),
  }
  return mockOwnerPayouts[idx]
}
