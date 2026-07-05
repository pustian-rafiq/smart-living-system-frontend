import type {
  ExpenseAnalytics,
  MonthlyExpense,
  YearlyExpense,
  Budget,
} from '@/types/expense'
import {
  expenseCategories,
  getExpenseAnalytics,
  getMonthlyExpenses,
  getYearlyExpenses,
  getBudgets,
  updateBudget,
} from '@/data/mockExpenses'
import { getDemoUserId } from './demoUser'
import { mockDelay, ok, type ApiResult } from './http'

export async function fetchExpenseCategories() {
  await mockDelay(50)
  return ok([...expenseCategories])
}

export async function fetchExpenseAnalytics(
  userId?: string
): Promise<ApiResult<ExpenseAnalytics>> {
  await mockDelay()
  return ok(getExpenseAnalytics(userId || getDemoUserId()))
}

export async function fetchMonthlyExpenses(
  year: number,
  userId?: string
): Promise<ApiResult<MonthlyExpense[]>> {
  await mockDelay()
  return ok(getMonthlyExpenses(userId || getDemoUserId(), year))
}

export async function fetchYearlyExpenses(
  userId?: string
): Promise<ApiResult<YearlyExpense[]>> {
  await mockDelay()
  return ok(getYearlyExpenses(userId || getDemoUserId()))
}

export async function fetchBudgets(
  userId?: string
): Promise<ApiResult<Budget[]>> {
  await mockDelay()
  return ok(getBudgets(userId || getDemoUserId()))
}

export async function patchBudget(
  userId: string,
  categoryId: string,
  amount: number
): Promise<ApiResult<Budget>> {
  await mockDelay(100)
  return ok(updateBudget(userId, categoryId, amount))
}
