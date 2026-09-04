'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader, LoadingState, EmptyState } from '@/components/page'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/property/PropertyCard'
import { useMockQuery } from '@/hooks/useMockQuery'
import { fetchUniversityDetail } from '@/lib/api/universities'
import { GraduationCap } from 'lucide-react'

export default function UniversityLandingPage() {
  const params = useParams()
  const slug = String(params.slug || '')
  const t = useTranslations('living.university')

  const load = useCallback(
    () => fetchUniversityDetail(slug, 'mess'),
    [slug],
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

  if (!data?.university) {
    return (
      <Layout>
        <PageContainer>
          <EmptyState
            icon={GraduationCap}
            title={t('notFound')}
            description={t('notFoundDesc')}
          >
            <Button asChild variant="outline">
              <Link href="/university">{t('back')}</Link>
            </Button>
          </EmptyState>
        </PageContainer>
      </Layout>
    )
  }

  const { university, listings } = data

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title={t('messTitle', { name: university.name })}
          description={t('messDesc', {
            fullName: university.fullName,
            areas: university.areas.join(', '),
          })}
          actions={
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/university">{t('allUnis')}</Link>
              </Button>
              <Button asChild size="sm">
                <Link
                  href={`/search?city=${encodeURIComponent(university.city)}&type=mess`}
                >
                  {t('searchAll')}
                </Link>
              </Button>
            </div>
          }
        />

        {listings.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
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
