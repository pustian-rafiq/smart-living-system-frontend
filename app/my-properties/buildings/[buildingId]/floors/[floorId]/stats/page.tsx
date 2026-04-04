'use client'

import { useParams, useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { FloorStats } from '@/components/floor/FloorStats'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getFloorById, getFloorStats } from '@/data/mockFloors'
import { mockBuildings } from '@/data/mockBuildings'
import { ArrowLeft } from 'lucide-react'

export default function FloorStatsPage() {
  const params = useParams()
  const router = useRouter()
  const buildingId = params.buildingId as string
  const floorId = params.floorId as string

  const floor = getFloorById(floorId)
  const building = mockBuildings.find(b => b.id === buildingId)
  const stats = floor ? getFloorStats(floorId) : undefined

  if (!floor || !building || !stats) {
    return (
      <Layout userRole="owner">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Floor not found</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() =>
                  router.push(`/my-properties/buildings/${buildingId}/floors`)
                }
              >
                Back to Floors
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
          <Button
            variant="ghost"
            onClick={() =>
              router.push(`/my-properties/buildings/${buildingId}/floors`)
            }
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Floors
          </Button>
          <h1 className="text-2xl font-bold">
            {floor.name || `Floor ${floor.floorNumber}`} - Statistics
          </h1>
          <p className="text-muted-foreground mt-1">{building.name}</p>
        </div>

        {/* Stats */}
        <FloorStats
          stats={stats}
          floorName={floor.name || `Floor ${floor.floorNumber}`}
        />
      </div>
    </Layout>
  )
}
