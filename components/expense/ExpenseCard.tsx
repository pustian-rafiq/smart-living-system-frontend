'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Calendar, Store, FileText } from 'lucide-react'
import type { MessExpense } from '@/types/messExpense'
import { format } from 'date-fns'

interface ExpenseCardProps {
  expense: MessExpense
  onEdit?: (expense: MessExpense) => void
  onDelete?: (expense: MessExpense) => void
  showActions?: boolean
}

const categoryLabels = {
  food: 'Food',
  utilities: 'Utilities',
  maintenance: 'Maintenance',
  staff: 'Staff',
  supplies: 'Supplies',
  other: 'Other',
}

const categoryColors = {
  food: 'bg-orange-50 text-orange-700 border-orange-200',
  utilities: 'bg-blue-50 text-blue-700 border-blue-200',
  maintenance: 'bg-purple-50 text-purple-700 border-purple-200',
  staff: 'bg-green-50 text-green-700 border-green-200',
  supplies: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  other: 'bg-gray-50 text-gray-700 border-gray-200',
}

export function ExpenseCard({
  expense,
  onEdit,
  onDelete,
  showActions = true,
}: ExpenseCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base md:text-lg flex items-start gap-2">
              <DollarSign className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span className="min-w-0 break-words">{expense.description}</span>
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="outline"
                className={`text-xs ${categoryColors[expense.category]}`}
              >
                {categoryLabels[expense.category]}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount */}
        <div>
          <p className="text-2xl font-bold text-primary">
            ৳{expense.amount.toLocaleString()}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium">
              {format(new Date(expense.date), 'MMM dd, yyyy')}
            </span>
          </div>
          {expense.vendor && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <Store className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">Vendor:</span>
              <span className="min-w-0 break-words font-medium">
                {expense.vendor}
              </span>
            </div>
          )}
        </div>

        {/* Notes */}
        {expense.notes && (
          <div className="rounded-lg border p-3 bg-muted/30">
            <p className="text-sm text-muted-foreground">{expense.notes}</p>
          </div>
        )}

        {/* Receipt */}
        {expense.receiptUrl && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a
              href={expense.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Receipt
            </a>
          </Button>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2 border-t">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEdit(expense)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onDelete(expense)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
