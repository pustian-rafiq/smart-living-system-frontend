'use client'

import { useCallback, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Check, User } from 'lucide-react'
import { fetchDisputes, patchDispute } from '@/lib/api/admin'
import type { Dispute, DisputeStatus } from '@/types/admin'
import { format } from 'date-fns'
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'
import { useServerPagedList } from '@/hooks/useServerPagedList'

export default function AdminDisputesPage() {
  const { confirm } = useConfirm()
  const t = useTranslations('admin.disputes')
  const tp = useTranslations('admin.properties')
  const ta = useTranslations('admin.actions')
  const tc = useTranslations('common')
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

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
      fetchDisputes({
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        status: params.filters.status,
        type: params.filters.type,
      }),
    [],
  )

  const list = useServerPagedList<Dispute>({
    fetcher,
    filters,
    pageSize: 20,
  })

  const handleStatusChange = async (
    disputeId: string,
    newStatus: DisputeStatus,
  ) => {
    const ok = await confirm({
      title: t('statusChangeTitle', { status: newStatus }),
    })
    if (!ok) return
    const result = await patchDispute(disputeId, { status: newStatus })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    list.updateItem(d => d.id === disputeId, result.data)
    toast.success(t('statusUpdated'))
  }

  const handleAssign = (_disputeId: string) => {
    toast.info(t('assignComingSoon'))
  }

  const statusColors: Record<DisputeStatus, string> = {
    open: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  }

  const priorityColors: Record<Dispute['priority'], string> = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
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
              setStatusFilter(value as DisputeStatus | 'all')
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={tp('filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tc('allStatus')}</SelectItem>
              <SelectItem value="open">{tc('status.open')}</SelectItem>
              <SelectItem value="assigned">{t('statuses.assigned')}</SelectItem>
              <SelectItem value="in_progress">{tc('status.inProgress')}</SelectItem>
              <SelectItem value="resolved">{tc('status.resolved')}</SelectItem>
              <SelectItem value="closed">{t('statuses.closed')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={tp('filterByType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tp('allTypes')}</SelectItem>
              <SelectItem value="payment">{t('types.payment')}</SelectItem>
              <SelectItem value="property">{t('types.property')}</SelectItem>
              <SelectItem value="booking">{t('types.booking')}</SelectItem>
              <SelectItem value="other">{t('types.other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {list.error && (
          <p className="text-sm text-destructive">{list.error}</p>
        )}

        <div className="space-y-4">
          {list.items.map(dispute => (
            <Card key={dispute.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <CardTitle className="text-lg">{dispute.title}</CardTitle>
                      <Badge className={priorityColors[dispute.priority]}>
                        {dispute.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{dispute.createdByName}</span>
                      </div>
                      <span>•</span>
                      <span>
                        {format(new Date(dispute.createdAt), 'MMM dd, yyyy')}
                      </span>
                      {dispute.assignedToName && (
                        <>
                          <span>•</span>
                          <span>
                            {t('assignedTo', { name: dispute.assignedToName })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge className={statusColors[dispute.status]}>
                    {dispute.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-foreground">{dispute.description}</p>

                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="capitalize">
                    {dispute.type}
                  </Badge>
                  {dispute.relatedBookingId && (
                    <Badge variant="outline">
                      {t('bookingRef', { id: dispute.relatedBookingId })}
                    </Badge>
                  )}
                  {dispute.relatedPropertyId && (
                    <Badge variant="outline">
                      {t('propertyRef', { id: dispute.relatedPropertyId })}
                    </Badge>
                  )}
                </div>

                {dispute.resolution && (
                  <div className="mb-4 rounded bg-green-50 p-3">
                    <p className="mb-1 text-sm font-semibold text-green-800">
                      {t('resolution')}
                    </p>
                    <p className="text-sm text-green-700">
                      {dispute.resolution}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {dispute.status === 'open' && (
                    <Button size="sm" onClick={() => handleAssign(dispute.id)}>
                      {t('assignToMe')}
                    </Button>
                  )}
                  {dispute.status === 'assigned' && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusChange(dispute.id, 'in_progress')
                      }
                    >
                      {t('markInProgress')}
                    </Button>
                  )}
                  {dispute.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(dispute.id, 'resolved')}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {ta('resolve')}
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    {ta('viewDetails')}
                  </Button>
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
    </AdminLayout>
  )
}
