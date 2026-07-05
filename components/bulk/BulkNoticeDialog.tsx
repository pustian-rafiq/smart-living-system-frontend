'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { fetchOwnerPortfolioSnapshot, fetchFloorsByBuilding } from '@/lib/api/buildings'
import { ok } from '@/lib/api/http'
import { useMockQuery } from '@/hooks/useMockQuery'
import type { BulkNoticeData } from '@/types/bulk'
import { Bell } from 'lucide-react'

const bulkNoticeSchema = z.object({
  buildingId: z.string().optional(),
  floorIds: z.array(z.string()).optional(),
  flatIds: z.array(z.string()).optional(),
  messId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  priority: z.enum(['high', 'medium', 'low']),
  category: z.enum([
    'general',
    'payment',
    'maintenance',
    'event',
    'announcement',
    'rule',
    'other',
  ]),
  expiryDate: z.string().optional(),
})

interface BulkNoticeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: BulkNoticeData) => void
}

export function BulkNoticeDialog({
  open,
  onOpenChange,
  onSubmit,
}: BulkNoticeDialogProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [selectedFloors, setSelectedFloors] = useState<string[]>([])
  const [selectedFlats, setSelectedFlats] = useState<string[]>([])
  const [selectedMess, setSelectedMess] = useState<string>('')
  const [expiryDate, setExpiryDate] = useState<Date | undefined>()

  const loadPortfolio = useCallback(
    () =>
      open
        ? fetchOwnerPortfolioSnapshot()
        : Promise.resolve(ok({ buildings: [], flats: [], messList: [] })),
    [open]
  )
  const { data: portfolio } = useMockQuery(loadPortfolio)

  const loadFloors = useCallback(
    () =>
      open && selectedBuilding
        ? fetchFloorsByBuilding(selectedBuilding)
        : Promise.resolve(ok([])),
    [open, selectedBuilding]
  )
  const { data: floorsData } = useMockQuery(loadFloors)

  const floors = floorsData ?? []
  const buildings = portfolio?.buildings ?? []
  const messList = portfolio?.messList ?? []
  const availableFlats = selectedBuilding
    ? (portfolio?.flats ?? []).filter(f => f.buildingId === selectedBuilding)
    : []

  const form = useForm<BulkNoticeData>({
    resolver: zodResolver(bulkNoticeSchema),
    defaultValues: {
      priority: 'medium',
      category: 'general',
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setSelectedBuilding('')
      setSelectedFloors([])
      setSelectedFlats([])
      setSelectedMess('')
      setExpiryDate(undefined)
    }
  }, [open, form])

  const handleSubmit = (data: BulkNoticeData) => {
    onSubmit({
      ...data,
      buildingId: selectedBuilding || undefined,
      floorIds: selectedFloors.length > 0 ? selectedFloors : undefined,
      flatIds: selectedFlats.length > 0 ? selectedFlats : undefined,
      messId: selectedMess || undefined,
      expiryDate: expiryDate ? expiryDate.toISOString() : undefined,
    })
    form.reset()
    setSelectedBuilding('')
    setSelectedFloors([])
    setSelectedFlats([])
    setSelectedMess('')
    setExpiryDate(undefined)
    onOpenChange(false)
  }

  const selectedCount = useMemo(() => {
    if (selectedMess)
      return messList.find(m => m.id === selectedMess)?.totalSeats || 0
    if (selectedFlats.length > 0) return selectedFlats.length
    if (selectedFloors.length > 0) {
      return floors
        .filter(f => selectedFloors.includes(f.id))
        .reduce((sum, f) => sum + f.totalFlats, 0)
    }
    if (selectedBuilding) return availableFlats.length
    return 0
  }, [
    selectedMess,
    selectedFlats,
    selectedFloors,
    selectedBuilding,
    floors,
    availableFlats,
    messList,
  ])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Bulk Notice Sending
          </DialogTitle>
          <DialogDescription>
            Send notices to multiple recipients at once
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <ScrollArea className="max-h-[calc(90vh-200px)] pr-4">
              <div className="space-y-4">
                {/* Recipient Selection */}
                <div className="space-y-4">
                  <FormLabel>Recipients</FormLabel>

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
                            setSelectedMess('')
                            field.onChange(value)
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a building" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {buildings.map(building => (
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

                  {/* Mess Selection */}
                  <FormField
                    control={form.control}
                    name="messId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mess (Optional)</FormLabel>
                        <Select
                          value={selectedMess}
                          onValueChange={value => {
                            setSelectedMess(value)
                            setSelectedBuilding('')
                            setSelectedFloors([])
                            setSelectedFlats([])
                            field.onChange(value)
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a mess" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {messList.map(mess => (
                              <SelectItem key={mess.id} value={mess.id}>
                                {mess.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                          <div
                            key={floor.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`floor-${floor.id}`}
                              checked={selectedFloors.includes(floor.id)}
                              onCheckedChange={checked => {
                                if (checked) {
                                  setSelectedFloors([
                                    ...selectedFloors,
                                    floor.id,
                                  ])
                                  setSelectedFlats([])
                                } else {
                                  setSelectedFloors(
                                    selectedFloors.filter(id => id !== floor.id)
                                  )
                                }
                              }}
                            />
                            <label
                              htmlFor={`floor-${floor.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {floor.name || `Floor ${floor.floorNumber}`}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Flat Selection */}
                  {selectedBuilding && availableFlats.length > 0 && (
                    <div className="space-y-2">
                      <FormLabel>Select Flats (Optional)</FormLabel>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                        {availableFlats.map(flat => (
                          <div
                            key={flat.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`flat-${flat.id}`}
                              checked={selectedFlats.includes(flat.id)}
                              onCheckedChange={checked => {
                                if (checked) {
                                  setSelectedFlats([...selectedFlats, flat.id])
                                  setSelectedFloors([])
                                } else {
                                  setSelectedFlats(
                                    selectedFlats.filter(id => id !== flat.id)
                                  )
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
                    </div>
                  )}
                </div>

                {/* Notice Details */}
                <div className="space-y-4 pt-4 border-t">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notice Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter notice title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notice Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter notice content..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="payment">Payment</SelectItem>
                              <SelectItem value="maintenance">
                                Maintenance
                              </SelectItem>
                              <SelectItem value="event">Event</SelectItem>
                              <SelectItem value="announcement">
                                Announcement
                              </SelectItem>
                              <SelectItem value="rule">Rule</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {expiryDate
                                  ? format(expiryDate, 'PPP')
                                  : 'Select date'}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={expiryDate}
                              onSelect={date => {
                                setExpiryDate(date)
                                field.onChange(date?.toISOString())
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </ScrollArea>

            {/* Summary */}
            {selectedCount > 0 && (
              <div className="rounded-lg border p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Recipients</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedCount} recipient{selectedCount !== 1 ? 's' : ''}{' '}
                      will receive this notice
                    </p>
                  </div>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {selectedCount}
                  </Badge>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={selectedCount === 0}>
                Send Notice
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
