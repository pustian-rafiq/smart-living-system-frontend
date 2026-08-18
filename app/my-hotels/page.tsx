'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, MapPin, Star, TrendingUp, Users, Calendar } from 'lucide-react'
import { RatingDisplay } from '@/components/hotel/RatingDisplay'
import { fetchOwnerHotels, fetchHotelBookings } from '@/lib/api/hotels'
import { useMockQuery } from '@/hooks/useMockQuery'
import { format } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import { EmptyState, PageContainer, PageHeader, LoadingState } from '@/components/page'
import { HotelOnboardingDialog } from '@/components/onboarding'
import { useAppFormat } from '@/hooks/useAppFormat'
import { Hotel as HotelIcon } from 'lucide-react'

type HotelStats = {
  totalBookings: number
  thisMonthBookings: number
  revenue: number
}

export default function MyHotelsPage() {
  const t = useTranslations('hotels')
  const { formatCurrency } = useAppFormat()
  const loadHotels = useCallback(() => fetchOwnerHotels(), [])
  const { data: myHotels, loading } = useMockQuery(loadHotels)
  const [statsByHotel, setStatsByHotel] = useState<Record<string, HotelStats>>(
    {},
  )

  useEffect(() => {
    const hotels = myHotels ?? []
    if (!hotels.length) {
      setStatsByHotel({})
      return
    }
    let cancelled = false
    void Promise.all(
      hotels.map(async hotel => {
        const result = await fetchHotelBookings(hotel.id)
        const bookings = result.ok ? result.data : []
        const today = new Date()
        const thisMonth = bookings.filter(b => {
          const bookingDate = new Date(b.createdAt)
          return (
            bookingDate.getMonth() === today.getMonth() &&
            bookingDate.getFullYear() === today.getFullYear()
          )
        })
        return [
          hotel.id,
          {
            totalBookings: bookings.length,
            thisMonthBookings: thisMonth.length,
            revenue: bookings
              .filter(b => b.paymentStatus === 'paid')
              .reduce((sum, b) => sum + b.totalAmount, 0),
          } satisfies HotelStats,
        ] as const
      }),
    ).then(entries => {
      if (!cancelled) setStatsByHotel(Object.fromEntries(entries))
    })
    return () => {
      cancelled = true
    }
  }, [myHotels])

  const getHotelStats = (hotelId: string): HotelStats =>
    statsByHotel[hotelId] ?? {
      totalBookings: 0,
      thisMonthBookings: 0,
      revenue: 0,
    }


  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <LoadingState label={t('myHotels.title')} />
        </PageContainer>
      </Layout>
    )
  }

  const hotels = myHotels ?? []

  return (
    <Layout>
      <HotelOnboardingDialog />
      <PageContainer>
        <PageHeader
          title={t('myHotels.title')}
          description={t('myHotels.description')}
          actions={
            <Button asChild>
              <Link href="/my-hotels/new">
                <Plus className="mr-2 h-4 w-4" />
                {t('myHotels.addHotelShort')}
              </Link>
            </Button>
          }
        />

        {/* Stats Overview */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('myHotels.totalHotels')}
                  </p>
                  <p className="text-2xl font-bold">{hotels.length}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <Star className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('myHotels.totalBookings')}
                  </p>
                  <p className="text-2xl font-bold">
                    {hotels.reduce(
                      (sum, h) => sum + getHotelStats(h.id).totalBookings,
                      0
                    )}
                  </p>
                </div>
                <div className="rounded-full bg-green-500/10 p-3">
                  <Calendar className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('myHotels.totalRevenue')}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      myHotels.reduce(
                        (sum, h) => sum + getHotelStats(h.id).revenue,
                        0
                      )
                    )}
                  </p>
                </div>
                <div className="rounded-full bg-blue-500/10 p-3">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hotels List */}
        {hotels.length === 0 ? (
          <EmptyState
            icon={HotelIcon}
            title={t('myHotels.emptyTitle')}
            description={t('myHotels.emptyDesc')}
          >
            <Button asChild>
              <Link href="/my-hotels/new">
                <Plus className="mr-2 h-4 w-4" />
                {t('myHotels.addHotelShort')}
              </Link>
            </Button>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map(hotel => {
              const stats = getHotelStats(hotel.id)

              return (
                <Card key={hotel.id} className="overflow-hidden">
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    {hotel.images[0] ? (
                      <Image
                        src={hotel.images[0]}
                        alt={hotel.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-4xl">🏨</span>
                      </div>
                    )}
                    <div className="absolute right-2 top-2">
                      {hotel.verified && (
                        <Badge variant="default">
                          {t('detail.verified')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{hotel.name}</h3>
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {hotel.area}, {hotel.city}
                      </span>
                    </div>
                    <div className="mb-4 flex items-center gap-2">
                      <RatingDisplay rating={hotel.averageRating} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {t('myHotels.reviews', { count: hotel.totalReviews })}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t('myHotels.rooms')}
                        </p>
                        <p className="font-semibold">{hotel.totalRooms}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t('myHotels.bookings')}
                        </p>
                        <p className="font-semibold">{stats.totalBookings}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {t('myHotels.revenue')}
                        </p>
                        <p className="font-semibold">
                          ৳{(stats.revenue / 1000).toFixed(0)}k
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/my-hotels/${hotel.id}/rooms`}>
                          {t('myHotels.viewRooms')}
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/my-hotels/${hotel.id}/bookings`}>
                          {t('myHotels.viewBookings')}
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/my-hotels/${hotel.id}/calendar`}>
                          {t('myHotels.viewCalendar')}
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/my-hotels/${hotel.id}/pricing`}>
                          {t('myHotels.viewPricing')}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </PageContainer>
    </Layout>
  )
}
