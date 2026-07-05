'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { EmptyState } from '@/components/page'
import { ComplaintCard } from '@/components/complaint/ComplaintCard'
import { ComplaintForm } from '@/components/complaint/ComplaintForm'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Filter, Plus, MessageSquareWarning } from 'lucide-react'
import type { Complaint, ComplaintStatus } from '@/types/complaint'
import { getStoredRole } from '@/utils/auth'
import { toast } from '@/lib/feedback/toast'
import { createComplaint, fetchComplaints } from '@/lib/api/complaints'
import { getDemoTenantId } from '@/lib/api/demoUser'

export default function ComplaintsPage() {
  const t = useTranslations('tools.complaints')
  const tc = useTranslations('common')
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>(
    'all'
  )
  const [showForm, setShowForm] = useState(false)

  const userRole = getStoredRole() || 'renter'
  const isOwner = userRole === 'owner'

  const loadComplaints = useCallback(async () => {
    const result = await fetchComplaints(
      isOwner ? { ownerView: true } : { userId: getDemoTenantId() }
    )
    if (result.ok) setComplaints(result.data)
  }, [isOwner])

  useEffect(() => {
    loadComplaints()
  }, [loadComplaints])

  const filteredComplaints = useMemo(() => {
    let filtered = [...complaints]

    if (!isOwner) {
      filtered = filtered.filter(c => c.userId === getDemoTenantId())
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter)
    }

    return filtered.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [complaints, statusFilter, isOwner])

  const handleSubmit = async (data: {
    title: string
    description: string
    image?: File
  }) => {
    const userId = getDemoTenantId()
    const result = await createComplaint({
      userId,
      userName: 'Current User',
      title: data.title,
      description: data.description,
      imageUrl: data.image ? URL.createObjectURL(data.image) : undefined,
    })
    if (result.ok) {
      setComplaints(prev => [result.data, ...prev])
      setShowForm(false)
      toast.success(t('submitSuccess'))
    }
  }

  const statusCounts = {
    all: filteredComplaints.length,
    open: complaints.filter(c => c.status === 'open').length,
    in_progress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  }

  const statusLabel = (status: ComplaintStatus | 'all') =>
    status === 'all' ? tc('status.all') : tc(`status.${status === 'in_progress' ? 'inProgress' : status}`)

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{t('title')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isOwner ? t('descriptionOwner') : t('descriptionRenter')}
            </p>
          </div>
          {!isOwner && (
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="mr-2 h-4 w-4" />
              {showForm ? tc('cancel') : t('newComplaint')}
            </Button>
          )}
        </div>

        {!isOwner && showForm && (
          <div className="mb-6">
            <ComplaintForm onSubmit={handleSubmit} />
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{tc('filterByStatus')}</span>
          </div>
          <Select
            value={statusFilter}
            onValueChange={value =>
              setStatusFilter(value as ComplaintStatus | 'all')
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {statusLabel('all')} ({statusCounts.all})
              </SelectItem>
              <SelectItem value="open">
                {statusLabel('open')} ({statusCounts.open})
              </SelectItem>
              <SelectItem value="in_progress">
                {statusLabel('in_progress')} ({statusCounts.in_progress})
              </SelectItem>
              <SelectItem value="resolved">
                {statusLabel('resolved')} ({statusCounts.resolved})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredComplaints.length === 0 ? (
          <EmptyState
            icon={MessageSquareWarning}
            title={t('emptyTitle')}
            description={
              statusFilter !== 'all'
                ? t('emptyDescFilter', {
                    status: statusLabel(statusFilter),
                  })
                : !isOwner
                  ? t('emptyDescRenter')
                  : t('emptyDescOwner')
            }
          >
            {!isOwner && !showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('newComplaint')}
              </Button>
            )}
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredComplaints.map(complaint => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
