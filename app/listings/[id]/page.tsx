import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPropertyById, getAllMockProperties } from '@/lib/api/properties'
import '@/data/mockReviews'
import {
  getListingMetadata,
  getListingNotFoundMetadata,
} from '@/lib/seo/get-page-metadata'
import { ListingDetailClient } from './ListingDetailClient'

type Props = { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return getAllMockProperties().map(p => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const property = getPropertyById(id)
  if (!property) {
    return getListingNotFoundMetadata()
  }
  return getListingMetadata(property)
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params
  const property = getPropertyById(id)
  if (!property) notFound()
  return <ListingDetailClient id={id} />
}
