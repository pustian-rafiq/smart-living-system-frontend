'use client'

import { useState, useEffect } from 'react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Camera, Plus, X } from 'lucide-react'
import type { Checklist, ChecklistItem } from '@/types/checklist'
import { checklistCategories } from '@/data/mockChecklists'

const checklistSchema = z.object({
  type: z.enum(['move_in', 'move_out']),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      category: z.string(),
      name: z.string().min(1, 'Item name is required'),
      description: z.string().optional(),
      status: z.enum(['good', 'fair', 'poor', 'damaged', 'missing']),
      notes: z.string().optional(),
      estimatedValue: z.number().optional(),
      damageDescription: z.string().optional(),
      repairCost: z.number().optional(),
    })
  ),
})

interface ChecklistDialogProps {
  checklist?: Checklist | null
  propertyId: string
  propertyName: string
  flatId?: string
  flatNumber?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function ChecklistDialog({
  checklist,
  propertyId,
  propertyName,
  flatId,
  flatNumber,
  open,
  onOpenChange,
  onSubmit,
}: ChecklistDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const form = useForm({
    resolver: zodResolver(checklistSchema),
    defaultValues: {
      type: checklist?.type || 'move_in',
      notes: checklist?.notes || '',
      items: checklist?.items || [],
    },
  })

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  useEffect(() => {
    if (checklist && open) {
      form.reset({
        type: checklist.type,
        notes: checklist.notes || '',
        items: checklist.items,
      })
    } else if (!checklist && open) {
      form.reset({
        type: 'move_in',
        notes: '',
        items: [],
      })
    }
  }, [checklist, open, form])

  const handleAddItem = () => {
    if (!selectedCategory) {
      alert('Please select a category first')
      return
    }

    const category = checklistCategories.find(c => c.id === selectedCategory)
    if (!category) return

    append({
      category: category.name,
      name: '',
      description: '',
      status: 'good' as const,
      notes: '',
      estimatedValue: undefined,
      damageDescription: '',
      repairCost: undefined,
    })
    setSelectedCategory('')
  }

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      propertyId,
      propertyName,
      flatId,
      flatNumber,
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {checklist
              ? 'Edit Checklist'
              : `Create ${form.watch('type') === 'move_in' ? 'Move-in' : 'Move-out'} Checklist`}
          </DialogTitle>
          <DialogDescription>
            {propertyName} {flatNumber && `- Flat ${flatNumber}`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
              <div className="space-y-4">
                {/* Checklist Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Checklist Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="move_in">Move-in</SelectItem>
                          <SelectItem value="move_out">Move-out</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Add Items */}
                <div className="space-y-2 rounded-lg border p-4">
                  <FormLabel>Add Items</FormLabel>
                  <div className="flex gap-2">
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {checklistCategories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" onClick={handleAddItem}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Items
                    </Button>
                  </div>
                  {selectedCategory && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {checklistCategories
                        .find(c => c.id === selectedCategory)
                        ?.items.map(item => (
                          <Badge
                            key={item}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={() => {
                              const category = checklistCategories.find(
                                c => c.id === selectedCategory
                              )
                              if (category) {
                                append({
                                  category: category.name,
                                  name: item,
                                  description: '',
                                  status: 'good' as const,
                                  notes: '',
                                })
                              }
                            }}
                          >
                            {item}
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>

                {/* Checklist Items */}
                <div className="space-y-4">
                  <FormLabel>Items ({fields.length})</FormLabel>
                  {fields.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-8 text-center">
                      <p className="text-muted-foreground">
                        No items added yet
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Select a category and add items to get started
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="rounded-lg border p-4 space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <FormField
                                control={form.control}
                                name={`items.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Item Name</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="ml-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <FormField
                              control={form.control}
                              name={`items.${index}.status`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Status</FormLabel>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="good">Good</SelectItem>
                                      <SelectItem value="fair">Fair</SelectItem>
                                      <SelectItem value="poor">Poor</SelectItem>
                                      <SelectItem value="damaged">
                                        Damaged
                                      </SelectItem>
                                      <SelectItem value="missing">
                                        Missing
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`items.${index}.estimatedValue`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Estimated Value (৳)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={e =>
                                        field.onChange(
                                          parseFloat(e.target.value) ||
                                            undefined
                                        )
                                      }
                                      value={field.value || ''}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {form.watch(`items.${index}.status`) ===
                            'damaged' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <FormField
                                control={form.control}
                                name={`items.${index}.damageDescription`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Damage Description</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} rows={2} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`items.${index}.repairCost`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Repair Cost (৳)</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        {...field}
                                        onChange={e =>
                                          field.onChange(
                                            parseFloat(e.target.value) ||
                                              undefined
                                          )
                                        }
                                        value={field.value || ''}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          )}

                          <FormField
                            control={form.control}
                            name={`items.${index}.notes`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notes</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    rows={2}
                                    placeholder="Additional notes..."
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overall Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          placeholder="General notes about the property condition..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
              <Button type="submit" disabled={fields.length === 0}>
                {checklist ? 'Update' : 'Create'} Checklist
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
