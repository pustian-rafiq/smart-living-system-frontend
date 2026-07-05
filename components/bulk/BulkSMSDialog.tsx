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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { fetchOwnerPortfolioSnapshot, fetchFloorsByBuilding } from '@/lib/api/buildings'
import { ok } from '@/lib/api/http'
import { useMockQuery } from '@/hooks/useMockQuery'
import type { BulkSMSData } from '@/types/bulk'
import { MessageSquare, Clock } from 'lucide-react'

const bulkSMSSchema = z.object({
  buildingId: z.string().optional(),
  floorIds: z.array(z.string()).optional(),
  flatIds: z.array(z.string()).optional(),
  messId: z.string().optional(),
  recipientType: z.enum(['all', 'owners', 'renters', 'custom']),
  customRecipients: z.array(z.string()).optional(),
  message: z.string().min(1, 'Message is required'),
  scheduledTime: z.string().optional(),
})

interface BulkSMSDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: BulkSMSData) => void
}

export function BulkSMSDialog({
  open,
  onOpenChange,
  onSubmit,
}: BulkSMSDialogProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('')
  const [selectedFloors, setSelectedFloors] = useState<string[]>([])
  const [selectedFlats, setSelectedFlats] = useState<string[]>([])
  const [selectedMess, setSelectedMess] = useState<string>('')
  const [customRecipients, setCustomRecipients] = useState<string[]>([])
  const [customPhone, setCustomPhone] = useState('')

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

  const form = useForm<BulkSMSData>({
    resolver: zodResolver(bulkSMSSchema),
    defaultValues: {
      recipientType: 'all',
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
      setSelectedBuilding('')
      setSelectedFloors([])
      setSelectedFlats([])
      setSelectedMess('')
      setCustomRecipients([])
      setCustomPhone('')
    }
  }, [open, form])

  const handleSubmit = (data: BulkSMSData) => {
    onSubmit({
      ...data,
      buildingId: selectedBuilding || undefined,
      floorIds: selectedFloors.length > 0 ? selectedFloors : undefined,
      flatIds: selectedFlats.length > 0 ? selectedFlats : undefined,
      messId: selectedMess || undefined,
      customRecipients:
        customRecipients.length > 0 ? customRecipients : undefined,
    })
    form.reset()
    setSelectedBuilding('')
    setSelectedFloors([])
    setSelectedFlats([])
    setSelectedMess('')
    setCustomRecipients([])
    setCustomPhone('')
    onOpenChange(false)
  }

  const addCustomRecipient = () => {
    if (customPhone && !customRecipients.includes(customPhone)) {
      setCustomRecipients([...customRecipients, customPhone])
      setCustomPhone('')
    }
  }

  const removeCustomRecipient = (phone: string) => {
    setCustomRecipients(customRecipients.filter(p => p !== phone))
  }

  const recipientType = form.watch('recipientType')
  const selectedCount = useMemo(() => {
    if (recipientType === 'custom') return customRecipients.length
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
    recipientType,
    customRecipients.length,
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
            <MessageSquare className="h-5 w-5" />
            Bulk SMS Sending
          </DialogTitle>
          <DialogDescription>
            Send SMS messages to multiple recipients at once
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
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
                            <label htmlFor="all" className="cursor-pointer">
                              All
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="owners" id="owners" />
                            <label htmlFor="owners" className="cursor-pointer">
                              Owners
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="renters" id="renters" />
                            <label htmlFor="renters" className="cursor-pointer">
                              Renters
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

                {/* Custom Recipients */}
                {form.watch('recipientType') === 'custom' && (
                  <div className="space-y-2">
                    <FormLabel>Custom Recipients</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        value={customPhone}
                        onChange={e => setCustomPhone(e.target.value)}
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addCustomRecipient()
                          }
                        }}
                      />
                      <Button type="button" onClick={addCustomRecipient}>
                        Add
                      </Button>
                    </div>
                    {customRecipients.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {customRecipients.map(phone => (
                          <Badge
                            key={phone}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            {phone}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0"
                              onClick={() => removeCustomRecipient(phone)}
                            >
                              ×
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Building Selection */}
                {form.watch('recipientType') !== 'custom' && (
                  <>
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
                                <SelectItem
                                  key={building.id}
                                  value={building.id}
                                >
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
                                      selectedFloors.filter(
                                        id => id !== floor.id
                                      )
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
                                    setSelectedFlats([
                                      ...selectedFlats,
                                      flat.id,
                                    ])
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
                  </>
                )}

                {/* Message */}
                <div className="pt-4 border-t">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your SMS message..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Character count: {field.value?.length || 0} / 160
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Scheduled Time */}
                <FormField
                  control={form.control}
                  name="scheduledTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Schedule SMS (Optional)
                      </FormLabel>
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
                      will receive this SMS
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
                Send SMS
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
