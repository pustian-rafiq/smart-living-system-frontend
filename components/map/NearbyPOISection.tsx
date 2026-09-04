'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useMockQuery } from '@/hooks/useMockQuery'
import { fetchNearbyPOIs } from '@/lib/api/discover'
import type { POICategory } from '@/types/living'
import {
  Bus,
  GraduationCap,
  Hospital,
  Landmark,
  ShoppingBag,
  TrainFront,
} from 'lucide-react'

const CATEGORIES: POICategory[] = [
  'hospital',
  'school',
  'market',
  'mosque',
  'bus',
  'metro',
]

const ICONS = {
  hospital: Hospital,
  school: GraduationCap,
  market: ShoppingBag,
  mosque: Landmark,
  bus: Bus,
  metro: TrainFront,
}

export function NearbyPOISection({
  lat,
  lng,
}: {
  lat?: number
  lng?: number
}) {
  const t = useTranslations('living.poi')
  const canQuery = lat != null && lng != null
  const load = useCallback(
    () =>
      canQuery
        ? fetchNearbyPOIs(lat, lng)
        : Promise.resolve({ ok: true as const, data: null }),
    [canQuery, lat, lng],
  )
  const { data, loading } = useMockQuery(load)

  if (!canQuery) {
    return (
      <section>
        <h2 className="mb-2 text-lg font-semibold">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      </section>
    )
  }

  const pois = data?.pois
  const hasAny = pois
    ? CATEGORIES.some(key => (pois[key] || []).length > 0)
    : false

  return (
    <section>
      <h2 className="mb-1 text-lg font-semibold">{t('title')}</h2>
      <p className="mb-4 text-sm text-muted-foreground">{t('subtitle')}</p>
      {loading ? (
        <p className="text-sm text-muted-foreground">{t('loading')}</p>
      ) : !hasAny ? (
        <p className="text-sm text-muted-foreground">{t('none')}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map(key => {
            const items = pois?.[key] || []
            if (!items.length) return null
            const Icon = ICONS[key]
            return (
              <div key={key}>
                <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Icon className="h-4 w-4 text-primary" />
                  {t(key)}
                </p>
                <ul className="space-y-1.5 text-sm">
                  {items.slice(0, 4).map(item => (
                    <li key={`${item.name}-${item.lat}`}>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-foreground hover:underline"
                      >
                        {item.name}
                      </a>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {t('meters', { m: item.distanceM })}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
