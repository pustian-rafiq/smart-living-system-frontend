'use client'

import { useId } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/format/locale'

interface CategoryBreakdownProps {
  categories: {
    categoryId: string
    categoryName: string
    amount: number
    percentage: number
  }[]
  categoryColors: Map<string, string>
  title?: string
}

export function CategoryBreakdown({
  categories,
  categoryColors,
  title = 'Category Breakdown',
}: CategoryBreakdownProps) {
  const titleId = useId()
  const data = categories.map(cat => ({
    name: cat.categoryName,
    value: cat.amount,
    percentage: cat.percentage,
  }))

  const COLORS = categories.map(
    cat => categoryColors.get(cat.categoryId) || '#6b7280'
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle id={titleId}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <figure role="figure" aria-labelledby={titleId}>
          <VisuallyHidden as="figcaption">
            Pie chart of expenses by category. Full breakdown in the list below.
          </VisuallyHidden>
          <div aria-hidden="true" className="h-[300px] w-full" tabIndex={0}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name ?? ''}: ${((percent ?? 0) * 100).toFixed(1)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number | string | undefined) => [
                    formatCurrency(Number(value ?? 0)),
                    'Amount',
                  ]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </figure>
        <ul
          className="mt-4 space-y-2"
          aria-label="Expense category breakdown"
        >
          {categories.map((cat, index) => (
            <li
              key={cat.categoryId}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                  aria-hidden="true"
                />
                <span>{cat.categoryName}</span>
              </div>
              <div className="text-right">
                <span className="font-medium">{formatCurrency(cat.amount)}</span>
                <span className="ml-2 text-muted-foreground">
                  ({cat.percentage.toFixed(1)}%)
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
