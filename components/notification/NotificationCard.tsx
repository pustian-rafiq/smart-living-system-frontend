'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Bell, FileText, DollarSign, Settings, Info } from 'lucide-react'
import type { Notification } from '@/types/complaint'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface NotificationCardProps {
  notification: Notification
  onToggleRead: (id: string) => void
}

const typeConfig = {
  complaint: {
    icon: FileText,
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  },
  bill: {
    icon: DollarSign,
    className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  },
  system: {
    icon: Settings,
    className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  },
  other: {
    icon: Info,
    className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  },
}

export function NotificationCard({ notification, onToggleRead }: NotificationCardProps) {
  const type = typeConfig[notification.type]
  const Icon = type.icon

  const content = (
    <Card
      className={cn(
        'transition-all',
        !notification.read && 'border-primary/50 bg-primary/5',
        notification.read && 'opacity-75'
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn('rounded-lg p-2', type.className)}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className={cn('font-semibold', !notification.read && 'text-primary')}>
                  {notification.title}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {notification.message}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {!notification.read && (
                <Badge variant="default" className="shrink-0">
                  New
                </Badge>
              )}
            </div>
          </div>
          <Switch
            checked={notification.read}
            onCheckedChange={() => onToggleRead(notification.id)}
            className="shrink-0"
          />
        </div>
      </CardContent>
    </Card>
  )

  if (notification.link) {
    return (
      <Link href={notification.link} className="block">
        {content}
      </Link>
    )
  }

  return content
}
