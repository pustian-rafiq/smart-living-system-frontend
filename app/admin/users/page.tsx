'use client'

import { useCallback, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { UserManagementTable } from '@/components/admin/UserManagementTable'
import { UserDetailsDialog } from '@/components/admin/UserDetailsDialog'
import { ServerSearchInput } from '@/components/data/ServerSearchInput'
import { PaginationBar } from '@/components/data/PaginationBar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { fetchManagedUsers, patchManagedUser } from '@/lib/api/admin'
import type { UserManagement, UserStatus } from '@/types/admin'
import { hasAdminPermission } from '@/lib/admin/permissions'
import { getStoredAdminRole } from '@/utils/auth'
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'
import { useServerPagedList } from '@/hooks/useServerPagedList'

export default function AdminUsersPage() {
  const { confirm } = useConfirm()
  const t = useTranslations('admin.users')
  const [busyUserId, setBusyUserId] = useState<string | null>(null)
  const [detailsUser, setDetailsUser] = useState<UserManagement | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const adminRole = getStoredAdminRole()
  const canManage = hasAdminPermission(adminRole, 'users.manage')
  const canBan = hasAdminPermission(adminRole, 'users.ban')

  const filters = useMemo(
    () => ({
      role: roleFilter,
      status: statusFilter,
    }),
    [roleFilter, statusFilter],
  )

  const fetcher = useCallback(
    (params: {
      page: number
      pageSize: number
      search: string
      filters: Record<string, string>
    }) =>
      fetchManagedUsers({
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        role: params.filters.role,
        status: params.filters.status,
      }),
    [],
  )

  const list = useServerPagedList<UserManagement>({
    fetcher,
    filters,
    pageSize: 20,
    minSearchChars: 3,
  })

  const applyUserUpdate = (updated: UserManagement) => {
    list.updateItem(u => u.id === updated.id, updated)
    setDetailsUser(prev => (prev?.id === updated.id ? updated : prev))
  }

  const handleStatusChange = async (userId: string, status: UserStatus) => {
    const current = list.items.find(u => u.id === userId)
    if (!current) return

    if (status === 'banned' || current.status === 'banned') {
      if (!canBan) {
        toast.error(t('banRequiresSuperAdmin'))
        return
      }
    } else if (!canManage) {
      return
    }

    const actionLabel =
      status === 'banned'
        ? 'ban'
        : status === 'suspended'
          ? 'suspend'
          : current.status === 'banned'
            ? 'unban'
            : 'activate'

    const ok = await confirm({
      title: t('statusChangeTitle', { status: actionLabel }),
      description: t('statusChangeDesc', { status: actionLabel }),
      variant: status === 'banned' ? 'destructive' : 'default',
    })
    if (!ok) return

    setBusyUserId(userId)
    const result = await patchManagedUser(userId, { status })
    setBusyUserId(null)

    if (!result.ok) {
      toast.error(result.error)
      return
    }
    applyUserUpdate(result.data)
    toast.success(t('statusUpdated', { status: actionLabel }))
  }

  const handleVerify = async (userId: string) => {
    if (!canManage) return
    const ok = await confirm({
      title: t('verifyTitle'),
      description: t('verifyDesc'),
    })
    if (!ok) return

    setBusyUserId(userId)
    const result = await patchManagedUser(userId, { verified: true })
    setBusyUserId(null)

    if (!result.ok) {
      toast.error(result.error)
      return
    }
    applyUserUpdate(result.data)
    toast.success(t('userVerified'))
  }

  const handleViewDetails = (userId: string) => {
    const user = list.items.find(u => u.id === userId) ?? null
    setDetailsUser(user)
    setDetailsOpen(Boolean(user))
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl space-y-4">
        <div className="mb-2">
          <h2 className="mb-2 text-2xl font-bold">{t('title')}</h2>
          <p className="text-muted-foreground">
            {t('description')}
            {!canBan && canManage && (
              <span className="mt-1 block text-xs">{t('moderatorNote')}</span>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <ServerSearchInput
            className="flex-1"
            value={list.searchInput}
            onChange={list.setSearchInput}
            pending={list.searchPending}
            placeholder={t('searchPlaceholder')}
          />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="renter">Renter</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {list.error && (
          <p className="text-sm text-destructive">{list.error}</p>
        )}

        <UserManagementTable
          users={list.items}
          loading={list.loading}
          onStatusChange={handleStatusChange}
          onVerify={handleVerify}
          onViewDetails={handleViewDetails}
          canBan={canBan}
          canManage={canManage}
          busyUserId={busyUserId}
        />

        <PaginationBar
          page={list.page}
          totalPages={list.totalPages}
          count={list.count}
          pageSize={list.pageSize}
          loading={list.loading}
          onPageChange={list.setPage}
          onPageSizeChange={list.setPageSize}
        />

        <UserDetailsDialog
          user={detailsUser}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          canManage={canManage}
          canBan={canBan}
          onStatusChange={async (id, status) => {
            setDetailsOpen(false)
            await handleStatusChange(id, status)
          }}
          onVerify={async id => {
            setDetailsOpen(false)
            await handleVerify(id)
          }}
        />
      </div>
    </AdminLayout>
  )
}
