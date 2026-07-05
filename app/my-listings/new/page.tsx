'use client'

import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader } from '@/components/page'
import { PublishListingWizard } from '@/components/property/PublishListingWizard'
import { createListing } from '@/lib/api/properties'
import type { PropertyListingInput } from '@/types/property'

export default function NewListingPage() {
  const router = useRouter()

  const handleSubmit = async (input: PropertyListingInput) => {
    const result = await createListing(input)
    if (!result.ok) throw new Error(result.error)
    router.push('/my-listings')
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="Publish a listing"
          description="Create a public listing for mess, hostel, apartment, or hotel discovery."
        />
        <PublishListingWizard
          onSubmit={handleSubmit}
          onCancel={() => router.push('/my-listings')}
        />
      </PageContainer>
    </Layout>
  )
}
