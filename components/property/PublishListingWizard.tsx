'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle2 } from 'lucide-react'
import type { Property, PropertyListingInput } from '@/types/property'
import { cn } from '@/lib/utils'

const FACILITY_OPTIONS = [
  'WiFi',
  'AC',
  'Generator',
  'Security',
  'Parking',
  'Lift',
  'Balcony',
  'Common Room',
  'CCTV',
  'Water Filter',
]

const schema = z.object({
  name: z.string().min(3, 'Name is required'),
  type: z.enum(['mess', 'apartment', 'hostel', 'hotel']),
  rent: z.coerce.number().min(500, 'Minimum rent is ৳500'),
  city: z.string().min(2, 'City is required'),
  area: z.string().min(2, 'Area is required'),
  address: z.string().min(5, 'Address is required'),
  description: z.string().min(20, 'Write at least 20 characters'),
  gender: z.enum(['male', 'female', 'mixed']).optional().nullable(),
  seatType: z.enum(['single', 'shared']).optional().nullable(),
  mealIncluded: z.boolean().optional(),
  mealCost: z.coerce.number().optional(),
  depositMonths: z.coerce.number().min(0).max(6),
  instantBook: z.boolean(),
  parking: z.boolean().optional(),
  security: z.boolean().optional(),
  furnishing: z
    .enum(['furnished', 'unfurnished', 'semi-furnished'])
    .optional()
    .nullable(),
  imageUrl: z.string().url('Enter a valid image URL'),
  facilities: z.array(z.string()),
  publishNow: z.boolean(),
})

type FormValues = z.infer<typeof schema>

const STEPS = ['Basics', 'Details', 'Photos & publish']

interface PublishListingWizardProps {
  initial?: Property
  onSubmit: (input: PropertyListingInput) => Promise<void>
  onCancel?: () => void
}

export function PublishListingWizard({
  initial,
  onSubmit,
  onCancel,
}: PublishListingWizardProps) {
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    // Zod v4 + RHF resolver typings are loose project-wide
    resolver: zodResolver(schema) as never,
    defaultValues: {
      name: initial?.name || '',
      type: initial?.type || 'mess',
      rent: initial?.rent || 5000,
      city: initial?.city || 'Dhaka',
      area: initial?.area || '',
      address: initial?.address || '',
      description: initial?.description || '',
      gender: initial?.gender || null,
      seatType: initial?.seatType || null,
      mealIncluded: initial?.mealIncluded || false,
      mealCost: initial?.mealCost || undefined,
      depositMonths: initial?.depositMonths ?? 1,
      instantBook: initial?.instantBook || false,
      parking: initial?.parking || false,
      security: initial?.security ?? true,
      furnishing: initial?.furnishing || null,
      imageUrl: initial?.images?.[0] || '',
      facilities: initial?.facilities || ['WiFi', 'Security'],
      publishNow: initial?.published ?? true,
    },
  })

  const propertyType = form.watch('type')
  const facilities = form.watch('facilities')

  const toggleFacility = (f: string) => {
    const current = form.getValues('facilities')
    form.setValue(
      'facilities',
      current.includes(f) ? current.filter(x => x !== f) : [...current, f]
    )
  }

  const validateStep = async () => {
    if (step === 0) {
      return form.trigger(['name', 'type', 'rent', 'city', 'area', 'address'])
    }
    if (step === 1) {
      return form.trigger(['description', 'depositMonths'])
    }
    return form.trigger(['imageUrl'])
  }

  const next = async () => {
    const ok = await validateStep()
    if (ok) setStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  const handleFinal = form.handleSubmit(async values => {
    setSubmitting(true)
    setError(null)
    try {
      const input: PropertyListingInput = {
        name: values.name,
        type: values.type,
        rent: values.rent,
        city: values.city,
        area: values.area,
        address: values.address,
        description: values.description,
        available: true,
        gender: values.gender || null,
        seatType: values.seatType || null,
        mealIncluded: values.mealIncluded,
        mealCost: values.mealCost,
        depositMonths: values.depositMonths,
        instantBook: values.instantBook,
        parking: values.parking,
        security: values.security,
        furnishing: values.furnishing || null,
        images: [values.imageUrl],
        facilities: values.facilities,
        published: values.publishNow,
        listingStatus: values.publishNow ? 'published' : 'draft',
      }
      await onSubmit(input)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save listing')
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                i < step
                  ? 'bg-primary text-primary-foreground'
                  : i === step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
              )}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className="text-center text-xs text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleFinal} className="space-y-4">
              {step === 0 && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Green Valley Mess, Mirpur"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
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
                              <SelectItem value="mess">Mess</SelectItem>
                              <SelectItem value="hostel">Hostel</SelectItem>
                              <SelectItem value="apartment">
                                Apartment
                              </SelectItem>
                              <SelectItem value="hotel">Hotel</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly rent (৳)</FormLabel>
                          <FormControl>
                            <Input type="number" min={500} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Dhaka" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area</FormLabel>
                          <FormControl>
                            <Input placeholder="Mirpur-10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="House, road, block"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {step === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Describe rooms, rules, meals, nearby universities…"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(propertyType === 'mess' || propertyType === 'hostel') && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select
                              value={field.value || undefined}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="mixed">Mixed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="seatType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seat type</FormLabel>
                            <Select
                              value={field.value || undefined}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="shared">Shared</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="depositMonths"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deposit (months of rent)</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} max={6} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="furnishing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Furnishing</FormLabel>
                          <Select
                            value={field.value || undefined}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="furnished">
                                Furnished
                              </SelectItem>
                              <SelectItem value="semi-furnished">
                                Semi-furnished
                              </SelectItem>
                              <SelectItem value="unfurnished">
                                Unfurnished
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormLabel className="mb-2 block">Facilities</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {FACILITY_OPTIONS.map(f => (
                        <Badge
                          key={f}
                          variant={
                            facilities.includes(f) ? 'default' : 'outline'
                          }
                          className="cursor-pointer"
                          onClick={() => toggleFacility(f)}
                        >
                          {f}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="instantBook"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <FormLabel>Instant book</FormLabel>
                          <FormDescription>
                            Auto-approve bookings without manual review
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover photo URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://…"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Use a clear photo of the room or building. Multiple
                          uploads will connect to cloud storage later.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="publishNow"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <FormLabel>Publish to search</FormLabel>
                          <FormDescription>
                            Visible to renters across Bangladesh
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                    After publishing, your listing appears in Search. Verified
                    badge is assigned after admin review of documents.
                  </div>
                </>
              )}

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex gap-2 pt-2">
                {onCancel && step === 0 && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(s => s - 1)}
                  >
                    Back
                  </Button>
                )}
                <div className="flex-1" />
                {step < STEPS.length - 1 ? (
                  <Button type="button" onClick={next}>
                    Continue
                  </Button>
                ) : (
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : initial ? (
                      'Save changes'
                    ) : (
                      'Create listing'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
