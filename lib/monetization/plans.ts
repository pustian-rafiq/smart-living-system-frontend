import { mockSystemSettings } from '@/data/mockAdmin'
import type { PlanTier, SubscriptionPlan } from '@/types/subscription'

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: 'Free',
  basic: 'Basic',
  premium: 'Premium',
}

export function getSubscriptionPlans(): SubscriptionPlan[] {
  const { subscriptionPlans } = mockSystemSettings
  return [
    {
      tier: 'free',
      name: PLAN_LABELS.free,
      price: 0,
      maxFlats: subscriptionPlans.free.maxFlats,
      features: subscriptionPlans.free.features,
    },
    {
      tier: 'basic',
      name: PLAN_LABELS.basic,
      price: subscriptionPlans.basic.price,
      maxFlats: subscriptionPlans.basic.maxFlats,
      features: subscriptionPlans.basic.features,
      highlighted: true,
    },
    {
      tier: 'premium',
      name: PLAN_LABELS.premium,
      price: subscriptionPlans.premium.price,
      maxFlats: subscriptionPlans.premium.maxFlats,
      features: subscriptionPlans.premium.features,
    },
  ]
}

export function getPlanByTier(tier: PlanTier): SubscriptionPlan {
  const plan = getSubscriptionPlans().find(p => p.tier === tier)
  if (!plan) throw new Error(`Unknown plan: ${tier}`)
  return plan
}

export function formatPlanLimit(maxFlats: number): string {
  return maxFlats < 0 ? 'Unlimited flats' : `Up to ${maxFlats} flats`
}
