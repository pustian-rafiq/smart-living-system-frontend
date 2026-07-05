'use client'

import { Suspense, useState, useMemo, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  EmptyState,
  LoadingState,
} from '@/components/page'
import { FlatCard } from '@/components/flat/FlatCard'
import { FlatDetailDialog } from '@/components/flat/FlatDetailDialog'
import { AssignRenterDialog } from '@/components/flat/AssignRenterDialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Filter, Layers } from 'lucide-react'
import { mockBuildings, mockFlats } from '@/data/mockBuildings'
import type { Flat, FlatStatus, Renter } from '@/types/building'

function FlatsPageContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const buildingId = params.buildingId as string
  const floorFromQuery = searchParams.get('floor')

  const [flats, setFlats] = useState(() =>
    mockFlats.filter(f => f.buildingId === buildingId)
  )
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [assignFlat, setAssignFlat] = useState<Flat | null>(null)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<FlatStatus | 'all'>('all')
  const [floorFilter, setFloorFilter] = useState<string>(floorFromQuery || 'all')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (floorFromQuery) setFloorFilter(floorFromQuery)
  }, [floorFromQuery])

  const building = mockBuildings.find(b => b.id === buildingId)

  const floors = useMemo(
    () => Array.from(new Set(flats.map(f => f.floor))).sort((a, b) => a - b),
    [flats]
  )

  const filteredFlats = useMemo(() => {
    let list = [...flats]
    if (statusFilter !== 'all') {
      list = list.filter(f => f.status === statusFilter)
    }
    if (floorFilter !== 'all') {
      list = list.filter(f => f.floor === Number(floorFilter))
    }
    return list
  }, [flats, statusFilter, floorFilter])

  const statusCounts = {
    all: flats.length,
    available: flats.filter(f => f.status === 'available').length,
    occupied: flats.filter(f => f.status === 'occupied').length,
    maintenance: flats.filter(f => f.status === 'maintenance').length,
  }

  const handleViewDetails = (flat: Flat) => {
    setSelectedFlat(flat)
    setIsDialogOpen(true)
  }

  const handleAssignRenter = (flat: Flat) => {
    setAssignFlat(flat)
    setIsDialogOpen(false)
    setIsAssignOpen(true)
  }

  const handleAssignSubmit = (flat: Flat, renter: Renter) => {
    setFlats(prev =>
      prev.map(f =>
        f.id === flat.id ? { ...f, renter, status: 'occupied' as const } : f
      )
    )
    setSelectedFlat(prev =>
      prev?.id === flat.id
        ? { ...prev, renter, status: 'occupied' as const }
        : prev
    )
    setSuccessMessage(
      `${renter.name} assigned to Flat ${flat.flatNumber}. NID on file.`
    )
  }

  const handleGenerateBill = (flat: Flat) => {
    setIsDialogOpen(false)
    router.push(
      `/bills?action=generate&propertyId=${buildingId}&flatId=${flat.id}`
    )
  }

  if (!building) {
    return (
      <EmptyState
        title="Building not found"
        description="This building may have been removed."
      >
        <Button
          variant="outline"
          onClick={() => router.push('/my-properties')}
        >
          Back to buildings
        </Button>
      </EmptyState>
    )
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => router.push('/my-properties')}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to buildings
      </Button>

      <PageHeader
        title={building.name}
        description={building.address}
        actions={
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/my-properties/buildings/${buildingId}/floors`)
            }
          >
            <Layers className="mr-2 h-4 w-4" />
            Manage floors
          </Button>
        }
      />

      {successMessage && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100">
          {successMessage}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        <Select
          value={statusFilter}
          onValueChange={value => setStatusFilter(value as FlatStatus | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
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
        <Select value={floorFilter} onValueChange={setFloorFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Floor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All floors</SelectItem>
            {floors.map(floor => (
              <SelectItem key={floor} value={String(floor)}>
                Floor {floor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredFlats.length === 0 ? (
        <EmptyState
          title="No flats found"
          description={
            statusFilter !== 'all' || floorFilter !== 'all'
              ? 'Try changing filters.'
              : 'No flats in this building yet.'
          }
        />
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

      <FlatDetailDialog
        flat={selectedFlat}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAssignRenter={handleAssignRenter}
        onGenerateBill={handleGenerateBill}
      />

      <AssignRenterDialog
        flat={assignFlat}
        open={isAssignOpen}
        onOpenChange={setIsAssignOpen}
        onAssign={handleAssignSubmit}
      />
    </>
  )
}

export default function FlatsPage() {
  return (
    <Layout>
      <PageContainer>
        <Suspense fallback={<LoadingState label="Loading flats…" />}>
          <FlatsPageContent />
        </Suspense>
      </PageContainer>
    </Layout>
  )
}
