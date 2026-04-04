'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  EmptyState,
  LoadingState,
} from '@/components/page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useMockQuery } from '@/hooks/useMockQuery'
import { fetchRentalSummariesForRenter } from '@/lib/api/rentals'
import { getDemoRenterId } from '@/lib/api/demoUser'
import type { RentalSummary } from '@/lib/api/rentals'
import {
  Building2,
  Calendar,
  MapPin,
  MessageCircle,
  Phone,
  Search,
} from 'lucide-react'
import Image from 'next/image'

function phaseBadge(phase: RentalSummary['phase']) {
  const map: Record<
    RentalSummary['phase'],
    {
      label: string
      variant: 'default' | 'secondary' | 'destructive' | 'outline'
    }
  > = {
    active: { label: 'Active', variant: 'default' },
    upcoming: { label: 'Upcoming', variant: 'secondary' },
    pending: { label: 'Pending', variant: 'outline' },
    past: { label: 'Past', variant: 'secondary' },
    declined: { label: 'Closed', variant: 'destructive' },
  }
  const x = map[phase]
  return <Badge variant={x.variant}>{x.label}</Badge>
}

export default function RentalsPage() {
  const renterId = getDemoRenterId()
  const load = useCallback(
    () => fetchRentalSummariesForRenter(renterId),
    [renterId]
  )
  const { data: summaries, loading, error, refetch } = useMockQuery(load)

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="My rentals"
          description="Booking requests and active stays tied to your demo account. Data loads through the mock API layer (replace with real endpoints later)."
          actions={
            <Button asChild>
              <Link href="/search">
                <Search className="mr-2 h-4 w-4" />
                Find a place
              </Link>
            </Button>
          }
        />

        <p className="mb-6 text-xs text-muted-foreground">
          Demo renter ID:{' '}
          <code className="rounded bg-muted px-1.5 py-0.5">{renterId}</code>
        </p>

        {loading && <LoadingState label="Loading your rentals…" />}
        {error && (
          <EmptyState
            title="Something went wrong"
            description={error}
            icon={Building2}
          >
            <Button onClick={() => refetch()}>Retry</Button>
          </EmptyState>
        )}
        {!loading && !error && summaries && summaries.length === 0 && (
          <EmptyState
            title="No rentals yet"
            description="When you request a mess, flat, or hostel seat, it will show up here."
            icon={Building2}
          >
            <Button asChild>
              <Link href="/search">Browse listings</Link>
            </Button>
          </EmptyState>
        )}
        {!loading && !error && summaries && summaries.length > 0 && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {summaries.map(({ booking, phase }) => (
              <Card
                key={booking.id}
                className="overflow-hidden border-border/80"
              >
                <div className="relative h-40 w-full bg-muted">
                  {booking.propertyImage ? (
                    <Image
                      src={booking.propertyImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">
                      🏠
                    </div>
                  )}
                  <div className="absolute right-2 top-2">
                    {phaseBadge(phase)}
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-snug">
                      {booking.propertyName}
                    </CardTitle>
                    <Badge variant="outline" className="shrink-0 capitalize">
                      {booking.propertyType}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{booking.propertyAddress}</span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {booking.moveInDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Move-in:{' '}
                          {new Date(booking.moveInDate).toLocaleDateString(
                            'en-BD',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </div>
                    )}
                    <div className="font-semibold text-primary">
                      ৳{booking.rent.toLocaleString()}/mo
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 border-t pt-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/messages?propertyId=${booking.propertyId}`}>
                        <MessageCircle className="mr-1.5 h-4 w-4" />
                        Chat
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${booking.ownerPhone}`}>
                        <Phone className="mr-1.5 h-4 w-4" />
                        Owner
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/my-bookings">Booking details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageContainer>
    </Layout>
  )
}
