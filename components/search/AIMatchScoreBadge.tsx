'use client'

import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

export function AIMatchScoreBadge({
  score,
  className,
}: {
  score: number
  className?: string
}) {
  const color =
    score >= 85
      ? 'bg-emerald-500 text-white'
      : score >= 70
        ? 'bg-blue-500 text-white'
        : score >= 50
          ? 'bg-amber-500 text-white'
          : 'bg-gray-400 text-white'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm',
        color,
        className,
      )}
    >
      <Sparkles className="h-3 w-3" />
      {Math.round(score)}% Match
    </span>
  )
}
