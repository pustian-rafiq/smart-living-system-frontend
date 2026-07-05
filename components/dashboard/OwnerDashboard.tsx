'use client'

import { useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatCard } from './StatCard'
import { ActionCard } from './ActionCard'
import { useTranslations } from 'next-intl'
import { FreeTierLimitBanner } from '@/components/monetization'
import { OwnerOnboardingDialog } from '@/components/onboarding'
import { useMockQuery } from '@/hooks/useMockQuery'
import { fetchFlatLimitStatus } from '@/lib/api/subscriptions'
import { fetchBuildings, fetchAllFlats } from '@/lib/api/buildings'
import { fetchBillsForOwner } from '@/lib/api/bills'
import { ok } from '@/lib/api/http'
import { useAppFormat } from '@/hooks/useAppFormat'

interface OwnerDashboardProps {
  ownerId: string
}

function Icon({
  path,
  className = 'h-6 w-6',
}: {
  path: string
  className?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

export function OwnerDashboard({ ownerId }: OwnerDashboardProps) {
  const td = useTranslations('dashboard')
  const { formatCurrency } = useAppFormat()
  const loadLimit = useCallback(() => fetchFlatLimitStatus(), [])
  const { data: limitStatus } = useMockQuery(loadLimit)

  const loadStats = useCallback(async () => {
    const [buildings, flats, bills] = await Promise.all([
      fetchBuildings(ownerId),
      fetchAllFlats(),
      fetchBillsForOwner(ownerId),
    ])
    if (!buildings.ok) return buildings
    if (!flats.ok) return flats
    if (!bills.ok) return bills
    return ok({
      buildings: buildings.data,
      flats: flats.data,
      bills: bills.data,
    })
  }, [ownerId])
  const { data: dashboardData } = useMockQuery(loadStats)

  // Calculate owner stats
  const stats = useMemo(() => {
    const buildings = dashboardData?.buildings.length ?? 0
    const flats = dashboardData?.flats.length ?? 0
    const dueBills = (dashboardData?.bills ?? []).filter(
      b => b.status === 'unpaid' && new Date(b.dueDate) < new Date()
    )
    const totalDue = dueBills.reduce((sum, b) => sum + b.amount, 0)

    return {
      buildings,
      flats,
      totalDue,
    }
  }, [dashboardData])

  const ownerActions = useMemo(
    () => [
      {
        title: 'Add Building',
        subtitle: 'Create a building and manage flats',
        href: '/my-properties',
        icon: <Icon path="M4 21V3h16v18M9 21V9h6v12" />,
        photoToneClass:
          'bg-gradient-to-r from-violet-200/70 via-fuchsia-200/60 to-pink-200/70 dark:from-violet-900/30 dark:via-fuchsia-900/20 dark:to-pink-900/30',
      },
      {
        title: 'Mess & Hostel',
        subtitle: 'Seats, meals, attendance, SMS',
        href: '/mess',
        icon: (
          <Icon path="M4 21V8a2 2 0 012-2h12a2 2 0 012 2v13M9 21V12h6v9" />
        ),
        photoToneClass:
          'bg-gradient-to-r from-amber-200/70 via-orange-200/60 to-rose-200/70 dark:from-amber-900/30 dark:via-orange-900/20 dark:to-rose-900/30',
      },
      {
        title: 'My Hotels',
        subtitle: 'Rooms, bookings, pricing, invoices',
        href: '/my-hotels',
        icon: (
          <Icon path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        ),
        photoToneClass:
          'bg-gradient-to-r from-sky-200/70 via-blue-200/60 to-indigo-200/70 dark:from-sky-900/30 dark:via-blue-900/20 dark:to-indigo-900/30',
      },
      {
        title: 'Publish Listing',
        subtitle: 'Appear in search & discovery',
        href: '/my-listings/new',
        icon: <Icon path="M12 5v14M5 12h14" />,
        photoToneClass:
          'bg-gradient-to-r from-emerald-200/70 via-lime-200/60 to-yellow-200/70 dark:from-emerald-900/30 dark:via-lime-900/20 dark:to-yellow-900/30',
      },
      {
        title: 'Booking Requests',
        subtitle: 'Approve or reject renters',
        href: '/my-properties/bookings',
        icon: (
          <Icon path="M8 7V3m8 4V3M4 11h16M6 21h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        ),
        photoToneClass:
          'bg-gradient-to-r from-teal-200/70 via-cyan-200/60 to-sky-200/70 dark:from-teal-900/30 dark:via-cyan-900/20 dark:to-sky-900/30',
      },
      {
        title: 'Subscription',
        subtitle: 'Plan, flat limits & listing boosts',
        href: '/subscription',
        icon: (
          <Icon path="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        ),
        photoToneClass:
          'bg-gradient-to-r from-amber-200/70 via-yellow-200/60 to-orange-200/70 dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-orange-900/30',
      },
      {
        title: 'Payments & Payouts',
        subtitle: 'Ledger, analytics, and cash records',
        href: '/payments',
        icon: (
          <Icon path="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        ),
        photoToneClass:
          'bg-gradient-to-r from-emerald-200/70 via-green-200/60 to-teal-200/70 dark:from-emerald-900/30 dark:via-green-900/20 dark:to-teal-900/30',
      },
      {
        title: 'Manage Bills',
        subtitle: 'Generate rent and track collections',
        href: '/bills',
        icon: (
          <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        ),
        photoToneClass:
          'bg-gradient-to-r from-orange-200/70 via-amber-200/60 to-yellow-200/70 dark:from-orange-900/30 dark:via-amber-900/20 dark:to-yellow-900/30',
      },
      {
        title: 'Generate Rent',
        subtitle: 'Create monthly rent slips',
        href: '/bills?mode=generate',
        icon: (
          <Icon path="M8 7h8M8 11h8M8 15h6M7 3h10a2 2 0 012 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 012-2z" />
        ),
        photoToneClass:
          'bg-gradient-to-r from-sky-200/70 via-indigo-200/60 to-violet-200/70 dark:from-sky-900/30 dark:via-indigo-900/20 dark:to-violet-900/30',
      },
      {
        title: 'Manage Notices',
        subtitle: 'Create and manage notices',
        href: '/notices',
        icon: (
          <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        ),
        photoToneClass:
          'bg-gradient-to-r from-orange-200/70 via-amber-200/60 to-yellow-200/70 dark:from-orange-900/30 dark:via-amber-900/20 dark:to-yellow-900/30',
      },
    ],
    []
  )

  return (
    <div className="space-y-6 md:space-y-8">
      <OwnerOnboardingDialog />
      {limitStatus && <FreeTierLimitBanner status={limitStatus} compact />}

      {/* Overview Statistics */}
      <div>
        <h2 className="mb-4 text-lg font-bold md:mb-6 md:text-xl lg:text-2xl">
          {td('overviewStats')}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label={td('totalBuildings')}
            value={stats.buildings.toString()}
            icon={<Icon path="M4 21V3h16v18M9 21V9h6v12" />}
          />
          <StatCard
            label={td('totalFlats')}
            value={stats.flats.toString()}
            icon={<Icon path="M3 3h18v18H3V3zm6 6h6v6H9V9z" />}
          />
          <StatCard
            label={td('dueRents')}
            value={formatCurrency(stats.totalDue)}
            icon={
              <Icon path="M12 1v22M17 5H9.5a3.5 3.5 0 000 7H14a3.5 3.5 0 010 7H6" />
            }
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h2 className="text-lg font-bold md:text-xl lg:text-2xl">
            {td('quickActions')}
          </h2>
          <Button asChild variant="ghost" size="sm" className="md:size-default">
            <Link href="/my-properties">{td('manageProperties')}</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ownerActions.map(action => (
            <ActionCard key={action.href} action={action} />
          ))}
        </div>
      </div>
    </div>
  )
}
