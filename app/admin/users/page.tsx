'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { UserManagementTable } from '@/components/admin/UserManagementTable'
import { fetchManagedUsers } from '@/lib/api/admin'
import type { UserManagement, UserStatus } from '@/types/admin'
import { hasAdminPermission } from '@/lib/admin/permissions'
import { getStoredAdminRole } from '@/utils/auth'
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'

export default function AdminUsersPage() {
  const { confirm } = useConfirm()
  const t = useTranslations('admin.users')
  const [users, setUsers] = useState<UserManagement[]>([])
  const adminRole = getStoredAdminRole()
  const canManage = hasAdminPermission(adminRole, 'users.manage')
  const canBan = hasAdminPermission(adminRole, 'users.ban')

  useEffect(() => {
    fetchManagedUsers().then(result => {
      if (result.ok) setUsers(result.data)
    })
  }, [])

  const handleStatusChange = async (userId: string, status: UserStatus) => {
    if (status === 'banned' && !canBan) return
    if (!canManage && status !== 'banned') return
    const ok = await confirm({
      title: t('statusChangeTitle', { status }),
      description: t('statusChangeDesc', { status }),
      variant: status === 'banned' ? 'destructive' : 'default',
    })
    if (!ok) return
    setUsers(users.map(u => (u.id === userId ? { ...u, status } : u)))
    toast.success(t('statusUpdated', { status }))
  }

  const handleVerify = async (userId: string) => {
    if (!canManage) return
    const ok = await confirm({
      title: t('verifyTitle'),
    })
    if (!ok) return
    setUsers(users.map(u => (u.id === userId ? { ...u, verified: true } : u)))
    toast.success(t('userVerified'))
  }

  const handleViewDetails = (userId: string) => {
    toast.info(t('viewDetailsFor', { id: userId }))
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{t('title')}</h2>
          <p className="text-muted-foreground">
            {t('description')}
            {!canBan && canManage && (
              <span className="block text-xs mt-1">{t('moderatorNote')}</span>
            )}
          </p>
        </div>

        <UserManagementTable
          users={users}
          onStatusChange={handleStatusChange}
          onVerify={handleVerify}
          onViewDetails={handleViewDetails}
          canBan={canBan}
          canManage={canManage}
        />
      </div>
    </AdminLayout>
  )
}
