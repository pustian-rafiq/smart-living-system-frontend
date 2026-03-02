'use client'

import { useState, useEffect } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Upload, FileText, X } from 'lucide-react'
import { mockBuildings, mockFlats } from '@/data/mockBuildings'
import type { RentalAgreement } from '@/types/agreement'

const agreementUploadSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  flatId: z.string().optional(),
  agreementType: z.enum(['rental', 'lease', 'sublease']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  monthlyRent: z.number().min(0, 'Monthly rent must be positive'),
  securityDeposit: z.number().min(0, 'Security deposit must be positive'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  renewalReminderDays: z.array(z.number()),
  duration: z.number().optional(),
  noticePeriod: z.number().optional(),
  renewalTerms: z.string().optional(),
  specialConditions: z.array(z.string()).optional(),
})

interface AgreementUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  agreement?: RentalAgreement | null
}

export function AgreementUploadDialog({
  open,
  onOpenChange,
  onSubmit,
  agreement,
}: AgreementUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [specialCondition, setSpecialCondition] = useState('')

  const form = useForm({
    resolver: zodResolver(agreementUploadSchema),
    defaultValues: {
      agreementType: 'rental' as const,
      monthlyRent: 0,
      securityDeposit: 0,
      renewalReminderDays: [30, 15, 7],
      specialConditions: [] as string[],
    },
  })

  useEffect(() => {
    if (agreement && open) {
      form.reset({
        propertyId: agreement.propertyId,
        flatId: agreement.flatId,
        agreementType: agreement.agreementType,
        startDate: agreement.startDate.split('T')[0],
        endDate: agreement.endDate.split('T')[0],
        monthlyRent: agreement.monthlyRent,
        securityDeposit: agreement.securityDeposit,
        expiryDate: agreement.expiryDate.split('T')[0],
        renewalReminderDays: agreement.renewalReminderDays,
        duration: agreement.terms?.duration,
        noticePeriod: agreement.terms?.noticePeriod,
        renewalTerms: agreement.terms?.renewalTerms,
        specialConditions: agreement.terms?.specialConditions || [],
      })
      setFilePreview(agreement.documentUrl)
    } else if (!agreement && open) {
      form.reset()
      setFile(null)
      setFilePreview(null)
    }
  }, [agreement, open, form])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        alert('Please upload a PDF file')
        return
      }
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = (data: any) => {
    if (!file && !filePreview) {
      alert('Please upload an agreement document')
      return
    }

    onSubmit({
      ...data,
      file: file || null,
      documentUrl: filePreview || agreement?.documentUrl,
      documentName: file?.name || agreement?.documentName || 'agreement.pdf',
      documentSize: file?.size || agreement?.documentSize || 0,
      flatNumber: availableFlats.find(f => f.id === data.flatId)?.flatNumber,
    })
    form.reset()
    setFile(null)
    setFilePreview(null)
    setSelectedPropertyId('')
    onOpenChange(false)
  }

  const addSpecialCondition = () => {
    if (specialCondition.trim()) {
      const current = form.getValues('specialConditions') || []
      form.setValue('specialConditions', [...current, specialCondition.trim()])
      setSpecialCondition('')
    }
  }

  const removeSpecialCondition = (index: number) => {
    const current = form.getValues('specialConditions') || []
    form.setValue('specialConditions', current.filter((_, i) => i !== index))
  }

  const reminderDays = [1, 2, 3, 5, 7, 14, 30, 60]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{agreement ? 'Update Agreement' : 'Upload Agreement'}</DialogTitle>
          <DialogDescription>
            {agreement
              ? 'Update your rental agreement details'
              : 'Upload and configure your rental agreement'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
              <div className="space-y-4">
                {/* Property Selection */}
                <FormField
                  control={form.control}
                  name="propertyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property</FormLabel>
                      <Select
                        value={selectedPropertyId || field.value || ''}
                        onValueChange={value => {
                          setSelectedPropertyId(value)
                          field.onChange(value)
                          form.setValue('flatId', undefined)
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a property" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockBuildings.map(building => (
                            <SelectItem key={building.id} value={building.id}>
                              {building.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Flat Selection */}
                {selectedPropertyId && availableFlats.length > 0 && (
                  <FormField
                    control={form.control}
                    name="flatId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flat (Optional)</FormLabel>
                        <Select value={field.value || ''} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a flat" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {availableFlats.map(flat => (
                              <SelectItem key={flat.id} value={flat.id}>
                                Flat {flat.flatNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* File Upload */}
                <FormItem>
                  <FormLabel>Agreement Document (PDF)</FormLabel>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      disabled={!!agreement}
                    />
                    {filePreview && (
                      <div className="rounded-lg border p-3 bg-muted/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="text-sm font-medium">
                              {file?.name || agreement?.documentName || 'agreement.pdf'}
                            </span>
                          </div>
                          {!agreement && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setFile(null)
                                setFilePreview(null)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <FormDescription>
                    Upload a PDF file of your rental agreement
                  </FormDescription>
                </FormItem>

                {/* Agreement Type */}
                <FormField
                  control={form.control}
                  name="agreementType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agreement Type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="rental">Rental</SelectItem>
                          <SelectItem value="lease">Lease</SelectItem>
                          <SelectItem value="sublease">Sublease</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Financial Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="monthlyRent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Rent (৳)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="securityDeposit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Security Deposit (৳)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Renewal Reminders */}
                <FormField
                  control={form.control}
                  name="renewalReminderDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Renewal Reminder Days</FormLabel>
                      <div className="grid grid-cols-4 gap-2">
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
                              {day}d
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormDescription>
                        Select days before expiry to receive reminders
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Terms */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold">Terms & Conditions</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (months)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="noticePeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notice Period (days)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="renewalTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Renewal Terms</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe renewal terms..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Special Conditions */}
                  <FormField
                    control={form.control}
                    name="specialConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Conditions</FormLabel>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a condition..."
                              value={specialCondition}
                              onChange={e => setSpecialCondition(e.target.value)}
                              onKeyPress={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault()
                                  addSpecialCondition()
                                }
                              }}
                            />
                            <Button type="button" onClick={addSpecialCondition}>
                              Add
                            </Button>
                          </div>
                          {field.value && field.value.length > 0 && (
                            <div className="space-y-1">
                              {field.value.map((condition, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between rounded-lg border p-2 bg-muted/30"
                                >
                                  <span className="text-sm">{condition}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSpecialCondition(index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{agreement ? 'Update' : 'Upload'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
