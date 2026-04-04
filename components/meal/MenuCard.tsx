'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, UtensilsCrossed } from 'lucide-react'
import type { DailyMenu, MealItem } from '@/types/meal'
import { format } from 'date-fns'

interface MenuCardProps {
  menu: DailyMenu
  mealTiming?: {
    breakfast?: { startTime: string; endTime: string; enabled: boolean }
    lunch?: { startTime: string; endTime: string; enabled: boolean }
    dinner?: { startTime: string; endTime: string; enabled: boolean }
    snack?: { startTime: string; endTime: string; enabled: boolean }
  }
}

const categoryLabels = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
}

export function MenuCard({ menu, mealTiming }: MenuCardProps) {
  const renderMealItems = (items: MealItem[] | undefined, category: string) => {
    if (!items || items.length === 0) return null

    const timing = mealTiming?.[category as keyof typeof mealTiming]

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4" />
            {categoryLabels[category as keyof typeof categoryLabels]}
          </h4>
          {timing && timing.enabled && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {timing.startTime} - {timing.endTime}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between rounded-lg border p-2 bg-muted/30"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{item.name}</p>
                  {item.isSpecial && (
                    <Badge variant="outline" className="text-xs">
                      Special
                    </Badge>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </p>
                )}
              </div>
              {item.price && (
                <p className="text-sm font-semibold text-primary">
                  ৳{item.price}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{format(new Date(menu.date), 'EEEE, MMMM dd, yyyy')}</span>
          <Badge variant="outline">
            {format(new Date(menu.date), 'MMM dd')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderMealItems(menu.breakfast, 'breakfast')}
        {renderMealItems(menu.lunch, 'lunch')}
        {renderMealItems(menu.snack, 'snack')}
        {renderMealItems(menu.dinner, 'dinner')}
        {menu.notes && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-sm font-medium text-primary">Note:</p>
            <p className="text-sm text-muted-foreground mt-1">{menu.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
