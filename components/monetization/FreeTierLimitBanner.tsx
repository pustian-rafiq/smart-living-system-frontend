'use client'

import Link from 'next/link'
import { AlertTriangle, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SubscriptionUsageMeter } from './SubscriptionUsageMeter'
import type { FlatLimitStatus } from '@/types/subscription'
import { cn } from '@/lib/utils'

interface FreeTierLimitBannerProps {
  status: FlatLimitStatus
  className?: string
  compact?: boolean
}

export function FreeTierLimitBanner({
  status,
  className,
  compact,
}: FreeTierLimitBannerProps) {
  if (status.max < 0) return null
  if (!status.nearLimit && !status.atLimit) return null

  const isCritical = status.atLimit

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
              {isCritical ? 'Flat limit reached' : 'Approaching flat limit'}
            </p>
            <p className="text-sm text-muted-foreground">
              {status.planName} plan: {status.used} / {status.max} flats
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
              ? `You’ve reached the ${status.max}-flat limit on ${status.planName}`
              : `You’re using ${status.used} of ${status.max} flats on ${status.planName}`}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isCritical
              ? 'Upgrade to Basic or Premium to add more flats. Existing units stay active.'
              : 'Upgrade now to avoid interruptions when adding new units.'}
          </p>
        </div>
      </div>
      <SubscriptionUsageMeter status={status} />
      <Button asChild size="sm">
        <Link href="/subscription">
          View plans & upgrade
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
