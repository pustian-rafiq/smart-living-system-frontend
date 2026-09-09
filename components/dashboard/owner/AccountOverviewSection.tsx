'use client'

import { useCallback } from 'react'
import {
  BadgeCheck,
  Banknote,
  BellRing,
  ClipboardList,
  FileText,
  LifeBuoy,
  Megaphone,
  MessageSquare,
  PieChart,
  Settings2,
  UtensilsCrossed,
  Wallet,
} from 'lucide-react'
import { StatCard } from '../StatCard'
import {
  OwnerSection,
  QuickLinkGrid,
  StatGrid,
  type QuickLink,
} from './OwnerSection'
import { useMockQuery } from '@/hooks/useMockQuery'
import { useAppFormat } from '@/hooks/useAppFormat'
import { useOwnerFocus } from '@/hooks/useOwnerFocus'
import { fetchOwnerUsageStatus } from '@/lib/api/subscriptions'
import { fetchOwnerPaymentAnalytics } from '@/lib/api/payments'
import { fetchComplaints } from '@/lib/api/complaints'
import { ok } from '@/lib/api/http'
import type { ModuleLimitStatus, OwnerModuleKey } from '@/types/subscription'
import type { OwnerVertical } from '@/lib/owner-focus'

function formatModuleHint(
  module: ModuleLimitStatus,
  unit: string,
  formatNumber: (n: number) => string
): string {
  if (module.max < 0) {
    return `${formatNumber(module.used)} ${unit} (unlimited)`
  }
  return `${formatNumber(module.used)} of ${formatNumber(module.max)} ${unit} used`
}

function buildPlanHint(
  enabled: OwnerVertical[],
  primary: OwnerVertical | '',
  modules: Record<OwnerModuleKey, ModuleLimitStatus>,
  formatNumber: (n: number) => string
): string {
  if (enabled.length === 0) return 'Subscription details'

  const order: OwnerModuleKey[] =
    primary && enabled.includes(primary)
      ? [
          primary as OwnerModuleKey,
          ...enabled.filter(v => v !== primary),
        ]
      : enabled

  const labels: Record<OwnerModuleKey, string> = {
    mess: 'messes',
    apartment: 'flats',
    hotel: 'hotels',
  }

  if (order.length === 1) {
    const key = order[0]
    return formatModuleHint(modules[key], labels[key], formatNumber)
  }

  return order
    .map(key => {
      const m = modules[key]
      if (m.max < 0) return `${labels[key]} ∞`
      return `${formatNumber(m.used)}/${formatNumber(m.max)} ${labels[key]}`
    })
    .join(' · ')
}

