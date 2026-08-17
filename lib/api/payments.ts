import type {
  PayBillInput,
  PaymentTransaction,
  RecordCashPaymentInput,
  ScheduledPayment,
  PaymentSchedule,
  OwnerPayout,
  OwnerPaymentAnalytics,
} from '@/types/payment'
import { apiRequest } from './client'
import type { ApiResult } from './http'
import { hasAuthTokens } from '@/utils/auth-tokens'

export async function fetchPaymentHistory(
  _userId?: string,
): Promise<ApiResult<PaymentTransaction[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<PaymentTransaction[]>('/payments/history/')
}

export async function fetchScheduledPayments(
  _userId?: string,
): Promise<ApiResult<ScheduledPayment[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<ScheduledPayment[]>('/payments/scheduled/')
}

export async function payBill(
  input: Omit<PayBillInput, 'userId'> & { userId?: string },
): Promise<ApiResult<PaymentTransaction>> {
  if (!input.billId || input.amount <= 0) {
    return { ok: false, error: 'Invalid bill payment', code: 'INVALID' }
  }

  const method = input.paymentMethod
  const needsAccount = method !== 'Cash' && method !== 'Card'

  if (needsAccount) {
    if (
      !input.accountNumber ||
      input.accountNumber.replace(/\D/g, '').length < 11
    ) {
      return {
        ok: false,
        error: 'Enter a valid wallet / account number',
        code: 'INVALID_ACCOUNT',
      }
    }
  }

  if (method === 'Card') {
    return {
      ok: false,
      error:
        'Card payments will be available when the payment gateway is connected.',
      code: 'GATEWAY_TODO',
    }
  }

  return apiRequest<PaymentTransaction>('/payments/pay-bill/', {
    method: 'POST',
    body: {
      billId: input.billId,
      billName: input.billName,
      propertyName: input.propertyName,
      tenantName: input.tenantName,
      amount: input.amount,
      paymentMethod: input.paymentMethod,
      accountNumber: input.accountNumber || '',
    },
  })
}

export async function recordCashPaymentApi(
  input: RecordCashPaymentInput,
): Promise<
  ApiResult<{ transaction: PaymentTransaction; payout: OwnerPayout }>
> {
  return apiRequest<{ transaction: PaymentTransaction; payout: OwnerPayout }>(
    '/payments/record-cash/',
    {
      method: 'POST',
      body: {
        billId: input.billId,
        billName: input.billName,
        propertyName: input.propertyName,
        tenantName: input.tenantName,
        amount: input.amount,
        receivedDate: input.receivedDate,
        receivedBy: input.receivedBy || '',
        receiptNote: input.receiptNote || '',
        receiptFileName: input.receiptFileName || '',
      },
    },
  )
}

export async function fetchOwnerPayouts(
  _ownerId?: string,
): Promise<ApiResult<OwnerPayout[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<OwnerPayout[]>('/payments/owner/payouts/')
}

export async function fetchOwnerPaymentAnalytics(
  _ownerId?: string,
): Promise<ApiResult<OwnerPaymentAnalytics>> {
  if (!hasAuthTokens()) {
    return {
      ok: true,
      data: {
        totalCollected: 0,
        totalCommission: 0,
        netEarnings: 0,
        pendingPayouts: 0,
        paidPayouts: 0,
        collectionByMethod: [],
        monthlyTrend: [],
        commissionRate: 5,
      },
    }
  }
  return apiRequest<OwnerPaymentAnalytics>('/payments/owner/analytics/')
}

export async function fetchPaymentByTxnId(
  transactionId: string,
): Promise<ApiResult<PaymentTransaction | undefined>> {
  const result = await apiRequest<PaymentTransaction>(
    `/payments/transactions/${encodeURIComponent(transactionId)}/`,
    { auth: false },
  )
  if (!result.ok) {
    if (result.code === 'NOT_FOUND') return { ok: true, data: undefined }
    return result
  }
  return result
}

export async function fetchPaymentSchedules(
  _userId?: string,
): Promise<ApiResult<PaymentSchedule[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<PaymentSchedule[]>('/payments/schedules/')
}

export async function createScheduledPayment(
  payment: Omit<ScheduledPayment, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<ApiResult<ScheduledPayment>> {
  return apiRequest<ScheduledPayment>('/payments/scheduled/', {
    method: 'POST',
    body: {
      billId: payment.billId || null,
      billName: payment.billName,
      amount: payment.amount,
      scheduledDate: payment.scheduledDate,
      scheduledTime: payment.scheduledTime || '',
      paymentMethod: payment.paymentMethod,
      accountNumber: payment.accountNumber || '',
      reminderEnabled: payment.reminderEnabled,
      reminderDays: payment.reminderDays,
      autoRetry: payment.autoRetry,
      maxRetries: payment.maxRetries,
      metadata: payment.metadata || {},
    },
  })
}

export async function patchScheduledPayment(
  paymentId: string,
  updates: Partial<ScheduledPayment>,
): Promise<ApiResult<ScheduledPayment>> {
  return apiRequest<ScheduledPayment>(`/payments/scheduled/${paymentId}/`, {
    method: 'PATCH',
    body: {
      ...(updates.billName !== undefined ? { billName: updates.billName } : {}),
      ...(updates.amount !== undefined ? { amount: updates.amount } : {}),
      ...(updates.scheduledDate !== undefined
        ? { scheduledDate: updates.scheduledDate }
        : {}),
      ...(updates.scheduledTime !== undefined
        ? { scheduledTime: updates.scheduledTime }
        : {}),
      ...(updates.paymentMethod !== undefined
        ? { paymentMethod: updates.paymentMethod }
        : {}),
      ...(updates.accountNumber !== undefined
        ? { accountNumber: updates.accountNumber }
        : {}),
      ...(updates.reminderEnabled !== undefined
        ? { reminderEnabled: updates.reminderEnabled }
        : {}),
      ...(updates.reminderDays !== undefined
        ? { reminderDays: updates.reminderDays }
        : {}),
      ...(updates.autoRetry !== undefined
        ? { autoRetry: updates.autoRetry }
        : {}),
      ...(updates.maxRetries !== undefined
        ? { maxRetries: updates.maxRetries }
        : {}),
      ...(updates.metadata !== undefined ? { metadata: updates.metadata } : {}),
    },
  })
}

export async function cancelScheduledPaymentApi(
  paymentId: string,
): Promise<ApiResult<boolean>> {
  const result = await apiRequest<ScheduledPayment>(
    `/payments/scheduled/${paymentId}/cancel/`,
    { method: 'POST' },
  )
  if (!result.ok) return result
  return { ok: true, data: true }
}

export async function settlePayout(
  payoutId: string,
): Promise<ApiResult<OwnerPayout | undefined>> {
  return apiRequest<OwnerPayout>(
    `/payments/owner/payouts/${payoutId}/settle/`,
    { method: 'POST' },
  )
}
