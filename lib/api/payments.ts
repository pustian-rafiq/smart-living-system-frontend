import type {
  CollectionReport,
  OwnerCollectionSettings,
  OwnerGatewayCredential,
  OwnerPaymentAnalytics,
  OwnerPayout,
  PayBillInput,
  PaymentClaim,
  PaymentInstructions,
  PaymentMethod,
  PaymentSchedule,
  PaymentTransaction,
  RecordCashPaymentInput,
  ScheduledPayment,
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
  ApiResult<{ transaction: PaymentTransaction; payout: OwnerPayout | null }>
> {
  return apiRequest<{ transaction: PaymentTransaction; payout: OwnerPayout | null }>(
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
        paymentMethod: input.paymentMethod || 'Cash',
        transactionId: input.transactionId || '',
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

export async function fetchOwnerLedger(): Promise<ApiResult<PaymentTransaction[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<PaymentTransaction[]>('/payments/owner/ledger/')
}

export async function fetchCollectionSettings(): Promise<
  ApiResult<OwnerCollectionSettings>
> {
  return apiRequest<OwnerCollectionSettings>(
    '/payments/owner/collection-settings/',
  )
}

export async function updateCollectionSettings(
  body: Partial<OwnerCollectionSettings> & Record<string, unknown>,
): Promise<ApiResult<OwnerCollectionSettings>> {
  return apiRequest<OwnerCollectionSettings>(
    '/payments/owner/collection-settings/',
    { method: 'PATCH', body },
  )
}

export async function fetchGatewayCredentials(): Promise<
  ApiResult<OwnerGatewayCredential[]>
> {
  return apiRequest<OwnerGatewayCredential[]>(
    '/payments/owner/gateway-credentials/',
  )
}

export async function upsertGatewayCredential(body: {
  gateway: 'bkash' | 'nagad' | 'rocket'
  displayName?: string
  merchantNumber?: string
  credentials?: Record<string, string>
  isActive?: boolean
  isSandbox?: boolean
}): Promise<ApiResult<OwnerGatewayCredential>> {
  return apiRequest<OwnerGatewayCredential>(
    '/payments/owner/gateway-credentials/',
    { method: 'POST', body },
  )
}

export async function fetchPaymentInstructions(params: {
  billId?: string
  messId?: string
}): Promise<ApiResult<PaymentInstructions>> {
  const q = new URLSearchParams()
  if (params.billId) q.set('billId', params.billId)
  if (params.messId) q.set('messId', params.messId)
  return apiRequest<PaymentInstructions>(`/payments/instructions/?${q}`)
}

export async function fetchPaymentClaims(opts?: {
  ownerView?: boolean
  status?: string
}): Promise<ApiResult<PaymentClaim[]>> {
  const q = new URLSearchParams()
  if (opts?.ownerView) q.set('ownerView', '1')
  if (opts?.status) q.set('status', opts.status)
  const suffix = q.toString() ? `?${q}` : ''
  return apiRequest<PaymentClaim[]>(`/payments/claims/${suffix}`)
}

export async function createPaymentClaim(body: {
  billId?: string
  messId?: string
  studentId?: string
  amount: number
  paymentMethod: PaymentMethod
  transactionId?: string
  note?: string
  date?: string
}): Promise<ApiResult<PaymentClaim>> {
  return apiRequest<PaymentClaim>('/payments/claims/', {
    method: 'POST',
    body,
  })
}

export async function reviewPaymentClaim(
  claimId: string,
  body: { approve: boolean; reason?: string },
): Promise<ApiResult<PaymentClaim>> {
  return apiRequest<PaymentClaim>(`/payments/claims/${claimId}/review/`, {
    method: 'POST',
    body,
  })
}

export async function fetchCollectionReport(params?: {
  year?: number
  month?: number
}): Promise<ApiResult<CollectionReport>> {
  const q = new URLSearchParams()
  if (params?.year) q.set('year', String(params.year))
  if (params?.month) q.set('month', String(params.month))
  const suffix = q.toString() ? `?${q}` : ''
  return apiRequest<CollectionReport>(
    `/payments/owner/collection-report/${suffix}`,
  )
}
