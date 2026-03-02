'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText } from 'lucide-react'
import type { Bill } from '@/types/bill'
import { format } from 'date-fns'

interface RecentBillsProps {
  bills: Bill[]
  limit?: number
  showViewAll?: boolean
}

export function RecentBills({ bills, limit = 3, showViewAll = true }: RecentBillsProps) {
  if (bills.length === 0) return null

  const recentBills = bills.slice(0, limit)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Recent Bills
        </CardTitle>
        {showViewAll && (
          <Button asChild variant="ghost" size="sm">
            <Link href="/bills">View All</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentBills.map((bill) => {
            const isOverdue = bill.status === 'unpaid' && new Date(bill.dueDate) < new Date()
            return (
              <div
                key={bill.id}
                className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm md:text-base">
                      {bill.month} {bill.year}
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        bill.status === 'paid'
                          ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400'
                          : isOverdue
                          ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }
                    >
                      {bill.status === 'paid' ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {bill.propertyName} • {bill.flatNumber || bill.seatNumber}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due: {format(new Date(bill.dueDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-bold text-primary">
                    ৳{bill.amount.toLocaleString()}
                  </p>
                  {bill.status === 'unpaid' && (
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <Link href="/bills">Pay</Link>
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
