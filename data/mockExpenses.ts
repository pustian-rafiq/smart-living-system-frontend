import type {
  ExpenseAnalytics,
  MonthlyExpense,
  YearlyExpense,
  ExpenseTrend,
  Budget,
  ExpenseCategory,
} from '@/types/expense'
import { mockBills } from './mockBills'

export const expenseCategories: ExpenseCategory[] = [
  { id: 'cat1', name: 'Rent', type: 'rent', color: '#3b82f6' },
  { id: 'cat2', name: 'Electricity', type: 'utilities', color: '#f59e0b' },
  { id: 'cat3', name: 'Gas', type: 'utilities', color: '#ef4444' },
  { id: 'cat4', name: 'Water', type: 'utilities', color: '#06b6d4' },
  { id: 'cat5', name: 'Service Charge', type: 'service', color: '#8b5cf6' },
  { id: 'cat6', name: 'Maintenance', type: 'maintenance', color: '#ec4899' },
  { id: 'cat7', name: 'Other', type: 'other', color: '#6b7280' },
]

// Generate monthly expenses from bills
function generateMonthlyExpenses(): MonthlyExpense[] {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const expenses: MonthlyExpense[] = []
  const currentYear = new Date().getFullYear()

  // Get last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentYear, new Date().getMonth() - i, 1)
    const month = months[date.getMonth()]
    const year = date.getFullYear()

    // Get bills for this month
    const monthBills = mockBills.filter(
      b => b.month === month && b.year === year && b.tenantId === 'r1'
    )

    const categoryMap = new Map<string, { name: string; amount: number }>()
    let total = 0

    monthBills.forEach(bill => {
      bill.items.forEach(item => {
        let categoryId = 'cat7' // Other
        let categoryName = 'Other'

        if (item.description.toLowerCase().includes('rent')) {
          categoryId = 'cat1'
          categoryName = 'Rent'
        } else if (
          item.description.toLowerCase().includes('electricity') ||
          item.description.toLowerCase().includes('electric')
        ) {
          categoryId = 'cat2'
          categoryName = 'Electricity'
        } else if (item.description.toLowerCase().includes('gas')) {
          categoryId = 'cat3'
          categoryName = 'Gas'
        } else if (item.description.toLowerCase().includes('water')) {
          categoryId = 'cat4'
          categoryName = 'Water'
        } else if (item.description.toLowerCase().includes('service')) {
          categoryId = 'cat5'
          categoryName = 'Service Charge'
        } else if (item.description.toLowerCase().includes('maintenance')) {
          categoryId = 'cat6'
          categoryName = 'Maintenance'
        }

        const existing = categoryMap.get(categoryId) || {
          name: categoryName,
          amount: 0,
        }
        existing.amount += item.amount
        categoryMap.set(categoryId, existing)
        total += item.amount
      })
    })

    const categories = Array.from(categoryMap.entries()).map(
      ([categoryId, data]) => ({
        categoryId,
        categoryName: data.name,
        amount: data.amount,
        percentage: total > 0 ? (data.amount / total) * 100 : 0,
      })
    )

    expenses.push({
      month,
      year,
      total,
      categories,
      bills: monthBills.map(b => b.id),
    })
  }

  return expenses
}

