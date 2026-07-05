import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import '@/data/mockReviews'
import { getPropertyById, mockProperties } from '@/data/mockProperties'
import { ListingDetailClient } from './ListingDetailClient'

type Props = { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return mockProperties.map(p => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const property = getPropertyById(id)
  if (!property) {
    return {
      title: 'Listing not found | Smart Living System',
      description: 'This accommodation listing could not be found.',
    }
  }

  const title = `${property.name} in ${property.area}, ${property.city}`
  const description =
    property.description.length > 155
      ? `${property.description.slice(0, 152)}…`
      : property.description
  const priceLine = `৳${property.rent.toLocaleString()}/month · ${property.type}`

  return {
    title: `${title} | Smart Living Bangladesh`,
    description: `${priceLine}. ${description}`,
    openGraph: {
      title,
      description: `${priceLine}. ${description}`,
      type: 'website',
      locale: 'en_BD',
      images: property.images[0]
        ? [{ url: property.images[0], alt: property.name }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: priceLine,
      images: property.images[0] ? [property.images[0]] : [],
    },
    alternates: {
      canonical: `/listings/${property.id}`,
    },
    keywords: [
      property.type,
      property.city,
      property.area,
      'rent Bangladesh',
      'mess',
      'hostel',
      'apartment',
      property.verified ? 'verified listing' : '',
    ].filter(Boolean),
  }
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params
  const property = getPropertyById(id)
  if (!property) notFound()
  return <ListingDetailClient id={id} />
}
