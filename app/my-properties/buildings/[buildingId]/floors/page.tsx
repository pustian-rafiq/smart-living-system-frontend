'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FloorCard } from '@/components/floor/FloorCard'
import { FloorDialog } from '@/components/floor/FloorDialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  getFloorsByBuilding,
  addFloor,
  updateFloor,
  deleteFloor,
} from '@/data/mockFloors'
import { mockBuildings } from '@/data/mockBuildings'
import type { Floor, FloorFormData } from '@/types/floor'
import { Plus, Building2 } from 'lucide-react'

export default function FloorsPage() {
  const params = useParams()
  const router = useRouter()
  const buildingId = params.buildingId as string

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null)
  const [deleteFloorData, setDeleteFloorData] = useState<Floor | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const building = mockBuildings.find(b => b.id === buildingId)
  const floors = useMemo(
    () => getFloorsByBuilding(buildingId),
    [buildingId, refreshKey]
  )

  const handleAddFloor = () => {
    setSelectedFloor(null)
    setIsDialogOpen(true)
  }

  const handleEditFloor = (floor: Floor) => {
    setSelectedFloor(floor)
    setIsDialogOpen(true)
  }

  const handleDeleteFloor = (floor: Floor) => {
    setDeleteFloorData(floor)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = (data: FloorFormData) => {
    if (selectedFloor) {
      updateFloor(selectedFloor.id, {
        ...selectedFloor,
        ...data,
      })
    } else {
      addFloor({
        buildingId,
        ...data,
        totalFlats: 0,
        occupiedFlats: 0,
        availableFlats: 0,
        maintenanceFlats: 0,
        flats: [],
      })
    }
    setRefreshKey(k => k + 1)
  }

  const handleConfirmDelete = () => {
    if (deleteFloorData) {
      deleteFloor(deleteFloorData.id)
      setIsDeleteDialogOpen(false)
      setDeleteFloorData(null)
      setRefreshKey(k => k + 1)
    }
  }

  if (!building) {
    return (
      <Layout userRole="owner">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Building not found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push('/my-properties')}
              >
                Back to Buildings
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout userRole="owner">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Button
                variant="ghost"
                className="mb-2 -ml-2"
                onClick={() => router.push('/my-properties')}
              >
                ← Back to buildings
              </Button>
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                <Building2 className="h-6 w-6" />
                {building.name} — Floors
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage floors and open flats by floor
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/my-properties/buildings/${buildingId}/flats`)
                }
              >
                All flats
              </Button>
              <Button onClick={handleAddFloor}>
                <Plus className="mr-2 h-4 w-4" />
                Add floor
              </Button>
            </div>
          </div>
        </div>

        {/* Floors Grid */}
        {floors.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {floors.map(floor => (
              <FloorCard
                key={floor.id}
                floor={floor}
                buildingName={building.name}
                onEdit={handleEditFloor}
                onDelete={handleDeleteFloor}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mb-4">No floors found</p>
              <Button onClick={handleAddFloor}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Floor
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        <FloorDialog
          floor={selectedFloor}
          buildingId={buildingId}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Floor?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{' '}
                {deleteFloorData?.name ||
                  `Floor ${deleteFloorData?.floorNumber}`}
                ? This action cannot be undone. All flats on this floor will
                need to be reassigned.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  )
}
