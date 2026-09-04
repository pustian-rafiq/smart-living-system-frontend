'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { MessUtilities } from '@/types/mess'
import { Droplets, Zap } from 'lucide-react'

function ScoreRing({ score, tone }: { score: number; tone: 'water' | 'power' }) {
  const color =
    tone === 'water'
      ? score >= 75
        ? 'text-sky-700'
        : 'text-amber-700'
      : score >= 75
        ? 'text-amber-700'
        : 'text-orange-700'
  return (
    <div className={`text-3xl font-bold tabular-nums ${color}`}>
      {score}
      <span className="text-base font-medium text-muted-foreground">%</span>
    </div>
  )
}

export function MessUtilitiesBoard({ utilities }: { utilities: MessUtilities }) {
  const t = useTranslations('mess.publicDetail')
  const water = utilities.water
  const power = utilities.electricity

  return (
    <Card className="border-sky-900/10 bg-gradient-to-br from-sky-50/70 via-white to-amber-50/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{t('utilitiesTitle')}</CardTitle>
        <p className="text-sm text-muted-foreground">{t('utilitiesSubtitle')}</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-sky-100 bg-white/80 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="flex items-center gap-2 font-semibold">
                <Droplets className="h-4 w-4 text-sky-600" />
                {t('waterReliability')}
              </p>
              <Badge variant="outline">{water.label}</Badge>
            </div>
            <ScoreRing score={water.score} tone="water" />
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              <li>
                {t('availability')}: {water.profile.availability || '—'}
              </li>
              <li>
                {t('source')}: {water.profile.source || '—'}
              </li>
              <li>
                {t('filter')}: {water.profile.hasFilter ? t('yes') : t('no')}
              </li>
              <li>
                {t('backup')}: {water.profile.hasBackup ? t('yes') : t('no')}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-amber-100 bg-white/80 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="flex items-center gap-2 font-semibold">
                <Zap className="h-4 w-4 text-amber-600" />
                {t('electricReliability')}
              </p>
              <Badge variant="outline">{power.label}</Badge>
            </div>
            <ScoreRing score={power.score} tone="power" />
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              <li>
                {t('availability')}: {power.profile.availability || '—'}
              </li>
              <li>
                IPS: {power.profile.hasIps ? t('yes') : t('no')}
              </li>
              <li>
                {t('generator')}:{' '}
                {power.profile.hasGenerator ? t('yes') : t('no')}
              </li>
              <li>
                {t('loadShedding')}: {power.profile.loadSheddingLevel || '—'}
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
