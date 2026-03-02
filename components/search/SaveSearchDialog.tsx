'use client'

import { useState, useEffect } from 'react'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import type { SearchFilters } from '@/types/property'

const saveSearchSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  enableNotifications: z.boolean().default(true),
})

interface SaveSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: SearchFilters
  onSave: (name: string, filters: SearchFilters, enableNotifications: boolean) => void
}

export function SaveSearchDialog({
  open,
  onOpenChange,
  filters,
  onSave,
}: SaveSearchDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof saveSearchSchema>>({
    resolver: zodResolver(saveSearchSchema),
    defaultValues: {
      name: '',
      enableNotifications: true,
    },
  })

  const handleSubmit = async (data: z.infer<typeof saveSearchSchema>) => {
    setIsSubmitting(true)
    try {
      await onSave(data.name, filters, data.enableNotifications)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving search:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate a suggested name based on filters
  const suggestedName = () => {
    const parts: string[] = []
    if (filters.propertyType && filters.propertyType !== 'all') {
      parts.push(filters.propertyType.charAt(0).toUpperCase() + filters.propertyType.slice(1))
    }
    if (filters.city) {
      parts.push(filters.city)
    }
    if (filters.area) {
      parts.push(filters.area)
    }
    if (parts.length === 0) {
      return 'My Search'
    }
    return parts.join(' - ')
  }

  // Set suggested name when dialog opens
  useEffect(() => {
    if (open && !form.getValues('name')) {
      form.setValue('name', suggestedName())
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Search</DialogTitle>
          <DialogDescription>
            Save your search criteria to get notified when new properties match
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Search Summary */}
            <div className="rounded-lg border p-3 bg-muted/50">
              <p className="text-sm font-medium mb-2">Search Criteria:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                {filters.propertyType && filters.propertyType !== 'all' && (
                  <p>Type: {filters.propertyType}</p>
                )}
                {filters.city && <p>City: {filters.city}</p>}
                {filters.area && <p>Area: {filters.area}</p>}
                <p>
                  Rent: ৳{filters.rentRange[0].toLocaleString()} - ৳{filters.rentRange[1].toLocaleString()}
                </p>
                {filters.availableOnly && <p>Available only</p>}
                {filters.verifiedOnly && <p>Verified only</p>}
              </div>
            </div>

            {/* Name Input */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Mess in Mirpur"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Give this search a memorable name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Enable Notifications */}
            <FormField
              control={form.control}
              name="enableNotifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Enable Notifications</FormLabel>
                    <FormDescription>
                      Get notified when new properties match this search
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

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Search'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