function generateYearlyExpenses(
  monthlyExpenses: MonthlyExpense[]
): YearlyExpense[] {
  const years = new Set(monthlyExpenses.map(e => e.year))
  const yearlyExpenses: YearlyExpense[] = []

  years.forEach(year => {
    const yearExpenses = monthlyExpenses.filter(e => e.year === year)
    const total = yearExpenses.reduce((sum, e) => sum + e.total, 0)
    const monthlyAverages = yearExpenses.map(e => ({
      month: e.month,
      average: e.total,
    }))

    // Calculate category totals
    const categoryMap = new Map<string, { name: string; total: number }>()
    yearExpenses.forEach(expense => {
      expense.categories.forEach(cat => {
        const existing = categoryMap.get(cat.categoryId) || {
          name: cat.categoryName,
          total: 0,
        }
        existing.total += cat.amount
        categoryMap.set(cat.categoryId, existing)
      })
    })

    const categoryTotals = Array.from(categoryMap.entries()).map(
      ([categoryId, data]) => ({
        categoryId,
        categoryName: data.name,
        total: data.total,
        percentage: total > 0 ? (data.total / total) * 100 : 0,
      })
    )

    // Calculate trend
    const sorted = yearExpenses.sort((a, b) => {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]
      return months.indexOf(a.month) - months.indexOf(b.month)
    })

    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable'
    let growthRate = 0

    if (sorted.length >= 2) {
      const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2))
      const secondHalf = sorted.slice(Math.floor(sorted.length / 2))
      const firstAvg =
        firstHalf.reduce((sum, e) => sum + e.total, 0) / firstHalf.length
      const secondAvg =
        secondHalf.reduce((sum, e) => sum + e.total, 0) / secondHalf.length

      growthRate = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg) * 100 : 0

      if (growthRate > 5) trend = 'increasing'
      else if (growthRate < -5) trend = 'decreasing'
      else trend = 'stable'
    }

    yearlyExpenses.push({
      year,
      total,
      monthlyAverages,
      categoryTotals,
      trend,
      growthRate,
    })
  })

  return yearlyExpenses
}

function generateTrends(monthlyExpenses: MonthlyExpense[]): ExpenseTrend[] {
  return monthlyExpenses.map(expense => ({
    period: `${expense.month} ${expense.year}`,
    amount: expense.total,
    categoryBreakdown: expense.categories.map(cat => ({
      categoryId: cat.categoryId,
      amount: cat.amount,
    })),
  }))
}

function generateBudgets(): Budget[] {
  return [
    {
      id: 'budget1',
      categoryId: 'cat1',
      categoryName: 'Rent',
      monthlyLimit: 15000,
      currentSpending: 15000,
      period: {
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
      },
      alerts: {
        enabled: true,
        threshold: 80,
      },
    },
    {
      id: 'budget2',
      categoryId: 'cat2',
      categoryName: 'Electricity',
      monthlyLimit: 3000,
      currentSpending: 2500,
      period: {
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
      },
      alerts: {
        enabled: true,
        threshold: 90,
      },
    },
    {
      id: 'budget3',
      categoryId: 'cat3',
      categoryName: 'Gas',
      monthlyLimit: 2000,
      currentSpending: 1800,
      period: {
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
      },
      alerts: {
        enabled: true,
        threshold: 85,
      },
    },
  ]
}

export const mockExpenseAnalytics: ExpenseAnalytics = {
  userId: 'r1',
  monthlyExpenses: generateMonthlyExpenses(),
  yearlyExpenses: [],
  trends: [],
  budgets: generateBudgets(),
  categories: expenseCategories,
}

mockExpenseAnalytics.yearlyExpenses = generateYearlyExpenses(
  mockExpenseAnalytics.monthlyExpenses
)
mockExpenseAnalytics.trends = generateTrends(
  mockExpenseAnalytics.monthlyExpenses
)

// Helper functions
export function getExpenseAnalytics(userId: string): ExpenseAnalytics {
  return mockExpenseAnalytics
}

export function getMonthlyExpenses(
  userId: string,
  year?: number
): MonthlyExpense[] {
  let expenses = mockExpenseAnalytics.monthlyExpenses
  if (year) {
    expenses = expenses.filter(e => e.year === year)
  }
  return expenses
}

export function getYearlyExpenses(userId: string): YearlyExpense[] {
  return mockExpenseAnalytics.yearlyExpenses
}

export function getBudgets(userId: string): Budget[] {
  return mockExpenseAnalytics.budgets
}

export function updateBudget(
  userId: string,
  budgetId: string,
  updates: Partial<Budget>
): Budget | undefined {
  const budget = mockExpenseAnalytics.budgets.find(b => b.id === budgetId)
  if (!budget) return undefined

  Object.assign(budget, updates)
  return budget
}
