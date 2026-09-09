'use client'

import Link from 'next/link'
import { AlertTriangle, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SubscriptionUsageMeter } from './SubscriptionUsageMeter'
import type { OwnerUsageStatus } from '@/types/subscription'
import type { OwnerVertical } from '@/lib/owner-focus'
import { OWNER_VERTICAL_META } from '@/lib/owner-focus'
import { cn } from '@/lib/utils'

interface FreeTierLimitBannerProps {
  usage: OwnerUsageStatus
  verticals?: OwnerVertical[]
  className?: string
  compact?: boolean
}

function findAlertModule(
  usage: OwnerUsageStatus,
  verticals: OwnerVertical[]
): { key: OwnerVertical; label: string } | null {
  const modules = {
    mess: usage.mess,
    apartment: usage.apartment,
    hotel: usage.hotel,
  }
  const ordered =
    verticals.length > 0
      ? verticals
      : (['mess', 'apartment', 'hotel'] as OwnerVertical[])

  const atLimit = ordered.find(k => modules[k].atLimit)
  if (atLimit) {
    return { key: atLimit, label: OWNER_VERTICAL_META[atLimit].label }
  }
  const near = ordered.find(k => modules[k].nearLimit)
  if (near) {
    return { key: near, label: OWNER_VERTICAL_META[near].label }
  }
  return null
}

export function FreeTierLimitBanner({
  usage,
  verticals,
  className,
  compact,
}: FreeTierLimitBannerProps) {
  const keys =
    verticals && verticals.length > 0
      ? verticals
      : (usage.enabledVerticals as OwnerVertical[])

  const alert = findAlertModule(usage, keys)
  if (!alert) return null

  const module = {
    mess: usage.mess,
    apartment: usage.apartment,
    hotel: usage.hotel,
  }[alert.key]
  const isCritical = module.atLimit

  if (compact) {
    return (
      <div
        className={cn(
          'flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between',
          isCritical
            ? 'border-destructive/50 bg-destructive/5'
            : 'border-amber-500/40 bg-amber-500/5',
          className
        )}
      >
        <div className="flex gap-3">
          <AlertTriangle
            className={cn(
              'h-5 w-5 shrink-0',
              isCritical ? 'text-destructive' : 'text-amber-600'
            )}
          />
          <div>
            <p className="font-medium">
              {isCritical
                ? `${alert.label} limit reached`
                : `Approaching ${alert.label.toLowerCase()} limit`}
            </p>
            <p className="text-sm text-muted-foreground">
              {usage.planName} plan:{' '}
              {module.max < 0
                ? `${module.used} (unlimited)`
                : `${module.used} / ${module.max}`}
            </p>
          </div>
        </div>
        <Button asChild size="sm" variant={isCritical ? 'default' : 'outline'}>
          <Link href="/subscription">
            Upgrade
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'space-y-3 rounded-lg border border-dashed p-4',
        isCritical
          ? 'border-destructive/50 bg-destructive/5'
          : 'border-amber-500/40 bg-amber-500/5',
        className
      )}
    >
      <div className="flex gap-3">
        <AlertTriangle
          className={cn(
            'h-5 w-5 shrink-0',
            isCritical ? 'text-destructive' : 'text-amber-600'
          )}
        />
        <div>
          <p className="font-semibold">
            {isCritical
              ? `You’ve reached the ${alert.label.toLowerCase()} limit on ${usage.planName}`
              : `You’re using ${module.used} of ${module.max} on ${alert.label} (${usage.planName})`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isCritical
              ? 'Upgrade to Basic or Premium to add more. Existing units stay active.'
              : 'Upgrade now to avoid interruptions when adding more.'}
          </p>
        </div>
      </div>
      <SubscriptionUsageMeter usage={usage} verticals={keys} />
      <Button asChild size="sm">
        <Link href="/subscription">
          View plans & upgrade
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
