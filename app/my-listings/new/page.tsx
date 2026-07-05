'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader } from '@/components/page'
import { PublishListingWizard } from '@/components/property/PublishListingWizard'
import { createListing } from '@/lib/api/properties'
import type { PropertyListingInput } from '@/types/property'

export default function NewListingPage() {
  const router = useRouter()
  const t = useTranslations('portfolio.listings')

  const handleSubmit = async (input: PropertyListingInput) => {
    const result = await createListing(input)
    if (!result.ok) throw new Error(result.error)
    router.push('/my-listings')
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader title={t('newTitle')} description={t('newDesc')} />
        <PublishListingWizard
          onSubmit={handleSubmit}
          onCancel={() => router.push('/my-listings')}
        />
      </PageContainer>
    </Layout>
  )
}
