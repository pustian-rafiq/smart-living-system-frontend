'use client'

import { Suspense, useState, useMemo, useEffect, useCallback } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
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
import { fetchBuildingById, fetchFlatsByBuilding, assignRenter } from '@/lib/api/buildings'
import { useMockQuery } from '@/hooks/useMockQuery'
import type { Flat, FlatStatus, Renter } from '@/types/building'

function FlatsPageContent() {
  const t = useTranslations('portfolio.flats')
  const tb = useTranslations('portfolio.buildings')
  const tc = useTranslations('common')
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const buildingId = params.buildingId as string
  const floorFromQuery = searchParams.get('floor')

  const loadBuilding = useCallback(
    () => fetchBuildingById(buildingId),
    [buildingId]
  )
  const { data: building } = useMockQuery(loadBuilding)

  const loadFlats = useCallback(
    () => fetchFlatsByBuilding(buildingId),
    [buildingId]
  )
  const { data: fetchedFlats } = useMockQuery(loadFlats)

  const [localFlats, setLocalFlats] = useState<Flat[] | null>(null)
  const flats = localFlats ?? fetchedFlats ?? []
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

  const handleAssignSubmit = async (flat: Flat, renter: Renter) => {
    const result = await assignRenter(flat.id, {
      name: renter.name,
      phone: renter.phone,
      email: renter.email,
      nid: renter.nid,
      address: renter.address,
      joinedDate: renter.joinedDate,
    })
    const updated = result.ok
      ? result.data
      : { ...flat, renter, status: 'occupied' as const }
    setLocalFlats(prev =>
      (prev ?? fetchedFlats ?? []).map(f => (f.id === flat.id ? updated : f)),
    )
    setSelectedFlat(prev => (prev?.id === flat.id ? updated : prev))
    setSuccessMessage(
      t('assignSuccess', { renter: renter.name, flat: flat.flatNumber }),
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
        title={tb('notFoundTitle')}
        description={tb('notFoundDesc')}
      >
        <Button
          variant="outline"
          onClick={() => router.push('/my-properties')}
        >
          {tb('backToBuildings')}
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
        {tb('backToBuildings')}
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
            {t('manageFloors')}
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
          <span className="text-sm font-medium">{t('filters')}</span>
        </div>
        <Select
          value={statusFilter}
          onValueChange={value => setStatusFilter(value as FlatStatus | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('statusPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {tc('status.all')} ({statusCounts.all})
            </SelectItem>
            <SelectItem value="available">
              {t('available')} ({statusCounts.available})
            </SelectItem>
            <SelectItem value="occupied">
              {t('occupied')} ({statusCounts.occupied})
            </SelectItem>
            <SelectItem value="maintenance">
              {t('maintenance')} ({statusCounts.maintenance})
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={floorFilter} onValueChange={setFloorFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t('floorPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allFloors')}</SelectItem>
            {floors.map(floor => (
              <SelectItem key={floor} value={String(floor)}>
                {t('floorNumber', { number: floor })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredFlats.length === 0 ? (
        <EmptyState
          title={t('emptyTitle')}
          description={
            statusFilter !== 'all' || floorFilter !== 'all'
              ? t('emptyFiltered')
              : t('emptyBuilding')
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
  const t = useTranslations('portfolio.flats')

  return (
    <Layout>
      <PageContainer>
        <Suspense fallback={<LoadingState label={t('loading')} />}>
          <FlatsPageContent />
        </Suspense>
      </PageContainer>
    </Layout>
  )
}
