'use client'

/**
 * Bangladesh weekly menu grid (Sat → Fri).
 * Module path bumped from WeeklyMenuView to bust stale HMR clients.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { MealDay, MealItem, WeeklySchedule } from '@/types/meal'
import { format, addDays } from 'date-fns'
import { BD_WEEK_DAYS, bdStartOfWeek } from '@/lib/format/bangladesh'
import { useAppFormat } from '@/hooks/useAppFormat'

interface WeeklyMenuBoardProps {
  schedule: WeeklySchedule
  mealTiming?: {
    breakfast?: { startTime: string; endTime: string; enabled: boolean }
    lunch?: { startTime: string; endTime: string; enabled: boolean }
    dinner?: { startTime: string; endTime: string; enabled: boolean }
    snack?: { startTime: string; endTime: string; enabled: boolean }
  }
}

type DayMeals = {
  breakfast?: MealItem[]
  lunch?: MealItem[]
  dinner?: MealItem[]
  snack?: MealItem[]
}

function asScheduleMap(raw: unknown): Partial<Record<MealDay, DayMeals>> {
  if (!raw) return {}
  let value: unknown = raw
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value)
    } catch {
      return {}
    }
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return value as Partial<Record<MealDay, DayMeals>>
}

function mealsForDay(
  map: Partial<Record<MealDay, DayMeals>>,
  day: MealDay
): Required<Pick<DayMeals, never>> & DayMeals {
  const entry = map[day]
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return {}
  }
  return entry
}

export function WeeklyMenuBoard({ schedule, mealTiming }: WeeklyMenuBoardProps) {
  const { formatDate } = useAppFormat()
  const weekStartDate = schedule?.weekStartDate
    ? new Date(schedule.weekStartDate)
    : new Date()
  const weekEndDate = schedule?.weekEndDate
    ? new Date(schedule.weekEndDate)
    : weekStartDate
  const weekStart = bdStartOfWeek(weekStartDate)
  const scheduleMap = asScheduleMap(schedule?.schedule)

  const renderMealItems = (
    items: MealItem[] | undefined,
    category: keyof DayMeals
  ) => {
    if (!Array.isArray(items) || items.length === 0) return null
    const timing = mealTiming?.[category]

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-semibold capitalize">{category}</h5>
          {timing?.enabled && (
            <span className="text-xs text-muted-foreground">
              {timing.startTime} - {timing.endTime}
            </span>
          )}
        </div>
        <div className="space-y-1">
          {items.map((item, idx) => (
            <div
              key={item?.id || `${category}-${idx}`}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-1">
                <span>{item?.name}</span>
                {item?.isSpecial && (
                  <Badge variant="outline" className="px-1 py-0 text-xs">
                    S
                  </Badge>
                )}
              </div>
              {item?.price != null && item.price > 0 && (
                <span className="text-xs font-semibold">৳{item.price}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>Weekly Menu</span>
          <Badge variant="outline" className="w-fit">
            {formatDate(weekStartDate, { style: 'short' })} -{' '}
            {formatDate(weekEndDate, { style: 'short' })}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          {BD_WEEK_DAYS.map((day, index) => {
            const dayDate = addDays(weekStart, index)
            const meals = mealsForDay(scheduleMap, day.value)
            const hasAnyMeal =
              (meals.breakfast?.length ?? 0) > 0 ||
              (meals.lunch?.length ?? 0) > 0 ||
              (meals.snack?.length ?? 0) > 0 ||
              (meals.dinner?.length ?? 0) > 0

            return (
              <div key={day.value} className="space-y-3 rounded-lg border p-3">
                <div className="text-center">
                  <p className="text-sm font-semibold">{day.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(dayDate, 'dd/MM')}
                  </p>
                </div>
                <div className="space-y-3">
                  {renderMealItems(meals.breakfast, 'breakfast')}
                  {renderMealItems(meals.lunch, 'lunch')}
                  {renderMealItems(meals.snack, 'snack')}
                  {renderMealItems(meals.dinner, 'dinner')}
                  {!hasAnyMeal && (
                    <p className="py-2 text-center text-xs text-muted-foreground">
                      No meals
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

/** @deprecated Use WeeklyMenuBoard — kept for import compatibility during HMR. */
export const WeeklyMenuView = WeeklyMenuBoard
