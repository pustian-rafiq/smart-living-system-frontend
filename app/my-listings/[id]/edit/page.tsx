'use client'

import { useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
        <PageHeader
          title="Edit listing"
          description="Update details, photos, and publish status."
        />
        {loading && <LoadingState label="Loading listing…" />}
        {(error || (!loading && !listing)) && (
          <EmptyState
            title="Listing not found"
            description={error || 'This listing does not exist.'}
            icon={Home}
          >
            <Button asChild>
              <Link href="/my-listings">Back</Link>
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
