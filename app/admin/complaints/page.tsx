'use client'

import { useState, useMemo, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search, Check, Eye } from 'lucide-react'
import { fetchAdminComplaints } from '@/lib/api/admin'
import { updateComplaintStatus } from '@/lib/api/complaints'
import type { Complaint, ComplaintStatus } from '@/types/complaint'
import { format } from 'date-fns'
import Image from 'next/image'
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'

export default function AdminComplaintsPage() {
  const { confirm } = useConfirm()
  const t = useTranslations('admin.complaints')
  const tp = useTranslations('admin.properties')
  const ta = useTranslations('admin.actions')
  const tc = useTranslations('common')
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>(
    'all'
  )
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAdminComplaints().then(result => {
      if (result.ok) setComplaints(result.data)
    })
  }, [])

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter
      const matchesSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.userName.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [complaints, statusFilter, searchTerm])

  const handleStatusChange = async (
    complaintId: string,
    newStatus: ComplaintStatus
  ) => {
    const ok = await confirm({
      title: t('statusChangeTitle', { status: newStatus }),
    })
    if (!ok) return
    const result = await updateComplaintStatus(complaintId, newStatus)
    if (result.ok) {
      setComplaints(
        complaints.map(c =>
          c.id === complaintId
            ? {
                ...result.data,
                resolvedAt:
                  newStatus === 'resolved'
                    ? new Date().toISOString()
                    : c.resolvedAt,
              }
            : c
        )
      )
      toast.success(t('statusUpdated'))
    }
  }

  const statusColors: Record<ComplaintStatus, string> = {
    open: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{t('title')}</h2>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={value => setStatusFilter(value as ComplaintStatus | 'all')}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={tp('filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tc('allStatus')}</SelectItem>
              <SelectItem value="open">{tc('status.open')}</SelectItem>
              <SelectItem value="in_progress">{tc('status.inProgress')}</SelectItem>
              <SelectItem value="resolved">{tc('status.resolved')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredComplaints.map(complaint => (
            <Card key={complaint.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{complaint.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('byUser', { name: complaint.userName })} •{' '}
                      {format(new Date(complaint.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <Badge className={statusColors[complaint.status]}>
                    {complaint.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-foreground">{complaint.description}</p>

                {complaint.imageUrl && (
                  <div className="mb-4 relative h-48 w-full rounded overflow-hidden bg-muted">
                    <Image
                      src={complaint.imageUrl}
                      alt={complaint.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 800px"
                    />
                  </div>
                )}

                {complaint.response && (
                  <div className="mb-4 rounded bg-muted p-3">
                    <p className="text-sm font-semibold mb-1">{t('response')}</p>
                    <p className="text-sm text-foreground">
                      {complaint.response}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {complaint.status === 'open' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusChange(complaint.id, 'in_progress')
                        }
                      >
                        <Check className="mr-2 h-4 w-4" />
                        {t('markInProgress')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleStatusChange(complaint.id, 'resolved')
                        }
                      >
                        {ta('resolve')}
                      </Button>
                    </>
                  )}
                  {complaint.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusChange(complaint.id, 'resolved')
                      }
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {ta('resolve')}
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    {ta('viewDetails')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t('emptyFiltered')}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
