'use client'

import { useState, useMemo, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExpenseChart } from '@/components/expense/ExpenseChart'
import { CategoryBreakdown } from '@/components/expense/CategoryBreakdown'
import { BudgetCard } from '@/components/expense/BudgetCard'
import { ExpenseSummaryCard } from '@/components/expense/ExpenseSummaryCard'
import {
  getExpenseAnalytics,
  getMonthlyExpenses,
  getYearlyExpenses,
  getBudgets,
  expenseCategories,
} from '@/data/mockExpenses'
import { getStoredRole } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import { TrendingUp, PieChart, DollarSign } from 'lucide-react'

export default function ExpensesPage() {
  const router = useRouter()
  const role = getStoredRole()

  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  )
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toLocaleString('default', { month: 'long' })
  )

  const analytics = useMemo(() => getExpenseAnalytics('r1'), [])
  const monthlyExpenses = useMemo(
    () => getMonthlyExpenses('r1', selectedYear),
    [selectedYear]
  )
  const yearlyExpenses = useMemo(() => getYearlyExpenses('r1'), [])
  const budgets = useMemo(() => getBudgets('r1'), [])

  const currentMonthlyExpense = useMemo(
    () =>
      monthlyExpenses.find(
        e => e.month === selectedMonth && e.year === selectedYear
      ),
    [monthlyExpenses, selectedMonth, selectedYear]
  )

  const currentYearlyExpense = useMemo(
    () => yearlyExpenses.find(e => e.year === selectedYear),
    [yearlyExpenses, selectedYear]
  )

  const categoryColorMap = useMemo(() => {
    const map = new Map<string, string>()
    expenseCategories.forEach(cat => {
      map.set(cat.id, cat.color)
    })
    return map
  }, [])

  const availableYears = useMemo(() => {
    const years = new Set(monthlyExpenses.map(e => e.year))
    return Array.from(years).sort((a, b) => b - a)
  }, [monthlyExpenses])

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

  useEffect(() => {
    if (role !== 'renter') {
      router.replace('/dashboard')
    }
  }, [role, router])

  if (role !== 'renter') {
    return null
  }

  return (
    <Layout userRole="renter">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Expense Analytics</h1>
          <p className="text-muted-foreground">
            Track and analyze your housing expenses
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Select
                  value={selectedYear.toString()}
                  onValueChange={v => setSelectedYear(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Month</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {currentMonthlyExpense && (
            <ExpenseSummaryCard
              monthlyExpense={currentMonthlyExpense}
              title="Monthly Summary"
            />
          )}
          {currentYearlyExpense && (
            <ExpenseSummaryCard
              yearlyExpense={currentYearlyExpense}
              title="Yearly Summary"
            />
          )}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Average Monthly
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ৳
                {currentYearlyExpense
                  ? Math.round(
                      currentYearlyExpense.monthlyAverages.reduce(
                        (sum, m) => sum + m.average,
                        0
                      ) / currentYearlyExpense.monthlyAverages.length
                    ).toLocaleString()
                  : '0'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Based on {selectedYear} data
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList>
            <TabsTrigger value="trends">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="breakdown">
              <PieChart className="h-4 w-4 mr-2" />
              Breakdown
            </TabsTrigger>
            <TabsTrigger value="budgets">
              <DollarSign className="h-4 w-4 mr-2" />
              Budgets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <ExpenseChart
              trends={analytics.trends.filter(t => {
                const [month, year] = t.period.split(' ')
                return parseInt(year) === selectedYear
              })}
              type="line"
              title="Monthly Expense Trends"
            />
            <ExpenseChart
              trends={analytics.trends.filter(t => {
                const [month, year] = t.period.split(' ')
                return parseInt(year) === selectedYear
              })}
              type="bar"
              title="Monthly Expense Comparison"
            />
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            {currentMonthlyExpense && (
              <CategoryBreakdown
                categories={currentMonthlyExpense.categories}
                categoryColors={categoryColorMap}
                title={`${selectedMonth} ${selectedYear} - Category Breakdown`}
              />
            )}
            {currentYearlyExpense && (
              <CategoryBreakdown
                categories={currentYearlyExpense.categoryTotals.map(c => ({
                  categoryId: c.categoryId,
                  categoryName: c.categoryName,
                  amount: c.total,
                  percentage: c.percentage,
                }))}
                categoryColors={categoryColorMap}
                title={`${selectedYear} - Yearly Category Breakdown`}
              />
            )}
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {budgets.map(budget => (
                <BudgetCard key={budget.id} budget={budget} />
              ))}
            </div>
            {budgets.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No budgets set</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
