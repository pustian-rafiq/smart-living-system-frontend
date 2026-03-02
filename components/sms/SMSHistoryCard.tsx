'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, Users, CheckCircle2, XCircle, Clock, DollarSign } from 'lucide-react'
import type { SMSMessage } from '@/types/sms'
import { format } from 'date-fns'

interface SMSHistoryCardProps {
  message: SMSMessage
  onView?: (message: SMSMessage) => void
}

const statusColors = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
  sent: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
  failed: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400',
  delivered: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400',
}

const statusIcons = {
  pending: Clock,
  sent: MessageSquare,
  failed: XCircle,
  delivered: CheckCircle2,
}

export function SMSHistoryCard({ message, onView }: SMSHistoryCardProps) {
  const StatusIcon = statusIcons[message.status]

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span className="truncate">{message.content.substring(0, 50)}...</span>
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className={`text-xs ${statusColors[message.status]}`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {message.recipientType}
              </Badge>
              {message.gateway && (
                <Badge variant="outline" className="text-xs">
                  {message.gateway}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Content Preview */}
        <div className="rounded-lg border p-3 bg-muted/30">
          <p className="text-sm line-clamp-3">{message.content}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Total</p>
              <p className="font-semibold">{message.totalRecipients}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-muted-foreground">Successful</p>
              <p className="font-semibold text-green-600">{message.successful}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <div>
              <p className="text-muted-foreground">Failed</p>
              <p className="font-semibold text-red-600">{message.failed}</p>
            </div>
          </div>
          {message.cost && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <div>
                <p className="text-muted-foreground">Cost</p>
                <p className="font-semibold">৳{message.cost.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Date Info */}
        <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
          <span>
            {message.sentAt
              ? `Sent: ${format(new Date(message.sentAt), 'MMM dd, yyyy HH:mm')}`
              : `Created: ${format(new Date(message.createdAt), 'MMM dd, yyyy HH:mm')}`}
          </span>
        </div>

        {/* Error Message */}
        {message.errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-2 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-xs text-red-800 dark:text-red-200">
              Error: {message.errorMessage}
            </p>
          </div>
        )}

        {/* Actions */}
        {onView && (
          <Button variant="outline" className="w-full" onClick={() => onView(message)}>
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
