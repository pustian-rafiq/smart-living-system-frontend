'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuditLogTable } from '@/components/audit/AuditLogTable'
import { AuditLogCard } from '@/components/audit/AuditLogCard'
import { AuditLogDetailDialog } from '@/components/audit/AuditLogDetailDialog'
import { RollbackDialog } from '@/components/audit/RollbackDialog'
import { fetchAuditLogs, rollbackAudit } from '@/lib/api/admin'
import type { AuditLog, AuditAction, AuditEntityType } from '@/types/audit'
import { Download, X } from 'lucide-react'

export default function AuditLogsPage() {
  const t = useTranslations('admin.audit')
  const tc = useTranslations('common')
  const [allLogs, setAllLogs] = useState<AuditLog[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAction, setSelectedAction] = useState<AuditAction | 'all'>(
    'all'
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

  const loadLogs = useCallback(async () => {
    const result = await fetchAuditLogs()
    if (result.ok) setAllLogs(result.data)
  }, [])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  const filteredLogs = useMemo(() => {
    let filtered = [...allLogs]

    if (selectedAction !== 'all') {
      filtered = filtered.filter(log => log.action === selectedAction)
    }

    if (selectedEntityType !== 'all') {
      filtered = filtered.filter(log => log.entityType === selectedEntityType)
    }

    if (selectedUserRole !== 'all') {
      filtered = filtered.filter(log => log.userRole === selectedUserRole)
    }

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      filtered = filtered.filter(
        log =>
          log.entityName.toLowerCase().includes(searchLower) ||
          log.userName.toLowerCase().includes(searchLower) ||
          log.id.toLowerCase().includes(searchLower)
      )
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [allLogs, searchQuery, selectedAction, selectedEntityType, selectedUserRole])

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
        await loadLogs()
      }
    }
  }

  const hasActiveFilters =
    searchQuery ||
    selectedAction !== 'all' ||
    selectedEntityType !== 'all' ||
    selectedUserRole !== 'all'

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedAction('all')
    setSelectedEntityType('all')
    setSelectedUserRole('all')
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t('title')}</h2>
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
                  <X className="h-4 w-4 mr-2" />
                  {t('clearFilters')}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">{tc('search')}</Label>
                <Input
                  id="search"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
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
                    <SelectItem value="verification">{t('entities.verification')}</SelectItem>
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
                      v as 'renter' | 'owner' | 'admin' | 'all'
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
                  {t('logsCount', { count: filteredLogs.length })}
                </CardTitle>
                <CardDescription>
                  {filteredLogs.length === 1
                    ? t('showingLogs', { count: filteredLogs.length })
                    : t('showingLogsPlural', { count: filteredLogs.length })}
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
                  <Download className="h-4 w-4 mr-2" />
                  {tc('export')}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'table' ? (
              <AuditLogTable
                logs={filteredLogs}
                onViewDetails={handleViewDetails}
                onRollback={handleRollback}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredLogs.map(log => (
                  <AuditLogCard
                    key={log.id}
                    log={log}
                    onViewDetails={handleViewDetails}
                    onRollback={handleRollback}
                  />
                ))}
              </div>
            )}
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
