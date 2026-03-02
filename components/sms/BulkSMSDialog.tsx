'use client'

import { useEffect, useState, useMemo } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Send, Users, MessageSquare } from 'lucide-react'
import type { SMSRecipientType, SMSTemplate } from '@/types/sms'
import { mockStudents } from '@/data/mockMess'
import { getSMSTemplatesByMess, getSMSGroupsByMess } from '@/data/mockSMS'

const bulkSMSSchema = z.object({
  recipientType: z.enum(['all', 'group', 'individual', 'custom']),
  groupId: z.string().optional(),
  customRecipients: z.array(z.string()).optional(),
  templateId: z.string().optional(),
  content: z.string().min(1, 'SMS content is required'),
  scheduledAt: z.string().optional(),
  gateway: z.enum(['bKash', 'Nagad', 'Rocket', 'Twilio', 'Custom']).optional(),
})

interface BulkSMSDialogProps {
  messId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function BulkSMSDialog({
  messId,
  open,
  onOpenChange,
  onSubmit,
}: BulkSMSDialogProps) {
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({})

  const templates = getSMSTemplatesByMess(messId)
  const groups = getSMSGroupsByMess(messId)
  const messStudents = mockStudents.filter(s => s.seatNumber)

  const form = useForm({
    resolver: zodResolver(bulkSMSSchema),
    defaultValues: {
      recipientType: 'all' as SMSRecipientType,
      groupId: '',
      customRecipients: [],
      templateId: '',
      content: '',
      scheduledAt: '',
      gateway: 'bKash' as const,
    },
  })

  const recipientType = form.watch('recipientType')
  const selectedTemplateId = form.watch('templateId')
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId)

  useEffect(() => {
    if (open) {
      form.reset({
        recipientType: 'all',
        groupId: '',
        customRecipients: [],
        templateId: '',
        content: '',
        scheduledAt: '',
        gateway: 'bKash',
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
        finalContent = finalContent.replace(new RegExp(`\\{${variable}\\}`, 'g'), value)
      })
    }

    // Determine recipients
    let recipients: typeof mockStudents = []
    if (data.recipientType === 'all') {
      recipients = messStudents
    } else if (data.recipientType === 'group' && data.groupId) {
      const group = groups.find(g => g.id === data.groupId)
      if (group) {
        recipients = messStudents.filter(s => group.memberIds.includes(s.id))
      }
    } else if (data.recipientType === 'custom' && selectedRecipients.length > 0) {
      recipients = messStudents.filter(s => selectedRecipients.includes(s.id))
    } else if (data.recipientType === 'individual' && selectedRecipients.length > 0) {
      recipients = messStudents.filter(s => selectedRecipients.includes(s.id))
    }

    onSubmit({
      ...data,
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
      return group ? group.memberIds.length : 0
    }
    if (recipientType === 'custom' || recipientType === 'individual') {
      return selectedRecipients.length
    }
    return 0
  }, [recipientType, form.watch('groupId'), selectedRecipients, groups, messStudents.length])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Bulk SMS
          </DialogTitle>
          <DialogDescription>
            Send SMS to students using templates or custom messages
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
              <div className="space-y-4">
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
                          className="grid grid-cols-2 gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="all" />
                            <label htmlFor="all" className="cursor-pointer">All Students</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="group" id="group" />
                            <label htmlFor="group" className="cursor-pointer">Group</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="individual" id="individual" />
                            <label htmlFor="individual" className="cursor-pointer">Individual</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="custom" id="custom" />
                            <label htmlFor="custom" className="cursor-pointer">Custom</label>
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
                        <Select value={field.value || ''} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {groups.map(group => (
                              <SelectItem key={group.id} value={group.id}>
                                {group.name} ({group.memberIds.length} members)
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
                {(recipientType === 'individual' || recipientType === 'custom') && (
                  <FormItem>
                    <FormLabel>Select Recipients</FormLabel>
                    <div className="rounded-lg border p-4 max-h-48 overflow-y-auto space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          {selectedRecipients.length} selected
                        </span>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRecipients(messStudents.map(s => s.id))}
                          >
                            Select All
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
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
                            className="flex-1 cursor-pointer text-sm"
                          >
                            {student.name} ({student.phone})
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}

                {/* Template Selection */}
                <FormField
                  control={form.control}
                  name="templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Use Template (Optional)</FormLabel>
                      <Select value={field.value || ''} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a template or write custom message" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Custom Message</SelectItem>
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
                {selectedTemplate && selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                  <div className="space-y-2 rounded-lg border p-4 bg-muted/30">
                    <p className="text-sm font-medium">Template Variables</p>
                    {selectedTemplate.variables.map(variable => (
                      <FormItem key={variable}>
                        <FormLabel className="capitalize">{variable.replace(/_/g, ' ')}</FormLabel>
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
                      </FormItem>
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
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Character count: {field.value.length} / 160 (SMS limit)
                        {field.value.length > 160 && (
                          <span className="text-red-600 ml-2">
                            Message will be split into multiple SMS
                          </span>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gateway Selection */}
                <FormField
                  control={form.control}
                  name="gateway"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMS Gateway</FormLabel>
                      <Select value={field.value || 'bKash'} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bKash">bKash</SelectItem>
                          <SelectItem value="Nagad">Nagad</SelectItem>
                          <SelectItem value="Rocket">Rocket</SelectItem>
                          <SelectItem value="Twilio">Twilio</SelectItem>
                          <SelectItem value="Custom">Custom Gateway</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                <div className="rounded-lg border p-4 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Recipients</span>
                    </div>
                    <span className="font-bold">{recipientCount}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Estimated Cost</span>
                    </div>
                    <span className="font-bold">৳{(recipientCount * 0.5).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    * Cost: ৳0.50 per SMS
                  </p>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={recipientCount === 0 || form.watch('content').length === 0}
              >
                <Send className="h-4 w-4 mr-2" />
                Send SMS ({recipientCount} recipients)
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
