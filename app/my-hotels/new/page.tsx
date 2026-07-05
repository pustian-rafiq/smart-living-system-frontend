'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader } from '@/components/page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addHotel } from '@/data/mockHotels'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const AMENITIES = [
  'WiFi',
  'AC',
  'Parking',
  'Restaurant',
  'Gym',
  'Swimming Pool',
  'Spa',
  'Room Service',
  'Laundry',
  'Airport Shuttle',
]

const schema = z.object({
  name: z.string().min(3),
  type: z.enum(['hotel', 'guest-house', 'resort']),
  starRating: z.coerce.number().min(1).max(5).optional(),
  address: z.string().min(5),
  area: z.string().min(2),
  city: z.string().min(2),
  description: z.string().min(20),
  checkInTime: z.string().min(1),
  checkOutTime: z.string().min(1),
  minimumStay: z.coerce.number().min(1),
  licenseNumber: z.string().optional(),
  licenseDocumentName: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  weekendMultiplier: z.coerce.number().min(1).max(3),
  serviceChargePercent: z.coerce.number().min(0).max(30),
  vatPercent: z.coerce.number().min(0).max(30),
  freeCancellationHours: z.coerce.number().min(0).max(168),
  partialRefundPercent: z.coerce.number().min(0).max(100),
})

type FormValues = z.infer<typeof schema>

const STEPS = ['Basics', 'License & media', 'Pricing & policy']

export default function RegisterHotelPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [amenities, setAmenities] = useState<string[]>(['WiFi', 'AC'])
  const [createdId, setCreatedId] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      name: '',
      type: 'guest-house',
      starRating: 3,
      address: '',
      area: '',
      city: 'Dhaka',
      description: '',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      minimumStay: 1,
      licenseNumber: '',
      licenseDocumentName: '',
      imageUrl: '',
      weekendMultiplier: 1.15,
      serviceChargePercent: 10,
      vatPercent: 15,
      freeCancellationHours: 48,
      partialRefundPercent: 50,
    },
  })

  const toggleAmenity = (a: string) => {
    setAmenities(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    )
  }

  const next = async () => {
    const fields: (keyof FormValues)[][] = [
      ['name', 'type', 'address', 'area', 'city', 'description'],
      ['checkInTime', 'checkOutTime', 'minimumStay'],
      [
        'weekendMultiplier',
        'serviceChargePercent',
        'vatPercent',
        'freeCancellationHours',
        'partialRefundPercent',
      ],
    ]
    const ok = await form.trigger(fields[step])
    if (ok) setStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  const onSubmit = form.handleSubmit(values => {
    const hotel = addHotel({
      ...values,
      amenities,
      imageUrl: values.imageUrl || undefined,
      licenseNumber: values.licenseNumber || undefined,
      licenseDocumentName: values.licenseDocumentName || 'license.pdf',
    })
    setCreatedId(hotel.id)
  })

  if (createdId) {
    return (
      <Layout>
        <PageContainer>
          <div className="mx-auto max-w-md space-y-4 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
            <h1 className="text-2xl font-bold">Hotel registered</h1>
            <p className="text-muted-foreground">
              Pending verification. You can manage rooms and pricing now.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href={`/my-hotels/${createdId}/rooms`}>Manage rooms</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/my-hotels/${createdId}/pricing`}>
                  Pricing rules
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/my-hotels">My hotels</Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </Layout>
    )
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="Register hotel / guest house"
          description="Onboard your property with license, pricing, and cancellation policy."
        />

        <div className="mb-6 flex gap-2">
          {STEPS.map((label, i) => (
            <Badge
              key={label}
              variant={i === step ? 'default' : i < step ? 'secondary' : 'outline'}
            >
              {i + 1}. {label}
            </Badge>
          ))}
        </div>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>{STEPS[step]}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                {step === 0 && (
                  <>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property name</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                                <SelectItem value="hotel">Hotel</SelectItem>
                                <SelectItem value="guest-house">
                                  Guest house
                                </SelectItem>
                                <SelectItem value="resort">Resort</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="starRating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Star rating</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} max={5} {...field} />
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
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="area"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Area</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea rows={4} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <Label className="mb-2 block">Amenities</Label>
                      <div className="flex flex-wrap gap-2">
                        {AMENITIES.map(a => (
                          <Badge
                            key={a}
                            variant={
                              amenities.includes(a) ? 'default' : 'outline'
                            }
                            className="cursor-pointer"
                            onClick={() => toggleAmenity(a)}
                          >
                            {a}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="checkInTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Check-in time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="checkOutTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Check-out time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="minimumStay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum stay (nights)</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="licenseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trade / hotel license number</FormLabel>
                          <FormControl>
                            <Input placeholder="HTL-2024-XXX" {...field} />
                          </FormControl>
                          <FormDescription>
                            Required for verification in Bangladesh
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="licenseDocumentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License document name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="license_scan.pdf"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Demo: enter filename; real upload comes with backend
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover image URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://…"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <FormField
                      control={form.control}
                      name="weekendMultiplier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weekend price multiplier</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.05"
                              min={1}
                              max={3}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            e.g. 1.15 = +15% Fri–Sat nights
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="serviceChargePercent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service charge %</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} max={30} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="vatPercent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>VAT %</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} max={30} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="freeCancellationHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Free cancel (hours before)</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="partialRefundPercent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Partial refund %</FormLabel>
                            <FormControl>
                              <Input type="number" min={0} max={100} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2 pt-2">
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
                    <Button type="submit">Register hotel</Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </PageContainer>
    </Layout>
  )
}
