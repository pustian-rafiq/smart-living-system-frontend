'use client'

import { useState, useMemo, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PropertyModerationCard } from '@/components/admin/PropertyModerationCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { fetchPropertyModerations } from '@/lib/api/admin'
import type { PropertyModeration, PropertyStatus } from '@/types/admin'
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'

export default function AdminPropertiesPage() {
  const { confirm } = useConfirm()
  const t = useTranslations('admin.properties')
  const ta = useTranslations('admin.actions')
  const tc = useTranslations('common')
  const tProp = useTranslations('search.page.propertyTypes')
  const [properties, setProperties] = useState<PropertyModeration[]>([])
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>(
    'all'
  )
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPropertyModerations().then(result => {
      if (result.ok) setProperties(result.data)
    })
  }, [])

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter
      const matchesType = typeFilter === 'all' || p.propertyType === typeFilter
      const matchesSearch =
        p.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesType && matchesSearch
    })
  }, [properties, statusFilter, typeFilter, searchTerm])

  const handleApprove = async (propertyId: string) => {
    const ok = await confirm({
      title: t('approveTitle'),
    })
    if (!ok) return
    setProperties(
      properties.map(p =>
        p.propertyId === propertyId
          ? {
              ...p,
              status: 'approved' as PropertyStatus,
              reviewedAt: new Date().toISOString(),
            }
          : p
      )
    )
    toast.success(t('approved'))
  }

  const handleReject = (propertyId: string) => {
    const reason = prompt(t('rejectReason'))
    if (reason) {
      setProperties(
        properties.map(p =>
          p.propertyId === propertyId
            ? {
                ...p,
                status: 'rejected' as PropertyStatus,
                reviewedAt: new Date().toISOString(),
                rejectionReason: reason,
              }
            : p
        )
      )
      toast.success(t('rejected'))
    }
  }

  const handleToggleFeatured = (propertyId: string) => {
    setProperties(
      properties.map(p =>
        p.propertyId === propertyId ? { ...p, featured: !p.featured } : p
      )
    )
  }

  const handleToggleVerified = (propertyId: string) => {
    setProperties(
      properties.map(p =>
        p.propertyId === propertyId ? { ...p, verified: !p.verified } : p
      )
    )
  }

  const handleView = (propertyId: string) => {
    toast.info(t('viewProperty', { id: propertyId }))
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
            onValueChange={value => setStatusFilter(value as PropertyStatus | 'all')}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{tc('allStatus')}</SelectItem>
              <SelectItem value="pending">{tc('status.pending')}</SelectItem>
              <SelectItem value="approved">{tc('status.approved')}</SelectItem>
              <SelectItem value="rejected">{tc('status.rejected')}</SelectItem>
              <SelectItem value="suspended">{ta('suspend')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={t('filterByType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allTypes')}</SelectItem>
              <SelectItem value="mess">{tProp('mess')}</SelectItem>
              <SelectItem value="apartment">{tProp('apartment')}</SelectItem>
              <SelectItem value="hotel">{tProp('hotel')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map(property => (
            <PropertyModerationCard
              key={property.id}
              property={property}
              onApprove={handleApprove}
              onReject={handleReject}
              onView={handleView}
              onToggleFeatured={handleToggleFeatured}
              onToggleVerified={handleToggleVerified}
            />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t('emptyFiltered')}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
