import type {
  ExpenseAnalytics,
  MonthlyExpense,
  YearlyExpense,
  Budget,
  ExpenseCategory,
} from '@/types/expense'
import { apiRequest } from './client'
import type { ApiResult } from './http'
import { hasAuthTokens } from '@/utils/auth-tokens'

export async function fetchExpenseCategories(): Promise<
  ApiResult<ExpenseCategory[]>
> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<ExpenseCategory[]>('/expenses/categories/')
}

export async function fetchExpenseAnalytics(
  _userId?: string,
): Promise<ApiResult<ExpenseAnalytics>> {
  if (!hasAuthTokens()) {
    return {
      ok: true,
      data: {
        userId: '',
        monthlyExpenses: [],
        yearlyExpenses: [],
        trends: [],
        budgets: [],
        categories: [],
      },
    }
  }
  return apiRequest<ExpenseAnalytics>('/expenses/analytics/')
}

export async function fetchMonthlyExpenses(
  year: number,
  _userId?: string,
): Promise<ApiResult<MonthlyExpense[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<MonthlyExpense[]>(
    `/expenses/monthly/?year=${encodeURIComponent(String(year))}`,
  )
}

export async function fetchYearlyExpenses(
  _userId?: string,
): Promise<ApiResult<YearlyExpense[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<YearlyExpense[]>('/expenses/yearly/')
}

export async function fetchBudgets(
  _userId?: string,
): Promise<ApiResult<Budget[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<Budget[]>('/expenses/budgets/')
}

export async function patchBudget(
  _userId: string,
  categoryId: string,
  amount: number,
): Promise<ApiResult<Budget>> {
  return apiRequest<Budget>(
    `/expenses/budgets/by-category/${encodeURIComponent(categoryId)}/`,
    {
      method: 'PATCH',
      body: { monthlyLimit: amount },
    },
  )
}
