'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, AlertCircle } from 'lucide-react'
import type { Bill } from '@/types/bill'

interface BillsSummaryProps {
  bills: Bill[]
  showViewAll?: boolean
}

export function BillsSummary({ bills, showViewAll = true }: BillsSummaryProps) {
  const upcoming = bills.filter(b => {
    const dueDate = new Date(b.dueDate)
    const today = new Date()
    return b.status === 'unpaid' && dueDate >= today
  })
  const overdue = bills.filter(b => {
    const dueDate = new Date(b.dueDate)
    const today = new Date()
    return b.status === 'unpaid' && dueDate < today
  })
  const paid = bills.filter(b => b.status === 'paid')
  const totalDue = [...upcoming, ...overdue].reduce(
    (sum, b) => sum + b.amount,
    0
  )
  const totalPaid = paid.reduce((sum, b) => sum + b.amount, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Bills Summary
        </CardTitle>
        {showViewAll && (
          <Button asChild variant="ghost" size="sm">
            <Link href="/bills">View All</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center sm:text-left">
            <p className="text-xs text-muted-foreground mb-1">Upcoming</p>
            <p className="text-lg font-bold">{upcoming.length}</p>
            <p className="text-xs text-muted-foreground">
              ৳{upcoming.reduce((s, b) => s + b.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs text-muted-foreground mb-1">Overdue</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">
              {overdue.length}
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">
              ৳{overdue.reduce((s, b) => s + b.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs text-muted-foreground mb-1">Total Due</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
              ৳{totalDue.toLocaleString()}
            </p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs text-muted-foreground mb-1">Paid</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {paid.length}
            </p>
            <p className="text-xs text-muted-foreground">
              ৳{totalPaid.toLocaleString()}
            </p>
          </div>
        </div>
        {overdue.length > 0 && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {overdue.length} overdue bill{overdue.length > 1 ? 's' : ''}
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="mt-2 w-full border-red-300 text-red-700 hover:bg-red-100"
            >
              <Link href="/bills?status=overdue">Pay Now</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
