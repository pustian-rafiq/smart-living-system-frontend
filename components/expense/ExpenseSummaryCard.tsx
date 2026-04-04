'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { MonthlyExpense, YearlyExpense } from '@/types/expense'

interface ExpenseSummaryCardProps {
  monthlyExpense?: MonthlyExpense
  yearlyExpense?: YearlyExpense
  title?: string
}

export function ExpenseSummaryCard({
  monthlyExpense,
  yearlyExpense,
  title = 'Expense Summary',
}: ExpenseSummaryCardProps) {
  const expense = monthlyExpense || yearlyExpense
  if (!expense) return null

  const isYearly = !!yearlyExpense
  const trend = yearlyExpense?.trend || 'stable'
  const growthRate = yearlyExpense?.growthRate || 0

  const categoryRows =
    monthlyExpense?.categories ||
    yearlyExpense?.categoryTotals.map(c => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      amount: c.total,
      percentage: c.percentage,
    })) ||
    []

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-2xl font-bold">
            ৳{expense.total.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {isYearly && yearlyExpense
              ? `Total for ${yearlyExpense.year}`
              : monthlyExpense
                ? `${monthlyExpense.month} ${monthlyExpense.year}`
                : `Year ${expense.year}`}
          </p>
        </div>

        {isYearly && (
          <div className="flex items-center gap-2">
            {trend === 'increasing' && (
              <>
                <TrendingUp className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">
                  {growthRate.toFixed(1)}% increase
                </span>
              </>
            )}
            {trend === 'decreasing' && (
              <>
                <TrendingDown className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">
                  {Math.abs(growthRate).toFixed(1)}% decrease
                </span>
              </>
            )}
            {trend === 'stable' && (
              <>
                <Minus className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Stable</span>
              </>
            )}
          </div>
        )}

        {categoryRows.length > 0 && (
          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm font-medium">Top Categories</p>
            {categoryRows
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 3)
              .map(cat => (
                <div
                  key={cat.categoryId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {cat.categoryName}
                  </span>
                  <span className="font-medium">
                    ৳{cat.amount.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
