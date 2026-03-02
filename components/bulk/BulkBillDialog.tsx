'use client'

import { useState, useEffect, useMemo } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { mockBuildings } from '@/data/mockBuildings'
import { getFloorsByBuilding } from '@/data/mockFloors'
import { mockFlats } from '@/data/mockBuildings'
import { getBillTemplates } from '@/data/mockBillTemplates'
import type { BulkBillGenerationData } from '@/types/bulk'
import { Calendar, Building2, FileText } from 'lucide-react'

const bulkBillSchema = z.object({
  buildingId: z.string().optional(),
  floorIds: z.array(z.string()).optional(),
  flatIds: z.array(z.string()).optional(),
  month: z.string().min(1, 'Month is required'),
  year: z.number().min(2020).max(2100),
  templateId: z.string().optional(),
  includeUnpaid: z.boolean(),
})

interface BulkBillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: BulkBillGenerationData) => void
}

export function BulkBillDialog({ open, onOpenChange, onSubmit }: BulkBillDialogProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [selectedFloors, setSelectedFloors] = useState<string[]>([])
  const [selectedFlats, setSelectedFlats] = useState<string[]>([])

  const templates = getBillTemplates()
  const floors = selectedBuilding ? getFloorsByBuilding(selectedBuilding) : []
  const availableFlats = selectedBuilding
    ? mockFlats.filter(f => f.buildingId === selectedBuilding)
    : []

  const form = useForm<BulkBillGenerationData>({
    resolver: zodResolver(bulkBillSchema),
    defaultValues: {
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear(),
      includeUnpaid: false,
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setSelectedBuilding('')
      setSelectedFloors([])
      setSelectedFlats([])
    }
  }, [open, form])

  const handleSubmit = (data: BulkBillGenerationData) => {
    onSubmit({
      ...data,
      buildingId: selectedBuilding || undefined,
      floorIds: selectedFloors.length > 0 ? selectedFloors : undefined,
      flatIds: selectedFlats.length > 0 ? selectedFlats : undefined,
    })
    form.reset()
    setSelectedBuilding('')
    setSelectedFloors([])
    setSelectedFlats([])
    onOpenChange(false)
  }

  const selectedCount = useMemo(() => {
    if (selectedFlats.length > 0) return selectedFlats.length
    if (selectedFloors.length > 0) {
      return floors
        .filter(f => selectedFloors.includes(f.id))
        .reduce((sum, f) => sum + f.totalFlats, 0)
    }
    if (selectedBuilding) {
      return availableFlats.length
    }
    return 0
  }, [selectedBuilding, selectedFloors, selectedFlats, floors, availableFlats])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Bulk Bill Generation
          </DialogTitle>
          <DialogDescription>
            Generate bills for multiple flats at once
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
              <div className="space-y-4">
                {/* Building Selection */}
                <FormField
                  control={form.control}
                  name="buildingId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Building (Optional)</FormLabel>
                      <Select
                        value={selectedBuilding}
                        onValueChange={value => {
                          setSelectedBuilding(value)
                          setSelectedFloors([])
                          setSelectedFlats([])
                          field.onChange(value)
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a building" />
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
                      <FormDescription>
                        Select a building to generate bills for all its flats
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Floor Selection */}
                {selectedBuilding && floors.length > 0 && (
                  <div className="space-y-2">
                    <FormLabel>Select Floors (Optional)</FormLabel>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                      {floors.map(floor => (
                        <div key={floor.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`floor-${floor.id}`}
                            checked={selectedFloors.includes(floor.id)}
                            onCheckedChange={checked => {
                              if (checked) {
                                setSelectedFloors([...selectedFloors, floor.id])
                                setSelectedFlats([])
                              } else {
                                setSelectedFloors(selectedFloors.filter(id => id !== floor.id))
                              }
                            }}
                          />
                          <label
                            htmlFor={`floor-${floor.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {floor.name || `Floor ${floor.floorNumber}`} ({floor.totalFlats} flats)
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormDescription>
                      Select specific floors. Leave empty to select all floors.
                    </FormDescription>
                  </div>
                )}

                {/* Flat Selection */}
                {selectedBuilding && availableFlats.length > 0 && (
                  <div className="space-y-2">
                    <FormLabel>Select Flats (Optional)</FormLabel>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                      {availableFlats.map(flat => (
                        <div key={flat.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`flat-${flat.id}`}
                            checked={selectedFlats.includes(flat.id)}
                            onCheckedChange={checked => {
                              if (checked) {
                                setSelectedFlats([...selectedFlats, flat.id])
                                setSelectedFloors([])
                              } else {
                                setSelectedFlats(selectedFlats.filter(id => id !== flat.id))
                              }
                            }}
                          />
                          <label
                            htmlFor={`flat-${flat.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            Flat {flat.flatNumber}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormDescription>
                      Select specific flats. Leave empty to select all flats.
                    </FormDescription>
                  </div>
                )}

                {/* Month and Year */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Month</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              'January', 'February', 'March', 'April', 'May', 'June',
                              'July', 'August', 'September', 'October', 'November', 'December',
                            ].map(month => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || new Date().getFullYear())}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Template Selection */}
                {templates.length > 0 && (
                  <FormField
                    control={form.control}
                    name="templateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bill Template (Optional)</FormLabel>
                        <Select value={field.value || ''} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None (Manual)</SelectItem>
                            {templates.map(template => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Use a template for automated bill generation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Include Unpaid */}
                <FormField
                  control={form.control}
                  name="includeUnpaid"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Include Unpaid Bills</FormLabel>
                        <FormDescription>
                          Generate bills even if previous bills are unpaid
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            {/* Summary */}
            {selectedCount > 0 && (
              <div className="rounded-lg border p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Selected for Bill Generation</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedCount} flat{selectedCount !== 1 ? 's' : ''} will receive bills
                    </p>
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {selectedCount}
                  </Badge>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={selectedCount === 0}>
                Generate Bills
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
