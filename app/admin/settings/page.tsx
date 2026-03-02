'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { mockSystemSettings } from '@/data/mockAdmin'

const settingsSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required'),
  platformEmail: z.string().email('Invalid email'),
  platformPhone: z.string().min(1, 'Phone is required'),
  commissionRate: z.number().min(0).max(100),
})

type SettingsFormData = z.infer<typeof settingsSchema>

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(mockSystemSettings)
  const [loading, setLoading] = useState(false)

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      platformName: settings.platformName,
      platformEmail: settings.platformEmail,
      platformPhone: settings.platformPhone,
      commissionRate: settings.commissionRate,
    },
  })

  const handleSubmit = async (data: SettingsFormData) => {
    setLoading(true)
    // TODO: API call
    setTimeout(() => {
      setLoading(false)
      alert('Settings saved successfully')
    }, 1000)
  }

  const handleFeatureToggle = (feature: string) => {
    setSettings({
      ...settings,
      featureFlags: {
        ...settings.featureFlags,
        [feature]: !settings.featureFlags[feature],
      },
    })
    // TODO: API call
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">System Settings</h2>
          <p className="text-muted-foreground">
            Configure platform settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Platform Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Information</CardTitle>
              <CardDescription>Basic platform details</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="platformName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platformEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="platformPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="commissionRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Commission Rate (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Subscription Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Configure subscription pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded border p-4">
                  <h4 className="font-semibold mb-2">Free Plan</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Max Flats: {settings.subscriptionPlans.free.maxFlats}
                  </p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Features:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {settings.subscriptionPlans.free.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="rounded border p-4">
                  <h4 className="font-semibold mb-2">Basic Plan</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Price: ৳{settings.subscriptionPlans.basic.price}/month
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Max Flats: {settings.subscriptionPlans.basic.maxFlats}
                  </p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Features:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {settings.subscriptionPlans.basic.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="rounded border p-4">
                  <h4 className="font-semibold mb-2">Premium Plan</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Price: ৳{settings.subscriptionPlans.premium.price}/month
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Max Flats: {settings.subscriptionPlans.premium.maxFlats === -1 ? 'Unlimited' : settings.subscriptionPlans.premium.maxFlats}
                  </p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">Features:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {settings.subscriptionPlans.premium.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Flags */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(settings.featureFlags).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').trim()}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {enabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <Switch
                      checked={enabled}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Service Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Service Configuration</CardTitle>
              <CardDescription>Third-party service settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">SMS Gateway</Label>
                    <p className="text-sm text-muted-foreground">
                      Provider: {settings.smsGateway.provider}
                    </p>
                  </div>
                  <Switch checked={settings.smsGateway.enabled} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Email Service</Label>
                    <p className="text-sm text-muted-foreground">
                      Provider: {settings.emailService.provider}
                    </p>
                  </div>
                  <Switch checked={settings.emailService.enabled} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
