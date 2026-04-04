'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  Mail,
  Smartphone,
} from 'lucide-react'
import type { Reminder } from '@/types/reminder'
import { format } from 'date-fns'

interface ReminderCardProps {
  reminder: Reminder
}

const channelIcons = {
  sms: Smartphone,
  push: Bell,
  email: Mail,
}

const statusColors = {
  sent: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400',
  pending:
    'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
  failed:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400',
  cancelled:
    'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400',
}

const typeLabels = {
  rent_due: 'Rent Due',
  bill_due: 'Bill Due',
  maintenance: 'Maintenance',
  custom: 'Custom',
}

export function ReminderCard({ reminder }: ReminderCardProps) {
  const statusIcon = {
    sent: CheckCircle2,
    pending: Clock,
    failed: XCircle,
    cancelled: XCircle,
  }[reminder.status]

  const StatusIcon = statusIcon

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {typeLabels[reminder.type]}
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs ${statusColors[reminder.status]}`}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {reminder.status.charAt(0).toUpperCase() +
                    reminder.status.slice(1)}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm md:text-base truncate">
                {reminder.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {reminder.message}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {reminder.sentDate
                ? format(new Date(reminder.sentDate), 'MMM dd, yyyy HH:mm')
                : format(
                    new Date(reminder.scheduledDate),
                    'MMM dd, yyyy HH:mm'
                  )}
            </div>
            <div className="flex items-center gap-1 ml-auto">
              {reminder.channels.map(channel => {
                const Icon = channelIcons[channel]
                return (
                  <div
                    key={channel}
                    className="rounded-full bg-muted p-1"
                    title={channel.toUpperCase()}
                  >
                    <Icon className="h-3 w-3" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
