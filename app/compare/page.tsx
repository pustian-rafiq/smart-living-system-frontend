'use client'

import { Suspense, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('property.compare')
  const tf = useTranslations('search.page.filters')
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
        title={t('emptyTitle')}
        description={t('emptyDesc')}
        icon={GitCompareArrows}
      >
        <Button asChild>
          <Link href="/search">{t('goToSearch')}</Link>
        </Button>
      </EmptyState>
    )
  }

  if (loading) return <LoadingState label={t('loading')} />
  if (error || !properties?.length) {
    return (
      <EmptyState
        title={t('errorTitle')}
        description={error || t('errorDesc')}
        icon={GitCompareArrows}
      >
        <Button asChild>
          <Link href="/search">{t('backToSearch')}</Link>
        </Button>
      </EmptyState>
    )
  }

  const rows: {
    label: string
    get: (p: Property) => ReactNode
  }[] = [
    {
      label: t('fields.rent'),
      get: p => (
        <span className="font-bold text-primary">
          ৳{p.rent.toLocaleString()}
          {t('perMonth')}
        </span>
      ),
    },
    {
      label: t('fields.type'),
      get: p => <span className="capitalize">{p.type}</span>,
    },
    {
      label: t('fields.location'),
      get: p => (
        <span>
          {p.area}, {p.city}
        </span>
      ),
    },
    {
      label: t('fields.rating'),
      get: p =>
        p.rating != null && p.reviewCount ? (
          <RatingDisplay rating={p.rating} size="sm" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground" />
        ),
    },
    {
      label: t('fields.verified'),
      get: p =>
        p.verified ? (
          <Check className="h-4 w-4 text-emerald-600" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground" />
        ),
    },
    {
      label: t('instantBook'),
      get: p =>
        p.instantBook ? (
          <Check className="h-4 w-4 text-emerald-600" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground" />
        ),
    },
    {
      label: t('fields.available'),
      get: p => (p.available ? t('yes') : t('no')),
    },
    {
      label: t('fields.gender'),
      get: p => (p.gender ? <span className="capitalize">{p.gender}</span> : '—'),
    },
    {
      label: t('seat'),
      get: p =>
        p.seatType ? <span className="capitalize">{p.seatType}</span> : '—',
    },
    {
      label: t('meals'),
      get: p =>
        p.mealIncluded
          ? `${t('yes')}${p.mealCost ? ` (+৳${p.mealCost})` : ''}`
          : t('no'),
    },
    {
      label: t('deposit'),
      get: p =>
        t('months', {
          count: p.depositMonths ?? (p.type === 'apartment' ? 2 : 1),
        }),
    },
    {
      label: tf('furnishing'),
      get: p =>
        p.furnishing ? (
          <span className="capitalize">{p.furnishing}</span>
        ) : (
          '—'
        ),
    },
    {
      label: tf('parking'),
      get: p => (p.parking ? t('yes') : t('no')),
    },
    {
      label: tf('security'),
      get: p => (p.security ? t('yes') : t('no')),
    },
    {
      label: t('facilities'),
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
                  {t('viewListing')}
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
  const t = useTranslations('property.compare')
  const tc = useTranslations('common')

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title={t('title')}
          description={t('description')}
          actions={
            <Button variant="outline" asChild>
              <Link href="/search">{t('addMoreFromSearch')}</Link>
            </Button>
          }
        />
        <Suspense fallback={<LoadingState label={tc('loading')} />}>
          <CompareContent />
        </Suspense>
      </PageContainer>
    </Layout>
  )
}
