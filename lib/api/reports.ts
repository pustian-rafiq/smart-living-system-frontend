import type { ExpenseReport, TaxDocument } from '@/types/report'
import {
  getExpenseReportsByUserId,
  getTaxDocumentsByUserId,
  generateExpenseReport,
  generateTaxDocument,
} from '@/data/mockReports'
import { getDemoUserId } from './demoUser'
import { mockDelay, ok, type ApiResult } from './http'

export async function fetchExpenseReports(
  userId?: string
): Promise<ApiResult<ExpenseReport[]>> {
  await mockDelay()
  return ok(getExpenseReportsByUserId(userId || getDemoUserId()))
}

export async function fetchTaxDocuments(
  userId?: string
): Promise<ApiResult<TaxDocument[]>> {
  await mockDelay()
  return ok(getTaxDocumentsByUserId(userId || getDemoUserId()))
}

export async function createExpenseReport(
  userId: string,
  startDate: string,
  endDate: string,
  format: 'pdf' | 'excel' | 'csv' = 'pdf'
): Promise<ApiResult<ExpenseReport>> {
  await mockDelay(200)
  return ok(generateExpenseReport(userId, startDate, endDate, format))
}

export async function createTaxDocument(
  userId: string,
  taxYear: number,
  documentType: 'rent_receipt' | 'expense_summary' | 'tax_certificate',
  startDate: string,
  endDate: string
): Promise<ApiResult<TaxDocument>> {
  await mockDelay(200)
  return ok(
    generateTaxDocument(userId, taxYear, documentType, startDate, endDate)
  )
}
