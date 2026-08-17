'use client'

import { useCallback, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLayout } from '@/components/admin/AdminLayout'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ServerSearchInput } from '@/components/data/ServerSearchInput'
import { PaginationBar } from '@/components/data/PaginationBar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuditLogTable } from '@/components/audit/AuditLogTable'
import { AuditLogCard } from '@/components/audit/AuditLogCard'
import { AuditLogDetailDialog } from '@/components/audit/AuditLogDetailDialog'
import { RollbackDialog } from '@/components/audit/RollbackDialog'
import { fetchAuditLogs, rollbackAudit } from '@/lib/api/admin'
import type { AuditLog, AuditAction, AuditEntityType } from '@/types/audit'
import { Download, X } from 'lucide-react'
import { useServerPagedList } from '@/hooks/useServerPagedList'

export default function AuditLogsPage() {
  const t = useTranslations('admin.audit')
  const tc = useTranslations('common')
  const [selectedAction, setSelectedAction] = useState<AuditAction | 'all'>(
    'all',
  )
  const [selectedEntityType, setSelectedEntityType] = useState<
    AuditEntityType | 'all'
  >('all')
  const [selectedUserRole, setSelectedUserRole] = useState<
    'renter' | 'owner' | 'admin' | 'all'
  >('all')
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table')
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isRollbackDialogOpen, setIsRollbackDialogOpen] = useState(false)
  const [rollbackLog, setRollbackLog] = useState<AuditLog | null>(null)

  const filters = useMemo(
    () => ({
      action: selectedAction,
      entityType: selectedEntityType,
      userRole: selectedUserRole,
    }),
    [selectedAction, selectedEntityType, selectedUserRole],
  )

  const fetcher = useCallback(
    (params: {
      page: number
      pageSize: number
      search: string
      filters: Record<string, string>
    }) =>
      fetchAuditLogs({
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        action: params.filters.action,
        entityType: params.filters.entityType,
        userRole: params.filters.userRole,
      }),
    [],
  )

  const list = useServerPagedList<AuditLog>({
    fetcher,
    filters,
    pageSize: 20,
  })

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log)
    setIsDetailDialogOpen(true)
  }

  const handleRollback = (log: AuditLog) => {
    setRollbackLog(log)
    setIsRollbackDialogOpen(true)
  }

  const handleConfirmRollback = async () => {
    if (rollbackLog) {
      const result = await rollbackAudit(rollbackLog.id)
      if (result.ok && result.data) {
        setIsRollbackDialogOpen(false)
        setRollbackLog(null)
        await list.refetch()
      }
    }
  }

  const hasActiveFilters =
    list.searchInput ||
    selectedAction !== 'all' ||
    selectedEntityType !== 'all' ||
    selectedUserRole !== 'all'

  const clearFilters = () => {
    list.setSearchInput('')
    setSelectedAction('all')
    setSelectedEntityType('all')
    setSelectedUserRole('all')
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl space-y-6">
        <div>
          <h2 className="mb-2 text-2xl font-bold">{t('title')}</h2>
          <p className="text-muted-foreground">{t('trackDesc')}</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{t('filters')}</CardTitle>
                <CardDescription>{t('filtersDesc')}</CardDescription>
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  {t('clearFilters')}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">{tc('search')}</Label>
                <ServerSearchInput
                  value={list.searchInput}
                  onChange={list.setSearchInput}
                  pending={list.searchPending}
                  placeholder={t('searchPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="action">{t('action')}</Label>
                <Select
                  value={selectedAction}
                  onValueChange={v =>
                    setSelectedAction(v as AuditAction | 'all')
                  }
                >
                  <SelectTrigger id="action">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allActions')}</SelectItem>
                    <SelectItem value="create">{t('actions.create')}</SelectItem>
                    <SelectItem value="update">{t('actions.update')}</SelectItem>
                    <SelectItem value="delete">{t('actions.delete')}</SelectItem>
                    <SelectItem value="approve">{t('actions.approve')}</SelectItem>
                    <SelectItem value="reject">{t('actions.reject')}</SelectItem>
                    <SelectItem value="verify">{t('actions.verify')}</SelectItem>
                    <SelectItem value="unverify">{t('actions.unverify')}</SelectItem>
                    <SelectItem value="payment">{t('actions.payment')}</SelectItem>
                    <SelectItem value="rollback">{t('actions.rollback')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="entityType">{t('entityType')}</Label>
                <Select
                  value={selectedEntityType}
                  onValueChange={v =>
                    setSelectedEntityType(v as AuditEntityType | 'all')
                  }
                >
                  <SelectTrigger id="entityType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allTypes')}</SelectItem>
                    <SelectItem value="property">{t('entities.property')}</SelectItem>
                    <SelectItem value="building">{t('entities.building')}</SelectItem>
                    <SelectItem value="flat">{t('entities.flat')}</SelectItem>
                    <SelectItem value="bill">{t('entities.bill')}</SelectItem>
                    <SelectItem value="booking">{t('entities.booking')}</SelectItem>
                    <SelectItem value="user">{t('entities.user')}</SelectItem>
                    <SelectItem value="verification">
                      {t('entities.verification')}
                    </SelectItem>
                    <SelectItem value="dispute">{t('entities.dispute')}</SelectItem>
                    <SelectItem value="complaint">{t('entities.complaint')}</SelectItem>
                    <SelectItem value="notice">{t('entities.notice')}</SelectItem>
                    <SelectItem value="mess">{t('entities.mess')}</SelectItem>
                    <SelectItem value="hotel">{t('entities.hotel')}</SelectItem>
                    <SelectItem value="room">{t('entities.room')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="userRole">{t('userRole')}</Label>
                <Select
                  value={selectedUserRole}
                  onValueChange={v =>
                    setSelectedUserRole(
                      v as 'renter' | 'owner' | 'admin' | 'all',
                    )
                  }
                >
                  <SelectTrigger id="userRole">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('allRoles')}</SelectItem>
                    <SelectItem value="admin">{t('roles.admin')}</SelectItem>
                    <SelectItem value="owner">{t('roles.owner')}</SelectItem>
                    <SelectItem value="renter">{t('roles.renter')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {t('logsCount', { count: list.count })}
                </CardTitle>
                <CardDescription>
                  {list.count === 1
                    ? t('showingLogs', { count: list.count })
                    : t('showingLogsPlural', { count: list.count })}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Tabs
                  value={viewMode}
                  onValueChange={v => setViewMode(v as 'table' | 'card')}
                >
                  <TabsList>
                    <TabsTrigger value="table">{t('table')}</TabsTrigger>
                    <TabsTrigger value="card">{t('card')}</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  {tc('export')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {list.error && (
              <p className="text-sm text-destructive">{list.error}</p>
            )}

            {viewMode === 'table' ? (
              <AuditLogTable
                logs={list.items}
                onViewDetails={handleViewDetails}
                onRollback={handleRollback}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {list.items.map(log => (
                  <AuditLogCard
                    key={log.id}
                    log={log}
                    onViewDetails={handleViewDetails}
                    onRollback={handleRollback}
                  />
                ))}
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
          </CardContent>
        </Card>

        <AuditLogDetailDialog
          log={selectedLog}
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
        />
        <RollbackDialog
          log={rollbackLog}
          open={isRollbackDialogOpen}
          onOpenChange={setIsRollbackDialogOpen}
          onConfirm={handleConfirmRollback}
        />
      </div>
    </AdminLayout>
  )
}
