import { permanentRedirect } from 'next/navigation'
import { fetchHotelServer } from '@/lib/seo/fetch-entity'
import { extractEntityId, hotelPath } from '@/lib/seo/slug'
import { HotelDetailClient } from './HotelDetailClient'

type Props = { params: Promise<{ hotelId: string }> }

export default async function HotelDetailPage({ params }: Props) {
  const { hotelId: param } = await params
  const hotel = await fetchHotelServer(extractEntityId(param))

  // Send `/hotels/<uuid>` and stale slugs to the canonical keyword URL.
  if (hotel) {
    const canonical = hotelPath(hotel)
    if (canonical !== `/hotels/${param}`) permanentRedirect(canonical)
  }

  return <HotelDetailClient />
}
