'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  LoadingState,
  EmptyState,
} from '@/components/page'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/property/PropertyCard'
import { useMockQuery } from '@/hooks/useMockQuery'
import { fetchAreaSeoDetail } from '@/lib/api/areas'
import { MapPin } from 'lucide-react'

export default function AreaMessLandingPage() {
  const params = useParams()
  const city = String(params.city || '')
  const area = String(params.area || '')
  const t = useTranslations('living.areasSeo')

  const load = useCallback(
    () => fetchAreaSeoDetail(city, area, 'mess'),
    [city, area],
  )
  const { data, loading } = useMockQuery(load)

  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <LoadingState label={t('loading')} />
        </PageContainer>
      </Layout>
    )
  }

  if (!data?.area) {
    return (
      <Layout>
        <PageContainer>
          <EmptyState
            icon={MapPin}
            title={t('notFound')}
            description={t('notFoundDesc')}
          >
            <Button asChild variant="outline">
              <Link href="/areas">{t('back')}</Link>
            </Button>
          </EmptyState>
        </PageContainer>
      </Layout>
    )
  }

  const { area: meta, listings } = data

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title={t('messTitle', { area: meta.area, city: meta.city })}
          description={t('messDesc', { area: meta.area, city: meta.city })}
          actions={
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/areas">{t('allAreas')}</Link>
              </Button>
              <Button asChild size="sm">
                <Link
                  href={`/search?city=${encodeURIComponent(meta.city)}&area=${encodeURIComponent(meta.area)}&type=mess`}
                >
                  {t('searchAll')}
                </Link>
              </Button>
            </div>
          }
        />
        {listings.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title={t('noListings')}
            description={t('noListingsDesc')}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={p => {
                  window.location.href = `/listings/${p.id}`
                }}
                onCall={phone => {
                  window.location.href = `tel:${phone}`
                }}
              />
            ))}
          </div>
        )}
      </PageContainer>
    </Layout>
  )
}
