'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, CreditCard, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import type { ScheduledPayment } from '@/types/payment'
import { format, differenceInDays } from 'date-fns'

interface ScheduledPaymentCardProps {
  payment: ScheduledPayment
  onEdit?: (payment: ScheduledPayment) => void
  onCancel?: (payment: ScheduledPayment) => void
  showActions?: boolean
}

const statusColors = {
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
  processing: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400',
  completed: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400',
  failed: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400',
  cancelled: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400',
}

const statusIcons = {
  scheduled: Calendar,
  pending: Clock,
  processing: Clock,
  completed: CheckCircle2,
  failed: XCircle,
  cancelled: XCircle,
}

export function ScheduledPaymentCard({
  payment,
  onEdit,
  onCancel,
  showActions = true,
}: ScheduledPaymentCardProps) {
  const daysUntilPayment = differenceInDays(new Date(payment.scheduledDate), new Date())
  const isUpcoming = daysUntilPayment >= 0 && payment.status === 'scheduled'
  const isOverdue = daysUntilPayment < 0 && payment.status === 'scheduled'

  const StatusIcon = statusIcons[payment.status]

  return (
    <Card className={`transition-all hover:shadow-md ${isOverdue ? 'border-red-500' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base md:text-lg truncate">{payment.billName}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={`text-xs ${statusColors[payment.status]}`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </Badge>
              {payment.autoRetry && (
                <Badge variant="outline" className="text-xs">
                  Auto-retry
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount */}
        <div>
          <p className="text-2xl font-bold text-primary">৳{payment.amount.toLocaleString()}</p>
        </div>

        {/* Schedule Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Scheduled Date
            </span>
            <span className="font-medium">
              {format(new Date(payment.scheduledDate), 'MMM dd, yyyy')}
            </span>
          </div>
          {payment.scheduledTime && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Time
              </span>
              <span className="font-medium">{payment.scheduledTime}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              Payment Method
            </span>
            <span className="font-medium">{payment.paymentMethod}</span>
          </div>
          {payment.accountNumber && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Account</span>
              <span className="font-medium">{payment.accountNumber}</span>
            </div>
          )}
        </div>

        {/* Time Until Payment */}
        {isUpcoming && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {daysUntilPayment === 0
                  ? 'Due today'
                  : daysUntilPayment === 1
                  ? 'Due tomorrow'
                  : `Due in ${daysUntilPayment} days`}
              </p>
            </div>
          </div>
        )}

        {isOverdue && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Overdue by {Math.abs(daysUntilPayment)} day{Math.abs(daysUntilPayment) !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Failure Reason */}
        {payment.status === 'failed' && payment.failureReason && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-xs font-medium text-red-800 dark:text-red-200">
              Failure: {payment.failureReason}
            </p>
            {payment.autoRetry && payment.retryCount < payment.maxRetries && (
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                Auto-retry: {payment.retryCount}/{payment.maxRetries} attempts
              </p>
            )}
          </div>
        )}

        {/* Transaction ID */}
        {payment.transactionId && (
          <div className="text-xs text-muted-foreground">
            Transaction: {payment.transactionId}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2 border-t">
            {payment.status === 'scheduled' && onEdit && (
              <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(payment)}>
                Edit
              </Button>
            )}
            {(payment.status === 'scheduled' || payment.status === 'pending') && onCancel && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onCancel(payment)}
              >
                Cancel
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
