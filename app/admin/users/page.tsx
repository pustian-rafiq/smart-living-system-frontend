'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { UserManagementTable } from '@/components/admin/UserManagementTable'
import { mockUsers } from '@/data/mockAdmin'
import type { UserStatus } from '@/types/admin'

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers)

  const handleStatusChange = (userId: string, status: UserStatus) => {
    if (confirm(`Are you sure you want to ${status} this user?`)) {
      setUsers(users.map(u => (u.id === userId ? { ...u, status } : u)))
      // TODO: API call
      alert(`User status updated to ${status}`)
    }
  }

  const handleVerify = (userId: string) => {
    if (confirm('Verify this user?')) {
      setUsers(users.map(u => (u.id === userId ? { ...u, verified: true } : u)))
      // TODO: API call
      alert('User verified')
    }
  }

  const handleViewDetails = (userId: string) => {
    // TODO: Navigate to user details page
    alert(`View details for user ${userId}`)
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">User Management</h2>
          <p className="text-muted-foreground">
            Manage all platform users, their status, and verification
          </p>
        </div>

        <UserManagementTable
          users={users}
          onStatusChange={handleStatusChange}
          onVerify={handleVerify}
          onViewDetails={handleViewDetails}
        />
      </div>
    </AdminLayout>
  )
}
