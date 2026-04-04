import type {
  MessExpense,
  MonthlyExpenseSummary,
  ExpenseReport,
} from '@/types/messExpense'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'

export const mockMessExpenses: MessExpense[] = [
  {
    id: 'exp1',
    messId: 'm1',
    category: 'food',
    description: 'Rice purchase (50kg)',
    amount: 3500,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    vendor: 'Local Grocery Store',
    notes: 'Monthly rice supply',
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'exp2',
    messId: 'm1',
    category: 'food',
    description: 'Vegetables and spices',
    amount: 2500,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    vendor: 'Local Market',
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'exp3',
    messId: 'm1',
    category: 'food',
    description: 'Chicken and fish',
    amount: 8000,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    vendor: 'Meat Market',
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'exp4',
    messId: 'm1',
    category: 'utilities',
    description: 'Electricity bill',
    amount: 4500,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    vendor: 'DESCO',
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'exp5',
    messId: 'm1',
    category: 'utilities',
    description: 'Gas bill',
    amount: 1200,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    vendor: 'Titas Gas',
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'exp6',
    messId: 'm1',
    category: 'staff',
    description: 'Cook salary',
    amount: 15000,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    vendor: 'Staff Payment',
    notes: 'Monthly salary',
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'exp7',
    messId: 'm1',
    category: 'maintenance',
    description: 'Kitchen equipment repair',
    amount: 3000,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    vendor: 'Repair Service',
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'exp8',
    messId: 'm1',
    category: 'supplies',
    description: 'Cleaning supplies',
    amount: 1500,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    vendor: 'Supermarket',
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockExpenseReports: ExpenseReport[] = [
  {
    id: 'erep1',
    messId: 'm1',
    reportType: 'monthly',
    period: {
      startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
      endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    },
    generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    generatedBy: 'owner1',
    summary: {
      messId: 'm1',
      month: format(new Date(), 'MMMM'),
      year: new Date().getFullYear(),
      totalAmount: 37700,
      categoryBreakdown: [
        { category: 'food', amount: 14000, percentage: 37.1 },
        { category: 'utilities', amount: 5700, percentage: 15.1 },
        { category: 'staff', amount: 15000, percentage: 39.8 },
        { category: 'maintenance', amount: 3000, percentage: 8.0 },
      ],
      expenseCount: 8,
      averageDailyExpense: 1256.67,
    },
    expenses: mockMessExpenses.map(e => e.id),
    fileUrl: '/reports/expense-january-2024.pdf',
    fileName: 'Expense_Report_January_2024.pdf',
  },
]

// Helper functions
export function getExpensesByMess(
  messId: string,
  startDate?: string,
  endDate?: string
): MessExpense[] {
  let expenses = mockMessExpenses.filter(e => e.messId === messId)

  if (startDate) {
    expenses = expenses.filter(e => e.date >= startDate)
  }
  if (endDate) {
    expenses = expenses.filter(e => e.date <= endDate)
  }

  return expenses.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export function getExpenseById(expenseId: string): MessExpense | undefined {
  return mockMessExpenses.find(e => e.id === expenseId)
}

export function getMonthlyExpenseSummary(
  messId: string,
  month: string,
  year: number
): MonthlyExpenseSummary {
  const monthDate = new Date(`${month} 1, ${year}`)
  const startDate = format(startOfMonth(monthDate), 'yyyy-MM-dd')
  const endDate = format(endOfMonth(monthDate), 'yyyy-MM-dd')

  const expenses = getExpensesByMess(messId, startDate, endDate)
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0)

  const categoryMap = new Map<string, number>()
  expenses.forEach(expense => {
    const current = categoryMap.get(expense.category) || 0
    categoryMap.set(expense.category, current + expense.amount)
  })

  const categoryBreakdown = Array.from(categoryMap.entries()).map(
    ([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
    })
  )

  const daysInMonth = new Date(
    year,
    new Date(`${month} 1, ${year}`).getMonth() + 1,
    0
  ).getDate()

  return {
    messId,
    month,
    year,
    totalAmount,
    categoryBreakdown,
    expenseCount: expenses.length,
    averageDailyExpense: totalAmount / daysInMonth,
  }
}

export function addExpense(
  expense: Omit<MessExpense, 'id' | 'createdAt' | 'updatedAt'>
): MessExpense {
  const newExpense: MessExpense = {
    ...expense,
    id: `exp${mockMessExpenses.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockMessExpenses.unshift(newExpense)
  return newExpense
}

export function updateExpense(
  expenseId: string,
  updates: Partial<MessExpense>
): MessExpense | undefined {
  const index = mockMessExpenses.findIndex(e => e.id === expenseId)
  if (index === -1) return undefined

  mockMessExpenses[index] = {
    ...mockMessExpenses[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockMessExpenses[index]
}

export function deleteExpense(expenseId: string): boolean {
  const index = mockMessExpenses.findIndex(e => e.id === expenseId)
  if (index === -1) return false
  mockMessExpenses.splice(index, 1)
  return true
}

export function generateExpenseReport(
  messId: string,
  reportType: 'monthly' | 'yearly' | 'custom',
  startDate: string,
  endDate: string,
  generatedBy: string
): ExpenseReport {
  const expenses = getExpensesByMess(messId, startDate, endDate)
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0)

  const categoryMap = new Map<string, number>()
  expenses.forEach(expense => {
    const current = categoryMap.get(expense.category) || 0
    categoryMap.set(expense.category, current + expense.amount)
  })

  const categoryBreakdown = Array.from(categoryMap.entries()).map(
    ([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
    })
  )

  const startDateObj = new Date(startDate)
  const endDateObj = new Date(endDate)
  const daysDiff =
    Math.ceil(
      (endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1

  const month = format(startDateObj, 'MMMM')
  const year = startDateObj.getFullYear()

  const summary: MonthlyExpenseSummary = {
    messId,
    month,
    year,
    totalAmount,
    categoryBreakdown,
    expenseCount: expenses.length,
    averageDailyExpense: totalAmount / daysDiff,
  }

  const newReport: ExpenseReport = {
    id: `erep${mockExpenseReports.length + 1}`,
    messId,
    reportType,
    period: { startDate, endDate },
    generatedAt: new Date().toISOString(),
    generatedBy,
    summary,
    expenses: expenses.map(e => e.id),
    fileUrl: `/reports/expense-${reportType}-${startDate}-${endDate}.pdf`,
    fileName: `Expense_Report_${reportType}_${startDate}_${endDate}.pdf`,
  }

  mockExpenseReports.unshift(newReport)
  return newReport
}
