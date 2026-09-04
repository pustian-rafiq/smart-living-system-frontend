'use client'

import { useTranslations } from 'next-intl'
import { Progress } from '@/components/ui/progress'
import type { VerificationScore } from '@/types/living'

export function ScoreBreakdownCard({
  title,
  score,
}: {
  title: string
  score: VerificationScore
}) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-2xl font-bold text-primary">{score.score}/100</p>
      <p className="text-xs text-muted-foreground">{score.label}</p>
      <ul className="mt-3 space-y-2">
        {score.breakdown.map(item => (
          <li key={item.key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span>{item.label}</span>
              <span className="text-muted-foreground">
                {item.earned}/{item.max}
              </span>
            </div>
            <Progress
              value={item.max ? (Number(item.earned) / Number(item.max)) * 100 : 0}
              className="h-1.5"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LivingConditionCard({
  score,
}: {
  score: VerificationScore
}) {
  const t = useTranslations('living.condition')
  return <ScoreBreakdownCard title={t('title')} score={score} />
}

export function SafetyScoreCard({ score }: { score: VerificationScore }) {
  const t = useTranslations('living.safety')
  return <ScoreBreakdownCard title={t('title')} score={score} />
}
