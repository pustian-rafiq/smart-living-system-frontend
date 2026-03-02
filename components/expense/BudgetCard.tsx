'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import type { Budget } from '@/types/expense'

interface BudgetCardProps {
  budget: Budget
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const percentage = budget.monthlyLimit > 0
    ? (budget.currentSpending / budget.monthlyLimit) * 100
    : 0

  const isOverBudget = percentage > 100
  const isNearLimit = budget.alerts.enabled && percentage >= budget.alerts.threshold && percentage <= 100

  return (
    <Card className={isOverBudget ? 'border-red-500' : isNearLimit ? 'border-yellow-500' : ''}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{budget.categoryName}</CardTitle>
          {isOverBudget && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Over Budget
            </Badge>
          )}
          {isNearLimit && !isOverBudget && (
            <Badge variant="outline" className="flex items-center gap-1 border-yellow-500 text-yellow-600">
              <AlertCircle className="h-3 w-3" />
              Near Limit
            </Badge>
          )}
          {!isOverBudget && !isNearLimit && (
            <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-600">
              <CheckCircle2 className="h-3 w-3" />
              On Track
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Spent</span>
          <span className="font-medium">৳{budget.currentSpending.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Limit</span>
          <span className="font-medium">৳{budget.monthlyLimit.toLocaleString()}</span>
        </div>
        <Progress
          value={Math.min(percentage, 100)}
          className={`h-2 ${
            isOverBudget
              ? 'bg-red-500'
              : isNearLimit
              ? 'bg-yellow-500'
              : 'bg-green-500'
          }`}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{percentage.toFixed(1)}% used</span>
          {!isOverBudget && (
            <span>
              ৳{(budget.monthlyLimit - budget.currentSpending).toLocaleString()} remaining
            </span>
          )}
          {isOverBudget && (
            <span className="text-red-600">
              ৳{(budget.currentSpending - budget.monthlyLimit).toLocaleString()} over
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
