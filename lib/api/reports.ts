import type { ExpenseReport, TaxDocument } from '@/types/report'
import { apiRequest } from './client'
import type { ApiResult } from './http'
import { hasAuthTokens } from '@/utils/auth-tokens'

export async function fetchExpenseReports(
  _userId?: string,
): Promise<ApiResult<ExpenseReport[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<ExpenseReport[]>('/reports/expense/')
}

export async function fetchTaxDocuments(
  _userId?: string,
): Promise<ApiResult<TaxDocument[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<TaxDocument[]>('/reports/tax/')
}

export async function createExpenseReport(
  _userId: string,
  startDate: string,
  endDate: string,
  format: 'pdf' | 'excel' | 'csv' = 'pdf',
): Promise<ApiResult<ExpenseReport>> {
  return apiRequest<ExpenseReport>('/reports/expense/', {
    method: 'POST',
    body: { startDate, endDate, format },
  })
}

export async function createTaxDocument(
  _userId: string,
  taxYear: number,
  documentType: 'rent_receipt' | 'expense_summary' | 'tax_certificate',
  startDate: string,
  endDate: string,
): Promise<ApiResult<TaxDocument>> {
  return apiRequest<TaxDocument>('/reports/tax/', {
    method: 'POST',
    body: { taxYear, documentType, startDate, endDate },
  })
}
