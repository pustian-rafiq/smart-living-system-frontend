'use client'

import { Suspense, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  EmptyState,
  LoadingState,
} from '@/components/page'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RatingDisplay } from '@/components/hotel/RatingDisplay'
import { VerificationBadge } from '@/components/property/VerificationBadge'
import { useMockQuery } from '@/hooks/useMockQuery'
import { fetchPropertiesByIds } from '@/lib/api/properties'
import { Check, Minus, GitCompareArrows } from 'lucide-react'
import Image from 'next/image'
import type { Property } from '@/types/property'
import type { ReactNode } from 'react'

function CompareContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ids = useMemo(
    () =>
      (searchParams.get('ids') || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .slice(0, 3),
    [searchParams]
  )

  const load = useCallback(() => fetchPropertiesByIds(ids), [ids])
  const { data: properties, loading, error } = useMockQuery(load)

  if (!ids.length) {
    return (
      <EmptyState
        title="Nothing to compare"
        description="Select 2–3 listings from search using the compare checkbox."
        icon={GitCompareArrows}
      >
        <Button asChild>
          <Link href="/search">Go to search</Link>
        </Button>
      </EmptyState>
    )
  }

  if (loading) return <LoadingState label="Loading comparison…" />
  if (error || !properties?.length) {
    return (
      <EmptyState
        title="Could not load listings"
        description={error || 'Try selecting listings again.'}
        icon={GitCompareArrows}
      >
        <Button asChild>
          <Link href="/search">Back to search</Link>
        </Button>
      </EmptyState>
    )
  }

  const rows: {
    label: string
    get: (p: Property) => ReactNode
  }[] = [
    {
      label: 'Rent',
      get: p => (
        <span className="font-bold text-primary">
          ৳{p.rent.toLocaleString()}/mo
        </span>
      ),
    },
    {
      label: 'Type',
      get: p => <span className="capitalize">{p.type}</span>,
    },
    {
      label: 'Location',
      get: p => (
        <span>
          {p.area}, {p.city}
        </span>
      ),
    },
    {
      label: 'Rating',
      get: p =>
        p.rating != null && p.reviewCount ? (
          <RatingDisplay rating={p.rating} size="sm" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground" />
        ),
    },
    {
      label: 'Verified',
      get: p =>
        p.verified ? (
          <Check className="h-4 w-4 text-emerald-600" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground" />
        ),
    },
    {
      label: 'Instant book',
      get: p =>
        p.instantBook ? (
          <Check className="h-4 w-4 text-emerald-600" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground" />
        ),
    },
    {
      label: 'Available',
      get: p => (p.available ? 'Yes' : 'No'),
    },
    {
      label: 'Gender',
      get: p => (p.gender ? <span className="capitalize">{p.gender}</span> : '—'),
    },
    {
      label: 'Seat',
      get: p =>
        p.seatType ? <span className="capitalize">{p.seatType}</span> : '—',
    },
    {
      label: 'Meals',
      get: p =>
        p.mealIncluded
          ? `Yes${p.mealCost ? ` (+৳${p.mealCost})` : ''}`
          : 'No',
    },
    {
      label: 'Deposit',
      get: p =>
        `${p.depositMonths ?? (p.type === 'apartment' ? 2 : 1)} month(s)`,
    },
    {
      label: 'Furnishing',
      get: p =>
        p.furnishing ? (
          <span className="capitalize">{p.furnishing}</span>
        ) : (
          '—'
        ),
    },
    {
      label: 'Parking',
      get: p => (p.parking ? 'Yes' : 'No'),
    },
    {
      label: 'Security',
      get: p => (p.security ? 'Yes' : 'No'),
    },
    {
      label: 'Facilities',
      get: p => (
        <div className="flex flex-wrap gap-1">
          {p.facilities.slice(0, 6).map((f: string) => (
            <Badge key={f} variant="outline" className="text-xs">
              {f}
            </Badge>
          ))}
        </div>
      ),
    },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-32 bg-background p-3 text-left font-medium text-muted-foreground" />
            {properties.map(p => (
              <th key={p.id} className="min-w-[200px] p-3 text-left align-top">
                <div className="relative mb-3 h-28 w-full overflow-hidden rounded-lg bg-muted">
                  {p.images[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  )}
                </div>
                <Link
                  href={`/listings/${p.id}`}
                  className="font-semibold hover:text-primary"
                >
                  {p.name}
                </Link>
                <div className="mt-1">
                  <VerificationBadge
                    verified={p.verified}
                    verificationStatus={p.verificationStatus}
                  />
                </div>
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => router.push(`/listings/${p.id}`)}
                >
                  View listing
                </Button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.label} className="border-t">
              <th className="sticky left-0 bg-background p-3 text-left font-medium text-muted-foreground">
                {row.label}
              </th>
              {properties.map(p => (
                <td key={p.id} className="p-3 align-top">
                  {row.get(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ComparePage() {
  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="Compare listings"
          description="Side-by-side comparison to pick the best mess, hostel, or apartment."
          actions={
            <Button variant="outline" asChild>
              <Link href="/search">Add more from search</Link>
            </Button>
          }
        />
        <Suspense fallback={<LoadingState label="Loading…" />}>
          <CompareContent />
        </Suspense>
      </PageContainer>
    </Layout>
  )
}
