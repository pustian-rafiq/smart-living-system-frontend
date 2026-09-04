'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

const KEYS = ['water', 'electricity', 'wifi', 'breakfast', 'lunch', 'dinner'] as const

const DOT: Record<string, string> = {
  ok: 'bg-emerald-500',
  warn: 'bg-amber-500',
  down: 'bg-rose-500',
}

export function MessLiveStatusBoard({
  status,
  updatedAt,
  editable,
  onChange,
}: {
  status: Record<string, string>
  updatedAt?: string | null
  editable?: boolean
  onChange?: (key: string, value: 'ok' | 'warn' | 'down') => void
}) {
  const t = useTranslations('living.liveStatus')
  const cycle = (key: string, current: string) => {
    if (!editable || !onChange) return
    const order = ['ok', 'warn', 'down'] as const
    const next = order[(order.indexOf(current as 'ok') + 1) % order.length]
    onChange(key, next)
  }

  return (
    <div className="rounded-xl border p-4">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="font-semibold">{t('title')}</h3>
        {updatedAt && (
          <p className="text-xs text-muted-foreground">
            {t('updated', { time: new Date(updatedAt).toLocaleString() })}
          </p>
        )}
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {KEYS.map(key => {
          const value = status[key] || 'ok'
          return (
            <li key={key}>
              <button
                type="button"
                disabled={!editable}
                onClick={() => cycle(key, value)}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm',
                  editable && 'hover:bg-muted/50',
                )}
              >
                <span>{t(key)}</span>
                <span className="inline-flex items-center gap-2">
                  <span className={cn('h-2.5 w-2.5 rounded-full', DOT[value] || DOT.ok)} />
                  {t(value)}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {editable && (
        <p className="mt-2 text-xs text-muted-foreground">{t('tapHint')}</p>
      )}
    </div>
  )
}
