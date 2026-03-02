export interface ExpenseCategory {
  id: string
  name: string
  type: 'rent' | 'utilities' | 'maintenance' | 'service' | 'other'
  color: string
}

export interface MonthlyExpense {
  month: string
  year: number
  total: number
  categories: {
    categoryId: string
    categoryName: string
    amount: number
    percentage: number
  }[]
  bills: string[] // Bill IDs
}

export interface YearlyExpense {
  year: number
  total: number
  monthlyAverages: {
    month: string
    average: number
  }[]
  categoryTotals: {
    categoryId: string
    categoryName: string
    total: number
    percentage: number
  }[]
  trend: 'increasing' | 'decreasing' | 'stable'
  growthRate: number
}

export interface ExpenseTrend {
  period: string
  amount: number
  categoryBreakdown: {
    categoryId: string
    amount: number
  }[]
}

export interface Budget {
  id: string
  categoryId: string
  categoryName: string
  monthlyLimit: number
  currentSpending: number
  period: {
    month: string
    year: number
  }
  alerts: {
    enabled: boolean
    threshold: number // Percentage (e.g., 80 for 80%)
  }
}

export interface ExpenseAnalytics {
  userId: string
  monthlyExpenses: MonthlyExpense[]
  yearlyExpenses: YearlyExpense[]
  trends: ExpenseTrend[]
  budgets: Budget[]
  categories: ExpenseCategory[]
}
