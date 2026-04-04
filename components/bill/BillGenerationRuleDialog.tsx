'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { mockBuildings } from '@/data/mockBuildings'
import { mockMess } from '@/data/mockMess'
import { mockBillTemplates } from '@/data/mockBillTemplates'
import type { BillGenerationRule } from '@/types/bill'

const billRuleSchema = z.object({
  name: z.string().min(1, 'Rule name is required'),
  description: z.string().optional(),
  propertyId: z.string().optional(),
  propertyType: z.enum(['apartment', 'mess']).optional(),
  templateId: z.string().min(1, 'Template is required'),
  schedule: z.object({
    type: z.enum(['monthly', 'weekly', 'custom']),
    dayOfMonth: z.coerce.number().min(1).max(31).optional(),
    dayOfWeek: z.coerce.number().min(0).max(6).optional(),
    customDays: z.array(z.coerce.number()).optional(),
    generateBeforeDays: z.coerce.number().min(0).optional(),
    dueDateDay: z.coerce.number().min(1).max(31).optional(),
  }),
  isActive: z.boolean(),
})

type BillRuleFormData = z.infer<typeof billRuleSchema>

interface BillGenerationRuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: BillRuleFormData) => void
  rule?: BillGenerationRule
}

const daysOfWeek = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

export function BillGenerationRuleDialog({
  open,
  onOpenChange,
  onSubmit,
  rule,
}: BillGenerationRuleDialogProps) {
  const [selectedPropertyType, setSelectedPropertyType] = useState<
    'apartment' | 'mess' | 'all'
  >(rule?.propertyType || 'all')

  const form = useForm<BillRuleFormData>({
    resolver: zodResolver(billRuleSchema) as never,
    defaultValues: rule
      ? {
          name: rule.name,
          description: rule.description,
          propertyId: rule.propertyId,
          propertyType: rule.propertyType,
          templateId: rule.templateId,
          schedule: rule.schedule,
          isActive: rule.isActive,
        }
      : {
          name: '',
          description: '',
          propertyId: undefined,
          propertyType: undefined,
          templateId: '',
          schedule: {
            type: 'monthly',
            dayOfMonth: 1,
            generateBeforeDays: 0,
            dueDateDay: 5,
          },
          isActive: true,
        },
  })

  const scheduleType = form.watch('schedule.type')
  const propertyType = form.watch('propertyType')

  const handleSubmit = (data: BillRuleFormData) => {
    onSubmit(data)
    if (!rule) {
      form.reset()
    }
  }

  const properties =
    selectedPropertyType === 'all'
      ? []
      : selectedPropertyType === 'apartment'
        ? mockBuildings
        : mockMess

  const availableTemplates = mockBillTemplates.filter(t => {
    if (propertyType && t.propertyType !== propertyType) return false
    return t.isActive
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {rule ? 'Edit Generation Rule' : 'Create Generation Rule'}
          </DialogTitle>
          <DialogDescription>
            {rule
              ? 'Update the automated bill generation rule'
              : 'Set up rules for automatic bill generation'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rule Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Monthly Auto Bill Generation"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bill Template</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTemplates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what this rule does..."
                      {...field}
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type (Optional)</FormLabel>
                    <Select
                      onValueChange={value => {
                        const val =
                          value === 'all'
                            ? undefined
                            : (value as 'apartment' | 'mess')
                        field.onChange(val)
                        setSelectedPropertyType(
                          value as 'apartment' | 'mess' | 'all'
                        )
                        form.setValue('propertyId', undefined)
                      }}
                      defaultValue={field.value || 'all'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="mess">Mess</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Leave as "All Types" to apply to all properties
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedPropertyType !== 'all' && properties.length > 0 && (
                <FormField
                  control={form.control}
                  name="propertyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property (Optional)</FormLabel>
                      <Select
                        onValueChange={value =>
                          field.onChange(value === 'all' ? undefined : value)
                        }
                        defaultValue={field.value || 'all'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Properties</SelectItem>
                          {properties.map(prop => (
                            <SelectItem key={prop.id} value={prop.id}>
                              {prop.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Leave as "All Properties" to apply to all properties of
                        this type
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Schedule Configuration */}
            <div className="space-y-4 rounded-lg border p-4">
              <Label className="text-base font-semibold">
                Schedule Configuration
              </Label>

              <FormField
                control={form.control}
                name="schedule.type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Schedule Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {scheduleType === 'monthly' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="schedule.dayOfMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Day of Month</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={31}
                            placeholder="1-31"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Day of month to generate bills
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="schedule.generateBeforeDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Generate Before (Days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Generate bills X days before the scheduled date
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {scheduleType === 'weekly' && (
                <FormField
                  control={form.control}
                  name="schedule.dayOfWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day of Week</FormLabel>
                      <Select
                        onValueChange={value => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {daysOfWeek.map(day => (
                            <SelectItem
                              key={day.value}
                              value={day.value.toString()}
                            >
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="schedule.dueDateDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date Day</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={31}
                        placeholder="5"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Day of month when bills are due (default: 5)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Only active rules will run automatically
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset()
                  onOpenChange(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {rule ? 'Update Rule' : 'Create Rule'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
