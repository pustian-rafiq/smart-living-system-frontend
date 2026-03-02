'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { ExpenseCategory } from '@/types/expense'

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
  const data = categories.map(cat => ({
    name: cat.categoryName,
    value: cat.amount,
    percentage: cat.percentage,
  }))

  const COLORS = categories.map(cat => categoryColors.get(cat.categoryId) || '#6b7280')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`৳${value.toLocaleString()}`, 'Amount']}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {categories.map((cat, index) => (
            <div key={cat.categoryId} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span>{cat.categoryName}</span>
              </div>
              <div className="text-right">
                <span className="font-medium">৳{cat.amount.toLocaleString()}</span>
                <span className="text-muted-foreground ml-2">({cat.percentage.toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
