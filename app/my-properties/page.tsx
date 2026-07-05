'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  EmptyState,
} from '@/components/page'
import { BuildingCard } from '@/components/building/BuildingCard'
import { AddBuildingDialog } from '@/components/building/AddBuildingDialog'
import { Button } from '@/components/ui/button'
import { Plus, FileText, MessageSquare, Receipt } from 'lucide-react'
import { mockBuildings } from '@/data/mockBuildings'
import type { Building } from '@/types/building'

export default function MyPropertiesPage() {
  const [buildings, setBuildings] = useState(mockBuildings)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleAddBuilding = (newBuilding: Building) => {
    setBuildings(prev => [...prev, newBuilding])
    setIsAddDialogOpen(false)
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="My buildings"
          description="Manage buildings, floors, flats, and renters."
          actions={
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add building
            </Button>
          }
        />

        <div className="mb-6 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/bills">
              <Receipt className="mr-2 h-4 w-4" />
              Bills
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/notices">
              <FileText className="mr-2 h-4 w-4" />
              Notices
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/complaints">
              <MessageSquare className="mr-2 h-4 w-4" />
              Complaints
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/my-properties/bookings">Booking requests</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/my-listings">Public listings</Link>
          </Button>
        </div>

        {buildings.length === 0 ? (
          <EmptyState
            title="No buildings yet"
            description="Add your first building, then create floors and flats."
          >
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add building
            </Button>
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {buildings.map(building => (
              <BuildingCard key={building.id} building={building} />
            ))}
          </div>
        )}

        <AddBuildingDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddBuilding}
        />
      </PageContainer>
    </Layout>
  )
}
