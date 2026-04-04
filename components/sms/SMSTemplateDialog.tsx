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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Edit SMS Template' : 'Create SMS Template'}
          </DialogTitle>
          <DialogDescription>
            Create reusable SMS templates with variables for personalization
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              {/* Template Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Payment Reminder" {...field} />
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
                <FormLabel>Insert Variables</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {commonVariables.map(variable => (
                    <Button
                      key={variable.key}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertVariable(variable.key)}
                    >
                      {variable.key}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Detected Variables */}
              {uniqueVariables.length > 0 && (
                <div className="rounded-lg border p-3 bg-muted/30">
                  <p className="text-sm font-medium mb-2">
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
                <div className="rounded-lg border p-3 bg-muted/30">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <p className="text-sm text-muted-foreground">
                    {content
                      .replace(/\{name\}/g, 'John Doe')
                      .replace(/\{date\}/g, '2024-01-15')
                      .replace(/\{amount\}/g, '৳3,500')
                      .replace(/\{status\}/g, 'present')
                      .replace(/\{time\}/g, '12:00 PM')
                      .replace(/\{meal\}/g, 'Lunch')
                      .replace(/\{message\}/g, 'Important announcement')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Character count: {content.length} / 160 (SMS limit)
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {template ? 'Update' : 'Create'} Template
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
