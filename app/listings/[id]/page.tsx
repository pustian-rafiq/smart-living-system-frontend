import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import {
  getListingMetadata,
  getListingNotFoundMetadata,
} from '@/lib/seo/get-page-metadata'
import { extractEntityId, listingPath } from '@/lib/seo/slug'
import type { Property } from '@/types/property'
import { ListingDetailClient } from './ListingDetailClient'

type Props = { params: Promise<{ id: string }> }

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://127.0.0.1:8000/api/v1'

async function fetchPropertyServer(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`${API_BASE}/properties/${id}/`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const json = (await res.json()) as {
      ok: boolean
      data?: Property
    }
    if (!json.ok || !json.data) return null
    return json.data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: param } = await params
  const property = await fetchPropertyServer(extractEntityId(param))
  if (!property) return getListingNotFoundMetadata()
  return getListingMetadata(property)
}

export default async function ListingPage({ params }: Props) {
  const { id: param } = await params
  const id = extractEntityId(param)
  const property = await fetchPropertyServer(id)
  if (!property) notFound()

  // Send `/listings/<uuid>` and stale slugs to the canonical keyword URL.
  // Middleware handles bare-id URLs; this catches stale slugs.
  const canonical = listingPath(property)
  if (canonical !== `/listings/${param}`) permanentRedirect(canonical)

  return <ListingDetailClient id={id} />
}
