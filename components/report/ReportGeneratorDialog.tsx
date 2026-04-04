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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { FileText, Download } from 'lucide-react'
import type { ReportFormat, ReportType } from '@/types/report'

const reportGeneratorSchema = z.object({
  reportType: z.enum(['expense', 'payment', 'tax', 'comprehensive']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  format: z.enum(['pdf', 'excel', 'csv']),
  taxYear: z.number().optional(),
  documentType: z
    .enum(['rent_receipt', 'expense_summary', 'tax_certificate'])
    .optional(),
})

interface ReportGeneratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function ReportGeneratorDialog({
  open,
  onOpenChange,
  onSubmit,
}: ReportGeneratorDialogProps) {
  const currentYear = new Date().getFullYear()
  const form = useForm({
    resolver: zodResolver(reportGeneratorSchema),
    defaultValues: {
      reportType: 'expense' as ReportType,
      startDate: new Date(currentYear, 0, 1).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      format: 'pdf' as ReportFormat,
      taxYear: currentYear,
      documentType: 'rent_receipt' as const,
    },
  })

  useEffect(() => {
    if (open) {
      const currentYear = new Date().getFullYear()
      form.reset({
        reportType: 'expense',
        startDate: new Date(currentYear, 0, 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        format: 'pdf',
        taxYear: currentYear,
        documentType: 'rent_receipt',
      })
    }
  }, [open, form])

  const handleSubmit = (data: any) => {
    onSubmit(data)
    form.reset()
    onOpenChange(false)
  }

  const reportType = form.watch('reportType')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Report
          </DialogTitle>
          <DialogDescription>
            Generate expense, payment, or tax reports for your records
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
                        onValueChange={field.onChange}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="expense" id="expense" />
                          <label htmlFor="expense" className="cursor-pointer">
                            Expense Report
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="payment" id="payment" />
                          <label htmlFor="payment" className="cursor-pointer">
                            Payment Report
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tax" id="tax" />
                          <label htmlFor="tax" className="cursor-pointer">
                            Tax Document
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="comprehensive"
                            id="comprehensive"
                          />
                          <label
                            htmlFor="comprehensive"
                            className="cursor-pointer"
                          >
                            Comprehensive
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tax Year (for tax documents) */}
              {reportType === 'tax' && (
                <FormField
                  control={form.control}
                  name="taxYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e =>
                            field.onChange(
                              parseInt(e.target.value) || currentYear
                            )
                          }
                          value={field.value || currentYear}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Document Type (for tax documents) */}
              {reportType === 'tax' && (
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <Select
                        value={field.value || 'rent_receipt'}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="rent_receipt">
                            Rent Receipt
                          </SelectItem>
                          <SelectItem value="expense_summary">
                            Expense Summary
                          </SelectItem>
                          <SelectItem value="tax_certificate">
                            Tax Certificate
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Format */}
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Export Format</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the format for your report export
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
