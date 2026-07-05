import type {
  PayBillInput,
  PaymentTransaction,
  RecordCashPaymentInput,
  ScheduledPayment,
  PaymentSchedule,
  OwnerPayout,
  OwnerPaymentAnalytics,
} from '@/types/payment'
import {
  getPaymentTransactionsByUserId,
  getScheduledPaymentsByUserId,
  getPaymentSchedulesByUserId,
  processBillPayment,
  mockPaymentTransactions,
  getPaymentTransactionByTxnId,
  addScheduledPayment,
  updateScheduledPayment,
  cancelScheduledPayment,
} from '@/data/mockPayments'
import {
  getOwnerPayouts,
  getOwnerPaymentAnalytics,
  recordCashPayment,
  markPayoutSettled,
} from '@/data/mockPayouts'
import { mockDelay, ok, err, type ApiResult } from './http'
import { getDemoTenantId, getDemoOwnerId } from './demoUser'

// TODO: Integrate bKash Checkout API — https://developer.bka.sh/docs
// TODO: Integrate Nagad merchant API
// TODO: Integrate DBBL Rocket merchant API
// TODO: Integrate SSLCommerz / Stripe for Card payments

export async function fetchPaymentHistory(
  userId?: string
): Promise<ApiResult<PaymentTransaction[]>> {
  await mockDelay()
  const id = userId || getDemoTenantId()
  return ok(getPaymentTransactionsByUserId(id))
}

export async function fetchScheduledPayments(
  userId?: string
): Promise<ApiResult<ScheduledPayment[]>> {
  await mockDelay()
  return ok(getScheduledPaymentsByUserId(userId || getDemoTenantId()))
}

export async function payBill(
  input: Omit<PayBillInput, 'userId'> & { userId?: string }
): Promise<ApiResult<PaymentTransaction>> {
  await mockDelay(100)
  if (!input.billId || input.amount <= 0) {
    return err('Invalid bill payment', 'INVALID')
  }

  const method = input.paymentMethod
  const needsAccount =
    method !== 'Cash' && method !== 'Card'

  if (needsAccount) {
    if (
      !input.accountNumber ||
      input.accountNumber.replace(/\D/g, '').length < 11
    ) {
      return err('Enter a valid wallet / account number', 'INVALID_ACCOUNT')
    }
  }

  if (method === 'Card') {
    // TODO: Open card gateway redirect / tokenization flow
    return err(
      'Card payments will be available when the payment gateway is connected.',
      'GATEWAY_TODO'
    )
  }

  const result = await processBillPayment({
    ...input,
    userId: input.userId || getDemoTenantId(),
  })
  return ok(result)
}

export async function recordCashPaymentApi(
  input: RecordCashPaymentInput
): Promise<
  ApiResult<{ transaction: PaymentTransaction; payout: OwnerPayout }>
> {
  await mockDelay(200)
  try {
    const data = await recordCashPayment(input, txn => {
      mockPaymentTransactions = [txn, ...mockPaymentTransactions]
    })
    return ok(data)
  } catch (e) {
    return err(e instanceof Error ? e.message : 'Could not record payment')
  }
}

export async function fetchOwnerPayouts(
  ownerId?: string
): Promise<ApiResult<OwnerPayout[]>> {
  await mockDelay()
  return ok(getOwnerPayouts(ownerId || getDemoOwnerId()))
}

export async function fetchOwnerPaymentAnalytics(
  ownerId?: string
): Promise<ApiResult<OwnerPaymentAnalytics>> {
  await mockDelay()
  return ok(getOwnerPaymentAnalytics(ownerId || getDemoOwnerId()))
}

export async function fetchPaymentByTxnId(
  transactionId: string
): Promise<ApiResult<PaymentTransaction | undefined>> {
  await mockDelay()
  const txn = getPaymentTransactionByTxnId(transactionId)
  return ok(txn)
}

export async function fetchPaymentSchedules(
  userId?: string
): Promise<ApiResult<PaymentSchedule[]>> {
  await mockDelay()
  return ok(getPaymentSchedulesByUserId(userId || getDemoTenantId()))
}

export async function createScheduledPayment(
  payment: Omit<ScheduledPayment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResult<ScheduledPayment>> {
  await mockDelay(100)
  return ok(addScheduledPayment(payment))
}

export async function patchScheduledPayment(
  paymentId: string,
  updates: Partial<ScheduledPayment>
): Promise<ApiResult<ScheduledPayment>> {
  await mockDelay(100)
  const updated = updateScheduledPayment(paymentId, updates)
  if (!updated) return err('Scheduled payment not found', 'NOT_FOUND')
  return ok(updated)
}

export async function cancelScheduledPaymentApi(
  paymentId: string
): Promise<ApiResult<boolean>> {
  await mockDelay(100)
  return ok(cancelScheduledPayment(paymentId))
}

export async function settlePayout(
  payoutId: string
): Promise<ApiResult<OwnerPayout | undefined>> {
  await mockDelay(100)
  return ok(markPayoutSettled(payoutId))
}
