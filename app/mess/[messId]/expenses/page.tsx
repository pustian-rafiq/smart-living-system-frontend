'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ExpenseCard } from '@/components/expense/ExpenseCard'
import { ExpenseDialog } from '@/components/expense/ExpenseDialog'
import { ExpenseChart } from '@/components/expense/ExpenseChart'
import { CategoryBreakdown } from '@/components/expense/CategoryBreakdown'
import {
  getExpensesByMess,
  getMonthlyExpenseSummary,
  generateExpenseReport,
  addExpense,
  updateExpense,
  deleteExpense,
} from '@/lib/api/messDomain'
import { fetchMessById } from '@/lib/api/mess'
import { getDemoOwnerId } from '@/lib/api/demoUser'
import { useMockQuery } from '@/hooks/useMockQuery'
import { getStoredRole } from '@/utils/auth'
import { Plus, DollarSign, FileText, TrendingUp } from 'lucide-react'
import type { MessExpense } from '@/types/messExpense'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'

export default function ExpensesManagementPage() {
  const t = useTranslations('mess')
  const tc = useTranslations('common')
  const { confirm } = useConfirm()
  const params = useParams()
  const router = useRouter()
  const role = getStoredRole()
  const messId = params.messId as string
  const ownerId = getDemoOwnerId()

  const loadMess = useCallback(() => fetchMessById(messId), [messId])
  const { data: mess } = useMockQuery(loadMess)
  const [expenses, setExpenses] = useState(getExpensesByMess(messId))
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<MessExpense | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    if (role !== 'owner') {
      router.replace('/dashboard')
    }
  }, [role, router])

  if (role !== 'owner') {
    return null
  }

  if (!mess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <p className="text-center">{t('notFound')}</p>
        </div>
      </Layout>
    )
  }

  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd')
  const monthlySummary = useMemo(
    () =>
      getMonthlyExpenseSummary(
        messId,
        format(new Date(), 'MMMM'),
        new Date().getFullYear()
      ),
    [messId]
  )

  const filteredExpenses = useMemo(() => {
    if (categoryFilter === 'all') return expenses
    return expenses.filter(e => e.category === categoryFilter)
  }, [expenses, categoryFilter])

  const handleExpenseSubmit = (data: any) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data)
    } else {
      addExpense(data)
    }
    setExpenses(getExpensesByMess(messId))
    setEditingExpense(null)
  }

  const handleExpenseDelete = async (expense: MessExpense) => {
    const ok = await confirm({
      title: t('expenses.deleteTitle'),
      description: t('expenses.deleteDesc'),
      variant: 'destructive',
    })
    if (!ok) return
    deleteExpense(expense.id)
    setExpenses(getExpensesByMess(messId))
  }

  const handleGenerateReport = () => {
    const report = generateExpenseReport(
      messId,
      'monthly',
      monthStart,
      monthEnd,
      ownerId
    )
    toast.success(
      t('expenses.reportGenerated', { fileName: report.fileName ?? '' })
    )
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const thisMonthExpenses = expenses
    .filter(e => e.date >= monthStart && e.date <= monthEnd)
    .reduce((sum, e) => sum + e.amount, 0)

  return (
    <Layout userRole="owner">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {t('expenses.managementTitle')}
            </h1>
            <p className="text-muted-foreground">{mess.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGenerateReport}>
              <FileText className="h-4 w-4 mr-2" />
              {t('expenses.generateReport')}
            </Button>
            <Button
              onClick={() => {
                setEditingExpense(null)
                setIsExpenseDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('expenses.addExpense')}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                {t('expenses.totalExpenses')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ৳{totalExpenses.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                {t('expenses.thisMonth')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ৳{thisMonthExpenses.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                {t('expenses.totalRecords')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{expenses.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Summary */}
        {monthlySummary && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {t('expenses.monthlySummary', {
                  month: monthlySummary.month,
                  year: monthlySummary.year,
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('expenses.totalAmount')}
                  </p>
                  <p className="text-2xl font-bold">
                    ৳{monthlySummary.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('expenses.expenseCount')}
                  </p>
                  <p className="text-2xl font-bold">
                    {monthlySummary.expenseCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('expenses.averageDaily')}
                  </p>
                  <p className="text-2xl font-bold">
                    ৳{monthlySummary.averageDailyExpense.toFixed(2)}
                  </p>
                </div>
              </div>
              {monthlySummary.categoryBreakdown.length > 0 && (
                <CategoryBreakdown
                  categories={monthlySummary.categoryBreakdown.map(cat => ({
                    categoryId: cat.category,
                    categoryName:
                      cat.category.charAt(0).toUpperCase() +
                      cat.category.slice(1),
                    amount: cat.amount,
                    percentage: cat.percentage,
                  }))}
                  categoryColors={
                    new Map(
                      monthlySummary.categoryBreakdown.map((cat, i) => [
                        cat.category,
                        ['#0ea5e9', '#22c55e', '#eab308', '#a855f7', '#f97316'][
                          i % 5
                        ],
                      ])
                    )
                  }
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="expenses" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="expenses">
                {t('expenses.tabs.expenses')}
              </TabsTrigger>
              <TabsTrigger value="analytics">
                {t('expenses.tabs.analytics')}
              </TabsTrigger>
            </TabsList>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t('expenses.allCategories')}
                </SelectItem>
                <SelectItem value="food">
                  {t('expenses.categories.food')}
                </SelectItem>
                <SelectItem value="utilities">
                  {t('expenses.categories.utilities')}
                </SelectItem>
                <SelectItem value="maintenance">
                  {t('expenses.categories.maintenance')}
                </SelectItem>
                <SelectItem value="staff">
                  {t('expenses.categories.staff')}
                </SelectItem>
                <SelectItem value="supplies">
                  {t('expenses.categories.supplies')}
                </SelectItem>
                <SelectItem value="other">
                  {t('expenses.categories.other')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-4">
            {filteredExpenses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredExpenses.map(expense => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onEdit={exp => {
                      setEditingExpense(exp)
                      setIsExpenseDialogOpen(true)
                    }}
                    onDelete={handleExpenseDelete}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    {t('expenses.emptyFiltered')}
                  </p>
                  <Button onClick={() => setIsExpenseDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('expenses.addFirstExpense')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            {expenses.length > 0 ? (
              <div className="space-y-6">
                <ExpenseChart
                  trends={Array.from(
                    expenses
                      .reduce((acc, e) => {
                        const p = format(new Date(e.date), 'MMM yyyy')
                        acc.set(p, (acc.get(p) || 0) + e.amount)
                        return acc
                      }, new Map<string, number>())
                      .entries()
                  ).map(([period, amount]) => ({
                    period,
                    amount,
                    categoryBreakdown: [],
                  }))}
                  type="bar"
                  title={t('expenses.expensesByMonth')}
                />
                <CategoryBreakdown
                  categories={monthlySummary.categoryBreakdown.map(cat => ({
                    categoryId: cat.category,
                    categoryName:
                      cat.category.charAt(0).toUpperCase() +
                      cat.category.slice(1),
                    amount: cat.amount,
                    percentage: cat.percentage,
                  }))}
                  categoryColors={
                    new Map(
                      monthlySummary.categoryBreakdown.map((cat, i) => [
                        cat.category,
                        ['#0ea5e9', '#22c55e', '#eab308', '#a855f7', '#f97316'][
                          i % 5
                        ],
                      ])
                    )
                  }
                />
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {t('expenses.emptyAnalytics')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialog */}
        <ExpenseDialog
          expense={editingExpense}
          messId={messId}
          open={isExpenseDialogOpen}
          onOpenChange={open => {
            setIsExpenseDialogOpen(open)
            if (!open) setEditingExpense(null)
          }}
          onSubmit={handleExpenseSubmit}
        />
      </div>
    </Layout>
  )
}
