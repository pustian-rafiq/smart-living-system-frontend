'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Send, Users, MessageSquare } from 'lucide-react'
import type { SMSRecipientType, SMSTemplate } from '@/types/sms'
import {
  fetchMessSmsGroups,
  fetchMessSmsTemplates,
  fetchMessStudents,
} from '@/lib/api/mess'
import { ok } from '@/lib/api/http'
import { useMockQuery } from '@/hooks/useMockQuery'

const bulkSMSSchema = z.object({
  recipientType: z.enum(['all', 'group', 'individual', 'custom']),
  groupId: z.string().optional(),
  customRecipients: z.array(z.string()).optional(),
  templateId: z.string().optional(),
  content: z.string().min(1, 'SMS content is required'),
  scheduledAt: z.string().optional(),
})

interface BulkSMSDialogProps {
  messId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  creditBalance?: number
  unitPriceBdt?: number
  gatewayLabel?: string
}

export function BulkSMSDialog({
  messId,
  open,
  onOpenChange,
  onSubmit,
  creditBalance = 0,
  unitPriceBdt = 0.5,
  gatewayLabel = 'SmartBasa SMS (BulkSMSBD)',
}: BulkSMSDialogProps) {
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [templateVariables, setTemplateVariables] = useState<
    Record<string, string>
  >({})

  const loadTemplates = useCallback(
    () => (open ? fetchMessSmsTemplates(messId) : Promise.resolve(ok([]))),
    [open, messId]
  )
  const loadGroups = useCallback(
    () => (open ? fetchMessSmsGroups(messId) : Promise.resolve(ok([]))),
    [open, messId]
  )
  const loadStudents = useCallback(
    () => (open ? fetchMessStudents(messId) : Promise.resolve(ok([]))),
    [open, messId]
  )
  const { data: templatesData } = useMockQuery(loadTemplates)
  const { data: groupsData } = useMockQuery(loadGroups)
  const { data: studentsData } = useMockQuery(loadStudents)

  const templates = templatesData ?? []
  const groups = groupsData ?? []
  const messStudents = (studentsData ?? []).filter(s => s.seatNumber)

  const form = useForm({
    resolver: zodResolver(bulkSMSSchema),
    defaultValues: {
      recipientType: 'all' as SMSRecipientType,
      groupId: '',
      customRecipients: [],
      templateId: 'none',
      content: '',
      scheduledAt: '',
    },
  })

  const recipientType = form.watch('recipientType')
  const selectedTemplateId = form.watch('templateId')
  const selectedTemplate =
    selectedTemplateId && selectedTemplateId !== 'none'
      ? templates.find(t => t.id === selectedTemplateId)
      : undefined

  useEffect(() => {
    if (open) {
      form.reset({
        recipientType: 'all',
        groupId: '',
        customRecipients: [],
        templateId: 'none',
        content: '',
        scheduledAt: '',
      })
      setSelectedRecipients([])
      setTemplateVariables({})
    }
  }, [open, form])

  useEffect(() => {
    if (selectedTemplate && selectedTemplate.variables) {
      const vars: Record<string, string> = {}
      selectedTemplate.variables.forEach(v => {
        vars[v] = ''
      })
      setTemplateVariables(vars)

      // Auto-fill template content
      form.setValue('content', selectedTemplate.content)
    }
  }, [selectedTemplate, form])

  const handleSubmit = (data: any) => {
    // Replace template variables with actual values
    let finalContent = data.content
    if (selectedTemplate && selectedTemplate.variables) {
      selectedTemplate.variables.forEach(variable => {
        const value = templateVariables[variable] || `{${variable}}`
        finalContent = finalContent.replace(
          new RegExp(`\\{${variable}\\}`, 'g'),
          value
        )
      })
    }

    // Determine recipients
    let recipients = [] as typeof messStudents
    if (data.recipientType === 'all') {
      recipients = messStudents
    } else if (data.recipientType === 'group' && data.groupId) {
      const group = groups.find(g => g.id === data.groupId)
      if (group) {
        recipients = messStudents.filter(s => group.memberIds.includes(s.id))
      }
    } else if (
      data.recipientType === 'custom' &&
      selectedRecipients.length > 0
    ) {
      recipients = messStudents.filter(s => selectedRecipients.includes(s.id))
    } else if (
      data.recipientType === 'individual' &&
      selectedRecipients.length > 0
    ) {
      recipients = messStudents.filter(s => selectedRecipients.includes(s.id))
    }

    onSubmit({
      ...data,
      templateId:
        data.templateId && data.templateId !== 'none'
          ? data.templateId
          : undefined,
      content: finalContent,
      recipients: recipients.map(s => ({
        id: s.id,
        name: s.name,
        phone: s.phone,
        studentId: s.id,
      })),
      totalRecipients: recipients.length,
    })
    form.reset()
    setSelectedRecipients([])
    setTemplateVariables({})
    onOpenChange(false)
  }

  const toggleRecipient = (studentId: string) => {
    setSelectedRecipients(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const recipientCount = useMemo(() => {
    if (recipientType === 'all') return messStudents.length
    if (recipientType === 'group' && form.watch('groupId')) {
      const group = groups.find(g => g.id === form.watch('groupId'))
      return group && Array.isArray(group.memberIds)
        ? group.memberIds.length
        : 0
    }
    if (recipientType === 'custom' || recipientType === 'individual') {
      return selectedRecipients.length
    }
    return 0
  }, [
    recipientType,
    form.watch('groupId'),
    selectedRecipients,
    groups,
    messStudents.length,
  ])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="left-[50%] top-0 flex h-[100dvh] max-h-[100dvh] w-full max-w-full translate-x-[-50%] translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:top-[50%] sm:h-auto sm:max-h-[85vh] sm:w-[calc(100%-2rem)] sm:max-w-3xl sm:translate-y-[-50%] sm:rounded-lg sm:border sm:p-0">
        <DialogHeader className="shrink-0 space-y-1.5 px-4 pb-2 pt-5 pr-12 text-left sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Send className="h-5 w-5 shrink-0" />
            Send Bulk SMS
          </DialogTitle>
          <DialogDescription className="text-sm">
            Send SMS to students using templates or custom messages
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-2 sm:px-6">
              <div className="space-y-4 pb-2">
                {/* Recipient Type */}
                <FormField
                  control={form.control}
                  name="recipientType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
                        >
                          <div className="flex items-center space-x-2 rounded-md border p-3 sm:border-0 sm:p-0">
                            <RadioGroupItem value="all" id="all" />
                            <label htmlFor="all" className="cursor-pointer text-sm">
                              All Students
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 rounded-md border p-3 sm:border-0 sm:p-0">
                            <RadioGroupItem value="group" id="group" />
                            <label htmlFor="group" className="cursor-pointer text-sm">
                              Group
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 rounded-md border p-3 sm:border-0 sm:p-0">
                            <RadioGroupItem
                              value="individual"
                              id="individual"
                            />
                            <label
                              htmlFor="individual"
                              className="cursor-pointer text-sm"
                            >
                              Individual
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 rounded-md border p-3 sm:border-0 sm:p-0">
                            <RadioGroupItem value="custom" id="custom" />
                            <label htmlFor="custom" className="cursor-pointer text-sm">
                              Custom
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Group Selection */}
                {recipientType === 'group' && (
                  <FormField
                    control={form.control}
                    name="groupId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Group</FormLabel>
                        <Select
                          value={field.value || ''}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {groups.map(group => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name} (
                                {Array.isArray(group.memberIds)
                                  ? group.memberIds.length
                                  : 0}{' '}
                                members)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Individual/Custom Recipient Selection */}
                {(recipientType === 'individual' ||
                  recipientType === 'custom') && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Select Recipients
                    </Label>
                    <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3 sm:p-4">
                      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-sm text-muted-foreground">
                          {selectedRecipients.length} selected
                        </span>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none"
                            onClick={() =>
                              setSelectedRecipients(messStudents.map(s => s.id))
                            }
                          >
                            Select All
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none"
                            onClick={() => setSelectedRecipients([])}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                      {messStudents.map(student => (
                        <div
                          key={student.id}
                          className="flex items-center space-x-2 rounded-lg border p-2 hover:bg-muted/50"
                        >
                          <Checkbox
                            id={`student-${student.id}`}
                            checked={selectedRecipients.includes(student.id)}
                            onCheckedChange={() => toggleRecipient(student.id)}
                          />
                          <label
                            htmlFor={`student-${student.id}`}
                            className="min-w-0 flex-1 cursor-pointer break-words text-sm"
                          >
                            {student.name} ({student.phone})
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Template Selection */}
                <FormField
                  control={form.control}
                  name="templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Use Template (Optional)</FormLabel>
                      <Select
                        value={field.value || 'none'}
                        onValueChange={value =>
                          field.onChange(value === 'none' ? 'none' : value)
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a template or write custom message" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Custom Message</SelectItem>
                          {templates.map(template => (
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

                {/* Template Variables */}
                {selectedTemplate &&
                  selectedTemplate.variables &&
                  selectedTemplate.variables.length > 0 && (
                    <div className="space-y-2 rounded-lg border bg-muted/30 p-3 sm:p-4">
                      <p className="text-sm font-medium">Template Variables</p>
                      {selectedTemplate.variables.map(variable => (
                        <div key={variable} className="space-y-2">
                          <Label className="capitalize">
                            {variable.replace(/_/g, ' ')}
                          </Label>
                          <Input
                            value={templateVariables[variable] || ''}
                            onChange={e =>
                              setTemplateVariables(prev => ({
                                ...prev,
                                [variable]: e.target.value,
                              }))
                            }
                            placeholder={`Enter ${variable}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                {/* SMS Content */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMS Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your SMS message..."
                          rows={5}
                          className="min-h-[7.5rem] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Character count: {field.value.length} / 160 (SMS limit)
                        {field.value.length > 160 && (
                          <span className="ml-2 text-red-600">
                            Message will be split into multiple SMS
                          </span>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gateway (system-owned BulkSMSBD) */}
                <div className="space-y-2 rounded-lg border p-3 sm:p-4">
                  <Label className="text-sm font-medium">SMS Gateway</Label>
                  <p className="text-sm font-medium">{gatewayLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    Messages are sent through the SmartBasa platform SMS
                    account. Owners do not configure personal API keys. Credits
                    are deducted from your wallet for each successful SMS.
                  </p>
                </div>

                {/* Scheduled Send (Optional) */}
                <FormField
                  control={form.control}
                  name="scheduledAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule Send (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          className="w-full"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty to send immediately
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Recipient Count & Cost Estimate */}
                <div className="rounded-lg border bg-primary/5 p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm font-medium">Recipients</span>
                    </div>
                    <span className="font-bold">{recipientCount}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm font-medium">
                        Credits required
                      </span>
                    </div>
                    <span className="font-bold">{recipientCount}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">Your balance</span>
                    <span
                      className={`font-bold ${
                        creditBalance < recipientCount
                          ? 'text-destructive'
                          : ''
                      }`}
                    >
                      {creditBalance}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">Est. cost</span>
                    <span className="font-bold">
                      ৳{(recipientCount * unitPriceBdt).toFixed(2)}
                    </span>
                  </div>
                  {creditBalance < recipientCount && (
                    <p className="mt-2 text-xs text-destructive">
                      Not enough credits. Buy more SMS from the wallet panel.
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    * Only successful sends debit credits (৳
                    {unitPriceBdt.toFixed(2)} each).
                  </p>
                </div>
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
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={
                  recipientCount === 0 ||
                  form.watch('content').length === 0 ||
                  creditBalance < recipientCount
                }
              >
                <Send className="mr-2 h-4 w-4" />
                <span className="truncate">
                  Send SMS ({recipientCount} recipients)
                </span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
