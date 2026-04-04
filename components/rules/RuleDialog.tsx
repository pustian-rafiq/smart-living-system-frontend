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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import type { MessRule } from '@/types/messRules'

const ruleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.enum([
    'general',
    'payment',
    'attendance',
    'meal',
    'behavior',
    'facility',
    'other',
  ]),
  severity: z.enum(['minor', 'moderate', 'major', 'critical']),
  penalty: z.string().optional(),
  requiresAcceptance: z.boolean(),
  effectiveDate: z.string().optional(),
  expiryDate: z.string().optional(),
})

interface RuleDialogProps {
  rule?: MessRule | null
  messId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function RuleDialog({
  rule,
  messId,
  open,
  onOpenChange,
  onSubmit,
}: RuleDialogProps) {
  const form = useForm({
    resolver: zodResolver(ruleSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'general' as const,
      severity: 'minor' as const,
      penalty: '',
      requiresAcceptance: true,
      effectiveDate: '',
      expiryDate: '',
    },
  })

  useEffect(() => {
    if (rule && open) {
      form.reset({
        title: rule.title,
        description: rule.description,
        category: rule.category,
        severity: rule.severity,
        penalty: rule.penalty || '',
        requiresAcceptance: rule.requiresAcceptance,
        effectiveDate: rule.effectiveDate || '',
        expiryDate: rule.expiryDate || '',
      })
    } else if (!rule && open) {
      form.reset({
        title: '',
        description: '',
        category: 'general',
        severity: 'minor',
        penalty: '',
        requiresAcceptance: true,
        effectiveDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
      })
    }
  }, [rule, open, form])

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      messId,
      status: 'active',
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit Rule' : 'Create Rule'}</DialogTitle>
          <DialogDescription>
            Define rules and regulations for your mess
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rule Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Monthly Fee Payment"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the rule in detail..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category & Severity */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
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
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="attendance">Attendance</SelectItem>
                          <SelectItem value="meal">Meal</SelectItem>
                          <SelectItem value="behavior">Behavior</SelectItem>
                          <SelectItem value="facility">Facility</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity</FormLabel>
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
                          <SelectItem value="minor">Minor</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="major">Major</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Penalty */}
              <FormField
                control={form.control}
                name="penalty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penalty (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Fine: ৳500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Requires Acceptance */}
              <FormField
                control={form.control}
                name="requiresAcceptance"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Requires Student Acceptance</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Students must accept this rule before it applies to them
                      </p>
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

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="effectiveDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Effective Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{rule ? 'Update' : 'Create'} Rule</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
