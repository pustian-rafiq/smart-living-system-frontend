'use client'

import { useTranslations } from 'next-intl'
import { Progress } from '@/components/ui/progress'
import type { VerificationScore } from '@/types/living'

export function VerificationScoreCard({
  score,
}: {
  score: VerificationScore
}) {
  const t = useTranslations('living.verification')

  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm font-semibold">{t('title')}</p>
      <p className="mt-1 text-2xl font-bold text-primary">{score.score}%</p>
      <p className="text-xs text-muted-foreground">{score.label}</p>
      {score.signals && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[
            ['addressVerified', 'Address'],
            ['photosVerified', 'Photos'],
            ['rentVerified', 'Rent'],
            ['ownerNidVerified', 'NID'],
          ].map(([key, label]) => {
            const ok = Boolean(score.signals?.[key as keyof typeof score.signals])
            return (
              <span
                key={key}
                className={`rounded-md border px-1.5 py-0.5 text-[10px] ${
                  ok
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {label} {ok ? '✓' : '—'}
              </span>
            )
          })}
        </div>
      )}
      <ul className="mt-3 space-y-2">
        {score.breakdown.map(item => (
          <li key={item.key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span>{item.label}</span>
              <span className="text-muted-foreground">
                {t('earned', { earned: item.earned, max: item.max })}
              </span>
            </div>
            <Progress
              value={item.max ? (item.earned / item.max) * 100 : 0}
              className="h-1.5"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
