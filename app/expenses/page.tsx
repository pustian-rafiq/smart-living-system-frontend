'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { EmptyState, LoadingState } from '@/components/page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import type {
  ExpenseAnalytics,
  MonthlyExpense,
  YearlyExpense,
  Budget,
} from '@/types/expense'
import {
  fetchExpenseAnalytics,
  fetchMonthlyExpenses,
  fetchYearlyExpenses,
  fetchBudgets,
  fetchExpenseCategories,
} from '@/lib/api/expenses'
import { getCurrentAccountUserId } from '@/lib/api/account'
import { getStoredRole } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import { TrendingUp, PieChart, DollarSign } from 'lucide-react'

export default function ExpensesPage() {
  const router = useRouter()
  const role = getStoredRole()
  const t = useTranslations('tools.expenses')
  const tc = useTranslations('common')

  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  )
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toLocaleString('default', { month: 'long' })
  )
  const [analytics, setAnalytics] = useState<ExpenseAnalytics | null>(null)
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([])
  const [yearlyExpenses, setYearlyExpenses] = useState<YearlyExpense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categoryColorMap, setCategoryColorMap] = useState<Map<string, string>>(
    new Map()
  )
  const [isLoading, setIsLoading] = useState(true)

  const userId = getCurrentAccountUserId()

  const loadBaseData = useCallback(async () => {
    const [analyticsRes, yearlyRes, budgetsRes, categoriesRes] =
      await Promise.all([
        fetchExpenseAnalytics(userId),
        fetchYearlyExpenses(userId),
        fetchBudgets(userId),
        fetchExpenseCategories(),
      ])
    if (analyticsRes.ok) setAnalytics(analyticsRes.data)
    if (yearlyRes.ok) setYearlyExpenses(yearlyRes.data)
    if (budgetsRes.ok) setBudgets(budgetsRes.data)
    if (categoriesRes.ok) {
      const map = new Map<string, string>()
      categoriesRes.data.forEach(cat => map.set(cat.id, cat.color))
      setCategoryColorMap(map)
    }
  }, [userId])

  const loadMonthlyExpenses = useCallback(async () => {
    const result = await fetchMonthlyExpenses(selectedYear, userId)
    if (result.ok) setMonthlyExpenses(result.data)
  }, [selectedYear, userId])

  useEffect(() => {
    if (role !== 'renter') return
    let mounted = true
    setIsLoading(true)
    Promise.all([loadBaseData(), loadMonthlyExpenses()]).finally(() => {
      if (mounted) setIsLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [role, loadBaseData, loadMonthlyExpenses])

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

  if (isLoading) {
    return (
      <Layout userRole="renter">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <LoadingState label={tc('loading')} variant="skeleton" />
        </div>
      </Layout>
    )
  }

  if (!analytics) {
    return (
      <Layout userRole="renter">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <EmptyState title={t('emptyTitle')} description={t('emptyDesc')} />
        </div>
      </Layout>
    )
  }

  const hasExpenseData =
    monthlyExpenses.length > 0 ||
    yearlyExpenses.length > 0 ||
    budgets.length > 0 ||
    analytics.trends.length > 0

  if (!hasExpenseData) {
    return (
      <Layout userRole="renter">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6">
            <h1 className="mb-2 text-2xl font-bold">{t('analyticsTitle')}</h1>
            <p className="text-muted-foreground">{t('analyticsDesc')}</p>
          </div>
          <EmptyState title={t('emptyTitle')} description={t('emptyDesc')} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout userRole="renter">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{t('analyticsTitle')}</h1>
          <p className="text-muted-foreground">{t('analyticsDesc')}</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('year')}</label>
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
                <label className="text-sm font-medium">{t('month')}</label>
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {currentMonthlyExpense && (
            <ExpenseSummaryCard
              monthlyExpense={currentMonthlyExpense}
              title={t('monthlySummary')}
            />
          )}
          {currentYearlyExpense && (
            <ExpenseSummaryCard
              yearlyExpense={currentYearlyExpense}
              title={t('yearlySummary')}
            />
          )}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {t('averageMonthly')}
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
                {t('basedOnYear', { year: selectedYear })}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList>
            <TabsTrigger value="trends">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t('tabs.trends')}
            </TabsTrigger>
            <TabsTrigger value="breakdown">
              <PieChart className="h-4 w-4 mr-2" />
              {t('tabs.breakdown')}
            </TabsTrigger>
            <TabsTrigger value="budgets">
              <DollarSign className="h-4 w-4 mr-2" />
              {t('tabs.budgets')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <ExpenseChart
              trends={analytics.trends.filter(t => {
                const [, year] = t.period.split(' ')
                return parseInt(year) === selectedYear
              })}
              type="line"
              title={t('monthlyTrends')}
            />
            <ExpenseChart
              trends={analytics.trends.filter(t => {
                const [, year] = t.period.split(' ')
                return parseInt(year) === selectedYear
              })}
              type="bar"
              title={t('monthlyComparison')}
            />
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            {currentMonthlyExpense && (
              <CategoryBreakdown
                categories={currentMonthlyExpense.categories}
                categoryColors={categoryColorMap}
                title={t('monthlyCategoryBreakdown', {
                  month: selectedMonth,
                  year: selectedYear,
                })}
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
                title={t('yearlyCategoryBreakdown', { year: selectedYear })}
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
                  <p className="text-muted-foreground">{t('noBudgets')}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
