'use client'

import { useCallback, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { EmptyState } from '@/components/page'
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
import { ShieldAlert, Check, X } from 'lucide-react'
import { fetchFraudReports, patchFraudReport } from '@/lib/api/admin'
import type { FraudReport } from '@/types/admin'
import { format } from 'date-fns'
import { hasAdminPermission } from '@/lib/admin/permissions'
import { getStoredAdminRole } from '@/utils/auth'
import { useServerPagedList } from '@/hooks/useServerPagedList'
import { toast } from '@/lib/feedback/toast'

type FraudStatus = FraudReport['status']

const statusColors: Record<FraudStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  investigating: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  dismissed: 'bg-gray-100 text-gray-800',
}

const priorityColors: Record<FraudReport['priority'], string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
}

export default function AdminFraudReportsPage() {
  const t = useTranslations('admin.fraud')
  const tp = useTranslations('admin.properties')
  const tc = useTranslations('common')
  const [statusFilter, setStatusFilter] = useState<FraudStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const adminRole = getStoredAdminRole()
  const canManage = hasAdminPermission(adminRole, 'fraud.manage')
  const canDismiss = adminRole === 'super-admin' || adminRole === 'moderator'

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
      fetchFraudReports({
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        status: params.filters.status,
        type: params.filters.type,
      }),
    [],
  )

  const list = useServerPagedList<FraudReport>({
    fetcher,
    filters,
    pageSize: 20,
  })

  const updateStatus = async (id: string, status: FraudStatus) => {
    if (!canManage) return
    const currentReport = list.items.find(report => report.id === id)
    const result = await patchFraudReport(id, {
      status,
      investigatedBy:
        status === 'investigating'
          ? 'current-admin'
          : currentReport?.investigatedBy,
    })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    list.updateItem(r => r.id === id, result.data)
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl space-y-4">
        <div>
          <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold">
            <ShieldAlert className="h-6 w-6" />
            {t('title')}
          </h2>
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
            onValueChange={v => setStatusFilter(v as FraudStatus | 'all')}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={tc('filters')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tc('allStatus')}</SelectItem>
              <SelectItem value="pending">{tc('status.pending')}</SelectItem>
              <SelectItem value="investigating">
                {t('statuses.investigating')}
              </SelectItem>
              <SelectItem value="resolved">{tc('status.resolved')}</SelectItem>
              <SelectItem value="dismissed">{t('statuses.dismissed')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={tp('filterByType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tp('allTypes')}</SelectItem>
              <SelectItem value="fake_listing">{t('types.fake_listing')}</SelectItem>
              <SelectItem value="payment_fraud">
                {t('types.payment_fraud')}
              </SelectItem>
              <SelectItem value="suspicious_activity">
                {t('types.suspicious_activity')}
              </SelectItem>
              <SelectItem value="other">{t('types.other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {list.error && (
          <p className="text-sm text-destructive">{list.error}</p>
        )}

        <div className="space-y-4">
          {!list.loading && list.items.length === 0 ? (
            <EmptyState
              icon={ShieldAlert}
              title={t('title')}
              description={t('emptyFiltered')}
            />
          ) : null}

          {list.items.map(report => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">
                      {t(`types.${report.reportType}`)}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t('reportedBy', { name: report.userName })} ·{' '}
                      {format(new Date(report.reportedAt), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={priorityColors[report.priority]}>
                      {report.priority}
                    </Badge>
                    <Badge className={statusColors[report.status]}>
                      {report.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{report.description}</p>
                {report.investigatedBy && (
                  <p className="mb-4 text-sm text-muted-foreground">
                    {t('investigator', { name: report.investigatedBy })}
                  </p>
                )}
                {canManage && (
                  <div className="flex flex-wrap gap-2">
                    {report.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(report.id, 'investigating')}
                      >
                        {t('startInvestigation')}
                      </Button>
                    )}
                    {report.status === 'investigating' && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(report.id, 'resolved')}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        {t('markResolved')}
                      </Button>
                    )}
                    {canDismiss &&
                      (report.status === 'pending' ||
                        report.status === 'investigating') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(report.id, 'dismissed')}
                        >
                          <X className="mr-2 h-4 w-4" />
                          {t('dismiss')}
                        </Button>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

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
