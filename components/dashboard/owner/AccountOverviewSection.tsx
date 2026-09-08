'use client'

import { useCallback } from 'react'
import {
  BadgeCheck,
  Banknote,
  BellRing,
  FileText,
  LifeBuoy,
  Megaphone,
  PieChart,
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
import { fetchFlatLimitStatus } from '@/lib/api/subscriptions'
import { fetchOwnerPaymentAnalytics } from '@/lib/api/payments'
import { fetchComplaints } from '@/lib/api/complaints'
import { ok } from '@/lib/api/http'

const ACCOUNT_LINKS: QuickLink[] = [
  {
    title: 'Subscription',
    subtitle: 'Plan, limits, and boosts',
    href: '/subscription',
    icon: <BadgeCheck className="h-4 w-4" />,
  },
  {
    title: 'Payments & payouts',
    subtitle: 'Ledger, cash records, settlements',
    href: '/payments',
    icon: <Banknote className="h-4 w-4" />,
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
  {
    title: 'Reminders',
    subtitle: 'Rent and renewal alerts',
    href: '/reminders',
    icon: <BellRing className="h-4 w-4" />,
  },
  {
    title: 'Documents',
    subtitle: 'Agreements and verification',
    href: '/documents',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: 'Reports',
    subtitle: 'Income and occupancy exports',
    href: '/reports',
    icon: <PieChart className="h-4 w-4" />,
  },
]

export function AccountOverviewSection({ ownerId }: { ownerId: string }) {
  const { formatCurrency, formatNumber } = useAppFormat()

  const load = useCallback(async () => {
    const [limit, analytics, complaints] = await Promise.all([
      fetchFlatLimitStatus(ownerId),
      fetchOwnerPaymentAnalytics(ownerId),
      fetchComplaints({ ownerView: true }),
    ])
    return ok({
      limit: limit.ok ? limit.data : null,
      analytics: analytics.ok ? analytics.data : null,
      openComplaints: complaints.ok
        ? complaints.data.filter(c => c.status !== 'resolved').length
        : 0,
    })
  }, [ownerId])
  const { data } = useMockQuery(load)

  const limit = data?.limit ?? null
  const analytics = data?.analytics ?? null

  return (
    <OwnerSection
      icon={<Wallet className="h-5 w-5" />}
      title="Account & money"
      description="Subscription, collections, payouts, and support."
      href="/payments"
      openLabel="Open payments"
    >
      <StatGrid>
        <StatCard
          label="Plan"
          value={limit?.planName ?? '—'}
          hint={
            limit
              ? `${formatNumber(limit.used)} of ${limit.max < 0 ? '∞' : formatNumber(limit.max)} flats used`
              : 'Subscription details'
          }
          href="/subscription"
          icon={<BadgeCheck className="h-6 w-6" />}
        />
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
          label="Open complaints"
          value={formatNumber(data?.openComplaints ?? 0)}
          hint="Tenant issues to resolve"
          href="/complaints"
          icon={<LifeBuoy className="h-6 w-6" />}
        />
        <StatCard
          label="Settled payouts"
          value={formatCurrency(analytics?.paidPayouts ?? 0)}
          hint="Already transferred to you"
          href="/payments"
          icon={<Banknote className="h-6 w-6" />}
        />
      </StatGrid>
      <QuickLinkGrid links={ACCOUNT_LINKS} />
    </OwnerSection>
  )
}
