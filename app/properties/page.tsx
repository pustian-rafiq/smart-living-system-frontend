'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { Layout } from '@/components/layout/Layout'
import { PropertyCard } from '@/components/property/PropertyCard'
import { PropertyDetailDialog } from '@/components/property/PropertyDetailDialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  PageContainer,
  PageHeader,
  EmptyState,
  LoadingState,
} from '@/components/page'
import { useMockQuery } from '@/hooks/useMockQuery'
import { fetchFeaturedProperties } from '@/lib/api/properties'
import type { Property } from '@/types/property'
import { SlidersHorizontal, Sparkles } from 'lucide-react'

export default function PropertiesPage() {
  const load = useCallback(() => fetchFeaturedProperties(12), [])
  const { data: properties, loading, error, refetch } = useMockQuery(load)
  const [selected, setSelected] = useState<Property | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const onViewDetails = (p: Property) => {
    setSelected(p)
    setDialogOpen(true)
  }

  const onCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\s/g, '')}`
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="Browse listings"
          description="Verified-style featured properties across Dhaka and beyond. Use filters on Search for precise matches."
          actions={
            <>
              <Button variant="outline" asChild>
                <Link href="/search">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Advanced search
                </Link>
              </Button>
              <Button asChild>
                <Link href="/hotels">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Hotels &amp; stays
                </Link>
              </Button>
            </>
          }
        />

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-normal">
            Mock API · same shape as production
          </Badge>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>

        {loading && <LoadingState label="Loading listings…" />}
        {error && (
          <EmptyState
            title="Could not load listings"
            description={error}
            icon={Sparkles}
          >
            <Button onClick={() => refetch()}>Try again</Button>
          </EmptyState>
        )}
        {!loading && !error && properties && properties.length === 0 && (
          <EmptyState
            title="No properties yet"
            description="Seed data will appear here."
            icon={Sparkles}
          >
            <Button asChild>
              <Link href="/search">Open search</Link>
            </Button>
          </EmptyState>
        )}
        {!loading && !error && properties && properties.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map(p => (
              <PropertyCard
                key={p.id}
                property={p}
                onViewDetails={onViewDetails}
                onCall={onCall}
              />
            ))}
          </div>
        )}

        <PropertyDetailDialog
          property={selected}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onCall={onCall}
        />
      </PageContainer>
    </Layout>
  )
}
