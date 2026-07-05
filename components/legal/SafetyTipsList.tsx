'use client'

import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import type { SafetyTip } from '@/data/legalContent'
import { cn } from '@/lib/utils'

const severityStyles = {
  critical: 'border-destructive/40 bg-destructive/5',
  important: 'border-amber-500/40 bg-amber-500/5',
  tip: 'border-border bg-card',
}

const severityBadge = {
  critical: 'destructive' as const,
  important: 'secondary' as const,
  tip: 'outline' as const,
}

const severityLabel = {
  critical: 'Critical',
  important: 'Important',
  tip: 'Good to know',
}

interface SafetyTipsListProps {
  tips: SafetyTip[]
  className?: string
}

export function SafetyTipsList({ tips, className }: SafetyTipsListProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {tips.map(tip => (
        <article
          key={tip.id}
          id={tip.id}
          className={cn(
            'scroll-mt-24 rounded-xl border p-5 sm:p-6',
            severityStyles[tip.severity]
          )}
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {tip.severity === 'critical' && (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            )}
            <h3 className="text-lg font-semibold">{tip.title}</h3>
            <Badge variant={severityBadge[tip.severity]}>
              {severityLabel[tip.severity]}
            </Badge>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {tip.description}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {tip.dos && tip.dos.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Do
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {tip.dos.map((d, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-600">•</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tip.donts && tip.donts.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1 text-sm font-medium text-destructive">
                  <XCircle className="h-4 w-4" />
                  Don&apos;t
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {tip.donts.map((d, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-destructive">•</span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
