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
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { SMSTemplate } from '@/types/sms'

const smsTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  content: z.string().min(1, 'Template content is required'),
  category: z
    .enum(['payment', 'attendance', 'notice', 'reminder', 'general'])
    .optional(),
})

interface SMSTemplateDialogProps {
  template?: SMSTemplate | null
  messId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

const commonVariables = [
  { key: '{name}', label: 'Student Name' },
  { key: '{date}', label: 'Date' },
  { key: '{amount}', label: 'Amount' },
  { key: '{status}', label: 'Status' },
  { key: '{time}', label: 'Time' },
  { key: '{meal}', label: 'Meal' },
  { key: '{message}', label: 'Message' },
]

export function SMSTemplateDialog({
  template,
  messId,
  open,
  onOpenChange,
  onSubmit,
}: SMSTemplateDialogProps) {
  const form = useForm({
    resolver: zodResolver(smsTemplateSchema),
    defaultValues: {
      name: '',
      content: '',
      category: 'general' as const,
    },
  })

  useEffect(() => {
    if (template && open) {
      form.reset({
        name: template.name,
        content: template.content,
        category: template.category || 'general',
      })
    } else if (!template && open) {
      form.reset({
        name: '',
        content: '',
        category: 'general',
      })
    }
  }, [template, open, form])

  const handleSubmit = (data: any) => {
    // Extract variables from content
    const variableMatches = data.content.match(/\{(\w+)\}/g) || []
    const variables = variableMatches.map((v: string) => v.replace(/[{}]/g, ''))

    onSubmit({
      ...data,
      messId,
      variables: [...new Set(variables)], // Remove duplicates
    })
    form.reset()
    onOpenChange(false)
  }

  const insertVariable = (variable: string) => {
    const currentContent = form.getValues('content')
    const cursorPosition =
      (document.activeElement as HTMLTextAreaElement)?.selectionStart ||
      currentContent.length
    const newContent =
      currentContent.slice(0, cursorPosition) +
      variable +
      currentContent.slice(cursorPosition)
    form.setValue('content', newContent)
  }

  const content = form.watch('content')
  const detectedVariables = (content.match(/\{(\w+)\}/g) || []).map(
    (v: string) => v.replace(/[{}]/g, '')
  )
  const uniqueVariables = [...new Set(detectedVariables)]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-[50%] top-0 flex h-[100dvh] max-h-[100dvh] w-full max-w-full translate-x-[-50%] translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:top-[50%] sm:h-auto sm:max-h-[85vh] sm:w-[calc(100%-2rem)] sm:max-w-2xl sm:translate-y-[-50%] sm:rounded-lg sm:border sm:p-0">
        <DialogHeader className="shrink-0 space-y-1.5 px-4 pb-2 pt-5 pr-12 text-left sm:px-6 sm:pt-6">
          <DialogTitle className="text-base sm:text-lg">
            {template ? 'Edit SMS Template' : 'Create SMS Template'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Create reusable SMS templates with variables for personalization
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-2 sm:px-6">
              <div className="space-y-4 pb-2">
                {/* Template Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Payment Reminder"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        value={field.value || 'general'}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="attendance">Attendance</SelectItem>
                          <SelectItem value="notice">Notice</SelectItem>
                          <SelectItem value="reminder">Reminder</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Template Content */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your SMS template. Use {variable} for dynamic content..."
                          className="min-h-[7.5rem] resize-y"
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Use variables like {'{name}'}, {'{date}'}, {'{amount}'}{' '}
                        etc. Click below to insert.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Variable Buttons */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Insert Variables</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonVariables.map(variable => (
                      <Button
                        key={variable.key}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs sm:text-sm"
                        onClick={() => insertVariable(variable.key)}
                      >
                        {variable.key}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Detected Variables */}
                {uniqueVariables.length > 0 && (
                  <div className="rounded-lg border bg-muted/30 p-3 sm:p-4">
                    <p className="mb-2 text-sm font-medium">
                      Detected Variables:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {uniqueVariables.map(variable => (
                        <Badge key={variable} variant="outline">
                          {'{' + variable + '}'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview */}
                {content && (
                  <div className="rounded-lg border bg-muted/30 p-3 sm:p-4">
                    <p className="mb-2 text-sm font-medium">Preview:</p>
                    <p className="break-words text-sm text-muted-foreground">
                      {content
                        .replace(/\{name\}/g, 'John Doe')
                        .replace(/\{date\}/g, '2024-01-15')
                        .replace(/\{amount\}/g, '৳3,500')
                        .replace(/\{status\}/g, 'present')
                        .replace(/\{time\}/g, '12:00 PM')
                        .replace(/\{meal\}/g, 'Lunch')
                        .replace(/\{message\}/g, 'Important announcement')}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Character count: {content.length} / 160 (SMS limit)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="shrink-0 gap-2 border-t bg-background px-4 py-3 sm:flex-row sm:justify-end sm:space-x-0 sm:px-6">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                {template ? 'Update' : 'Create'} Template
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
