'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  EmptyState,
  LoadingState,
} from '@/components/page'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { BookingCard } from '@/components/booking/BookingCard'
import { BookingDetailDialog } from '@/components/booking/BookingDetailDialog'
import { useMockQuery } from '@/hooks/useMockQuery'
import {
  fetchBookingsForRenter,
  patchBookingStatus,
} from '@/lib/api/bookings'
import { getDemoRenterId } from '@/lib/api/demoUser'
import type { Booking, BookingStatus } from '@/types/booking'
import { Calendar, Search } from 'lucide-react'

export default function MyBookingsPage() {
  const t = useTranslations('portfolio.myBookings')
  const tc = useTranslations('common')
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>(
    'all'
  )
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const load = useCallback(() => {
    return fetchBookingsForRenter(getDemoRenterId())
  }, [tick])

  const { data: bookings, loading, error, refetch } = useMockQuery(load)

  const filtered =
    bookings?.filter(b =>
      selectedStatus === 'all' ? true : b.status === selectedStatus
    ) || []

  const upcomingBookings = filtered.filter(
    b => b.status === 'approved' || b.status === 'pending'
  )
  const pastBookings = filtered.filter(
    b =>
      b.status === 'completed' ||
      b.status === 'cancelled' ||
      b.status === 'rejected'
  )

  const openDetail = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetail(true)
  }

  const confirmCancel = async () => {
    if (!cancelTarget || !cancelReason.trim()) return
    setActionError(null)
    const result = await patchBookingStatus(
      cancelTarget.id,
      'cancelled',
      cancelReason.trim()
    )
    if (!result.ok) {
      setActionError(result.error)
      return
    }
    setCancelTarget(null)
    setCancelReason('')
    setShowDetail(false)
    setTick(n => n + 1)
    refetch()
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title={t('title')}
          description={t('description')}
          actions={
            <Button asChild variant="outline">
              <Link href="/search">
                <Search className="mr-2 h-4 w-4" />
                {tc('findHousing')}
              </Link>
            </Button>
          }
        />

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Select
            value={selectedStatus}
            onValueChange={value =>
              setSelectedStatus(value as BookingStatus | 'all')
            }
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={tc('filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tc('allStatus')}</SelectItem>
              <SelectItem value="pending">{tc('status.pending')}</SelectItem>
              <SelectItem value="approved">{tc('status.approved')}</SelectItem>
              <SelectItem value="rejected">{tc('status.rejected')}</SelectItem>
              <SelectItem value="cancelled">{tc('status.cancelled')}</SelectItem>
              <SelectItem value="completed">{tc('status.completed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading && (
          <LoadingState label={t('loading')} variant="skeleton" skeletonVariant="row" skeletonCount={4} />
        )}
        {error && (
          <EmptyState
            title={t('errorTitle')}
            description={error}
            icon={Calendar}
          >
            <Button onClick={() => refetch()}>{tc('retry')}</Button>
          </EmptyState>
        )}

        {!loading && !error && (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">
                {t('tabs.upcoming')} ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                {t('tabs.past')} ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6 space-y-4">
              {upcomingBookings.length === 0 ? (
                <EmptyState
                  title={t('emptyUpcomingTitle')}
                  description={t('emptyUpcomingDesc')}
                  icon={Calendar}
                >
                  <Button asChild>
                    <Link href="/search">{tc('browseListings')}</Link>
                  </Button>
                </EmptyState>
              ) : (
                upcomingBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={id => {
                      const b = upcomingBookings.find(x => x.id === id)
                      if (b) setCancelTarget(b)
                    }}
                    onViewDetails={openDetail}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6 space-y-4">
              {pastBookings.length === 0 ? (
                <EmptyState
                  title={t('emptyPastTitle')}
                  description={t('emptyPastDesc')}
                  icon={Calendar}
                />
              ) : (
                pastBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onViewDetails={openDetail}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}

        <BookingDetailDialog
          booking={selectedBooking}
          open={showDetail}
          onOpenChange={setShowDetail}
          role="renter"
          onCancel={b => {
            setShowDetail(false)
            setCancelTarget(b)
          }}
        />

        <Dialog
          open={Boolean(cancelTarget)}
          onOpenChange={open => {
            if (!open) {
              setCancelTarget(null)
              setCancelReason('')
              setActionError(null)
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('cancelTitle')}</DialogTitle>
              <DialogDescription>{t('cancelDesc')}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cancel-reason">{t('cancelReason')}</Label>
                <Textarea
                  id="cancel-reason"
                  className="mt-2"
                  rows={4}
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder={t('cancelReasonPlaceholder')}
                />
              </div>
              {actionError && (
                <p className="text-sm text-destructive">{actionError}</p>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCancelTarget(null)}
                >
                  {t('keepBooking')}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  disabled={!cancelReason.trim()}
                  onClick={confirmCancel}
                >
                  {t('confirmCancel')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </Layout>
  )
}
