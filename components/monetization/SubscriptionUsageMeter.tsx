'use client'

import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import type { ModuleLimitStatus, OwnerUsageStatus } from '@/types/subscription'
import type { OwnerVertical } from '@/lib/owner-focus'
import { OWNER_VERTICAL_META } from '@/lib/owner-focus'
import { cn } from '@/lib/utils'

const MODULE_UNIT: Record<OwnerVertical, string> = {
  mess: 'messes',
  apartment: 'flats',
  hotel: 'hotels',
}

function ModuleMeter({
  label,
  unit,
  status,
}: {
  label: string
  unit: string
  status: ModuleLimitStatus
}) {
  const unlimited = status.max < 0
  const pct = unlimited
    ? 0
    : Math.min(100, Math.round((status.used / Math.max(status.max, 1)) * 100))

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium">{label}</span>
        <span className="shrink-0 text-muted-foreground">
          {unlimited
            ? `${status.used} ${unit} (unlimited)`
            : `${status.used} / ${status.max}`}
        </span>
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

interface SubscriptionUsageMeterProps {
  usage: OwnerUsageStatus
  /** Only show meters for these verticals (defaults to enabledVerticals). */
  verticals?: OwnerVertical[]
  className?: string
}

export function SubscriptionUsageMeter({
  usage,
  verticals,
  className,
}: SubscriptionUsageMeterProps) {
  const keys =
    verticals && verticals.length > 0
      ? verticals
      : (usage.enabledVerticals as OwnerVertical[]).length > 0
        ? (usage.enabledVerticals as OwnerVertical[])
        : (['mess', 'apartment', 'hotel'] as OwnerVertical[])

  const modules: Record<OwnerVertical, ModuleLimitStatus> = {
    mess: usage.mess,
    apartment: usage.apartment,
    hotel: usage.hotel,
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Plan usage</span>
        <Badge variant="outline">{usage.planName}</Badge>
      </div>
      {keys.map(key => (
        <ModuleMeter
          key={key}
          label={OWNER_VERTICAL_META[key].label}
          unit={MODULE_UNIT[key]}
          status={modules[key]}
        />
      ))}
    </div>
  )
}
