'use client'

import { useState, useMemo, Suspense, useEffect } from 'react'
import { useTranslations } from 'next-intl'
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
import { fetchVerificationRequests } from '@/lib/api/admin'
import type { VerificationRequest, VerificationStatus } from '@/types/admin'
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'

function VerificationsContent() {
  const { confirm } = useConfirm()
  const t = useTranslations('admin.verifications')
  const tp = useTranslations('admin.properties')
  const tc = useTranslations('common')
  const searchParams = useSearchParams()
  const initialStatus =
    (searchParams.get('status') as VerificationStatus) || 'all'

  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>(
    initialStatus
  )

  useEffect(() => {
    fetchVerificationRequests().then(result => {
      if (result.ok) setRequests(result.data)
    })
  }, [])

  const filteredRequests = useMemo(() => {
    if (statusFilter === 'all') return requests
    return requests.filter(r => r.status === statusFilter)
  }, [requests, statusFilter])

  const handleApprove = async (requestId: string) => {
    const ok = await confirm({
      title: t('approveTitle'),
    })
    if (!ok) return
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
    toast.success(t('approved'))
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
    toast.success(t('rejected'))
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
          <h2 className="text-2xl font-bold mb-2">{t('managementTitle')}</h2>
          <p className="text-muted-foreground">{t('managementDesc')}</p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <Select
            value={statusFilter}
            onValueChange={value => setStatusFilter(value as VerificationStatus | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={tp('filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tc('status.all')} ({statusCounts.all})</SelectItem>
              <SelectItem value="pending">{tc('status.pending')} ({statusCounts.pending})</SelectItem>
              <SelectItem value="approved">{tc('status.approved')} ({statusCounts.approved})</SelectItem>
              <SelectItem value="rejected">{tc('status.rejected')} ({statusCounts.rejected})</SelectItem>
              <SelectItem value="expired">{t('expired')} ({statusCounts.expired})</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
            {t('emptyFiltered')}
          </div>
        )}
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
