'use client'

import { useState, useMemo } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { PropertyModerationCard } from '@/components/admin/PropertyModerationCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { mockPropertyModerations } from '@/data/mockAdmin'
import type { PropertyModeration, PropertyStatus } from '@/types/admin'

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState(mockPropertyModerations)
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

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

  const handleApprove = (propertyId: string) => {
    if (confirm('Approve this property?')) {
      setProperties(
        properties.map(p =>
          p.propertyId === propertyId
            ? { ...p, status: 'approved' as PropertyStatus, reviewedAt: new Date().toISOString() }
            : p
        )
      )
      // TODO: API call
      alert('Property approved')
    }
  }

  const handleReject = (propertyId: string) => {
    const reason = prompt('Please provide a reason for rejection:')
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
      // TODO: API call
      alert('Property rejected')
    }
  }

  const handleToggleFeatured = (propertyId: string) => {
    setProperties(
      properties.map(p =>
        p.propertyId === propertyId ? { ...p, featured: !p.featured } : p
      )
    )
    // TODO: API call
  }

  const handleToggleVerified = (propertyId: string) => {
    setProperties(
      properties.map(p =>
        p.propertyId === propertyId ? { ...p, verified: !p.verified } : p
      )
    )
    // TODO: API call
  }

  const handleView = (propertyId: string) => {
    // TODO: Navigate to property details
    alert(`View property ${propertyId}`)
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Property Management</h2>
          <p className="text-muted-foreground">
            Review and manage all property listings on the platform
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="mess">Mess</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Properties List */}
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
            No properties found matching your filters
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
