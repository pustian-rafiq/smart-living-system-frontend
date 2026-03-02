import type { ExpenseReport, TaxDocument } from '@/types/report'
import { getMonthlyExpenses, getYearlyExpenses } from './mockExpenses'
import { mockBills } from './mockBills'

export const mockExpenseReports: ExpenseReport[] = [
  {
    id: 'rep1',
    userId: 'r1',
    reportType: 'expense',
    period: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    generatedBy: 'r1',
    data: {
      totalExpenses: 180000,
      categoryBreakdown: [
        { categoryId: 'cat1', categoryName: 'Rent', amount: 180000, percentage: 100 },
      ],
      monthlyBreakdown: [
        { month: 'January', year: 2024, amount: 15000 },
        { month: 'February', year: 2024, amount: 15000 },
        { month: 'March', year: 2024, amount: 15000 },
      ],
      bills: mockBills.filter(b => b.tenantId === 'r1').map(b => b.id),
    },
    fileUrl: '/reports/expense-report-2024.pdf',
    fileName: 'Expense_Report_2024.pdf',
    format: 'pdf',
  },
]

export const mockTaxDocuments: TaxDocument[] = [
  {
    id: 'tax1',
    userId: 'r1',
    taxYear: 2024,
    documentType: 'rent_receipt',
    period: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    generatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    totalAmount: 180000,
    breakdown: [
      {
        category: 'Rent',
        amount: 180000,
        description: 'Monthly rent payments for 2024',
      },
    ],
    fileUrl: '/reports/tax-receipt-2024.pdf',
    fileName: 'Rent_Receipt_2024.pdf',
    verified: true,
    verifiedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    verifiedBy: 'owner1',
  },
  {
    id: 'tax2',
    userId: 'r1',
    taxYear: 2024,
    documentType: 'expense_summary',
    period: {
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    },
    generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    totalAmount: 250000,
    breakdown: [
      {
        category: 'Rent',
        amount: 180000,
        description: 'Monthly rent',
      },
      {
        category: 'Utilities',
        amount: 50000,
        description: 'Electricity, Gas, Water',
      },
      {
        category: 'Service Charge',
        amount: 20000,
        description: 'Monthly service charges',
      },
    ],
    fileUrl: '/reports/expense-summary-2024.pdf',
    fileName: 'Expense_Summary_2024.pdf',
    verified: false,
  },
]

// Helper functions
export function getExpenseReportsByUserId(userId: string): ExpenseReport[] {
  return mockExpenseReports
    .filter(report => report.userId === userId)
    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
}

export function getTaxDocumentsByUserId(userId: string): TaxDocument[] {
  return mockTaxDocuments
    .filter(doc => doc.userId === userId)
    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
}

export function generateExpenseReport(
  userId: string,
  startDate: string,
  endDate: string,
  format: 'pdf' | 'excel' | 'csv' = 'pdf'
): ExpenseReport {
  const analytics = getExpenseAnalytics(userId)
  const filteredMonths = analytics.last12Months.filter(e => {
    const expenseDate = new Date(`${e.month} 1, ${e.year}`)
    return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate)
  })

  const totalExpenses = filteredMonths.reduce((sum, e) => sum + e.totalAmount, 0)
  const categoryMap = new Map<string, { name: string; amount: number }>()

  filteredMonths.forEach(expense => {
    Object.entries(expense.categories).forEach(([categoryName, amount]) => {
      const existing = categoryMap.get(categoryName) || { name: categoryName, amount: 0 }
      existing.amount += amount
      categoryMap.set(categoryName, existing)
    })
  })

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([categoryName, data]) => ({
    categoryId: categoryName.toLowerCase().replace(/\s+/g, '_'),
    categoryName: data.name,
    amount: data.amount,
    percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
  }))

  const bills = mockBills
    .filter(b => {
      const billDate = new Date(`${b.month} 1, ${b.year}`)
      return billDate >= new Date(startDate) && billDate <= new Date(endDate) && b.tenantId === userId
    })
    .map(b => b.id)

  const newReport: ExpenseReport = {
    id: `rep${mockExpenseReports.length + 1}`,
    userId,
    reportType: 'expense',
    period: { startDate, endDate },
    generatedAt: new Date().toISOString(),
    generatedBy: userId,
    data: {
      totalExpenses,
      categoryBreakdown,
      monthlyBreakdown: filteredMonths.map(e => ({
        month: e.month,
        year: e.year,
        amount: e.totalAmount,
      })),
      bills,
    },
    fileUrl: `/reports/expense-report-${startDate}-${endDate}.${format}`,
    fileName: `Expense_Report_${startDate}_${endDate}.${format}`,
    format,
  }

  mockExpenseReports.unshift(newReport)
  return newReport
}

export function generateTaxDocument(
  userId: string,
  taxYear: number,
  documentType: 'rent_receipt' | 'expense_summary' | 'tax_certificate',
  startDate: string,
  endDate: string
): TaxDocument {
  const analytics = getExpenseAnalytics(userId)
  const filteredMonths = analytics.last12Months.filter(e => {
    const expenseDate = new Date(`${e.month} 1, ${e.year}`)
    return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate) && e.year === taxYear
  })

  const totalAmount = filteredMonths.reduce((sum, e) => sum + e.totalAmount, 0)
  const categoryMap = new Map<string, { amount: number; description: string }>()

  filteredMonths.forEach(expense => {
    Object.entries(expense.categories).forEach(([categoryName, amount]) => {
      const existing = categoryMap.get(categoryName) || { amount: 0, description: '' }
      existing.amount += amount
      existing.description = `${categoryName} payments`
      categoryMap.set(categoryName, existing)
    })
  })

  const breakdown = Array.from(categoryMap.entries()).map(([categoryName, data]) => ({
    category: categoryName,
    amount: data.amount,
    description: data.description,
  }))

  const newDocument: TaxDocument = {
    id: `tax${mockTaxDocuments.length + 1}`,
    userId,
    taxYear,
    documentType,
    period: { startDate, endDate },
    generatedAt: new Date().toISOString(),
    totalAmount,
    breakdown,
    fileUrl: `/reports/tax-${documentType}-${taxYear}.pdf`,
    fileName: `${documentType.replace('_', '-')}-${taxYear}.pdf`,
    verified: false,
  }

  mockTaxDocuments.unshift(newDocument)
  return newDocument
}
