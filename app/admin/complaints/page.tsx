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
import { Check, Eye } from 'lucide-react'
import { fetchAdminComplaints } from '@/lib/api/admin'
import { updateComplaintStatus } from '@/lib/api/complaints'
import type { Complaint, ComplaintStatus } from '@/types/complaint'
import { format } from 'date-fns'
import Image from 'next/image'
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'
import { useServerPagedList } from '@/hooks/useServerPagedList'

export default function AdminComplaintsPage() {
  const { confirm } = useConfirm()
  const t = useTranslations('admin.complaints')
  const tp = useTranslations('admin.properties')
  const ta = useTranslations('admin.actions')
  const tc = useTranslations('common')
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>(
    'all',
  )

  const filters = useMemo(
    () => ({ status: statusFilter }),
    [statusFilter],
  )

  const fetcher = useCallback(
    (params: {
      page: number
      pageSize: number
      search: string
      filters: Record<string, string>
    }) =>
      fetchAdminComplaints({
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        status: params.filters.status,
      }),
    [],
  )

  const list = useServerPagedList<Complaint>({
    fetcher,
    filters,
    pageSize: 20,
  })

  const handleStatusChange = async (
    complaintId: string,
    newStatus: ComplaintStatus,
  ) => {
    const ok = await confirm({
      title: t('statusChangeTitle', { status: newStatus }),
    })
    if (!ok) return
    const result = await updateComplaintStatus(complaintId, newStatus)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    const current = list.items.find(c => c.id === complaintId)
    list.updateItem(
      c => c.id === complaintId,
      {
        ...result.data,
        resolvedAt:
          newStatus === 'resolved'
            ? new Date().toISOString()
            : current?.resolvedAt,
      },
    )
    toast.success(t('statusUpdated'))
  }

  const statusColors: Record<ComplaintStatus, string> = {
    open: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl space-y-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">{t('title')}</h2>
          <p className="text-muted-foreground">{t('description')}</p>
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
              setStatusFilter(value as ComplaintStatus | 'all')
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={tp('filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tc('allStatus')}</SelectItem>
              <SelectItem value="open">{tc('status.open')}</SelectItem>
              <SelectItem value="in_progress">{tc('status.inProgress')}</SelectItem>
              <SelectItem value="resolved">{tc('status.resolved')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {list.error && (
          <p className="text-sm text-destructive">{list.error}</p>
        )}

        <div className="space-y-4">
          {list.items.map(complaint => (
            <Card key={complaint.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{complaint.title}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t('byUser', { name: complaint.userName })} •{' '}
                      {format(new Date(complaint.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <Badge className={statusColors[complaint.status]}>
                    {complaint.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-foreground">{complaint.description}</p>

                {complaint.imageUrl && (
                  <div className="relative mb-4 h-48 w-full overflow-hidden rounded bg-muted">
                    <Image
                      src={complaint.imageUrl}
                      alt={complaint.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 800px"
                    />
                  </div>
                )}

                {complaint.response && (
                  <div className="mb-4 rounded bg-muted p-3">
                    <p className="mb-1 text-sm font-semibold">{t('response')}</p>
                    <p className="text-sm text-foreground">
                      {complaint.response}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {complaint.status === 'open' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusChange(complaint.id, 'in_progress')
                        }
                      >
                        <Check className="mr-2 h-4 w-4" />
                        {t('markInProgress')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleStatusChange(complaint.id, 'resolved')
                        }
                      >
                        {ta('resolve')}
                      </Button>
                    </>
                  )}
                  {complaint.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusChange(complaint.id, 'resolved')
                      }
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {ta('resolve')}
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
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