export function AccountOverviewSection({ ownerId }: { ownerId: string }) {
  const { formatCurrency, formatNumber } = useAppFormat()
  const { hasVertical, enabledVerticals, primaryFocus } = useOwnerFocus()

  const load = useCallback(async () => {
    const [usage, analytics, complaints] = await Promise.all([
      fetchOwnerUsageStatus(ownerId),
      fetchOwnerPaymentAnalytics(ownerId),
      fetchComplaints({ ownerView: true }),
    ])
    return ok({
      usage: usage.ok ? usage.data : null,
      analytics: analytics.ok ? analytics.data : null,
      openComplaints: complaints.ok
        ? complaints.data.filter(c => c.status !== 'resolved').length
        : 0,
    })
  }, [ownerId])
  const { data } = useMockQuery(load)

  const usage = data?.usage ?? null
  const analytics = data?.analytics ?? null
  const showPlatformPayouts = Boolean(analytics?.showsPlatformPayouts)
  const messOnly =
    enabledVerticals.length === 1 && enabledVerticals[0] === 'mess'

  const accountLinks: QuickLink[] = [
    {
      title: 'Subscription',
      subtitle: 'Plan, limits, and boosts',
      href: '/subscription',
      icon: <BadgeCheck className="h-4 w-4" />,
    },
    {
      title: showPlatformPayouts ? 'Payments & payouts' : 'Collection ledger',
      subtitle: showPlatformPayouts
        ? 'Ledger, cash records, settlements'
        : 'Marked received, claims, payment numbers',
      href: '/payments',
      icon: <Banknote className="h-4 w-4" />,
    },
    {
      title: 'Collection settings',
      subtitle: 'bKash / Nagad numbers & gateway',
      href: '/payments?tab=settings',
      icon: <Settings2 className="h-4 w-4" />,
    },
    {
      title: 'Notices',
      subtitle: 'Announcements to tenants',
      href: '/notices',
      icon: <Megaphone className="h-4 w-4" />,
    },
    {
      title: 'Complaints',
      subtitle: 'Tenant issues and repairs',
      href: '/complaints',
      icon: <LifeBuoy className="h-4 w-4" />,
    },
  ]

  if (hasVertical('mess')) {
    accountLinks.push({
      title: 'Bulk SMS',
      subtitle: 'Credits and message history',
      href: '/mess',
      icon: <MessageSquare className="h-4 w-4" />,
    })
    accountLinks.push({
      title: 'মিল হিসাব',
      subtitle: 'Meals, bazaar, and dues',
      href: '/mess',
      icon: <UtensilsCrossed className="h-4 w-4" />,
    })
  }

  if (hasVertical('apartment')) {
    accountLinks.push({
      title: 'Reminders',
      subtitle: 'Rent and renewal alerts',
      href: '/reminders',
      icon: <BellRing className="h-4 w-4" />,
    })
    accountLinks.push({
      title: 'Documents',
      subtitle: 'Agreements and verification',
      href: '/documents',
      icon: <FileText className="h-4 w-4" />,
    })
    accountLinks.push({
      title: 'Reports',
      subtitle: 'Income and occupancy exports',
      href: '/reports',
      icon: <PieChart className="h-4 w-4" />,
    })
  }

  if (hasVertical('hotel')) {
    accountLinks.push({
      title: 'Hotel reports',
      subtitle: 'Bookings and occupancy',
      href: '/reports',
      icon: <PieChart className="h-4 w-4" />,
    })
  }

  const planHint = usage
    ? buildPlanHint(
        enabledVerticals,
        primaryFocus,
        {
          mess: usage.mess,
          apartment: usage.apartment,
          hotel: usage.hotel,
        },
        formatNumber
      )
    : 'Subscription details'

  return (
    <OwnerSection
      icon={<Wallet className="h-5 w-5" />}
      title="Account & money"
      description={
        showPlatformPayouts
          ? 'Subscription, platform settlements, and support.'
          : 'Subscription is separate from tenant/member money you collect yourself.'
      }
      href="/payments"
      openLabel={showPlatformPayouts ? 'Open payments' : 'Open collection'}
    >
      <StatGrid>
        <StatCard
          label="Plan"
          value={usage?.planName ?? '—'}
          hint={planHint}
          href="/subscription"
          icon={<BadgeCheck className="h-6 w-6" />}
        />
        {showPlatformPayouts ? (
          <>
            <StatCard
              label="Total collected"
              value={formatCurrency(analytics?.totalCollected ?? 0)}
              hint={`Commission ${analytics?.commissionRate ?? 0}%`}
              href="/payments"
              icon={<Banknote className="h-6 w-6" />}
            />
            <StatCard
              label="Net earnings"
              value={formatCurrency(analytics?.netEarnings ?? 0)}
              hint="After platform commission"
              href="/payments"
              icon={<PieChart className="h-6 w-6" />}
            />
            <StatCard
              label="Pending payouts"
              value={formatCurrency(analytics?.pendingPayouts ?? 0)}
              hint="Awaiting settlement"
              href="/payments"
              icon={<Wallet className="h-6 w-6" />}
            />
            <StatCard
              label="Settled payouts"
              value={formatCurrency(analytics?.paidPayouts ?? 0)}
              hint="Already transferred to you"
              href="/payments"
              icon={<Banknote className="h-6 w-6" />}
            />
          </>
        ) : (
          <>
            <StatCard
              label="Marked received"
              value={formatCurrency(
                analytics?.markedReceived ?? analytics?.totalCollected ?? 0
              )}
              hint="You collected — not held by Smart Living"
              href="/payments"
              icon={<Banknote className="h-6 w-6" />}
            />
            {hasVertical('mess') && (
              <StatCard
                label="Mess deposits"
                value={formatCurrency(analytics?.messDepositsConfirmed ?? 0)}
                hint="Confirmed member payments"
                href="/mess"
                icon={<UtensilsCrossed className="h-6 w-6" />}
              />
            )}
            {!messOnly && (
              <StatCard
                label="Outstanding bills"
                value={formatCurrency(analytics?.outstandingBills ?? 0)}
                hint="Unpaid / partial rent"
                href="/bills"
                icon={<ClipboardList className="h-6 w-6" />}
              />
            )}
            <StatCard
              label="Pending claims"
              value={formatNumber(analytics?.pendingClaims ?? 0)}
              hint="“I paid” waiting for confirm"
              href="/payments?tab=claims"
              icon={<ClipboardList className="h-6 w-6" />}
            />
          </>
        )}
        <StatCard
          label="Open complaints"
          value={formatNumber(data?.openComplaints ?? 0)}
          hint="Tenant issues to resolve"
          href="/complaints"
          icon={<LifeBuoy className="h-6 w-6" />}
        />
      </StatGrid>
      <QuickLinkGrid links={accountLinks} />
    </OwnerSection>
  )
}
