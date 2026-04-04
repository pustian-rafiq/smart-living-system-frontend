'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, User, RotateCcw, Eye } from 'lucide-react'
import { format } from 'date-fns'
import type { AuditLog } from '@/types/audit'

interface AuditLogCardProps {
  log: AuditLog
  onViewDetails?: (log: AuditLog) => void
  onRollback?: (log: AuditLog) => void
  showRollback?: boolean
}

const actionColors: Record<string, string> = {
  create:
    'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400',
  update:
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
  delete:
    'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400',
  approve:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400',
  reject:
    'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400',
  verify:
    'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400',
  unverify:
    'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400',
  payment:
    'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400',
  rollback:
    'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
}

const roleColors: Record<string, string> = {
  admin:
    'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400',
  owner:
    'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400',
  renter:
    'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400',
}

export function AuditLogCard({
  log,
  onViewDetails,
  onRollback,
  showRollback = true,
}: AuditLogCardProps) {
  const timeAgo = formatDistanceToNow(new Date(log.timestamp))

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge
                  variant="outline"
                  className={
                    actionColors[log.action] ||
                    'bg-gray-50 text-gray-700 border-gray-200'
                  }
                >
                  {log.action.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {log.entityType}
                </Badge>
                {log.canRollback && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
                  >
                    Rollback Available
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-sm md:text-base truncate">
                {log.entityName}
              </h3>
            </div>
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(log)}
                className="shrink-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Changes Preview */}
          {log.changes && log.changes.length > 0 && (
            <div className="space-y-1">
              {log.changes.slice(0, 2).map((change, idx) => (
                <div key={idx} className="text-xs text-muted-foreground">
                  <span className="font-medium">{change.field}:</span>{' '}
                  <span className="line-through text-red-600 dark:text-red-400">
                    {String(change.oldValue || 'N/A')}
                  </span>{' '}
                  →{' '}
                  <span className="text-green-600 dark:text-green-400">
                    {String(change.newValue || 'N/A')}
                  </span>
                </div>
              ))}
              {log.changes.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{log.changes.length - 2} more changes
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span className="truncate">{log.userName}</span>
                <Badge
                  variant="outline"
                  className={`ml-1 text-xs ${roleColors[log.userRole] || ''}`}
                >
                  {log.userRole}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{timeAgo}</span>
              </div>
            </div>
            {showRollback && log.canRollback && onRollback && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRollback(log)}
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Rollback
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return format(date, 'MMM dd, yyyy')
}
