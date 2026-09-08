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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react'
import type { DailyMenu, MealItem, MealCategory } from '@/types/meal'

const dailyMenuSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  breakfast: z
    .array(
      z.object({
        name: z.string().min(1, 'Item name is required'),
        description: z.string().optional(),
        isSpecial: z.boolean().optional(),
        price: z.number().optional(),
      })
    )
    .optional(),
  lunch: z
    .array(
      z.object({
        name: z.string().min(1, 'Item name is required'),
        description: z.string().optional(),
        isSpecial: z.boolean().optional(),
        price: z.number().optional(),
      })
    )
    .optional(),
  dinner: z
    .array(
      z.object({
        name: z.string().min(1, 'Item name is required'),
        description: z.string().optional(),
        isSpecial: z.boolean().optional(),
        price: z.number().optional(),
      })
    )
    .optional(),
  snack: z
    .array(
      z.object({
        name: z.string().min(1, 'Item name is required'),
        description: z.string().optional(),
        isSpecial: z.boolean().optional(),
        price: z.number().optional(),
      })
    )
    .optional(),
  notes: z.string().optional(),
})

interface DailyMenuDialogProps {
  menu?: DailyMenu | null
  messId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

const mealCategories: { value: MealCategory; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
]

export function DailyMenuDialog({
  menu,
  messId,
  open,
  onOpenChange,
  onSubmit,
}: DailyMenuDialogProps) {
  const form = useForm({
    resolver: zodResolver(dailyMenuSchema),
    defaultValues: {
      date: '',
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
      notes: '',
    },
  })

  const breakfastArray = useFieldArray({
    control: form.control,
    name: 'breakfast',
  })
  const lunchArray = useFieldArray({ control: form.control, name: 'lunch' })
  const dinnerArray = useFieldArray({ control: form.control, name: 'dinner' })
  const snackArray = useFieldArray({ control: form.control, name: 'snack' })

  useEffect(() => {
    if (menu && open) {
      form.reset({
        date: menu.date,
        breakfast: menu.breakfast || [],
        lunch: menu.lunch || [],
        dinner: menu.dinner || [],
        snack: menu.snack || [],
        notes: menu.notes || '',
      })
    } else if (!menu && open) {
      const today = new Date().toISOString().split('T')[0]
      form.reset({
        date: today,
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
        notes: '',
      })
    }
  }, [menu, open, form])

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      messId,
    })
    form.reset()
    onOpenChange(false)
  }

  const renderMealItems = (
    category: MealCategory,
    fieldArray: ReturnType<typeof useFieldArray>
  ) => {
    const label =
      mealCategories.find(c => c.value === category)?.label || category

    return (
      <div className="space-y-3 rounded-lg border p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold">{label}</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() =>
              fieldArray.append({ name: '', description: '', isSpecial: false })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>

        {fieldArray.fields.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No items added yet
          </p>
        ) : (
          <div className="space-y-3">
            {fieldArray.fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-2 rounded-lg border p-3"
              >
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1 space-y-2">
                    <FormField
                      control={form.control}
                      name={`${category}.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Item name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`${category}.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Description (optional)"
                              rows={2}
                              className="min-h-[4.5rem] resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <FormField
                        control={form.control}
                        name={`${category}.${index}.isSpecial`}
                        render={({ field }) => (
                          <FormItem className="flex shrink-0 items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Special meal
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      {form.watch(`${category}.${index}.isSpecial`) && (
                        <FormField
                          control={form.control}
                          name={`${category}.${index}.price`}
                          render={({ field }) => (
                            <FormItem className="w-full sm:max-w-[10rem] sm:flex-1">
                              <FormControl>
                                <Input
                                  type="number"
                                  inputMode="decimal"
                                  placeholder="Price (৳)"
                                  {...field}
                                  onChange={e =>
                                    field.onChange(
                                      parseFloat(e.target.value) || undefined
                                    )
                                  }
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-0.5 h-9 w-9 shrink-0"
                    onClick={() => fieldArray.remove(index)}
                    aria-label="Remove item"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-[50%] top-0 flex h-[100dvh] max-h-[100dvh] w-full max-w-full translate-x-[-50%] translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:top-[50%] sm:h-auto sm:max-h-[85vh] sm:w-[calc(100%-2rem)] sm:max-w-4xl sm:translate-y-[-50%] sm:rounded-lg sm:border sm:p-0">
        <DialogHeader className="shrink-0 space-y-1.5 px-4 pb-2 pt-5 pr-12 text-left sm:px-6 sm:pt-6">
          <DialogTitle className="text-base sm:text-lg">
            {menu ? 'Edit Daily Menu' : 'Create Daily Menu'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Add or edit the menu for a specific date
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-2 sm:px-6">
              <div className="space-y-3 pb-2 sm:space-y-4">
                {/* Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Meal Categories */}
                {renderMealItems('breakfast', breakfastArray)}
                {renderMealItems('lunch', lunchArray)}
                {renderMealItems('dinner', dinnerArray)}
                {renderMealItems('snack', snackArray)}

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special notes or announcements..."
                          rows={3}
                          className="resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="shrink-0 gap-2 border-t bg-background px-4 py-3 sm:flex-row sm:justify-end sm:gap-2 sm:space-x-0 sm:px-6 sm:py-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {menu ? 'Update' : 'Create'} Menu
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
