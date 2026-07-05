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
import { Search, Check, User } from 'lucide-react'
import { fetchDisputes } from '@/lib/api/admin'
import type { Dispute, DisputeStatus } from '@/types/admin'
import { format } from 'date-fns'
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'

export default function AdminDisputesPage() {
  const { confirm } = useConfirm()
  const t = useTranslations('admin.disputes')
  const tp = useTranslations('admin.properties')
  const ta = useTranslations('admin.actions')
  const tc = useTranslations('common')
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchDisputes().then(result => {
      if (result.ok) setDisputes(result.data)
    })
  }, [])

  const filteredDisputes = useMemo(() => {
    return disputes.filter(d => {
      const matchesStatus = statusFilter === 'all' || d.status === statusFilter
      const matchesType = typeFilter === 'all' || d.type === typeFilter
      const matchesSearch =
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.createdByName.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesType && matchesSearch
    })
  }, [disputes, statusFilter, typeFilter, searchTerm])

  const handleStatusChange = async (
    disputeId: string,
    newStatus: DisputeStatus
  ) => {
    const ok = await confirm({
      title: t('statusChangeTitle', { status: newStatus }),
    })
    if (!ok) return
    setDisputes(
      disputes.map(d =>
        d.id === disputeId
          ? {
              ...d,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              resolvedAt:
                newStatus === 'resolved'
                  ? new Date().toISOString()
                  : undefined,
            }
          : d
      )
    )
    toast.success(t('statusUpdated'))
  }

  const handleAssign = (disputeId: string) => {
    toast.info(t('assignComingSoon'))
  }

  const statusColors: Record<DisputeStatus, string> = {
    open: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  }

  const priorityColors: Record<Dispute['priority'], string> = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{t('managementTitle')}</h2>
          <p className="text-muted-foreground">{t('managementDesc')}</p>
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
            onValueChange={value => setStatusFilter(value as DisputeStatus | 'all')}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={tp('filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tc('allStatus')}</SelectItem>
              <SelectItem value="open">{tc('status.open')}</SelectItem>
              <SelectItem value="assigned">{t('statuses.assigned')}</SelectItem>
              <SelectItem value="in_progress">{tc('status.inProgress')}</SelectItem>
              <SelectItem value="resolved">{tc('status.resolved')}</SelectItem>
              <SelectItem value="closed">{t('statuses.closed')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={tp('filterByType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tp('allTypes')}</SelectItem>
              <SelectItem value="payment">{t('types.payment')}</SelectItem>
              <SelectItem value="property">{t('types.property')}</SelectItem>
              <SelectItem value="booking">{t('types.booking')}</SelectItem>
              <SelectItem value="other">{t('types.other')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredDisputes.map(dispute => (
            <Card key={dispute.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <CardTitle className="text-lg">{dispute.title}</CardTitle>
                      <Badge className={priorityColors[dispute.priority]}>
                        {dispute.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{dispute.createdByName}</span>
                      </div>
                      <span>•</span>
                      <span>
                        {format(new Date(dispute.createdAt), 'MMM dd, yyyy')}
                      </span>
                      {dispute.assignedToName && (
                        <>
                          <span>•</span>
                          <span>{t('assignedTo', { name: dispute.assignedToName })}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge className={statusColors[dispute.status]}>
                    {dispute.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-foreground">{dispute.description}</p>

                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="capitalize">
                    {dispute.type}
                  </Badge>
                  {dispute.relatedBookingId && (
                    <Badge variant="outline">
                      {t('bookingRef', { id: dispute.relatedBookingId })}
                    </Badge>
                  )}
                  {dispute.relatedPropertyId && (
                    <Badge variant="outline">
                      {t('propertyRef', { id: dispute.relatedPropertyId })}
                    </Badge>
                  )}
                </div>

                {dispute.resolution && (
                  <div className="mb-4 rounded bg-green-50 p-3">
                    <p className="text-sm font-semibold text-green-800 mb-1">
                      {t('resolution')}
                    </p>
                    <p className="text-sm text-green-700">
                      {dispute.resolution}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {dispute.status === 'open' && (
                    <Button size="sm" onClick={() => handleAssign(dispute.id)}>
                      {t('assignToMe')}
                    </Button>
                  )}
                  {dispute.status === 'assigned' && (
                    <Button
                      size="sm"
                      onClick={() =>
                        handleStatusChange(dispute.id, 'in_progress')
                      }
                    >
                      {t('markInProgress')}
                    </Button>
                  )}
                  {dispute.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(dispute.id, 'resolved')}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {ta('resolve')}
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    {ta('viewDetails')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDisputes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t('emptyFiltered')}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
