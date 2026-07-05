'use client'

import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import type { FlatLimitStatus } from '@/types/subscription'
import { cn } from '@/lib/utils'

interface SubscriptionUsageMeterProps {
  status: FlatLimitStatus
  className?: string
}

export function SubscriptionUsageMeter({
  status,
  className,
}: SubscriptionUsageMeterProps) {
  const unlimited = status.max < 0
  const pct = unlimited
    ? 0
    : Math.min(100, Math.round((status.used / status.max) * 100))

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Flats managed</span>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{status.planName}</Badge>
          <span className="text-muted-foreground">
            {unlimited
              ? `${status.used} flats (unlimited)`
              : `${status.used} / ${status.max}`}
          </span>
        </div>
      </div>
      {!unlimited && (
        <Progress
          value={pct}
          className={cn(
            'h-2',
            status.atLimit && '[&>div]:bg-destructive',
            status.nearLimit && !status.atLimit && '[&>div]:bg-amber-500'
          )}
        />
      )}
    </div>
  )
}
