'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
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
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Trash2, Zap, Calculator } from 'lucide-react'
import { mockBuildings, mockRenters, mockFlats } from '@/data/mockBuildings'
import { mockMess } from '@/data/mockMess'
import {
  getTemplatesByProperty,
  getActiveTemplates,
  getMeterReading,
  getPreviousMeterReading,
} from '@/data/mockBillTemplates'
import type { BillTemplate, MeterReading } from '@/types/bill'

const generateBillSchema = z.object({
  propertyId: z.string().min(1, 'Property is required'),
  propertyType: z.enum(['apartment', 'mess']),
  flatId: z.string().optional(),
  month: z.string().min(1, 'Month is required'),
  year: z.coerce.number().min(2020).max(2100),
  tenantId: z.string().min(1, 'Tenant is required'),
  templateId: z.string().optional(),
  useTemplate: z.boolean().optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1, 'Description is required'),
        amount: z.coerce.number().min(0, 'Amount must be positive'),
        type: z.enum(['rent', 'utility', 'maintenance', 'other']),
        calculationType: z
          .enum(['fixed', 'meter-based', 'percentage'])
          .optional(),
        unitRate: z.coerce.number().optional(),
        meterType: z.enum(['electricity', 'gas', 'water']).optional(),
        previousReading: z.coerce.number().optional(),
        currentReading: z.coerce.number().optional(),
        consumption: z.coerce.number().optional(),
      })
    )
    .min(1, 'At least one item is required'),
})

type GenerateBillFormData = z.infer<typeof generateBillSchema>

interface GenerateBillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (data: GenerateBillFormData) => void
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

