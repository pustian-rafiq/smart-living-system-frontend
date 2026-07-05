'use client'

import { useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  EmptyState,
  LoadingState,
} from '@/components/page'
import { Button } from '@/components/ui/button'
import { PublishListingWizard } from '@/components/property/PublishListingWizard'
import { useMockQuery } from '@/hooks/useMockQuery'
import { fetchPropertyById, updateListing } from '@/lib/api/properties'
import type { PropertyListingInput } from '@/types/property'
import { Home } from 'lucide-react'
import Link from 'next/link'

export default function EditListingPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const t = useTranslations('portfolio.listings')
  const tc = useTranslations('common')
  const load = useCallback(() => fetchPropertyById(id), [id])
  const { data: listing, loading, error } = useMockQuery(load)

  const handleSubmit = async (input: PropertyListingInput) => {
    const result = await updateListing(id, input)
    if (!result.ok) throw new Error(result.error)
    router.push('/my-listings')
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader title={t('editTitle')} description={t('editDesc')} />
        {loading && <LoadingState label={t('loadingListing')} />}
        {(error || (!loading && !listing)) && (
          <EmptyState
            title={t('notFoundTitle')}
            description={error || t('notFoundEditDesc')}
            icon={Home}
          >
            <Button asChild>
              <Link href="/my-listings">{tc('back')}</Link>
            </Button>
          </EmptyState>
        )}
        {listing && (
          <PublishListingWizard
            initial={listing}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/my-listings')}
          />
        )}
      </PageContainer>
    </Layout>
  )
}
