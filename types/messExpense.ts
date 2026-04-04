export type ExpenseCategory =
  | 'food'
  | 'utilities'
  | 'maintenance'
  | 'staff'
  | 'supplies'
  | 'other'

export interface MessExpense {
  id: string
  messId: string
  category: ExpenseCategory
  description: string
  amount: number
  date: string // ISO date string
  receiptUrl?: string
  vendor?: string
  notes?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface MonthlyExpenseSummary {
  messId: string
  month: string
  year: number
  totalAmount: number
  categoryBreakdown: {
    category: ExpenseCategory
    amount: number
    percentage: number
  }[]
  expenseCount: number
  averageDailyExpense: number
}

export interface ExpenseReport {
  id: string
  messId: string
  reportType: 'monthly' | 'yearly' | 'custom'
  period: {
    startDate: string
    endDate: string
  }
  generatedAt: string
  generatedBy: string
  summary: MonthlyExpenseSummary
  expenses: string[] // Expense IDs
  fileUrl?: string
  fileName?: string
}
