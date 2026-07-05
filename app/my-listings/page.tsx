'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  EmptyState,
  LoadingState,
} from '@/components/page'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useMockQuery } from '@/hooks/useMockQuery'
import { fetchOwnerListings, updateListing } from '@/lib/api/properties'
import { Building2, Plus, Eye, Pencil, Pause, Play } from 'lucide-react'
import Image from 'next/image'
import type { Property } from '@/types/property'

export default function MyListingsPage() {
  const router = useRouter()
  const [tick, setTick] = useState(0)
  const load = useCallback(() => fetchOwnerListings(), [tick])
  const { data: listings, loading, error, refetch } = useMockQuery(load)

  const togglePublish = async (listing: Property) => {
    const nextPublished = !listing.published
    await updateListing(listing.id, {
      published: nextPublished,
      listingStatus: nextPublished ? 'published' : 'paused',
    })
    setTick(t => t + 1)
    refetch()
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="My public listings"
          description="Publish mess, hostel, or apartment listings to discovery search."
          actions={
            <Button asChild>
              <Link href="/my-listings/new">
                <Plus className="mr-2 h-4 w-4" />
                New listing
              </Link>
            </Button>
          }
        />

        {loading && <LoadingState label="Loading your listings…" />}
        {error && (
          <EmptyState
            title="Could not load listings"
            description={error}
            icon={Building2}
          >
            <Button onClick={() => refetch()}>Retry</Button>
          </EmptyState>
        )}

        {!loading && !error && listings && listings.length === 0 && (
          <EmptyState
            title="No listings yet"
            description="Create your first public listing so renters can find you in search."
            icon={Building2}
          >
            <Button asChild>
              <Link href="/my-listings/new">Publish a listing</Link>
            </Button>
          </EmptyState>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings?.map(listing => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="relative h-40 bg-muted">
                {listing.images[0] && (
                  <Image
                    src={listing.images[0]}
                    alt={listing.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                )}
              </div>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold leading-tight">
                      {listing.name}
                    </h3>
                    <p className="text-sm capitalize text-muted-foreground">
                      {listing.type} · {listing.area}
                    </p>
                  </div>
                  <Badge
                    variant={listing.published ? 'default' : 'secondary'}
                  >
                    {listing.listingStatus ||
                      (listing.published ? 'published' : 'draft')}
                  </Badge>
                </div>
                <p className="font-bold text-primary">
                  ৳{listing.rent.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground">
                    /mo
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/listings/${listing.id}`)}
                  >
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(`/my-listings/${listing.id}/edit`)
                    }
                  >
                    <Pencil className="mr-1 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => togglePublish(listing)}
                  >
                    {listing.published ? (
                      <>
                        <Pause className="mr-1 h-3.5 w-3.5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-1 h-3.5 w-3.5" />
                        Publish
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Tip for owners</p>
          <p className="mt-1">
            Listings with clear photos, verified badge, and instant book get
            more enquiries. Manage booking requests from{' '}
            <Link href="/my-properties/bookings" className="text-primary underline">
              Booking requests
            </Link>
            .
          </p>
        </div>
      </PageContainer>
    </Layout>
  )
}
