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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Download } from 'lucide-react'
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  formatISO,
} from 'date-fns'

const attendanceReportSchema = z.object({
  reportType: z.enum(['daily', 'weekly', 'monthly', 'custom']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
})

interface AttendanceReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function AttendanceReportDialog({
  open,
  onOpenChange,
  onSubmit,
}: AttendanceReportDialogProps) {
  const form = useForm({
    resolver: zodResolver(attendanceReportSchema),
    defaultValues: {
      reportType: 'monthly' as const,
      startDate: '',
      endDate: '',
    },
  })

  useEffect(() => {
    if (open) {
      const today = new Date()
      const monthStart = formatISO(startOfMonth(today), {
        representation: 'date',
      })
      const monthEnd = formatISO(endOfMonth(today), { representation: 'date' })

      form.reset({
        reportType: 'monthly',
        startDate: monthStart,
        endDate: monthEnd,
      })
    }
  }, [open, form])

  const handleReportTypeChange = (type: string) => {
    const today = new Date()
    let startDate = ''
    let endDate = ''

    switch (type) {
      case 'daily':
        const todayStr = formatISO(today, { representation: 'date' })
        startDate = todayStr
        endDate = todayStr
        break
      case 'weekly':
        startDate = formatISO(startOfWeek(today, { weekStartsOn: 1 }), {
          representation: 'date',
        })
        endDate = formatISO(endOfWeek(today, { weekStartsOn: 1 }), {
          representation: 'date',
        })
        break
      case 'monthly':
        startDate = formatISO(startOfMonth(today), { representation: 'date' })
        endDate = formatISO(endOfMonth(today), { representation: 'date' })
        break
      case 'custom':
        // Keep current dates or set to today
        startDate =
          form.getValues('startDate') ||
          formatISO(today, { representation: 'date' })
        endDate =
          form.getValues('endDate') ||
          formatISO(today, { representation: 'date' })
        break
    }

    form.setValue('reportType', type as any)
    form.setValue('startDate', startDate)
    form.setValue('endDate', endDate)
  }

  const handleSubmit = (data: any) => {
    onSubmit(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Attendance Report</DialogTitle>
          <DialogDescription>
            Generate attendance reports for analysis and record-keeping
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              {/* Report Type */}
              <FormField
                control={form.control}
                name="reportType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Report Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={value => {
                          field.onChange(value)
                          handleReportTypeChange(value)
                        }}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="daily" id="daily" />
                          <label htmlFor="daily" className="cursor-pointer">
                            Daily
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="weekly" id="weekly" />
                          <label htmlFor="weekly" className="cursor-pointer">
                            Weekly
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <label htmlFor="monthly" className="cursor-pointer">
                            Monthly
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="custom" id="custom" />
                          <label htmlFor="custom" className="cursor-pointer">
                            Custom
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={form.watch('reportType') !== 'custom'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={form.watch('reportType') !== 'custom'}
                        />
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
              <Button type="submit">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
