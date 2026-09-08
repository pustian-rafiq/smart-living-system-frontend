'use client'

import { useCallback, useMemo } from 'react'
import {
  BedDouble,
  CalendarDays,
  CalendarRange,
  Hotel,
  LogIn,
  Plus,
  Tags,
  TrendingUp,
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
import { fetchHotelBookings, fetchOwnerHotels } from '@/lib/api/hotels'
import { ok } from '@/lib/api/http'
import type { Booking } from '@/types/hotel'

export function HotelOverviewSection({ ownerId }: { ownerId: string }) {
  const { formatCurrency, formatNumber } = useAppFormat()

  const load = useCallback(async () => {
    const hotelResult = await fetchOwnerHotels(ownerId)
    if (!hotelResult.ok) return hotelResult
    const bookingResults = await Promise.all(
      hotelResult.data.map(h => fetchHotelBookings(h.id))
    )
    const bookings = bookingResults.reduce<Booking[]>(
      (all, result) => (result.ok ? all.concat(result.data) : all),
      []
    )
    return ok({ hotels: hotelResult.data, bookings })
  }, [ownerId])
  const { data } = useMockQuery(load)

  const hotels = data?.hotels ?? []
  const singleHotelId = hotels.length === 1 ? hotels[0].id : null

  const stats = useMemo(() => {
    const bookings = data?.bookings ?? []
    const now = new Date()
    const weekAhead = new Date(now)
    weekAhead.setDate(weekAhead.getDate() + 7)

    const upcomingCheckIns = bookings.filter(b => {
      if (b.status !== 'confirmed' && b.status !== 'pending') return false
      const checkIn = new Date(b.checkIn)
      return checkIn >= new Date(now.toDateString()) && checkIn <= weekAhead
    }).length

    const revenueThisMonth = bookings
      .filter(b => {
        if (b.status === 'cancelled' || b.status === 'pending') return false
        const created = new Date(b.createdAt)
        return (
          created.getMonth() === now.getMonth() &&
          created.getFullYear() === now.getFullYear()
        )
      })
      .reduce((sum, b) => sum + b.totalAmount, 0)

    return {
      totalRooms: hotels.reduce((sum, h) => sum + (h.totalRooms || 0), 0),
      availableRooms: hotels.reduce(
        (sum, h) => sum + (h.availableRooms || 0),
        0
      ),
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      stayingGuests: bookings.filter(b => b.status === 'checked-in').length,
      upcomingCheckIns,
      revenueThisMonth,
    }
  }, [data, hotels])

  const hotelPath = useCallback(
    (suffix: string) =>
      singleHotelId ? `/my-hotels/${singleHotelId}/${suffix}` : '/my-hotels',
    [singleHotelId]
  )

  const links: QuickLink[] = [
    {
      title: 'Rooms',
      subtitle: 'Add rooms, capacity, base price',
      href: hotelPath('rooms'),
      icon: <BedDouble className="h-4 w-4" />,
    },
    {
      title: 'Bookings',
      subtitle: 'Confirm, check-in, check-out',
      href: hotelPath('bookings'),
      icon: <CalendarDays className="h-4 w-4" />,
    },
    {
      title: 'Availability calendar',
      subtitle: 'Nightly occupancy view',
      href: hotelPath('calendar'),
      icon: <CalendarRange className="h-4 w-4" />,
    },
    {
      title: 'Pricing rules',
      subtitle: 'Weekend and seasonal rates',
      href: hotelPath('pricing'),
      icon: <Tags className="h-4 w-4" />,
    },
    {
      title: 'Register a hotel',
      subtitle: 'Add another property',
      href: '/my-hotels/new',
      icon: <Plus className="h-4 w-4" />,
    },
  ]

  return (
    <OwnerSection
      icon={<Hotel className="h-5 w-5" />}
      title="Hotel & guest house"
      description="Rooms, stay bookings, pricing, and check-ins."
      href="/my-hotels"
      openLabel="Open hotels"
    >
      <StatGrid>
        <StatCard
          label="My hotels"
          value={formatNumber(hotels.length)}
          hint={
            singleHotelId
              ? hotels[0].name
              : hotels.length === 0
                ? 'Register your first hotel'
                : `${hotels.length} properties`
          }
          href="/my-hotels"
          icon={<Hotel className="h-6 w-6" />}
        />
        <StatCard
          label="Rooms"
          value={formatNumber(stats.totalRooms)}
          hint={`${formatNumber(stats.availableRooms)} available now`}
          href={hotelPath('rooms')}
          icon={<BedDouble className="h-6 w-6" />}
        />
        <StatCard
          label="Pending bookings"
          value={formatNumber(stats.pendingBookings)}
          hint="Needs confirmation"
          href={hotelPath('bookings')}
          icon={<CalendarDays className="h-6 w-6" />}
        />
        <StatCard
          label="Check-ins (7 days)"
          value={formatNumber(stats.upcomingCheckIns)}
          hint="Arriving this week"
          href={hotelPath('calendar')}
          icon={<LogIn className="h-6 w-6" />}
        />
        <StatCard
          label="Guests in house"
          value={formatNumber(stats.stayingGuests)}
          hint="Currently checked in"
          href={hotelPath('bookings')}
          icon={<BedDouble className="h-6 w-6" />}
        />
        <StatCard
          label="Booking value (month)"
          value={formatCurrency(stats.revenueThisMonth)}
          hint="Confirmed stays this month"
          href="/payments"
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </StatGrid>
      <QuickLinkGrid links={links} />
    </OwnerSection>
  )
}
