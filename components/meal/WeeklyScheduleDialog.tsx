'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, X } from 'lucide-react'
import type { WeeklySchedule, MealDay } from '@/types/meal'
import { formatISO } from 'date-fns'
import {
  BD_WEEK_DAYS,
  bdEndOfWeek,
  bdStartOfWeek,
} from '@/lib/format/bangladesh'

const weeklyScheduleSchema = z.object({
  weekStartDate: z.string().min(1, 'Week start date is required'),
  weekEndDate: z.string().min(1, 'Week end date is required'),
})

function emptyWeekSchedule(): Record<
  MealDay,
  {
    breakfast?: any[]
    lunch?: any[]
    dinner?: any[]
    snack?: any[]
  }
> {
  return {
    saturday: {},
    sunday: {},
    monday: {},
    tuesday: {},
    wednesday: {},
    thursday: {},
    friday: {},
  }
}

interface WeeklyScheduleDialogProps {
  schedule?: WeeklySchedule | null
  messId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void | Promise<void>
}

export function WeeklyScheduleDialog({
  schedule,
  messId,
  open,
  onOpenChange,
  onSubmit,
}: WeeklyScheduleDialogProps) {
  const [scheduleData, setScheduleData] = useState(emptyWeekSchedule)
  const [saving, setSaving] = useState(false)

  const form = useForm({
    resolver: zodResolver(weeklyScheduleSchema),
    defaultValues: {
      weekStartDate: formatISO(bdStartOfWeek(new Date()), {
        representation: 'date',
      }),
      weekEndDate: formatISO(bdEndOfWeek(new Date()), {
        representation: 'date',
      }),
    },
  })

  useEffect(() => {
    if (schedule && open) {
      form.reset({
        weekStartDate: schedule.weekStartDate,
        weekEndDate: schedule.weekEndDate,
      })
      setScheduleData({
        ...emptyWeekSchedule(),
        ...(schedule.schedule ?? {}),
      })
    } else if (!schedule && open) {
      form.reset({
        weekStartDate: formatISO(bdStartOfWeek(new Date()), {
          representation: 'date',
        }),
        weekEndDate: formatISO(bdEndOfWeek(new Date()), {
          representation: 'date',
        }),
      })
      setScheduleData(emptyWeekSchedule())
    }
  }, [schedule, open, form])

  const handleSubmit = async (data: any) => {
    setSaving(true)
    try {
      await onSubmit({
        ...data,
        messId,
        schedule: scheduleData,
        isActive: true,
      })
      form.reset()
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  const addMealItem = (
    day: MealDay,
    category: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ) => {
    setScheduleData(prev => {
      const dayData = prev[day] ?? {}
      return {
        ...prev,
        [day]: {
          ...dayData,
          [category]: [
            ...(dayData[category] || []),
            { name: '', description: '', isSpecial: false },
          ],
        },
      }
    })
  }

  const removeMealItem = (
    day: MealDay,
    category: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    index: number
  ) => {
    setScheduleData(prev => {
      const dayData = prev[day] ?? {}
      return {
        ...prev,
        [day]: {
          ...dayData,
          [category]: dayData[category]?.filter((_, i) => i !== index) || [],
        },
      }
    })
  }

  const updateMealItem = (
    day: MealDay,
    category: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    index: number,
    field: string,
    value: any
  ) => {
    setScheduleData(prev => {
      const dayData = prev[day] ?? {}
      return {
        ...prev,
        [day]: {
          ...dayData,
          [category]:
            dayData[category]?.map((item, i) =>
              i === index ? { ...item, [field]: value } : item
            ) || [],
        },
      }
    })
  }

  const renderDaySchedule = (day: MealDay) => {
    const dayData = scheduleData[day] ?? {}
    const dayLabel =
      BD_WEEK_DAYS.find(d => d.value === day)?.label || day

    return (
      <div className="space-y-4">
        <h3 className="font-semibold">{dayLabel}</h3>
        {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(category => (
          <div key={category} className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium capitalize">{category}</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addMealItem(day, category)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {dayData[category] && dayData[category]!.length > 0 ? (
              <div className="space-y-2">
                {dayData[category].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 rounded border p-2"
                  >
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Item name"
                        value={item.name || ''}
                        onChange={e =>
                          updateMealItem(
                            day,
                            category,
                            index,
                            'name',
                            e.target.value
                          )
                        }
                      />
                      <Textarea
                        placeholder="Description"
                        rows={2}
                        value={item.description || ''}
                        onChange={e =>
                          updateMealItem(
                            day,
                            category,
                            index,
                            'description',
                            e.target.value
                          )
                        }
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={item.isSpecial || false}
                          onCheckedChange={checked =>
                            updateMealItem(
                              day,
                              category,
                              index,
                              'isSpecial',
                              checked
                            )
                          }
                        />
                        <label className="text-sm">Special meal</label>
                        {item.isSpecial && (
                          <Input
                            type="number"
                            placeholder="Price (৳)"
                            className="flex-1"
                            value={item.price || ''}
                            onChange={e =>
                              updateMealItem(
                                day,
                                category,
                                index,
                                'price',
                                parseFloat(e.target.value) || undefined
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMealItem(day, category, index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-2">
                No items
              </p>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:max-h-[85vh] sm:p-0">
        <DialogHeader className="shrink-0 space-y-1.5 px-6 pb-2 pt-6 pr-12 text-left">
          <DialogTitle>
            {schedule ? 'Edit Weekly Schedule' : 'Create Weekly Schedule'}
          </DialogTitle>
          <DialogDescription>
            Set up a weekly meal schedule that repeats automatically
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-2">
              <div className="space-y-4 pb-2">
                {/* Week Dates */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="weekStartDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Week Start Date (Saturday)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="weekEndDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Week End Date (Friday)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Weekly Schedule — Bangladesh order: Sat → Fri */}
                <Tabs defaultValue="saturday" className="w-full">
                  <TabsList className="grid h-auto w-full grid-cols-4 gap-1 sm:grid-cols-7">
                    {BD_WEEK_DAYS.map(day => (
                      <TabsTrigger
                        key={day.value}
                        value={day.value}
                        className="text-xs"
                      >
                        {day.short}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {BD_WEEK_DAYS.map(day => (
                    <TabsContent key={day.value} value={day.value}>
                      {renderDaySchedule(day.value)}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>

            <DialogFooter className="shrink-0 gap-2 border-t bg-background px-6 py-4 sm:space-x-0">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving
                  ? 'Saving…'
                  : schedule
                    ? 'Update Schedule'
                    : 'Create Schedule'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
