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
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ReminderSettings, ReminderChannel } from '@/types/reminder'
import { Bell, Clock } from 'lucide-react'

const reminderSettingsSchema = z.object({
  rentReminders: z.object({
    enabled: z.boolean(),
    daysBefore: z.array(z.number()),
    channels: z.array(z.enum(['sms', 'push', 'email'])),
    time: z.string(),
  }),
  billReminders: z.object({
    enabled: z.boolean(),
    daysBefore: z.array(z.number()),
    channels: z.array(z.enum(['sms', 'push', 'email'])),
    time: z.string(),
  }),
  maintenanceReminders: z.object({
    enabled: z.boolean(),
    channels: z.array(z.enum(['sms', 'push', 'email'])),
  }),
  customReminders: z.object({
    enabled: z.boolean(),
    defaultChannels: z.array(z.enum(['sms', 'push', 'email'])),
  }),
})

interface ReminderSettingsDialogProps {
  settings: ReminderSettings
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ReminderSettings) => void
}

const reminderDays = [1, 2, 3, 5, 7, 14]
const channels: { value: ReminderChannel; label: string }[] = [
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push Notification' },
  { value: 'email', label: 'Email' },
]

export function ReminderSettingsDialog({
  settings,
  open,
  onOpenChange,
  onSubmit,
}: ReminderSettingsDialogProps) {
  const form = useForm<ReminderSettings>({
    resolver: zodResolver(reminderSettingsSchema),
    defaultValues: settings,
  })

  useEffect(() => {
    if (open) {
      form.reset(settings)
    }
  }, [open, settings, form])

  const handleSubmit = (data: ReminderSettings) => {
    onSubmit(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Reminder Settings
          </DialogTitle>
          <DialogDescription>
            Configure automatic reminders for rent, bills, and maintenance
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
              <div className="space-y-6">
                {/* Rent Reminders */}
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Rent Reminders</h3>
                      <p className="text-sm text-muted-foreground">
                        Get notified before rent is due
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="rentReminders.enabled"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch('rentReminders.enabled') && (
                    <div className="space-y-4 pl-4 border-l-2">
                      <FormField
                        control={form.control}
                        name="rentReminders.daysBefore"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days Before</FormLabel>
                            <div className="grid grid-cols-3 gap-2">
                              {reminderDays.map(day => (
                                <div
                                  key={day}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`rent-day-${day}`}
                                    checked={field.value?.includes(day)}
                                    onCheckedChange={checked => {
                                      const current = field.value || []
                                      if (checked) {
                                        field.onChange(
                                          [...current, day].sort(
                                            (a, b) => b - a
                                          )
                                        )
                                      } else {
                                        field.onChange(
                                          current.filter(d => d !== day)
                                        )
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`rent-day-${day}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {day} day{day !== 1 ? 's' : ''}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rentReminders.channels"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Channels</FormLabel>
                            <div className="space-y-2">
                              {channels.map(channel => (
                                <div
                                  key={channel.value}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`rent-channel-${channel.value}`}
                                    checked={field.value?.includes(
                                      channel.value
                                    )}
                                    onCheckedChange={checked => {
                                      const current = field.value || []
                                      if (checked) {
                                        field.onChange([
                                          ...current,
                                          channel.value,
                                        ])
                                      } else {
                                        field.onChange(
                                          current.filter(
                                            c => c !== channel.value
                                          )
                                        )
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`rent-channel-${channel.value}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {channel.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rentReminders.time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Time
                            </FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Bill Reminders */}
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Bill Reminders</h3>
                      <p className="text-sm text-muted-foreground">
                        Get notified before bills are due
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="billReminders.enabled"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch('billReminders.enabled') && (
                    <div className="space-y-4 pl-4 border-l-2">
                      <FormField
                        control={form.control}
                        name="billReminders.daysBefore"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days Before</FormLabel>
                            <div className="grid grid-cols-3 gap-2">
                              {reminderDays.map(day => (
                                <div
                                  key={day}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`bill-day-${day}`}
                                    checked={field.value?.includes(day)}
                                    onCheckedChange={checked => {
                                      const current = field.value || []
                                      if (checked) {
                                        field.onChange(
                                          [...current, day].sort(
                                            (a, b) => b - a
                                          )
                                        )
                                      } else {
                                        field.onChange(
                                          current.filter(d => d !== day)
                                        )
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`bill-day-${day}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {day} day{day !== 1 ? 's' : ''}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="billReminders.channels"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Channels</FormLabel>
                            <div className="space-y-2">
                              {channels.map(channel => (
                                <div
                                  key={channel.value}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`bill-channel-${channel.value}`}
                                    checked={field.value?.includes(
                                      channel.value
                                    )}
                                    onCheckedChange={checked => {
                                      const current = field.value || []
                                      if (checked) {
                                        field.onChange([
                                          ...current,
                                          channel.value,
                                        ])
                                      } else {
                                        field.onChange(
                                          current.filter(
                                            c => c !== channel.value
                                          )
                                        )
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`bill-channel-${channel.value}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {channel.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="billReminders.time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Time
                            </FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Maintenance Reminders */}
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Maintenance Reminders</h3>
                      <p className="text-sm text-muted-foreground">
                        Get notified about maintenance updates
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="maintenanceReminders.enabled"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch('maintenanceReminders.enabled') && (
                    <div className="pl-4 border-l-2">
                      <FormField
                        control={form.control}
                        name="maintenanceReminders.channels"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Channels</FormLabel>
                            <div className="space-y-2">
                              {channels.map(channel => (
                                <div
                                  key={channel.value}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`maintenance-channel-${channel.value}`}
                                    checked={field.value?.includes(
                                      channel.value
                                    )}
                                    onCheckedChange={checked => {
                                      const current = field.value || []
                                      if (checked) {
                                        field.onChange([
                                          ...current,
                                          channel.value,
                                        ])
                                      } else {
                                        field.onChange(
                                          current.filter(
                                            c => c !== channel.value
                                          )
                                        )
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`maintenance-channel-${channel.value}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {channel.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                {/* Custom Reminders */}
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Custom Reminders</h3>
                      <p className="text-sm text-muted-foreground">
                        Default settings for custom reminders
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="customReminders.enabled"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch('customReminders.enabled') && (
                    <div className="pl-4 border-l-2">
                      <FormField
                        control={form.control}
                        name="customReminders.defaultChannels"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Default Channels</FormLabel>
                            <div className="space-y-2">
                              {channels.map(channel => (
                                <div
                                  key={channel.value}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`custom-channel-${channel.value}`}
                                    checked={field.value?.includes(
                                      channel.value
                                    )}
                                    onCheckedChange={checked => {
                                      const current = field.value || []
                                      if (checked) {
                                        field.onChange([
                                          ...current,
                                          channel.value,
                                        ])
                                      } else {
                                        field.onChange(
                                          current.filter(
                                            c => c !== channel.value
                                          )
                                        )
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`custom-channel-${channel.value}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    {channel.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
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
              <Button type="submit">Save Settings</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
