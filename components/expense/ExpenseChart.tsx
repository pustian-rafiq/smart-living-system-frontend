'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AccessibleChart } from '@/components/a11y/AccessibleChart'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { ExpenseTrend } from '@/types/expense'
import { formatCurrency } from '@/lib/format/locale'

interface ExpenseChartProps {
  trends: ExpenseTrend[]
  type?: 'line' | 'bar'
  title?: string
}

export function ExpenseChart({
  trends,
  type = 'line',
  title = 'Expense Trends',
}: ExpenseChartProps) {
  const data = trends.map(trend => ({
    period: trend.period,
    amount: trend.amount,
  }))

  const chart = (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'line' ? (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip
            formatter={(value: number | undefined) => [
              formatCurrency(value ?? 0),
              'Amount',
            ]}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            name="Expense"
          />
        </LineChart>
      ) : (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip
            formatter={(value: number | undefined) => [
              formatCurrency(value ?? 0),
              'Amount',
            ]}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
            }}
          />
          <Legend />
          <Bar dataKey="amount" fill="hsl(var(--primary))" name="Expense" />
        </BarChart>
      )}
    </ResponsiveContainer>
  )

  return (
    <AccessibleChart
      title={title}
      description={`${type === 'line' ? 'Line' : 'Bar'} chart showing expense amounts over time.`}
      data={data}
      rowLabelKey="period"
      columns={[
        { key: 'period', label: 'Period' },
        {
          key: 'amount',
          label: 'Amount',
          format: v => formatCurrency(Number(v)),
        },
      ]}
      height={300}
    >
      {chart}
    </AccessibleChart>
  )
}
