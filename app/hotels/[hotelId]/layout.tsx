import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { getLocale } from 'next-intl/server'
import type { AppLocale } from '@/lib/i18n/config'
import { fetchHotelServer } from '@/lib/seo/fetch-entity'
import { extractEntityId, hotelPath } from '@/lib/seo/slug'

type Props = { children: React.ReactNode; params: Promise<{ hotelId: string }> }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hotelId: string }>
}): Promise<Metadata> {
  const { hotelId } = await params
  const hotel = await fetchHotelServer(extractEntityId(hotelId))
  const locale = (await getLocale()) as AppLocale

  if (!hotel) {
    return buildMetadata({
      title: 'Hotel',
      description: 'Hotel details on SmartBasa.',
      path: `/hotels/${hotelId}`,
      locale,
      noindex: true,
    })
  }

  return buildMetadata({
    title: `${hotel.name} — ${hotel.city}`,
    description: hotel.description.slice(0, 160),
    path: hotelPath(hotel),
    locale,
    keywords: ['hotel', hotel.city, hotel.area, 'Bangladesh', 'guest house'],
    images: hotel.images[0]
      ? [{ url: hotel.images[0], alt: hotel.name }]
      : undefined,
  })
}

export default async function HotelDetailLayout({ children }: Props) {
  return children
}
