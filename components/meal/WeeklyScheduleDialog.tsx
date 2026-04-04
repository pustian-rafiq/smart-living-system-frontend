'use client'

import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, X } from 'lucide-react'
import type { WeeklySchedule, MealDay } from '@/types/meal'
import { startOfWeek, endOfWeek, formatISO } from 'date-fns'

const mealItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional(),
  isSpecial: z.boolean().optional(),
  price: z.number().optional(),
})

const weeklyScheduleSchema = z.object({
  weekStartDate: z.string().min(1, 'Week start date is required'),
  weekEndDate: z.string().min(1, 'Week end date is required'),
})

const daysOfWeek: { value: MealDay; label: string }[] = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
]

interface WeeklyScheduleDialogProps {
  schedule?: WeeklySchedule | null
  messId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function WeeklyScheduleDialog({
  schedule,
  messId,
  open,
  onOpenChange,
  onSubmit,
}: WeeklyScheduleDialogProps) {
  const [scheduleData, setScheduleData] = useState<
    Record<
      MealDay,
      {
        breakfast?: any[]
        lunch?: any[]
        dinner?: any[]
        snack?: any[]
      }
    >
  >({
    monday: {},
    tuesday: {},
    wednesday: {},
    thursday: {},
    friday: {},
    saturday: {},
    sunday: {},
  })

  const form = useForm({
    resolver: zodResolver(weeklyScheduleSchema),
    defaultValues: {
      weekStartDate: formatISO(startOfWeek(new Date(), { weekStartsOn: 1 }), {
        representation: 'date',
      }),
      weekEndDate: formatISO(endOfWeek(new Date(), { weekStartsOn: 1 }), {
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
      setScheduleData(schedule.schedule)
    } else if (!schedule && open) {
      const weekStart = formatISO(
        startOfWeek(new Date(), { weekStartsOn: 1 }),
        {
          representation: 'date',
        }
      )
      const weekEnd = formatISO(endOfWeek(new Date(), { weekStartsOn: 1 }), {
        representation: 'date',
      })
      form.reset({
        weekStartDate: weekStart,
        weekEndDate: weekEnd,
      })
      setScheduleData({
        monday: {},
        tuesday: {},
        wednesday: {},
        thursday: {},
        friday: {},
        saturday: {},
        sunday: {},
      })
    }
  }, [schedule, open, form])

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      messId,
      schedule: scheduleData,
    })
    form.reset()
    onOpenChange(false)
  }

  const addMealItem = (
    day: MealDay,
    category: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ) => {
    setScheduleData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [category]: [
          ...(prev[day][category] || []),
          { name: '', description: '', isSpecial: false },
        ],
      },
    }))
  }

  const removeMealItem = (
    day: MealDay,
    category: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    index: number
  ) => {
    setScheduleData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [category]: prev[day][category]?.filter((_, i) => i !== index) || [],
      },
    }))
  }

  const updateMealItem = (
    day: MealDay,
    category: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    index: number,
    field: string,
    value: any
  ) => {
    setScheduleData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [category]:
          prev[day][category]?.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
          ) || [],
      },
    }))
  }

  const renderDaySchedule = (day: MealDay) => {
    const dayData = scheduleData[day]
    const dayLabel = daysOfWeek.find(d => d.value === day)?.label || day

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
            {dayData[category] && dayData[category].length > 0 ? (
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
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
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
            className="space-y-6"
          >
            <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
              <div className="space-y-4">
                {/* Week Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weekStartDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Week Start Date (Monday)</FormLabel>
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
                        <FormLabel>Week End Date (Sunday)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Weekly Schedule */}
                <Tabs defaultValue="monday" className="w-full">
                  <TabsList className="grid w-full grid-cols-7">
                    {daysOfWeek.map(day => (
                      <TabsTrigger
                        key={day.value}
                        value={day.value}
                        className="text-xs"
                      >
                        {day.label.slice(0, 3)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {daysOfWeek.map(day => (
                    <TabsContent key={day.value} value={day.value}>
                      {renderDaySchedule(day.value)}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {schedule ? 'Update' : 'Create'} Schedule
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
