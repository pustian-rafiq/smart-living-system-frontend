'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, UtensilsCrossed } from 'lucide-react'
import type { WeeklySchedule, MealDay } from '@/types/meal'
import { format, startOfWeek, addDays } from 'date-fns'

interface WeeklyMenuViewProps {
  schedule: WeeklySchedule
  mealTiming?: {
    breakfast?: { startTime: string; endTime: string; enabled: boolean }
    lunch?: { startTime: string; endTime: string; enabled: boolean }
    dinner?: { startTime: string; endTime: string; enabled: boolean }
    snack?: { startTime: string; endTime: string; enabled: boolean }
  }
}

const daysOfWeek: { value: MealDay; label: string }[] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
]

const categoryLabels = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

export function WeeklyMenuView({ schedule, mealTiming }: WeeklyMenuViewProps) {
  const weekStart = startOfWeek(new Date(schedule.weekStartDate), { weekStartsOn: 1 })

  const renderMealItems = (items: any[] | undefined, category: string) => {
    if (!items || items.length === 0) return null

    const timing = mealTiming?.[category as keyof typeof mealTiming]

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h5 className="text-xs font-semibold capitalize">{category}</h5>
          {timing && timing.enabled && (
            <span className="text-xs text-muted-foreground">
              {timing.startTime} - {timing.endTime}
            </span>
          )}
        </div>
        <div className="space-y-1">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <span>{item.name}</span>
                {item.isSpecial && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    S
                  </Badge>
                )}
              </div>
              {item.price && (
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
        <CardTitle className="flex items-center justify-between">
          <span>Weekly Menu</span>
          <Badge variant="outline">
            {format(new Date(schedule.weekStartDate), 'MMM dd')} -{' '}
            {format(new Date(schedule.weekEndDate), 'MMM dd')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          {daysOfWeek.map((day, index) => {
            const dayDate = addDays(weekStart, index)
            const daySchedule = schedule.schedule[day.value]

            return (
              <div key={day.value} className="space-y-3 rounded-lg border p-3">
                <div className="text-center">
                  <p className="font-semibold text-sm">{day.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(dayDate, 'MMM dd')}
                  </p>
                </div>
                <div className="space-y-3">
                  {renderMealItems(daySchedule.breakfast, 'breakfast')}
                  {renderMealItems(daySchedule.lunch, 'lunch')}
                  {renderMealItems(daySchedule.snack, 'snack')}
                  {renderMealItems(daySchedule.dinner, 'dinner')}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
