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

interface SliceLabelProps {
  cx?: number
  cy?: number
  midAngle?: number
  innerRadius?: number
  outerRadius?: number
  percent?: number
}

const RADIAN = Math.PI / 180

/**
 * Percentages sit inside their slice so they can never collide with a
 * neighbour's label, however narrow the screen. Slivers under 5% stay bare —
 * the legend and the list below name every category anyway.
 */
function renderSliceLabel({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}: SliceLabelProps) {
  if (percent < 0.05) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6
  return (
    <text
      x={cx + radius * Math.cos(-midAngle * RADIAN)}
      y={cy + radius * Math.sin(-midAngle * RADIAN)}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function CategoryBreakdown({
  categories,
  categoryColors,
  title = 'Category Breakdown',
}: CategoryBreakdownProps) {
  const titleId = useId()
  const colorFor = (categoryId: string) =>
    categoryColors.get(categoryId) || '#6b7280'

  // Only spent categories go in the pie — a 0% slice has no wedge to sit in and
  // its label collides with its neighbours. The list below still shows them all.
  const used = categories.filter(cat => cat.amount > 0)
  const data = used.map(cat => ({
    name: cat.categoryName,
    value: cat.amount,
    percentage: cat.percentage,
    color: colorFor(cat.categoryId),
  }))

  if (used.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle id={titleId}>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-6 text-center text-sm text-muted-foreground">
            No expenses recorded for this period yet.
          </p>
        </CardContent>
      </Card>
    )
  }

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
          <div
            aria-hidden="true"
            className="h-[260px] w-full sm:h-[300px]"
            tabIndex={0}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderSliceLabel}
                  outerRadius="75%"
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map(entry => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(
                    value: number | string | undefined,
                    name: number | string | undefined,
                  ) => [formatCurrency(Number(value ?? 0)), String(name ?? '')]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: 12, lineHeight: '18px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </figure>
        <ul
          className="mt-4 space-y-2"
          aria-label="Expense category breakdown"
        >
          {categories.map(cat => (
            <li
              key={cat.categoryId}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: colorFor(cat.categoryId) }}
                  aria-hidden="true"
                />
                <span className="truncate">{cat.categoryName}</span>
              </div>
              <div className="shrink-0 text-right">
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
