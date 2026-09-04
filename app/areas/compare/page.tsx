'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader, LoadingState } from '@/components/page'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMockQuery } from '@/hooks/useMockQuery'
import { useAppFormat } from '@/hooks/useAppFormat'
import { fetchAreaCompare, fetchAreas } from '@/lib/api/discover'
import type { AreaSummary } from '@/types/living'

export default function AreaComparePage() {
  const t = useTranslations('living.areas')
  const { formatCurrency } = useAppFormat()
  const loadAreas = useCallback(() => fetchAreas(), [])
  const { data: areaOptions, loading: areasLoading } = useMockQuery(loadAreas)
  const [areaA, setAreaA] = useState('Mohammadpur')
  const [areaB, setAreaB] = useState('Mirpur')
  const [queryAreas, setQueryAreas] = useState<string[] | null>(['Mohammadpur', 'Mirpur'])

  const loadCompare = useCallback(() => {
    if (!queryAreas || queryAreas.length < 2) {
      return Promise.resolve({ ok: true as const, data: null })
    }
    return fetchAreaCompare(queryAreas)
  }, [queryAreas])
  const { data: comparison, loading } = useMockQuery(loadCompare)

  const options = useMemo(() => {
    const names = new Set(
      (areaOptions || []).map(item => item.area).filter(Boolean),
    )
    ;['Mohammadpur', 'Mirpur', 'Dhanmondi', 'Uttara', 'Gulshan', 'Banani'].forEach(
      name => names.add(name),
    )
    return Array.from(names).sort()
  }, [areaOptions])

  const runCompare = () => {
    if (!areaA || !areaB || areaA === areaB) return
    setQueryAreas([areaA, areaB])
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader title={t('title')} description={t('description')} />

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <p className="text-sm font-medium">{t('areaA')}</p>
            <Select value={areaA} onValueChange={setAreaA}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map(name => (
                  <SelectItem key={`a-${name}`} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-1.5">
            <p className="text-sm font-medium">{t('areaB')}</p>
            <Select value={areaB} onValueChange={setAreaB}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map(name => (
                  <SelectItem key={`b-${name}`} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={runCompare} disabled={areasLoading}>
            {t('compare')}
          </Button>
        </div>

        {loading ? (
          <LoadingState label={t('compare')} />
        ) : !comparison ? (
          <p className="text-sm text-muted-foreground">{t('pickTwo')}</p>
        ) : (
          <div className="space-y-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 pr-4 font-medium" />
                    {comparison.areas.map(area => (
                      <th key={area.area} className="py-2 pr-4 font-semibold">
                        {area.area}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <MetricRow
                    label={t('listings')}
                    areas={comparison.areas}
                    get={a => String(a.listingCount)}
                  />
                  <MetricRow
                    label={t('avgRent')}
                    areas={comparison.areas}
                    get={a => formatCurrency(a.averageRent)}
                  />
                  <MetricRow
                    label={t('verified')}
                    areas={comparison.areas}
                    get={a => `${a.verifiedPercent}%`}
                  />
                  <MetricRow
                    label={t('security')}
                    areas={comparison.areas}
                    get={a => `${a.securityPercent}%`}
                  />
                  <MetricRow
                    label={t('parking')}
                    areas={comparison.areas}
                    get={a => `${a.parkingPercent}%`}
                  />
                  <MetricRow
                    label={t('rating')}
                    areas={comparison.areas}
                    get={a => (a.averageRating ? a.averageRating.toFixed(1) : '—')}
                  />
                  <MetricRow
                    label={t('transport')}
                    areas={comparison.areas}
                    get={a => `${a.transportScore}`}
                  />
                  <MetricRow
                    label={t('market')}
                    areas={comparison.areas}
                    get={a => `${a.marketAccess}`}
                  />
                  <MetricRow
                    label={t('safety')}
                    areas={comparison.areas}
                    get={a => `${a.safetyScore}`}
                  />
                  <MetricRow
                    label={t('livingCost')}
                    areas={comparison.areas}
                    get={a =>
                      a.livingCost ? formatCurrency(a.livingCost.total) : '—'
                    }
                  />
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm font-semibold">{t('recommendation')}</p>
              <p className="mt-2 text-lg font-bold">
                {comparison.recommendation.area}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {comparison.recommendation.reason}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {comparison.areas.map(area => (
                <Button key={area.area} variant="outline" asChild>
                  <Link
                    href={
                      area.city
                        ? `/areas/${encodeURIComponent(area.city)}`
                        : `/search`
                    }
                  >
                    {t('openArea')}: {area.area}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}
      </PageContainer>
    </Layout>
  )
}

function MetricRow({
  label,
  areas,
  get,
}: {
  label: string
  areas: AreaSummary[]
  get: (area: AreaSummary) => string
}) {
  return (
    <tr className="border-b last:border-0">
      <td className="py-2.5 pr-4 text-muted-foreground">{label}</td>
      {areas.map(area => (
        <td key={`${label}-${area.area}`} className="py-2.5 pr-4 font-medium">
          {get(area)}
        </td>
      ))}
    </tr>
  )
}
