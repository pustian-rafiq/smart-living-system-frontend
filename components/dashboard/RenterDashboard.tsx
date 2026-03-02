'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProfileSummary } from './ProfileSummary'
import { CurrentRental } from './CurrentRental'
import { BillsSummary } from './BillsSummary'
import { RecentBills } from './RecentBills'
import { LocationSearch } from './LocationSearch'
import { StatCard } from './StatCard'
import { ActionCard } from './ActionCard'
import { Home, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import { mockFlats, mockRenters, mockBuildings } from '@/data/mockBuildings'
import { mockBills } from '@/data/mockBills'
import { getRenterProfile } from '@/data/mockRenterProfile'
import { getRenterHistory } from '@/data/mockRenterHistory'

interface RenterDashboardProps {
  renterId: string
  name: string
  phone: string
  email?: string
  city: string
  area: string
  search: string
  onCityChange: (city: string) => void
  onAreaChange: (area: string) => void
  onSearchChange: (search: string) => void
  areasByCity: Record<string, string[]>
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

export function RenterDashboard({
  renterId,
  name,
  phone,
  email,
  city,
  area,
  search,
  onCityChange,
  onAreaChange,
  onSearchChange,
  areasByCity,
}: RenterDashboardProps) {
  // Get current renter data
  const currentRenter = mockRenters.find(r => r.id === renterId)
  const currentFlat = mockFlats.find(f => f.renter?.id === renterId)
  const currentBuilding = currentFlat
    ? mockBuildings.find(b => b.id === currentFlat.buildingId)
    : undefined
  const renterBills = useMemo(() => mockBills.filter(b => b.tenantId === renterId), [renterId])
  const renterProfile = useMemo(() => getRenterProfile('user1'), [])
  const renterHistory = useMemo(() => getRenterHistory(renterId), [renterId])

  // Calculate profile completion
  const profileCompletion = useMemo(() => {
    if (!renterProfile) return 0
    let completed = 0
    let total = 6

    if (renterProfile.documents && renterProfile.documents.length > 0) completed++
    if (renterProfile.jobInfo) completed++
    if (renterProfile.familyMembers && renterProfile.familyMembers.length > 0) completed++
    if (renterProfile.emergencyContacts && renterProfile.emergencyContacts.length > 0) completed++
    if (currentRenter?.email) completed++
    if (currentRenter?.nid) completed++

    return Math.round((completed / total) * 100)
  }, [renterProfile, currentRenter])

  const renterActions = useMemo(
    () => [
      {
        title: 'Find Mess',
        subtitle: 'Low-cost shared living near you',
        href: '/search?type=mess',
        icon: <Icon path="M4 21V8a2 2 0 012-2h12a2 2 0 012 2v13M9 21V12h6v9" />,
        photoToneClass:
          'bg-gradient-to-r from-amber-200/70 via-orange-200/60 to-rose-200/70 dark:from-amber-900/30 dark:via-orange-900/20 dark:to-rose-900/30',
      },
      {
        title: 'Find Apartment',
        subtitle: 'Family & bachelor-friendly listings',
        href: '/search?type=apartment',
        icon: <Icon path="M3 10l9-7 9 7v10a2 2 0 01-2 2h-4V12H9v10H5a2 2 0 01-2-2V10z" />,
        photoToneClass:
          'bg-gradient-to-r from-sky-200/70 via-cyan-200/60 to-emerald-200/70 dark:from-sky-900/30 dark:via-cyan-900/20 dark:to-emerald-900/30',
      },
      {
        title: 'Saved Searches',
        subtitle: 'View and manage your saved searches',
        href: '/saved-searches',
        icon: <Icon path="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />,
        photoToneClass:
          'bg-gradient-to-r from-purple-200/70 via-pink-200/60 to-rose-200/70 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-rose-900/30',
      },
      {
        title: 'Expense Analytics',
        subtitle: 'Track and analyze your expenses',
        href: '/expenses',
        icon: <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
        photoToneClass:
          'bg-gradient-to-r from-blue-200/70 via-indigo-200/60 to-purple-200/70 dark:from-blue-900/30 dark:via-indigo-900/20 dark:to-purple-900/30',
      },
      {
        title: 'Reminders',
        subtitle: 'Manage your automatic reminders',
        href: '/reminders',
        icon: <Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
        photoToneClass:
          'bg-gradient-to-r from-green-200/70 via-emerald-200/60 to-teal-200/70 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-teal-900/30',
      },
      {
        title: 'Documents',
        subtitle: 'Agreements and checklists',
        href: '/documents',
        icon: <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
        photoToneClass:
          'bg-gradient-to-r from-indigo-200/70 via-purple-200/60 to-pink-200/70 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-pink-900/30',
      },
      {
        title: 'Payment Scheduling',
        subtitle: 'Schedule future payments',
        href: '/payments',
        icon: <Icon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
        photoToneClass:
          'bg-gradient-to-r from-blue-200/70 via-cyan-200/60 to-teal-200/70 dark:from-blue-900/30 dark:via-cyan-900/20 dark:to-teal-900/30',
      },
      {
        title: 'Expense Reports',
        subtitle: 'Generate and export reports',
        href: '/reports',
        icon: <Icon path="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
        photoToneClass:
          'bg-gradient-to-r from-purple-200/70 via-pink-200/60 to-rose-200/70 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-rose-900/30',
      },
    ],
    []
  )

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Profile Summary Card */}
      <ProfileSummary
        name={name}
        phone={phone}
        email={email}
        profileCompletion={profileCompletion}
      />

      {/* Current Rental & Bills Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CurrentRental flat={currentFlat} building={currentBuilding} />
        <div className="sm:col-span-2 lg:col-span-2">
          <BillsSummary bills={renterBills} />
        </div>
      </div>

      {/* Quick Stats */}
      {renterHistory && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Total Rentals"
            value={renterHistory.totalRentals.toString()}
            icon={<Home className="h-5 w-5 md:h-6 md:w-6" />}
          />
          <StatCard
            label="Avg Rating"
            value={renterHistory.averageRating.toFixed(1)}
            icon={<TrendingUp className="h-5 w-5 md:h-6 md:w-6" />}
          />
          <StatCard
            label="Complaints"
            value={renterHistory.totalComplaints.toString()}
            icon={<AlertCircle className="h-5 w-5 md:h-6 md:w-6" />}
          />
          <StatCard
            label="Resolved"
            value={renterHistory.resolvedComplaints.toString()}
            icon={<CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />}
          />
        </div>
      )}

      {/* Location & Search */}
      <LocationSearch
        city={city}
        area={area}
        search={search}
        onCityChange={onCityChange}
        onAreaChange={onAreaChange}
        onSearchChange={onSearchChange}
        areasByCity={areasByCity}
      />

      {/* Recent Bills */}
      {renterBills.length > 0 && <RecentBills bills={renterBills} />}

      {/* Quick Actions */}
      <div>
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h2 className="text-lg font-bold md:text-xl lg:text-2xl">
            Quick Actions
          </h2>
          <Button asChild variant="ghost" size="sm" className="md:size-default">
            <Link href="/search">See all</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {renterActions.map(action => (
            <ActionCard key={action.href} action={action} />
          ))}
        </div>
      </div>
    </div>
  )
}
