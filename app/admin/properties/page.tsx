'use client'

import { useCallback, useMemo, useState } from 'react'
import { useMessages, useTranslations } from 'next-intl'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PropertyModerationCard } from '@/components/admin/PropertyModerationCard'
import { PropertyDetailsDialog } from '@/components/admin/PropertyDetailsDialog'
import { ServerSearchInput } from '@/components/data/ServerSearchInput'
import { PaginationBar } from '@/components/data/PaginationBar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { fetchPropertyModerations, patchPropertyModeration } from '@/lib/api/admin'
import type { PropertyModeration, PropertyStatus } from '@/types/admin'
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'
import { useServerPagedList } from '@/hooks/useServerPagedList'
import {
  PROPERTY_ADMIN_COPY,
  readAdminPropertyCopy,
  type PropertyAdminCopyKey,
} from '@/lib/i18n/property-admin-copy'

export default function AdminPropertiesPage() {
  const { confirm } = useConfirm()
  const t = useTranslations('admin.properties')
  const ta = useTranslations('admin.actions')
  const tc = useTranslations('common')
  const tProp = useTranslations('search.page.propertyTypes')
  const messages = useMessages()
  const propertyCopy = useMemo(
    () => ({ ...PROPERTY_ADMIN_COPY, ...readAdminPropertyCopy(messages) }),
    [messages],
  )

  const text = useCallback(
    (key: PropertyAdminCopyKey) => propertyCopy[key] || PROPERTY_ADMIN_COPY[key],
    [propertyCopy],
  )

  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>(
    'all',
  )
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [busyPropertyId, setBusyPropertyId] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsProperty, setDetailsProperty] =
    useState<PropertyModeration | null>(null)

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
      fetchPropertyModerations({
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        status: params.filters.status,
        type: params.filters.type,
      }),
    [],
  )

  const list = useServerPagedList<PropertyModeration>({
    fetcher,
    filters,
    pageSize: 20,
  })

  const applyUpdate = (updated: PropertyModeration) => {
    list.updateItem(p => p.propertyId === updated.propertyId, updated)
    setDetailsProperty(prev =>
      prev?.propertyId === updated.propertyId ? updated : prev,
    )
  }

  const patchProperty = async (
    propertyId: string,
    updates: {
      status?: PropertyStatus
      rejectionReason?: string
      featured?: boolean
      verified?: boolean
    },
  ) => {
    const target = list.items.find(p => p.propertyId === propertyId)
    if (!target) return null

    setBusyPropertyId(propertyId)
    const result = await patchPropertyModeration(target.id, updates)
    setBusyPropertyId(null)

    if (!result.ok) {
      toast.error(result.error)
      return null
    }
    applyUpdate(result.data)
    return result.data
  }

  const handleApprove = async (propertyId: string) => {
    const ok = await confirm({
      title: text('approveTitle'),
      description: text('approveDesc'),
    })
    if (!ok) return
    const updated = await patchProperty(propertyId, { status: 'approved' })
    if (updated) toast.success(text('approved'))
  }

  const handleReject = async (propertyId: string) => {
    const reason = prompt(text('rejectReason'))
    if (!reason?.trim()) return
    const updated = await patchProperty(propertyId, {
      status: 'rejected',
      rejectionReason: reason.trim(),
    })
    if (updated) toast.success(text('rejected'))
  }

  const handleSuspend = async (propertyId: string) => {
    const ok = await confirm({
      title: text('suspendTitle'),
      description: text('suspendDesc'),
      variant: 'destructive',
    })
    if (!ok) return
    const updated = await patchProperty(propertyId, { status: 'suspended' })
    if (updated) toast.success(text('suspended'))
  }

  const handleReactivate = async (propertyId: string) => {
    const ok = await confirm({
      title: text('reactivateTitle'),
      description: text('reactivateDesc'),
    })
    if (!ok) return
    const updated = await patchProperty(propertyId, { status: 'approved' })
    if (updated) toast.success(text('reactivated'))
  }

  const handleToggleFeatured = async (propertyId: string) => {
    const target =
      list.items.find(p => p.propertyId === propertyId) ??
      (detailsProperty?.propertyId === propertyId ? detailsProperty : null)
    if (!target) return
    const next = !target.featured
    const ok = await confirm({
      title: next ? text('featureTitle') : text('removeFeatureTitle'),
      description: next ? text('featureDesc') : text('removeFeatureDesc'),
    })
    if (!ok) return
    const updated = await patchProperty(propertyId, { featured: next })
    if (updated) {
      toast.success(next ? text('featureSuccess') : text('removeFeatureSuccess'))
    }
  }

  const handleToggleVerified = async (propertyId: string) => {
    const target =
      list.items.find(p => p.propertyId === propertyId) ??
      (detailsProperty?.propertyId === propertyId ? detailsProperty : null)
    if (!target) return
    const next = !target.verified
    const ok = await confirm({
      title: next ? text('verifyTitle') : text('removeVerifyTitle'),
      description: next ? text('verifyDesc') : text('removeVerifyDesc'),
    })
    if (!ok) return
    const updated = await patchProperty(propertyId, { verified: next })
    if (updated) {
      toast.success(next ? text('verifySuccess') : text('removeVerifySuccess'))
    }
  }

  const handleView = (propertyId: string) => {
    const property = list.items.find(p => p.propertyId === propertyId) ?? null
    setDetailsProperty(property)
    setDetailsOpen(Boolean(property))
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">{t('managementTitle')}</h2>
          <p className="text-muted-foreground">{t('managementDesc')}</p>
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
            onValueChange={value =>
              setStatusFilter(value as PropertyStatus | 'all')
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tc('allStatus')}</SelectItem>
              <SelectItem value="pending">{tc('status.pending')}</SelectItem>
              <SelectItem value="approved">{tc('status.approved')}</SelectItem>
              <SelectItem value="rejected">{tc('status.rejected')}</SelectItem>
              <SelectItem value="suspended">{ta('suspend')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('filterByType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allTypes')}</SelectItem>
              <SelectItem value="mess">{tProp('mess')}</SelectItem>
              <SelectItem value="apartment">{tProp('apartment')}</SelectItem>
              <SelectItem value="hotel">{tProp('hotel')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {list.error && (
          <p className="text-sm text-destructive">{list.error}</p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.items.map(property => (
            <PropertyModerationCard
              key={property.id}
              property={property}
              busy={busyPropertyId === property.propertyId}
              onApprove={handleApprove}
              onReject={handleReject}
              onView={handleView}
              onSuspend={handleSuspend}
              onReactivate={handleReactivate}
              onToggleFeatured={handleToggleFeatured}
              onToggleVerified={handleToggleVerified}
            />
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

        <PropertyDetailsDialog
          property={detailsProperty}
          open={detailsOpen}
          onOpenChange={open => {
            setDetailsOpen(open)
            if (!open) setDetailsProperty(null)
          }}
          busy={
            detailsProperty != null &&
            busyPropertyId === detailsProperty.propertyId
          }
          onApprove={handleApprove}
          onReject={handleReject}
          onSuspend={handleSuspend}
          onReactivate={handleReactivate}
          onToggleFeatured={handleToggleFeatured}
          onToggleVerified={handleToggleVerified}
        />
      </div>
    </AdminLayout>
  )
}
