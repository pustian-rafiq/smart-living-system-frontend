'use client'

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/format/locale'
import type { MessMealCalendar, MessMealDay } from '@/types/mess'
import { Coffee, Moon, Sun, Utensils } from 'lucide-react'

const mealIcons = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Utensils,
} as const

/** Display labels only — never raw {id, name} blobs. */
function mealLabels(items: unknown): string[] {
  if (!Array.isArray(items)) return []
  return items
    .map(item => {
      if (typeof item === 'string') {
        const trimmed = item.trim()
        if (trimmed.startsWith('{') && trimmed.includes('name')) {
          const match = trimmed.match(/['"]name['"]\s*:\s*['"]([^'"]+)['"]/)
          if (match?.[1]) return match[1]
        }
        return trimmed
      }
      if (item && typeof item === 'object' && 'name' in item) {
        return String((item as { name?: string }).name || '').trim()
      }
      return ''
    })
    .filter(Boolean)
}

function dayMealLine(day: MessMealDay): string {
  const lunch = mealLabels(day.lunch)
  const dinner = mealLabels(day.dinner)
  const breakfast = mealLabels(day.breakfast)
  const primary = [...lunch, ...dinner].slice(0, 3)
  if (primary.length) return primary.join(', ')
  return breakfast.join(', ')
}

export function MessPublicMealCalendar({
  calendar,
}: {
  calendar: MessMealCalendar
}) {
  const t = useTranslations('mess.publicDetail')
  const system = calendar.mealSystem
  const today = calendar.today

  return (
    <Card className="overflow-hidden border-emerald-900/10 bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/50">
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Utensils className="h-5 w-5 text-emerald-700" />
              {t('mealSystemTitle')}
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {t('mealSystemSubtitle')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {t('mealsPerDay', { count: system.mealsPerDay })}
            </Badge>
            {system.vegetarianOption ? (
              <Badge variant="outline">{t('vegetarianYes')}</Badge>
            ) : null}
            {system.guestMealPrice != null ? (
              <Badge className="bg-emerald-700 hover:bg-emerald-700">
                {t('guestMeal', { price: formatCurrency(system.guestMealPrice) })}
              </Badge>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {today ? (
          <div className="rounded-xl border border-emerald-900/10 bg-white/70 p-4">
            <p className="mb-3 text-sm font-semibold text-emerald-900">
              {t('todayMenu')}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {(['breakfast', 'lunch', 'dinner'] as const).map(key => {
                const Icon = mealIcons[key]
                const items = mealLabels(today[key])
                return (
                  <div key={key} className="rounded-lg bg-muted/40 p-3">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" />
                      {t(key)}
                    </p>
                    <p className="text-sm leading-snug">
                      {items.length ? items.join(' · ') : t('menuEmpty')}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}

        <div>
          <p className="mb-2 text-sm font-semibold">{t('weekCalendar')}</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
            {calendar.calendar.map(day => {
              const label = day.date.slice(5)
              const line = dayMealLine(day)
              const filled = Boolean(line)
              return (
                <div
                  key={day.date}
                  className={`rounded-lg border p-2 text-xs ${
                    filled
                      ? 'border-emerald-200 bg-white'
                      : 'border-dashed border-muted-foreground/20 bg-muted/20'
                  }`}
                >
                  <p className="mb-1 font-medium">{label}</p>
                  <p className="line-clamp-3 text-muted-foreground">
                    {filled ? line : t('menuEmpty')}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {(system.mealMonthlyCharge != null || system.mealOffPolicy) && (
          <div className="space-y-1 text-sm text-muted-foreground">
            {system.mealMonthlyCharge != null ? (
              <p>
                {t('mealMonthlyCharge')}:{' '}
                <span className="font-medium text-foreground">
                  {formatCurrency(system.mealMonthlyCharge)}
                </span>
              </p>
            ) : null}
            {system.mealOffPolicy ? (
              <p>
                {t('mealOffPolicy')}: {system.mealOffPolicy}
              </p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
