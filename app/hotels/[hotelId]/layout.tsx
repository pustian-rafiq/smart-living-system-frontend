import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getHotelsSync } from '@/lib/api/hotels'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { getLocale } from 'next-intl/server'
import type { AppLocale } from '@/lib/i18n/config'

function findHotel(id: string) {
  return getHotelsSync().find(h => h.id === id)
}

type Props = { children: React.ReactNode; params: Promise<{ hotelId: string }> }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hotelId: string }>
}): Promise<Metadata> {
  const { hotelId } = await params
  const hotel = findHotel(hotelId)
  const locale = (await getLocale()) as AppLocale

  if (!hotel) {
    return buildMetadata({
      title: 'Hotel not found',
      description: 'This hotel listing could not be found.',
      path: `/hotels/${hotelId}`,
      locale,
      noindex: true,
    })
  }

  return buildMetadata({
    title: `${hotel.name} — ${hotel.city}`,
    description: hotel.description.slice(0, 160),
    path: `/hotels/${hotel.id}`,
    locale,
    keywords: ['hotel', hotel.city, hotel.area, 'Bangladesh', 'guest house'],
    images: hotel.images[0] ? [{ url: hotel.images[0], alt: hotel.name }] : undefined,
  })
}

export default async function HotelDetailLayout({ children, params }: Props) {
  const { hotelId } = await params
  if (!findHotel(hotelId)) notFound()
  return children
}
