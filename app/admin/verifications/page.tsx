'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { VerificationRequestCard } from '@/components/admin/VerificationRequestCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { mockVerificationRequests } from '@/data/mockAdmin'
import type { VerificationStatus } from '@/types/admin'

function VerificationsContent() {
  const searchParams = useSearchParams()
  const initialStatus =
    (searchParams.get('status') as VerificationStatus) || 'all'

  const [requests, setRequests] = useState(mockVerificationRequests)
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>(
    initialStatus
  )

  const filteredRequests = useMemo(() => {
    if (statusFilter === 'all') return requests
    return requests.filter(r => r.status === statusFilter)
  }, [requests, statusFilter])

  const handleApprove = (requestId: string) => {
    if (confirm('Approve this verification request?')) {
      setRequests(
        requests.map(r =>
          r.id === requestId
            ? {
                ...r,
                status: 'approved' as VerificationStatus,
                reviewedAt: new Date().toISOString(),
                reviewedBy: 'admin1',
              }
            : r
        )
      )
      // TODO: API call
      alert('Verification approved')
    }
  }

  const handleReject = (requestId: string, reason: string) => {
    setRequests(
      requests.map(r =>
        r.id === requestId
          ? {
              ...r,
              status: 'rejected' as VerificationStatus,
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'admin1',
              rejectionReason: reason,
            }
          : r
      )
    )
    // TODO: API call
    alert('Verification rejected')
  }

  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    expired: requests.filter(r => r.status === 'expired').length,
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Verification Management</h2>
          <p className="text-muted-foreground">
            Review and manage user verification requests
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex items-center gap-4">
          <Select
            value={statusFilter}
            onValueChange={value => setStatusFilter(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({statusCounts.all})</SelectItem>
              <SelectItem value="pending">
                Pending ({statusCounts.pending})
              </SelectItem>
              <SelectItem value="approved">
                Approved ({statusCounts.approved})
              </SelectItem>
              <SelectItem value="rejected">
                Rejected ({statusCounts.rejected})
              </SelectItem>
              <SelectItem value="expired">
                Expired ({statusCounts.expired})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verification Requests */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map(request => (
            <VerificationRequestCard
              key={request.id}
              request={request}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No verification requests found
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default function AdminVerificationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationsContent />
    </Suspense>
  )
}
