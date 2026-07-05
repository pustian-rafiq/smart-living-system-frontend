'use client'

import { useMemo, useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search, Eye } from 'lucide-react'
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

export default function AdminBookingsPage() {
  const { confirm } = useConfirm()
  const t = useTranslations('admin.bookings')
  const tp = useTranslations('admin.properties')
  const ts = useTranslations('search.page.propertyTypes')
  const ta = useTranslations('admin.actions')
  const tc = useTranslations('common')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  const adminRole = getStoredAdminRole()
  const canManage = hasAdminPermission(adminRole, 'bookings.manage')

  const loadBookings = useCallback(async () => {
    const result = await fetchAdminBookings()
    if (result.ok) setBookings(result.data)
  }, [])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter
      const matchesType = typeFilter === 'all' || b.propertyType === typeFilter
      const q = searchTerm.toLowerCase()
      const matchesSearch =
        b.propertyName.toLowerCase().includes(q) ||
        b.renterName.toLowerCase().includes(q) ||
        b.ownerName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      return matchesStatus && matchesType && matchesSearch
    })
  }, [bookings, statusFilter, typeFilter, searchTerm])

  const stats = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      approved: bookings.filter(b => b.status === 'approved').length,
      revenue: bookings
        .filter(b => b.status === 'approved' || b.status === 'completed')
        .reduce((sum, b) => sum + b.totalAmount, 0),
    }),
    [bookings]
  )

  const handleStatusChange = async (
    bookingId: string,
    status: BookingStatus
  ) => {
    if (!canManage) return
    const ok = await confirm({
      title: t('markAs', { status: BOOKING_STATUS_LABELS[status] }),
    })
    if (!ok) return
    const result = await patchBookingStatus(bookingId, status)
    if (result.ok) await loadBookings()
  }

  const openDetail = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetail(true)
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold">{t('managementTitle')}</h2>
          <p className="text-muted-foreground">{t('managementDesc')}</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
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
              <p className="text-sm text-muted-foreground">{t('stats.bookedValue')}</p>
              <p className="text-2xl font-bold">
                ৳{stats.revenue.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
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
                )
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

        <div className="space-y-3">
          {filteredBookings.map(booking => (
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
                    ৳{booking.rent.toLocaleString()}{t('perMonth')} · {t('total')} ৳
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

        {filteredBookings.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            {t('emptyFiltered')}
          </div>
        )}
      </div>

      <BookingDetailDialog
        booking={selectedBooking}
        open={showDetail}
        onOpenChange={setShowDetail}
      />
    </AdminLayout>
  )
}
