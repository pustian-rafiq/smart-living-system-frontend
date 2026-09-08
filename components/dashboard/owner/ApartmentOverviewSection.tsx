'use client'

import { useCallback, useMemo } from 'react'
import {
  Building2,
  CalendarClock,
  DoorOpen,
  FileText,
  Home,
  Megaphone,
  Receipt,
  TrendingUp,
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
import { fetchAllFlats, fetchBuildings } from '@/lib/api/buildings'
import { fetchBillsForOwner } from '@/lib/api/bills'
import { fetchBookingsForOwner } from '@/lib/api/bookings'
import { ok } from '@/lib/api/http'

const APARTMENT_LINKS: QuickLink[] = [
  {
    title: 'Buildings & flats',
    subtitle: 'Floors, flats, renters',
    href: '/my-properties',
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    title: 'Booking requests',
    subtitle: 'Approve or reject renters',
    href: '/my-properties/bookings',
    icon: <CalendarClock className="h-4 w-4" />,
  },
  {
    title: 'Rent bills',
    subtitle: 'Track dues and collections',
    href: '/bills',
    icon: <Receipt className="h-4 w-4" />,
  },
  {
    title: 'Generate rent',
    subtitle: 'Create monthly rent slips',
    href: '/bills?mode=generate',
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: 'My listings',
    subtitle: 'Publish flats to search',
    href: '/my-listings',
    icon: <Megaphone className="h-4 w-4" />,
  },
  {
    title: 'Rental agreements',
    subtitle: 'Contracts and documents',
    href: '/documents',
    icon: <FileText className="h-4 w-4" />,
  },
]

export function ApartmentOverviewSection({ ownerId }: { ownerId: string }) {
  const { formatCurrency, formatNumber } = useAppFormat()

  const load = useCallback(async () => {
    const [buildings, flats, bills, bookings] = await Promise.all([
      fetchBuildings(ownerId),
      fetchAllFlats(),
      fetchBillsForOwner(ownerId),
      fetchBookingsForOwner(ownerId),
    ])
    if (!buildings.ok) return buildings
    if (!flats.ok) return flats
    if (!bills.ok) return bills
    return ok({
      buildings: buildings.data,
      flats: flats.data,
      bills: bills.data,
      bookings: bookings.ok ? bookings.data : [],
    })
  }, [ownerId])
  const { data } = useMockQuery(load)

  const stats = useMemo(() => {
    const flats = data?.flats ?? []
    const bills = data?.bills ?? []
    const bookings = data?.bookings ?? []
    const now = new Date()
    const occupiedFlats = flats.filter(f => f.status === 'occupied').length
    const vacantFlats = flats.filter(f => f.status === 'available').length
    const overdueBills = bills.filter(
      b => b.status !== 'paid' && new Date(b.dueDate) < now
    )
    const collectedThisMonth = bills
      .filter(b => {
        if (b.status !== 'paid' || !b.paidDate) return false
        const paid = new Date(b.paidDate)
        return (
          paid.getMonth() === now.getMonth() &&
          paid.getFullYear() === now.getFullYear()
        )
      })
      .reduce((sum, b) => sum + b.amount, 0)

    return {
      buildings: (data?.buildings ?? []).length,
      flats: flats.length,
      occupiedFlats,
      vacantFlats,
      occupancy:
        flats.length > 0
          ? Math.round((occupiedFlats / flats.length) * 100)
          : 0,
      overdueAmount: overdueBills.reduce((sum, b) => sum + b.amount, 0),
      overdueCount: overdueBills.length,
      collectedThisMonth,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
    }
  }, [data])

  return (
    <OwnerSection
      icon={<Building2 className="h-5 w-5" />}
      title="Apartment & building"
      description="Flats, renters, rent bills, and booking requests."
      href="/my-properties"
      openLabel="Open properties"
    >
      <StatGrid>
        <StatCard
          label="Buildings"
          value={formatNumber(stats.buildings)}
          hint="Under your management"
          href="/my-properties"
          icon={<Building2 className="h-6 w-6" />}
        />
        <StatCard
          label="Occupied flats"
          value={formatNumber(stats.occupiedFlats)}
          hint={`${stats.occupancy}% of ${formatNumber(stats.flats)} flats`}
          href="/my-properties"
          icon={<Home className="h-6 w-6" />}
        />
        <StatCard
          label="Vacant flats"
          value={formatNumber(stats.vacantFlats)}
          hint="Ready to rent out"
          href="/my-listings/new"
          icon={<DoorOpen className="h-6 w-6" />}
        />
        <StatCard
          label="Overdue rent"
          value={formatCurrency(stats.overdueAmount)}
          hint={`${formatNumber(stats.overdueCount)} bills past due date`}
          href="/bills"
          icon={<Wallet className="h-6 w-6" />}
        />
        <StatCard
          label="Collected this month"
          value={formatCurrency(stats.collectedThisMonth)}
          hint="Paid rent bills"
          href="/payments"
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatCard
          label="Booking requests"
          value={formatNumber(stats.pendingBookings)}
          hint="Waiting for your decision"
          href="/my-properties/bookings"
          icon={<CalendarClock className="h-6 w-6" />}
        />
      </StatGrid>
      <QuickLinkGrid links={APARTMENT_LINKS} />
    </OwnerSection>
  )
}
