'use client'

import { useEffect } from 'react'
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
import { Switch } from '@/components/ui/switch'
import type { MealTiming } from '@/types/meal'

const mealTimingSchema = z.object({
  breakfast: z.object({
    startTime: z.string(),
    endTime: z.string(),
    enabled: z.boolean(),
  }),
  lunch: z.object({
    startTime: z.string(),
    endTime: z.string(),
    enabled: z.boolean(),
  }),
  dinner: z.object({
    startTime: z.string(),
    endTime: z.string(),
    enabled: z.boolean(),
  }),
  snack: z.object({
    startTime: z.string(),
    endTime: z.string(),
    enabled: z.boolean(),
  }),
})

interface MealTimingDialogProps {
  timing?: MealTiming | null
  messId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function MealTimingDialog({
  timing,
  messId,
  open,
  onOpenChange,
  onSubmit,
}: MealTimingDialogProps) {
  const form = useForm({
    resolver: zodResolver(mealTimingSchema),
    defaultValues: {
      breakfast: { startTime: '07:00', endTime: '09:00', enabled: true },
      lunch: { startTime: '12:00', endTime: '14:00', enabled: true },
      dinner: { startTime: '19:00', endTime: '21:00', enabled: true },
      snack: { startTime: '16:00', endTime: '17:00', enabled: false },
    },
  })

  useEffect(() => {
    if (timing && open) {
      form.reset({
        breakfast: timing.breakfast,
        lunch: timing.lunch,
        dinner: timing.dinner,
        snack: timing.snack,
      })
    } else if (!timing && open) {
      form.reset({
        breakfast: { startTime: '07:00', endTime: '09:00', enabled: true },
        lunch: { startTime: '12:00', endTime: '14:00', enabled: true },
        dinner: { startTime: '19:00', endTime: '21:00', enabled: true },
        snack: { startTime: '16:00', endTime: '17:00', enabled: false },
      })
    }
  }, [timing, open, form])

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      messId,
    })
    form.reset()
    onOpenChange(false)
  }

  const renderMealTiming = (
    category: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    label: string
  ) => (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{label}</h3>
        <FormField
          control={form.control}
          name={`${category}.enabled`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      {form.watch(`${category}.enabled`) && (
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`${category}.startTime`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`${category}.endTime`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure Meal Timings</DialogTitle>
          <DialogDescription>
            Set the serving times for each meal category
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              {renderMealTiming('breakfast', 'Breakfast')}
              {renderMealTiming('lunch', 'Lunch')}
              {renderMealTiming('dinner', 'Dinner')}
              {renderMealTiming('snack', 'Snack')}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Timings</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
