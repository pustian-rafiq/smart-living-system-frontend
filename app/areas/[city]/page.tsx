'use client'

import { useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader, EmptyState, LoadingState } from '@/components/page'
import { PropertyCard } from '@/components/property/PropertyCard'
import { HotelCard } from '@/components/hotel/HotelCard'
import { MessPublicCard } from '@/components/mess/MessPublicCard'
import { Button } from '@/components/ui/button'
import { fetchDiscoverSearch } from '@/lib/api/discover'
import { useMockQuery } from '@/hooks/useMockQuery'
import { MapPin } from 'lucide-react'
import type { Property } from '@/types/property'

export default function AreaLandingPage() {
  const params = useParams()
  const city = decodeURIComponent(String(params.city || ''))
  const load = useCallback(
    () => fetchDiscoverSearch({ category: 'all', city, availableOnly: true }),
    [city],
  )
  const { data, loading } = useMockQuery(load)

  const listings = data?.listings ?? []
  const hotels = data?.hotels ?? []
  const messes = data?.messes ?? []
  const total = listings.length + hotels.length + messes.length

  const title = useMemo(
    () => (city ? `Live stays in ${city}` : 'Browse by city'),
    [city],
  )

  const onViewDetails = (property: Property) => {
    window.location.href = `/listings/${property.id}`
  }
  const onCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title={title}
          description="Apartments, mess seats, and hotels currently published for this city. Data is live from owners."
          actions={
            <Button asChild variant="outline">
              <Link href={`/search?city=${encodeURIComponent(city)}`}>
                Open full search
              </Link>
            </Button>
          }
        />
        {loading ? (
          <LoadingState label="Loading city listings…" />
        ) : total === 0 ? (
          <EmptyState
            icon={MapPin}
            title={`No live listings in ${city} yet`}
            description="Owners can publish apartments, messes, and hotels to appear here."
          />
        ) : (
          <div className="space-y-10">
            {messes.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold">Mess & hostels</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {messes.map(mess => (
                    <MessPublicCard key={mess.id} mess={mess} />
                  ))}
                </div>
              </section>
            )}
            {hotels.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold">Hotels</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {hotels.map(hotel => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              </section>
            )}
            {listings.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold">Apartments & listings</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {listings.map(property => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onViewDetails={onViewDetails}
                      onCall={onCall}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </PageContainer>
    </Layout>
  )
}
