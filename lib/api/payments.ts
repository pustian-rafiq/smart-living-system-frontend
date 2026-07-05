import type {
  PayBillInput,
  PaymentTransaction,
  ScheduledPayment,
} from '@/types/payment'
import {
  getPaymentTransactionsByUserId,
  getScheduledPaymentsByUserId,
  processBillPayment,
} from '@/data/mockPayments'
import { mockDelay, ok, err, type ApiResult } from './http'
// err used for validation failures
import { getDemoRenterId } from './demoUser'

export async function fetchPaymentHistory(
  userId?: string
): Promise<ApiResult<PaymentTransaction[]>> {
  await mockDelay()
  return ok(getPaymentTransactionsByUserId(userId || getDemoRenterId()))
}

export async function fetchScheduledPayments(
  userId?: string
): Promise<ApiResult<ScheduledPayment[]>> {
  await mockDelay()
  return ok(getScheduledPaymentsByUserId(userId || getDemoRenterId()))
}

export async function payBill(
  input: Omit<PayBillInput, 'userId'> & { userId?: string }
): Promise<ApiResult<PaymentTransaction>> {
  await mockDelay(100)
  if (!input.billId || input.amount <= 0) {
    return err('Invalid bill payment', 'INVALID')
  }
  if (
    input.paymentMethod !== 'Cash' &&
    (!input.accountNumber || input.accountNumber.replace(/\D/g, '').length < 11)
  ) {
    return err('Enter a valid wallet / account number', 'INVALID_ACCOUNT')
  }

  const result = await processBillPayment({
    ...input,
    userId: input.userId || getDemoRenterId(),
  })
  return ok(result)
}
