'use client'

import { useCallback, useMemo, useState, Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { VerificationRequestCard } from '@/components/admin/VerificationRequestCard'
import { ServerSearchInput } from '@/components/data/ServerSearchInput'
import { PaginationBar } from '@/components/data/PaginationBar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { fetchVerificationRequests, patchVerificationRequest } from '@/lib/api/admin'
import type { VerificationRequest, VerificationStatus } from '@/types/admin'
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'
import { useServerPagedList } from '@/hooks/useServerPagedList'

function VerificationsContent() {
  const { confirm } = useConfirm()
  const t = useTranslations('admin.verifications')
  const tp = useTranslations('admin.properties')
  const tc = useTranslations('common')
  const searchParams = useSearchParams()
  const initialStatus =
    (searchParams.get('status') as VerificationStatus) || 'all'

  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>(
    initialStatus,
  )

  const filters = useMemo(
    () => ({ status: statusFilter === 'all' ? 'all' : statusFilter }),
    [statusFilter],
  )

  const fetcher = useCallback(
    (params: {
      page: number
      pageSize: number
      search: string
      filters: Record<string, string>
    }) =>
      fetchVerificationRequests({
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        status: params.filters.status,
      }),
    [],
  )

  const list = useServerPagedList<VerificationRequest>({
    fetcher,
    filters,
    pageSize: 12,
  })

  const handleApprove = async (requestId: string) => {
    const ok = await confirm({ title: t('approveTitle') })
    if (!ok) return
    const result = await patchVerificationRequest(requestId, {
      status: 'approved',
    })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    list.updateItem(r => r.id === requestId, result.data)
    toast.success(tp('approved'))
  }

  const handleReject = async (requestId: string, reason: string) => {
    const result = await patchVerificationRequest(requestId, {
      status: 'rejected',
      rejectionReason: reason,
    })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    list.updateItem(r => r.id === requestId, result.data)
    toast.success(tp('rejected'))
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
            placeholder="Search by name, phone, document…"
          />
          <Select
            value={statusFilter}
            onValueChange={value =>
              setStatusFilter(value as VerificationStatus | 'all')
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={tp('filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tc('status.all')}</SelectItem>
              <SelectItem value="pending">{tc('status.pending')}</SelectItem>
              <SelectItem value="approved">{tc('status.approved')}</SelectItem>
              <SelectItem value="rejected">{tc('status.rejected')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {list.error && (
          <p className="text-sm text-destructive">{list.error}</p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.items.map(request => (
            <VerificationRequestCard
              key={request.id}
              request={request}
              onApprove={handleApprove}
              onReject={handleReject}
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
      </div>
    </AdminLayout>
  )
}

export default function AdminVerificationsPage() {
  const tc = useTranslations('common')
  return (
    <Suspense fallback={<div>{tc('loading')}</div>}>
      <VerificationsContent />
    </Suspense>
  )
}
