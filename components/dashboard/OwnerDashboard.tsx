'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatCard } from './StatCard'
import { ActionCard } from './ActionCard'
import { mockBuildings, mockFlats } from '@/data/mockBuildings'
import { mockBills } from '@/data/mockBills'

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
  // Calculate owner stats
  const stats = useMemo(() => {
    const buildings = mockBuildings.length
    const flats = mockFlats.length
    const dueBills = mockBills.filter(
      b => b.status === 'unpaid' && new Date(b.dueDate) < new Date()
    )
    const totalDue = dueBills.reduce((sum, b) => sum + b.amount, 0)

    return {
      buildings,
      flats,
      totalDue,
    }
  }, [])

  const ownerActions = useMemo(
    () => [
      {
        title: 'Add Building',
        subtitle: 'Create a building and manage flats',
        href: '/my-properties?tab=buildings',
        icon: <Icon path="M4 21V3h16v18M9 21V9h6v12" />,
        photoToneClass:
          'bg-gradient-to-r from-violet-200/70 via-fuchsia-200/60 to-pink-200/70 dark:from-violet-900/30 dark:via-fuchsia-900/20 dark:to-pink-900/30',
      },
      {
        title: 'Add Mess',
        subtitle: 'List shared rooms quickly',
        href: '/my-properties?tab=mess',
        icon: <Icon path="M7 21V3h10v18M9 7h6M9 11h6M9 15h6" />,
        photoToneClass:
          'bg-gradient-to-r from-emerald-200/70 via-lime-200/60 to-yellow-200/70 dark:from-emerald-900/30 dark:via-lime-900/20 dark:to-yellow-900/30',
      },
      {
        title: 'Generate Rent',
        subtitle: 'Create monthly rent slips',
        href: '/bills?mode=generate',
        icon: <Icon path="M8 7h8M8 11h8M8 15h6M7 3h10a2 2 0 012 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 012-2z" />,
        photoToneClass:
          'bg-gradient-to-r from-sky-200/70 via-indigo-200/60 to-violet-200/70 dark:from-sky-900/30 dark:via-indigo-900/20 dark:to-violet-900/30',
      },
      {
        title: 'Manage Notices',
        subtitle: 'Create and manage notices',
        href: '/notices',
        icon: <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
        photoToneClass:
          'bg-gradient-to-r from-orange-200/70 via-amber-200/60 to-yellow-200/70 dark:from-orange-900/30 dark:via-amber-900/20 dark:to-yellow-900/30',
      },
    ],
    []
  )

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Overview Statistics */}
      <div>
        <h2 className="mb-4 text-lg font-bold md:mb-6 md:text-xl lg:text-2xl">
          Overview Statistics
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total buildings"
            value={stats.buildings.toString()}
            icon={<Icon path="M4 21V3h16v18M9 21V9h6v12" />}
          />
          <StatCard
            label="Total flats"
            value={stats.flats.toString()}
            icon={<Icon path="M3 3h18v18H3V3zm6 6h6v6H9V9z" />}
          />
          <StatCard
            label="Due rents"
            value={`৳ ${stats.totalDue.toLocaleString()}`}
            icon={<Icon path="M12 1v22M17 5H9.5a3.5 3.5 0 000 7H14a3.5 3.5 0 010 7H6" />}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h2 className="text-lg font-bold md:text-xl lg:text-2xl">
            Quick Actions
          </h2>
          <Button asChild variant="ghost" size="sm" className="md:size-default">
            <Link href="/my-properties">Manage Properties</Link>
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
