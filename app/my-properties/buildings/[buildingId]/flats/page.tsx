'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { FlatCard } from '@/components/flat/FlatCard'
import { FlatDetailDialog } from '@/components/flat/FlatDetailDialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Filter } from 'lucide-react'
import { mockBuildings, mockFlats } from '@/data/mockBuildings'
import type { Flat, FlatStatus } from '@/types/building'

export default function FlatsPage() {
  const params = useParams()
  const router = useRouter()
  const buildingId = params.buildingId as string

  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<FlatStatus | 'all'>('all')

  const building = mockBuildings.find(b => b.id === buildingId)
  const flats = useMemo(
    () => mockFlats.filter(f => f.buildingId === buildingId),
    [buildingId]
  )

  const filteredFlats = useMemo(() => {
    if (statusFilter === 'all') return flats
    return flats.filter(f => f.status === statusFilter)
  }, [flats, statusFilter])

  const handleViewDetails = (flat: Flat) => {
    setSelectedFlat(flat)
    setIsDialogOpen(true)
  }

  const handleAssignRenter = (flat: Flat) => {
    // TODO: Implement assign renter functionality
    alert(`Assign renter to Flat ${flat.flatNumber}`)
  }

  const handleGenerateBill = (flat: Flat) => {
    // TODO: Implement generate bill functionality
    alert(`Generate bill for Flat ${flat.flatNumber}`)
  }

  if (!building) {
    return (
      <Layout>
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg font-semibold">Building not found</p>
            <Button
              variant="outline"
              onClick={() => router.push('/my-properties')}
              className="mt-4"
            >
              Back to Buildings
            </Button>
          </div>
        </div>
      </Layout>
    )
  }

  const statusCounts = {
    all: flats.length,
    available: flats.filter(f => f.status === 'available').length,
    occupied: flats.filter(f => f.status === 'occupied').length,
    maintenance: flats.filter(f => f.status === 'maintenance').length,
  }

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/my-properties')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Buildings
          </Button>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {building.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {building.address}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by Status:</span>
          </div>
          <Select
            value={statusFilter}
            onValueChange={value =>
              setStatusFilter(value as FlatStatus | 'all')
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({statusCounts.all})</SelectItem>
              <SelectItem value="available">
                Available ({statusCounts.available})
              </SelectItem>
              <SelectItem value="occupied">
                Occupied ({statusCounts.occupied})
              </SelectItem>
              <SelectItem value="maintenance">
                Maintenance ({statusCounts.maintenance})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Flats Grid */}
        {filteredFlats.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <p className="text-lg font-semibold text-muted-foreground">
              No flats found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {statusFilter !== 'all'
                ? `No flats with status "${statusFilter}"`
                : 'No flats in this building'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFlats.map(flat => (
              <FlatCard
                key={flat.id}
                flat={flat}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Flat Detail Dialog */}
        <FlatDetailDialog
          flat={selectedFlat}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAssignRenter={handleAssignRenter}
          onGenerateBill={handleGenerateBill}
        />
      </div>
    </Layout>
  )
}
