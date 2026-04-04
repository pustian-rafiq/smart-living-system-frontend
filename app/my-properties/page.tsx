'use client'

import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { BuildingCard } from '@/components/building/BuildingCard'
import { AddBuildingDialog } from '@/components/building/AddBuildingDialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { mockBuildings } from '@/data/mockBuildings'

export default function MyPropertiesPage() {
  const [buildings, setBuildings] = useState(mockBuildings)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleAddBuilding = (newBuilding: (typeof mockBuildings)[0]) => {
    setBuildings([...buildings, newBuilding])
    setIsAddDialogOpen(false)
  }

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">My Buildings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your buildings and apartments
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Building
          </Button>
        </div>

        {/* Buildings Grid */}
        {buildings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <p className="text-lg font-semibold text-muted-foreground">
              No buildings yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started by adding your first building
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Building
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {buildings.map(building => (
              <BuildingCard key={building.id} building={building} />
            ))}
          </div>
        )}

        {/* Add Building Dialog */}
        <AddBuildingDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddBuilding}
        />
      </div>
    </Layout>
  )
}
