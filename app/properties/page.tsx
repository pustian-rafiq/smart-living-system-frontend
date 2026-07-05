'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { PropertyCard } from '@/components/property/PropertyCard'
import { PropertyDetailDialog } from '@/components/property/PropertyDetailDialog'
import { BookingConfirmation } from '@/components/booking/BookingConfirmation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  PageContainer,
  PageHeader,
  EmptyState,
  LoadingState,
} from '@/components/page'
import { useMockQuery } from '@/hooks/useMockQuery'
import { fetchFeaturedProperties } from '@/lib/api/properties'
import { createBooking } from '@/lib/api/bookings'
import type { Property } from '@/types/property'
import type { Booking, BookingFormData } from '@/types/booking'
import { useTranslations } from 'next-intl'
import { SlidersHorizontal, Sparkles } from 'lucide-react'

export default function PropertiesPage() {
  const router = useRouter()
  const t = useTranslations('property.listings')
  const tc = useTranslations('common')
  const load = useCallback(() => fetchFeaturedProperties(12), [])
  const { data: properties, loading, error, refetch } = useMockQuery(load)
  const [selected, setSelected] = useState<Property | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [lastBooking, setLastBooking] = useState<Booking | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const onViewDetails = (p: Property) => {
    setSelected(p)
    setBookingError(null)
    setDialogOpen(true)
  }

  const onCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`
  }

  const handleBookingSubmit = async (
    property: Property,
    data: BookingFormData & { moveInDate: string; moveOutDate?: string }
  ) => {
    setBookingError(null)
    const result = await createBooking(property, data)
    if (!result.ok) {
      setBookingError(result.error)
      throw new Error(result.error)
    }
    setLastBooking(result.data)
    setShowConfirmation(true)
    setDialogOpen(false)
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title={t('title')}
          description={t('description')}
          actions={
            <>
              <Button variant="outline" asChild>
                <Link href="/search">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {t('advancedSearch')}
                </Link>
              </Button>
              <Button asChild>
                <Link href="/hotels">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t('hotelsStays')}
                </Link>
              </Button>
            </>
          }
        />

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-normal">
            {t('featured')}
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            {tc('refresh')}
          </Button>
        </div>

        {loading && (
          <LoadingState label={t('loading')} variant="skeleton" skeletonCount={6} />
        )}
        {error && (
          <EmptyState
            title={t('errorTitle')}
            description={error}
            icon={Sparkles}
          >
            <Button onClick={() => refetch()}>{tc('tryAgain')}</Button>
          </EmptyState>
        )}
        {!loading && !error && properties && properties.length === 0 && (
          <EmptyState
            title={t('emptyTitle')}
            description={t('emptyDesc')}
            icon={Sparkles}
          >
            <Button asChild>
              <Link href="/search">{t('openSearch')}</Link>
            </Button>
          </EmptyState>
        )}
        {!loading && !error && properties && properties.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map(p => (
              <PropertyCard
                key={p.id}
                property={p}
                onViewDetails={onViewDetails}
                onCall={onCall}
              />
            ))}
          </div>
        )}

        <PropertyDetailDialog
          property={selected}
          open={dialogOpen}
          onOpenChange={open => {
            setDialogOpen(open)
            if (!open) setBookingError(null)
          }}
          onBookingSubmit={handleBookingSubmit}
          onCall={onCall}
          bookingError={bookingError}
        />

        <BookingConfirmation
          booking={lastBooking}
          open={showConfirmation}
          onOpenChange={setShowConfirmation}
          onViewBookings={() => {
            setShowConfirmation(false)
            router.push('/my-bookings')
          }}
        />
      </PageContainer>
    </Layout>
  )
}
