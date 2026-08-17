import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo/build-metadata'
import { getLocale } from 'next-intl/server'
import type { AppLocale } from '@/lib/i18n/config'
import type { Hotel } from '@/types/hotel'

const DEFAULT_API_BASE = 'http://127.0.0.1:8000/api/v1'

function apiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (!raw) return DEFAULT_API_BASE
  return raw.replace(/\/$/, '')
}

async function findHotel(id: string): Promise<Hotel | null> {
  try {
    const res = await fetch(`${apiBase()}/hotels/${id}/`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const json = (await res.json()) as { ok?: boolean; data?: Hotel }
    if (json.ok && json.data) return json.data
  } catch {
    /* API unavailable during build — page client handles empty state */
  }
  return null
}

type Props = { children: React.ReactNode; params: Promise<{ hotelId: string }> }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hotelId: string }>
}): Promise<Metadata> {
  const { hotelId } = await params
  const hotel = await findHotel(hotelId)
  const locale = (await getLocale()) as AppLocale

  if (!hotel) {
    return buildMetadata({
      title: 'Hotel',
      description: 'Hotel details on Smart Living.',
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
    images: hotel.images[0]
      ? [{ url: hotel.images[0], alt: hotel.name }]
      : undefined,
  })
}

export default async function HotelDetailLayout({ children }: Props) {
  return children
}
