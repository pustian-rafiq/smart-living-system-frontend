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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Calendar, Clock } from 'lucide-react'
import type { ScheduledPayment, PaymentMethod } from '@/types/payment'
import { mockBills } from '@/data/mockBills'

const schedulePaymentSchema = z.object({
  billId: z.string().min(1, 'Bill is required'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  scheduledTime: z.string().optional(),
  paymentMethod: z.enum(['bKash', 'Nagad', 'Rocket', 'Bank Transfer', 'Cash', 'Card']),
  accountNumber: z.string().optional(),
  reminderEnabled: z.boolean(),
  reminderDays: z.array(z.number()),
  autoRetry: z.boolean(),
  maxRetries: z.number().optional(),
})

interface SchedulePaymentDialogProps {
  payment?: ScheduledPayment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

const reminderDays = [0, 1, 2, 3, 5, 7]

export function SchedulePaymentDialog({
  payment,
  billId,
  open,
  onOpenChange,
  onSubmit,
}: SchedulePaymentDialogProps) {
  const userBills = mockBills.filter(b => b.tenantId === 'r1' && b.status === 'unpaid')

  const form = useForm({
    resolver: zodResolver(schedulePaymentSchema),
    defaultValues: {
      billId: '',
      scheduledDate: '',
      scheduledTime: '10:00',
      paymentMethod: 'bKash' as PaymentMethod,
      accountNumber: '',
      reminderEnabled: true,
      reminderDays: [1, 0],
      autoRetry: false,
      maxRetries: 0,
    },
  })

  useEffect(() => {
    if (payment && open) {
      form.reset({
        billId: payment.billId,
        scheduledDate: payment.scheduledDate,
        scheduledTime: payment.scheduledTime || '10:00',
        paymentMethod: payment.paymentMethod,
        accountNumber: payment.accountNumber || '',
        reminderEnabled: payment.reminderEnabled,
        reminderDays: payment.reminderDays,
        autoRetry: payment.autoRetry,
        maxRetries: payment.maxRetries,
      })
    } else if (!payment && open) {
      form.reset({
        billId: billId || userBills[0]?.id || '',
        scheduledDate: '',
        scheduledTime: '10:00',
        paymentMethod: 'bKash',
        accountNumber: '',
        reminderEnabled: true,
        reminderDays: [1, 0],
        autoRetry: false,
        maxRetries: 0,
      })
    }
  }, [payment, open, form, userBills])

  const handleSubmit = (data: any) => {
    const selectedBill = userBills.find(b => b.id === data.billId)
    onSubmit({
      ...data,
      billName: selectedBill
        ? `${selectedBill.month} ${selectedBill.year} - ${selectedBill.propertyName}`
        : 'Payment',
      amount: selectedBill?.amount || 0,
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {payment ? 'Edit Scheduled Payment' : 'Schedule Payment'}
          </DialogTitle>
          <DialogDescription>
            Schedule a payment for a future date with automatic reminders
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
              <div className="space-y-4">
                {/* Bill Selection */}
                <FormField
                  control={form.control}
                  name="billId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Bill</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a bill" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userBills.map(bill => (
                            <SelectItem key={bill.id} value={bill.id}>
                              {bill.month} {bill.year} - {bill.propertyName} (৳{bill.amount.toLocaleString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Schedule Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Scheduled Date
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="scheduledTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Time (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Payment Method */}
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bKash">bKash</SelectItem>
                          <SelectItem value="Nagad">Nagad</SelectItem>
                          <SelectItem value="Rocket">Rocket</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Account Number */}
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 01712345678" {...field} />
                      </FormControl>
                      <FormDescription>
                        Your payment account number for this method
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reminder Settings */}
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Payment Reminders</h3>
                      <p className="text-sm text-muted-foreground">
                        Get notified before the scheduled payment
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="reminderEnabled"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch('reminderEnabled') && (
                    <FormField
                      control={form.control}
                      name="reminderDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Remind Me (Days Before)</FormLabel>
                          <div className="grid grid-cols-3 gap-2">
                            {reminderDays.map(day => (
                              <div key={day} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`reminder-${day}`}
                                  checked={field.value?.includes(day)}
                                  onCheckedChange={checked => {
                                    const current = field.value || []
                                    if (checked) {
                                      field.onChange([...current, day].sort((a, b) => b - a))
                                    } else {
                                      field.onChange(current.filter(d => d !== day))
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`reminder-${day}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {day === 0 ? 'On day' : `${day} day${day !== 1 ? 's' : ''}`}
                                </label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Auto-retry Settings */}
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Auto-retry on Failure</h3>
                      <p className="text-sm text-muted-foreground">
                        Automatically retry payment if it fails
                      </p>
                    </div>
                    <FormField
                      control={form.control}
                      name="autoRetry"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {form.watch('autoRetry') && (
                    <FormField
                      control={form.control}
                      name="maxRetries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Retries</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="5"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                              value={field.value || 1}
                            />
                          </FormControl>
                          <FormDescription>
                            Number of times to retry if payment fails (1-5)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{payment ? 'Update' : 'Schedule'} Payment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
