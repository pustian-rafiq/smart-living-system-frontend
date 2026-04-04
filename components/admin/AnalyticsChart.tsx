'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface AnalyticsChartProps {
  title: string
  data: { label: string; value: number; color?: string }[]
  total?: number
}

export function AnalyticsChart({ title, data, total }: AnalyticsChartProps) {
  const maxValue = total || Math.max(...data.map(d => d.value), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">
                  {item.value.toLocaleString()}
                  {total && ` (${((item.value / total) * 100).toFixed(1)}%)`}
                </span>
              </div>
              <Progress value={(item.value / maxValue) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
