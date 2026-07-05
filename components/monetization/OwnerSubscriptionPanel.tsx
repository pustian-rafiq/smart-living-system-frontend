'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlanCard } from './PlanCard'
import { SubscriptionUsageMeter } from './SubscriptionUsageMeter'
import { FreeTierLimitBanner } from './FreeTierLimitBanner'
import { useMockQuery } from '@/hooks/useMockQuery'
import {
  fetchOwnerSubscription,
  fetchFlatLimitStatus,
  upgradeOwnerPlan,
} from '@/lib/api/subscriptions'
import { getSubscriptionPlans } from '@/lib/monetization/plans'
import type { PlanTier } from '@/types/subscription'
import { Calendar, Sparkles, Crown } from 'lucide-react'
import { format } from 'date-fns'

export function OwnerSubscriptionPanel() {
  const [tick, setTick] = useState(0)
  const [upgrading, setUpgrading] = useState<PlanTier | null>(null)
  const [upgradeMsg, setUpgradeMsg] = useState<string | null>(null)

  const loadSub = useCallback(() => fetchOwnerSubscription(), [tick])
  const loadLimit = useCallback(() => fetchFlatLimitStatus(), [tick])

  const { data: subscription } = useMockQuery(loadSub)
  const { data: limitStatus } = useMockQuery(loadLimit)

  const plans = getSubscriptionPlans()

  const handleUpgrade = async (tier: PlanTier) => {
    if (tier === 'free' || tier === subscription?.planTier) return
    setUpgrading(tier)
    setUpgradeMsg(null)
    const result = await upgradeOwnerPlan(tier)
    setUpgrading(null)
    if (!result.ok) {
      setUpgradeMsg(result.error)
      return
    }
    setUpgradeMsg(`Upgraded to ${tier} plan successfully (demo).`)
    setTick(t => t + 1)
  }

  return (
    <div className="space-y-6">
      {limitStatus && (
        <FreeTierLimitBanner status={limitStatus} />
      )}

      {subscription && limitStatus && (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Crown className="h-5 w-5 text-primary" />
                Current plan
              </CardTitle>
              <Badge variant="secondary" className="capitalize">
                {subscription.planTier}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <SubscriptionUsageMeter status={limitStatus} />
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Billing cycle:{' '}
                {format(new Date(subscription.billingCycleStart), 'MMM d')} –{' '}
                {format(new Date(subscription.billingCycleEnd), 'MMM d, yyyy')}
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-amber-500" />
                {subscription.activeFeaturedListings} active featured listing
                {subscription.activeFeaturedListings !== 1 ? 's' : ''}
              </span>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/my-listings">Boost a listing</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="mb-4 text-lg font-semibold">Choose your plan</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map(plan => (
            <PlanCard
              key={plan.tier}
              plan={plan}
              currentTier={subscription?.planTier}
              onSelect={handleUpgrade}
              loading={upgrading === plan.tier}
            />
          ))}
        </div>
        {upgradeMsg && (
          <p className="mt-3 text-sm text-muted-foreground">{upgradeMsg}</p>
        )}
      </div>

      <Card className="border-dashed bg-muted/30">
        <CardContent className="p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">How billing works (demo)</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Free: up to 3 flats — perfect to try the platform</li>
            <li>Basic & Premium: billed monthly via bKash or card (TODO)</li>
            <li>Featured boosts are one-time add-ons per listing</li>
            <li>Platform commission on bookings is separate — see Payments</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
