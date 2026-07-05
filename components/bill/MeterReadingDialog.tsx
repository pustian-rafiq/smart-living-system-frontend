'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fetchBillsBoard } from '@/lib/api/bills'
import { ok } from '@/lib/api/http'
import { useMockQuery } from '@/hooks/useMockQuery'
import type { MeterReading } from '@/types/bill'

const meterReadingSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  propertyType: z.enum(['apartment', 'mess']),
  flatId: z.string().optional(),
  seatId: z.string().optional(),
  month: z.string().min(1, 'Month is required'),
  year: z.coerce.number().min(2020).max(2100),
  electricity: z.coerce.number().min(0).optional(),
  gas: z.coerce.number().min(0).optional(),
  water: z.coerce.number().min(0).optional(),
})

type MeterReadingFormData = z.infer<typeof meterReadingSchema>

interface MeterReadingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: MeterReadingFormData) => void
  reading?: MeterReading
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const currentYear = new Date().getFullYear()
const currentMonth = months[new Date().getMonth()]

export function MeterReadingDialog({
  open,
  onOpenChange,
  onSubmit,
  reading,
}: MeterReadingDialogProps) {
  const [selectedPropertyType, setSelectedPropertyType] = useState<
    'apartment' | 'mess'
  >(reading?.propertyType || 'apartment')
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    reading?.propertyId || ''
  )
  const [selectedFlatId, setSelectedFlatId] = useState<string>(
    reading?.flatId || ''
  )
  const [previousReading, setPreviousReading] = useState<
    MeterReading | undefined
  >()

  const loadBillsBoard = useCallback(
    () =>
      open
        ? fetchBillsBoard()
        : Promise.resolve(
            ok({
              bills: [],
              templates: [],
              rules: [],
              meterReadings: [],
              buildings: [],
              flats: [],
              renters: [],
              messList: [],
            })
          ),
    [open]
  )
  const { data: billsBoard } = useMockQuery(loadBillsBoard)

  const form = useForm<MeterReadingFormData>({
    resolver: zodResolver(meterReadingSchema) as never,
    defaultValues: reading
      ? {
          propertyId: reading.propertyId,
          propertyType: reading.propertyType,
          flatId: reading.flatId,
          seatId: reading.seatId,
          month: reading.month,
          year: reading.year,
          electricity: reading.electricity,
          gas: reading.gas,
          water: reading.water,
        }
      : {
          propertyId: '',
          propertyType: 'apartment',
          month: currentMonth,
          year: currentYear,
          electricity: undefined,
          gas: undefined,
          water: undefined,
        },
  })

  const propertyId = form.watch('propertyId')
  const flatId = form.watch('flatId')
  const month = form.watch('month')
  const year = form.watch('year')
  const electricity = form.watch('electricity')
  const gas = form.watch('gas')
  const water = form.watch('water')

  // Load previous reading when property/flat/month changes
  useEffect(() => {
    if (propertyId && month && year) {
      const currentIndex = months.indexOf(month)
      const prevMonth = currentIndex === 0 ? 'December' : months[currentIndex - 1]
      const prevYear = currentIndex === 0 ? year - 1 : year
      const prev = (billsBoard?.meterReadings ?? []).find(
        item =>
          item.propertyId === propertyId &&
          item.flatId === (flatId || undefined) &&
          item.seatId === undefined &&
          item.month === prevMonth &&
          item.year === prevYear
      )
      setPreviousReading(prev)
    } else {
      setPreviousReading(undefined)
    }
  }, [propertyId, flatId, month, year, billsBoard])

  const handleSubmit = (data: MeterReadingFormData) => {
    onSubmit(data)
    if (!reading) {
      form.reset()
      setPreviousReading(undefined)
    }
  }

  const properties =
    selectedPropertyType === 'apartment'
      ? (billsBoard?.buildings ?? [])
      : (billsBoard?.messList ?? [])
  const availableFlats = selectedPropertyId
    ? (billsBoard?.flats ?? []).filter(f => f.buildingId === selectedPropertyId)
    : []

  // Calculate consumption
  const electricityConsumption =
    electricity && previousReading?.electricity
      ? electricity - previousReading.electricity
      : undefined
  const gasConsumption =
    gas && previousReading?.gas ? gas - previousReading.gas : undefined
  const waterConsumption =
    water && previousReading?.water ? water - previousReading.water : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {reading ? 'Edit Meter Reading' : 'Add Meter Reading'}
          </DialogTitle>
          <DialogDescription>
            {reading
              ? 'Update the meter reading information'
              : 'Record meter readings for utility bill calculation'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select
                      onValueChange={value => {
                        field.onChange(value)
                        setSelectedPropertyType(value as 'apartment' | 'mess')
                        form.setValue('propertyId', '')
                        form.setValue('flatId', '')
                        setSelectedPropertyId('')
                        setSelectedFlatId('')
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="mess">Mess</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property</FormLabel>
                    <Select
                      onValueChange={value => {
                        field.onChange(value)
                        setSelectedPropertyId(value)
                        form.setValue('flatId', '')
                        setSelectedFlatId('')
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {properties.map(prop => (
                          <SelectItem key={prop.id} value={prop.id}>
                            {prop.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedPropertyType === 'apartment' &&
              availableFlats.length > 0 && (
                <FormField
                  control={form.control}
                  name="flatId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flat</FormLabel>
                      <Select
                        onValueChange={value => {
                          field.onChange(value)
                          setSelectedFlatId(value)
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select flat" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableFlats.map(flat => (
                            <SelectItem key={flat.id} value={flat.id}>
                              {flat.flatNumber} - Floor {flat.floor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {months.map(month => (
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
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Previous Reading Display */}
            {previousReading && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Previous Reading
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {previousReading.electricity !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Electricity:
                      </span>
                      <span className="font-medium">
                        {previousReading.electricity} units
                      </span>
                    </div>
                  )}
                  {previousReading.gas !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gas:</span>
                      <span className="font-medium">
                        {previousReading.gas} units
                      </span>
                    </div>
                  )}
                  {previousReading.water !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Water:</span>
                      <span className="font-medium">
                        {previousReading.water} units
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Meter Readings */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                Current Meter Readings
              </Label>

              <FormField
                control={form.control}
                name="electricity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Electricity (units)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter current reading"
                        {...field}
                        onChange={e => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                    {electricityConsumption !== undefined && (
                      <FormDescription>
                        Consumption:{' '}
                        <Badge variant="outline">
                          {electricityConsumption} units
                        </Badge>
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gas (units)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter current reading"
                        {...field}
                        onChange={e => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                    {gasConsumption !== undefined && (
                      <FormDescription>
                        Consumption:{' '}
                        <Badge variant="outline">{gasConsumption} units</Badge>
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="water"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Water (units)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter current reading"
                        {...field}
                        onChange={e => {
                          const value = e.target.value
                            ? parseFloat(e.target.value)
                            : undefined
                          field.onChange(value)
                        }}
                      />
                    </FormControl>
                    {waterConsumption !== undefined && (
                      <FormDescription>
                        Consumption:{' '}
                        <Badge variant="outline">
                          {waterConsumption} units
                        </Badge>
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset()
                  setPreviousReading(undefined)
                  onOpenChange(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {reading ? 'Update Reading' : 'Save Reading'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
