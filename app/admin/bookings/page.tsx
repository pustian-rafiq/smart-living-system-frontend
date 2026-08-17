'use client'

import { useCallback, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ServerSearchInput } from '@/components/data/ServerSearchInput'
import { PaginationBar } from '@/components/data/PaginationBar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Eye } from 'lucide-react'
import { fetchAdminBookings } from '@/lib/api/admin'
import { patchBookingStatus } from '@/lib/api/bookings'
import type { Booking, BookingStatus } from '@/types/booking'
import { BOOKING_STATUS_LABELS } from '@/types/booking'
import { BookingDetailDialog } from '@/components/booking/BookingDetailDialog'
import { BookingStatusBadge } from '@/components/booking/BookingStatusBadge'
import { format } from 'date-fns'
import { hasAdminPermission } from '@/lib/admin/permissions'
import { getStoredAdminRole } from '@/utils/auth'
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'
import { useServerPagedList } from '@/hooks/useServerPagedList'

export default function AdminBookingsPage() {
  const { confirm } = useConfirm()
  const t = useTranslations('admin.bookings')
  const tp = useTranslations('admin.properties')
  const ts = useTranslations('search.page.propertyTypes')
  const ta = useTranslations('admin.actions')
  const tc = useTranslations('common')
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  const adminRole = getStoredAdminRole()
  const canManage = hasAdminPermission(adminRole, 'bookings.manage')

  const filters = useMemo(
    () => ({
      status: statusFilter,
      type: typeFilter,
    }),
    [statusFilter, typeFilter],
  )

  const fetcher = useCallback(
    (params: {
      page: number
      pageSize: number
      search: string
      filters: Record<string, string>
    }) =>
      fetchAdminBookings({
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        status: params.filters.status,
        type: params.filters.type,
      }),
    [],
  )

  const list = useServerPagedList<Booking>({
    fetcher,
    filters,
    pageSize: 20,
  })

  const stats = useMemo(
    () => ({
      total: list.count,
      pending: list.items.filter(b => b.status === 'pending').length,
      approved: list.items.filter(b => b.status === 'approved').length,
      revenue: list.items
        .filter(b => b.status === 'approved' || b.status === 'completed')
        .reduce((sum, b) => sum + b.totalAmount, 0),
    }),
    [list.count, list.items],
  )

  const handleStatusChange = async (
    bookingId: string,
    status: BookingStatus,
  ) => {
    if (!canManage) return
    const ok = await confirm({
      title: t('markAs', { status: BOOKING_STATUS_LABELS[status] }),
    })
    if (!ok) return
    const result = await patchBookingStatus(
      bookingId,
      status,
      status === 'rejected' ? 'Rejected by admin' : undefined,
    )
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    list.updateItem(b => b.id === bookingId, result.data)
  }

  const openDetail = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetail(true)
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">{t('managementTitle')}</h2>
          <p className="text-muted-foreground">{t('managementDesc')}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{t('stats.total')}</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{t('stats.pending')}</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{t('stats.active')}</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.approved}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                {t('stats.bookedValue')}
              </p>
              <p className="text-2xl font-bold">
                ৳{stats.revenue.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <ServerSearchInput
            className="flex-1"
            value={list.searchInput}
            onChange={list.setSearchInput}
            pending={list.searchPending}
            placeholder={t('searchPlaceholder')}
          />
          <Select
            value={statusFilter}
            onValueChange={v => setStatusFilter(v as BookingStatus | 'all')}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={tp('filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tc('allStatus')}</SelectItem>
              {(Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[]).map(
                s => (
                  <SelectItem key={s} value={s}>
                    {BOOKING_STATUS_LABELS[s]}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder={tp('filterByType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tp('allTypes')}</SelectItem>
              <SelectItem value="mess">{ts('mess')}</SelectItem>
              <SelectItem value="apartment">{ts('apartment')}</SelectItem>
              <SelectItem value="hostel">{ts('hostel')}</SelectItem>
              <SelectItem value="hotel">{ts('hotel')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {list.error && (
          <p className="text-sm text-destructive">{list.error}</p>
        )}

        <div className="space-y-3">
          {list.items.map(booking => (
            <Card key={booking.id}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{booking.propertyName}</p>
                    <Badge variant="outline" className="capitalize">
                      {booking.propertyType}
                    </Badge>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {booking.renterName} → {booking.ownerName} ·{' '}
                    {format(new Date(booking.createdAt), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm">
                    ৳{booking.rent.toLocaleString()}
                    {t('perMonth')} · {t('total')} ৳
                    {booking.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDetail(booking)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {t('details')}
                  </Button>
                  {canManage && booking.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusChange(booking.id, 'approved')
                        }
                      >
                        {ta('approve')}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleStatusChange(booking.id, 'rejected')
                        }
                      >
                        {ta('reject')}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {list.items.length === 0 && !list.loading && (
          <div className="py-12 text-center text-muted-foreground">
            {t('emptyFiltered')}
          </div>
        )}

        <PaginationBar
          page={list.page}
          totalPages={list.totalPages}
          count={list.count}
          pageSize={list.pageSize}
          loading={list.loading}
          onPageChange={list.setPage}
          onPageSizeChange={list.setPageSize}
        />
      </div>

      <BookingDetailDialog
        booking={selectedBooking}
        open={showDetail}
        onOpenChange={setShowDetail}
      />
    </AdminLayout>
  )
}
