'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Crown } from 'lucide-react'
import { formatPlanLimit } from '@/lib/monetization/plans'
import type { PlanTier, SubscriptionPlan } from '@/types/subscription'
import { cn } from '@/lib/utils'

interface PlanCardProps {
  plan: SubscriptionPlan
  currentTier?: PlanTier
  onSelect?: (tier: PlanTier) => void
  loading?: boolean
}

export function PlanCard({
  plan,
  currentTier,
  onSelect,
  loading,
}: PlanCardProps) {
  const isCurrent = currentTier === plan.tier
  const isUpgrade =
    currentTier &&
    ((currentTier === 'free' && plan.tier !== 'free') ||
      (currentTier === 'basic' && plan.tier === 'premium'))

  return (
    <Card
      className={cn(
        'relative flex flex-col',
        plan.highlighted && 'border-primary shadow-md',
        isCurrent && 'ring-2 ring-primary'
      )}
    >
      {plan.highlighted && (
        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2">
          Most popular
        </Badge>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{plan.name}</CardTitle>
          {plan.tier === 'premium' && (
            <Crown className="h-5 w-5 text-amber-500" />
          )}
        </div>
        <p className="text-2xl font-bold">
          {plan.price === 0 ? (
            'Free'
          ) : (
            <>
              ৳{plan.price.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">
                /mo
              </span>
            </>
          )}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatPlanLimit(plan.maxFlats)}
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <ul className="mb-4 flex-1 space-y-2 text-sm">
          {plan.features.map(f => (
            <li key={f} className="flex items-start gap-2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        {onSelect && (
          <Button
            className="w-full"
            variant={isCurrent ? 'secondary' : plan.highlighted ? 'default' : 'outline'}
            disabled={isCurrent || loading}
            onClick={() => onSelect(plan.tier)}
          >
            {isCurrent
              ? 'Current plan'
              : isUpgrade
                ? `Upgrade to ${plan.name}`
                : plan.tier === 'free'
                  ? 'Downgrade via support'
                  : `Choose ${plan.name}`}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
