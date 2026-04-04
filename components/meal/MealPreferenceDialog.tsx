'use client'

import { useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { MealPreference, MealCategory } from '@/types/meal'

const mealPreferenceSchema = z.object({
  preferences: z.array(
    z.object({
      category: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
      likedItems: z.array(z.string()),
      dislikedItems: z.array(z.string()),
      allergies: z.array(z.string()).optional(),
      dietaryRestrictions: z.array(z.string()).optional(),
    })
  ),
})

interface MealPreferenceDialogProps {
  preference?: MealPreference | null
  messId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

const categories: { value: MealCategory; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
]

export function MealPreferenceDialog({
  preference,
  messId,
  open,
  onOpenChange,
  onSubmit,
}: MealPreferenceDialogProps) {
  const form = useForm({
    resolver: zodResolver(mealPreferenceSchema),
    defaultValues: {
      preferences: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'preferences',
  })

  useEffect(() => {
    if (preference && open) {
      form.reset({
        preferences: preference.preferences,
      })
    } else if (!preference && open) {
      form.reset({
        preferences: [],
      })
    }
  }, [preference, open, form])

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      messId,
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Meal Preferences</DialogTitle>
          <DialogDescription>
            Set your meal preferences, allergies, and dietary restrictions
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
              <div className="space-y-4">
                {fields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No preferences set yet</p>
                    <p className="text-sm mt-1">
                      Add preferences for each meal category
                    </p>
                  </div>
                ) : (
                  fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-lg border p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <FormField
                          control={form.control}
                          name={`preferences.${index}.category`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-[150px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map(cat => (
                                    <SelectItem
                                      key={cat.value}
                                      value={cat.value}
                                    >
                                      {cat.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name={`preferences.${index}.likedItems`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Liked Items (comma-separated)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Chicken Curry, Biriyani"
                                {...field}
                                value={field.value.join(', ')}
                                onChange={e =>
                                  field.onChange(
                                    e.target.value
                                      .split(',')
                                      .map(s => s.trim())
                                      .filter(Boolean)
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`preferences.${index}.dislikedItems`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Disliked Items (comma-separated)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Fish, Egg"
                                {...field}
                                value={field.value.join(', ')}
                                onChange={e =>
                                  field.onChange(
                                    e.target.value
                                      .split(',')
                                      .map(s => s.trim())
                                      .filter(Boolean)
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`preferences.${index}.allergies`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Allergies (comma-separated)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Peanuts, Shellfish"
                                {...field}
                                value={field.value?.join(', ') || ''}
                                onChange={e =>
                                  field.onChange(
                                    e.target.value
                                      .split(',')
                                      .map(s => s.trim())
                                      .filter(Boolean)
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`preferences.${index}.dietaryRestrictions`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Dietary Restrictions (comma-separated)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Vegetarian, Halal only"
                                {...field}
                                value={field.value?.join(', ') || ''}
                                onChange={e =>
                                  field.onChange(
                                    e.target.value
                                      .split(',')
                                      .map(s => s.trim())
                                      .filter(Boolean)
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    append({
                      category: 'breakfast',
                      likedItems: [],
                      dislikedItems: [],
                      allergies: [],
                      dietaryRestrictions: [],
                    })
                  }
                >
                  Add Preference
                </Button>
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
              <Button type="submit">Save Preferences</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
