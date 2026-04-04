'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import type { Notice } from '@/types/mess'
import { cn } from '@/lib/utils'

interface NoticeBoardProps {
  notices: Notice[]
}

const priorityConfig = {
  high: {
    icon: AlertCircle,
    className:
      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800',
    label: 'High',
  },
  medium: {
    icon: AlertTriangle,
    className:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    label: 'Medium',
  },
  low: {
    icon: Info,
    className:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    label: 'Low',
  },
}

export function NoticeBoard({ notices }: NoticeBoardProps) {
  const sortedNotices = [...notices].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Notice Board</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {sortedNotices.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Bell className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <p>No notices available</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {sortedNotices.map(notice => {
                const priority = priorityConfig[notice.priority]
                const PriorityIcon = priority.icon
                return (
                  <div
                    key={notice.id}
                    className="rounded-lg border p-4 transition-all hover:shadow-md"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-semibold leading-tight">
                          {notice.title}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(notice.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn('shrink-0', priority.className)}
                      >
                        <PriorityIcon className="mr-1 h-3 w-3" />
                        {priority.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {notice.content}
                    </p>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