export function GenerateBillDialog({
  open,
  onOpenChange,
  onGenerate,
}: GenerateBillDialogProps) {
  const [selectedPropertyType, setSelectedPropertyType] = useState<
    'apartment' | 'mess'
  >('apartment')
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('')
  const [selectedFlatId, setSelectedFlatId] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<
    BillTemplate | undefined
  >()
  const [meterReading, setMeterReading] = useState<MeterReading | undefined>()
  const [previousReading, setPreviousReading] = useState<
    MeterReading | undefined
  >()
  const [useTemplate, setUseTemplate] = useState(false)
  const [generationMode, setGenerationMode] = useState<'manual' | 'template'>(
    'manual'
  )

  const form = useForm<GenerateBillFormData>({
    resolver: zodResolver(generateBillSchema) as never,
    defaultValues: {
      propertyId: '',
      propertyType: 'apartment',
      flatId: undefined,
      month: months[new Date().getMonth()],
      year: currentYear,
      tenantId: '',
      templateId: undefined,
      useTemplate: false,
      items: [{ description: 'Monthly Rent', amount: 0, type: 'rent' }],
    },
  })

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const propertyId = form.watch('propertyId')
  const flatId = form.watch('flatId')
  const month = form.watch('month')
  const year = form.watch('year')
  const templateId = form.watch('templateId')
  const useTemplateValue = form.watch('useTemplate')

  // Get available templates for selected property
  const availableTemplates = useMemo(() => {
    if (!propertyId) return []
    return getTemplatesByProperty(propertyId).filter(t => t.isActive)
  }, [propertyId])

  // Get available flats for selected property
  const availableFlats = useMemo(() => {
    if (!propertyId || selectedPropertyType !== 'apartment') return []
    return mockFlats.filter(f => f.buildingId === propertyId && f.renter)
  }, [propertyId, selectedPropertyType])

  // Fetch meter reading when property/flat/month changes
  useEffect(() => {
    if (propertyId && month && year) {
      const reading = getMeterReading(
        propertyId,
        flatId,
        undefined,
        month,
        year
      )
      setMeterReading(reading)

      const prev = getPreviousMeterReading(
        propertyId,
        flatId,
        undefined,
        month,
        year
      )
      setPreviousReading(prev)
    } else {
      setMeterReading(undefined)
      setPreviousReading(undefined)
    }
  }, [propertyId, flatId, month, year])

  // Load template when selected
  useEffect(() => {
    if (templateId && useTemplateValue && availableTemplates.length > 0) {
      const template = availableTemplates.find(t => t.id === templateId)
      setSelectedTemplate(template)
      if (template) {
        calculateBillFromTemplate(template)
      }
    } else {
      setSelectedTemplate(undefined)
    }
  }, [templateId, useTemplateValue, availableTemplates, meterReading])

  // Calculate bill items from template
  const calculateBillFromTemplate = (template: BillTemplate) => {
    const calculatedItems: any[] = []

    // First pass: Calculate fixed and meter-based items
    template.items.forEach(item => {
      let amount = 0
      let consumption: number | undefined
      let previousReading: number | undefined
      let currentReading: number | undefined

      if (item.calculationType === 'fixed') {
        amount = item.fixedAmount || 0
      } else if (
        item.calculationType === 'meter-based' &&
        item.meterType &&
        meterReading
      ) {
        // Get consumption from meter reading
        if (item.meterType === 'electricity') {
          consumption = meterReading.electricityConsumption
          previousReading = meterReading.previousElectricity
          currentReading = meterReading.electricity
        } else if (item.meterType === 'gas') {
          consumption = meterReading.gasConsumption
          previousReading = meterReading.previousGas
          currentReading = meterReading.gas
        } else if (item.meterType === 'water') {
          consumption = meterReading.waterConsumption
          previousReading = meterReading.previousWater
          currentReading = meterReading.water
        }

        // Calculate amount = consumption × unit rate
        if (consumption !== undefined && item.unitRate) {
          amount = consumption * item.unitRate
        } else if (!meterReading) {
          // No meter reading available, set amount to 0
          amount = 0
        }
      } else if (item.calculationType === 'percentage') {
        // Will be calculated in second pass
        amount = 0
      }

      calculatedItems.push({
        description: item.description,
        amount: Math.round(amount * 100) / 100, // Round to 2 decimal places
        type: item.type,
        calculationType: item.calculationType,
        unitRate: item.unitRate,
        meterType: item.meterType,
        previousReading,
        currentReading,
        consumption,
        _templateItemId: item.id, // Store template item ID for percentage calculation
        _baseItemId: item.baseItemId,
        _percentage: item.percentage,
      })
    })

    // Second pass: Calculate percentage-based items
    calculatedItems.forEach((calculatedItem, index) => {
      if (
        calculatedItem.calculationType === 'percentage' &&
        calculatedItem._percentage &&
        calculatedItem._baseItemId
      ) {
        // Find base item in calculated items (by template item ID)
        const baseTemplateItem = template.items.find(
          i => i.id === calculatedItem._baseItemId
        )
        if (baseTemplateItem) {
          const baseItemIndex = template.items.findIndex(
            i => i.id === baseTemplateItem.id
          )
          const baseItem = calculatedItems[baseItemIndex]
          if (baseItem) {
            calculatedItem.amount =
              Math.round(
                ((baseItem.amount * calculatedItem._percentage) / 100) * 100
              ) / 100
          }
        }
      }
    })

    // Clean up internal fields
    const cleanedItems = calculatedItems.map(
      ({ _templateItemId, _baseItemId, _percentage, ...item }) => item
    )

    replace(cleanedItems)
  }

  const onSubmit = (data: GenerateBillFormData) => {
    onGenerate(data)
    handleReset()
  }

  const handleReset = () => {
    form.reset({
      propertyId: '',
      propertyType: 'apartment',
      flatId: undefined,
      month: months[new Date().getMonth()],
      year: currentYear,
      tenantId: '',
      templateId: undefined,
      useTemplate: false,
      items: [{ description: 'Monthly Rent', amount: 0, type: 'rent' }],
    })
    setSelectedPropertyType('apartment')
    setSelectedPropertyId('')
    setSelectedFlatId('')
    setSelectedTemplate(undefined)
    setMeterReading(undefined)
    setPreviousReading(undefined)
    setUseTemplate(false)
    setGenerationMode('manual')
  }

  const properties =
    selectedPropertyType === 'apartment' ? mockBuildings : mockMess
  const tenants = mockRenters

  const totalAmount = useMemo(() => {
    return fields.reduce((sum, _, index) => {
      const amount = form.getValues(`items.${index}.amount`) || 0
      return sum + amount
    }, 0)
  }, [fields, form])

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      handleReset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Bill</DialogTitle>
          <DialogDescription>Create a new bill for a tenant</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Generation Mode Toggle */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">
                  Generation Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Use template for automatic calculation or create manually
                </p>
              </div>
              <Tabs
                value={generationMode}
                onValueChange={v => {
                  setGenerationMode(v as 'manual' | 'template')
                  form.setValue('useTemplate', v === 'template')
                  if (v === 'manual') {
                    form.setValue('templateId', undefined)
                    replace([
                      { description: 'Monthly Rent', amount: 0, type: 'rent' },
                    ])
                  }
                }}
              >
                <TabsList>
                  <TabsTrigger value="manual">Manual</TabsTrigger>
                  <TabsTrigger value="template">
                    <Zap className="mr-2 h-4 w-4" />
                    Template
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

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
                        form.setValue('flatId', undefined)
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
                        form.setValue('flatId', undefined)
                        setSelectedFlatId('')
                        form.setValue('templateId', undefined)
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

            {/* Flat Selection (for apartments) */}
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
                          form.setValue('templateId', undefined)
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
                              {flat.flatNumber} -{' '}
                              {flat.renter?.name || 'Available'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

            {/* Template Selection (when template mode is enabled) */}
            {generationMode === 'template' && availableTemplates.length > 0 && (
              <FormField
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bill Template</FormLabel>
                    <Select
                      onValueChange={value => {
                        field.onChange(value)
                        form.setValue('useTemplate', true)
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTemplates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Template will auto-calculate bill items using meter
                      readings
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {generationMode === 'template' &&
              availableTemplates.length === 0 &&
              propertyId && (
                <Card className="bg-muted/50">
                  <CardContent className="py-4">
                    <p className="text-sm text-muted-foreground text-center">
                      No active templates found for this property. Create a
                      template first.
                    </p>
                  </CardContent>
                </Card>
              )}

            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tenant</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tenant" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tenants.map(tenant => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name} - {tenant.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <Select
                      onValueChange={value => {
                        field.onChange(value)
                        form.setValue('templateId', undefined)
                      }}
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
                      <Input
                        type="number"
                        {...field}
                        onChange={e => {
                          field.onChange(e)
                          form.setValue('templateId', undefined)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Meter Reading Display */}
            {meterReading && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Meter Readings for {month} {year}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {meterReading.electricity !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">
                        Electricity:
                      </span>
                      <div className="flex items-center gap-2">
                        {previousReading?.electricity && (
                          <span className="text-xs text-muted-foreground">
                            {previousReading.electricity} →
                          </span>
                        )}
                        <span className="font-medium">
                          {meterReading.electricity} units
                        </span>
                        {meterReading.electricityConsumption !== undefined && (
                          <Badge variant="outline">
                            +{meterReading.electricityConsumption} units
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  {meterReading.gas !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Gas:</span>
                      <div className="flex items-center gap-2">
                        {previousReading?.gas && (
                          <span className="text-xs text-muted-foreground">
                            {previousReading.gas} →
                          </span>
                        )}
                        <span className="font-medium">
                          {meterReading.gas} units
                        </span>
                        {meterReading.gasConsumption !== undefined && (
                          <Badge variant="outline">
                            +{meterReading.gasConsumption} units
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  {meterReading.water !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Water:</span>
                      <div className="flex items-center gap-2">
                        {previousReading?.water && (
                          <span className="text-xs text-muted-foreground">
                            {previousReading.water} →
                          </span>
                        )}
                        <span className="font-medium">
                          {meterReading.water} units
                        </span>
                        {meterReading.waterConsumption !== undefined && (
                          <Badge variant="outline">
                            +{meterReading.waterConsumption} units
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {!meterReading &&
              propertyId &&
              month &&
              year &&
              generationMode === 'template' && (
                <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                  <CardContent className="py-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <Calculator className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                          Meter Reading Required
                        </p>
                        <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                          No meter reading found for {month} {year}. Add meter
                          reading first to calculate utility costs
                          automatically.
                        </p>
                        <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                          Fixed amounts will still be calculated, but
                          meter-based items will show ৳0.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

            {!meterReading &&
              propertyId &&
              month &&
              year &&
              generationMode === 'manual' && (
                <Card className="border-dashed">
                  <CardContent className="py-4">
                    <p className="text-sm text-muted-foreground text-center">
                      No meter reading found for {month} {year}. You can still
                      create bills manually.
                    </p>
                  </CardContent>
                </Card>
              )}

            {/* Bill Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Bill Items</Label>
                {generationMode === 'manual' && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({ description: '', amount: 0, type: 'rent' })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                )}
                {generationMode === 'template' && selectedTemplate && (
                  <Badge variant="outline" className="text-xs">
                    <Calculator className="mr-1 h-3 w-3" />
                    Auto-calculated from template
                  </Badge>
                )}
              </div>

              {fields.map((field, index) => {
                const item = form.watch(`items.${index}`)
                const calculationType = item?.calculationType
                const consumption = item?.consumption
                const unitRate = item?.unitRate
                const previousReading = item?.previousReading
                const currentReading = item?.currentReading

                return (
                  <div
                    key={field.id}
                    className="space-y-2 rounded-lg border p-3"
                  >
                    <div className="grid grid-cols-12 gap-2">
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="col-span-12 sm:col-span-5">
                            <FormControl>
                              <Input
                                placeholder="Description"
                                {...field}
                                disabled={generationMode === 'template'}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.type`}
                        render={({ field }) => (
                          <FormItem className="col-span-6 sm:col-span-3">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={generationMode === 'template'}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="rent">Rent</SelectItem>
                                <SelectItem value="utility">Utility</SelectItem>
                                <SelectItem value="maintenance">
                                  Maintenance
                                </SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.amount`}
                        render={({ field }) => (
                          <FormItem className="col-span-5 sm:col-span-3">
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Amount"
                                {...field}
                                disabled={generationMode === 'template'}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {generationMode === 'manual' && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="col-span-1"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Calculation Details (for meter-based items) */}
                    {calculationType === 'meter-based' &&
                      consumption !== undefined &&
                      unitRate && (
                        <div className="mt-2 rounded bg-muted/50 p-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                              Calculation:
                            </span>
                            <div className="flex items-center gap-1">
                              {previousReading !== undefined &&
                                currentReading !== undefined && (
                                  <span>
                                    {previousReading} → {currentReading} ={' '}
                                    {consumption} units
                                  </span>
                                )}
                              {unitRate && (
                                <span className="ml-1">
                                  × ৳{unitRate} = ৳
                                  {item.amount?.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Percentage Calculation Details */}
                    {calculationType === 'percentage' && (
                      <div className="mt-2 rounded bg-muted/50 p-2 text-xs">
                        <span className="text-muted-foreground">
                          Calculated as percentage of base item
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Total Amount */}
              {fields.length > 0 && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold">
                        Total Amount:
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        ৳
                        {totalAmount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleReset()
                  onOpenChange(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Generate Bill</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
