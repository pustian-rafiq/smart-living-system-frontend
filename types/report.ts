export type ReportFormat = 'pdf' | 'excel' | 'csv'

export type ReportType = 'expense' | 'payment' | 'tax' | 'comprehensive'

export interface ExpenseReport {
  id: string
  userId: string
  reportType: ReportType
  period: {
    startDate: string
    endDate: string
  }
  generatedAt: string
  generatedBy: string
  data: {
    totalExpenses: number
    categoryBreakdown: {
      categoryId: string
      categoryName: string
      amount: number
      percentage: number
    }[]
    monthlyBreakdown: {
      month: string
      year: number
      amount: number
    }[]
    bills: string[] // Bill IDs
  }
  fileUrl?: string
  fileName?: string
  format: ReportFormat
}

export interface TaxDocument {
  id: string
  userId: string
  taxYear: number
  documentType: 'rent_receipt' | 'expense_summary' | 'tax_certificate'
  period: {
    startDate: string
    endDate: string
  }
  generatedAt: string
  totalAmount: number
  breakdown: {
    category: string
    amount: number
    description: string
  }[]
  fileUrl?: string
  fileName?: string
  verified: boolean
  verifiedAt?: string
  verifiedBy?: string
}
