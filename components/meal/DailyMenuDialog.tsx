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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react'
import type { DailyMenu, MealItem, MealCategory } from '@/types/meal'

const dailyMenuSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  breakfast: z.array(z.object({
    name: z.string().min(1, 'Item name is required'),
    description: z.string().optional(),
    isSpecial: z.boolean().optional(),
    price: z.number().optional(),
  })).optional(),
  lunch: z.array(z.object({
    name: z.string().min(1, 'Item name is required'),
    description: z.string().optional(),
    isSpecial: z.boolean().optional(),
    price: z.number().optional(),
  })).optional(),
  dinner: z.array(z.object({
    name: z.string().min(1, 'Item name is required'),
    description: z.string().optional(),
    isSpecial: z.boolean().optional(),
    price: z.number().optional(),
  })).optional(),
  snack: z.array(z.object({
    name: z.string().min(1, 'Item name is required'),
    description: z.string().optional(),
    isSpecial: z.boolean().optional(),
    price: z.number().optional(),
  })).optional(),
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

  const breakfastArray = useFieldArray({ control: form.control, name: 'breakfast' })
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
    const label = mealCategories.find(c => c.value === category)?.label || category

    return (
      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{label}</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fieldArray.append({ name: '', description: '', isSpecial: false })}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {fieldArray.fields.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No items added yet
          </p>
        ) : (
          <div className="space-y-3">
            {fieldArray.fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
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
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center gap-4">
                      <FormField
                        control={form.control}
                        name={`${category}.${index}.isSpecial`}
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
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
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Price (৳)"
                                  {...field}
                                  onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
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
                    size="sm"
                    onClick={() => fieldArray.remove(index)}
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
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{menu ? 'Edit Daily Menu' : 'Create Daily Menu'}</DialogTitle>
          <DialogDescription>
            Add or edit the menu for a specific date
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
              <div className="space-y-4">
                {/* Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{menu ? 'Update' : 'Create'} Menu</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
