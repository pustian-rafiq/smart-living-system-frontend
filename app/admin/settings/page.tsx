'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLayout } from '@/components/admin/AdminLayout'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
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
import { fetchSystemSettings, saveSystemSettings } from '@/lib/api/admin'
import type { SystemSettings } from '@/types/admin'
import { toast } from '@/lib/feedback/toast'

const settingsSchema = z.object({
  platformName: z.string().min(1, 'Platform name is required'),
  platformEmail: z.string().email('Invalid email'),
  platformPhone: z.string().min(1, 'Phone is required'),
  commissionRate: z.number().min(0).max(100),
})

type SettingsFormData = z.infer<typeof settingsSchema>

export default function AdminSettingsPage() {
  const t = useTranslations('admin.settings')
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      platformName: '',
      platformEmail: '',
      platformPhone: '',
      commissionRate: 0,
    },
  })

  useEffect(() => {
    fetchSystemSettings().then(result => {
      if (result.ok) {
        setSettings(result.data)
        form.reset({
          platformName: result.data.platformName,
          platformEmail: result.data.platformEmail,
          platformPhone: result.data.platformPhone,
          commissionRate: result.data.commissionRate,
        })
      }
    })
  }, [form])

  const handleSubmit = async (data: SettingsFormData) => {
    if (!settings) return
    setLoading(true)
    const result = await saveSystemSettings({ ...settings, ...data })
    setLoading(false)
    if (result.ok) {
      setSettings(result.data)
      toast.success(t('savedSuccess'))
    }
  }

  const handleFeatureToggle = (feature: string) => {
    if (!settings) return
    const updated = {
      ...settings,
      featureFlags: {
        ...settings.featureFlags,
        [feature]: !settings.featureFlags[feature],
      },
    }
    setSettings(updated)
    saveSystemSettings(updated)
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="max-w-7xl p-8 text-muted-foreground">Loading...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{t('systemTitle')}</h2>
          <p className="text-muted-foreground">{t('systemDesc')}</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('platformInfo')}</CardTitle>
              <CardDescription>{t('platformInfoDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="platformName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('platformName')}</FormLabel>
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
                        <FormLabel>{t('platformEmail')}</FormLabel>
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
                        <FormLabel>{t('platformPhone')}</FormLabel>
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
                        <FormLabel>{t('commissionRate')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            {...field}
                            onChange={e =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading}>
                    {loading ? t('saving') : t('saveChanges')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('subscriptionPlans')}</CardTitle>
              <CardDescription>{t('subscriptionPlansDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded border p-4">
                  <h4 className="font-semibold mb-2">{t('freePlan')}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('maxFlats', { count: settings.subscriptionPlans.free.maxFlats })}
                  </p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">{t('features')}</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {settings.subscriptionPlans.free.features.map(
                        (feature, idx) => (
                          <li key={idx}>{feature}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
                <div className="rounded border p-4">
                  <h4 className="font-semibold mb-2">{t('basicPlan')}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('pricePerMonth', { price: settings.subscriptionPlans.basic.price })}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('maxFlats', { count: settings.subscriptionPlans.basic.maxFlats })}
                  </p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">{t('features')}</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {settings.subscriptionPlans.basic.features.map(
                        (feature, idx) => (
                          <li key={idx}>{feature}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
                <div className="rounded border p-4">
                  <h4 className="font-semibold mb-2">{t('premiumPlan')}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('pricePerMonth', { price: settings.subscriptionPlans.premium.price })}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('maxFlats', {
                      count:
                        settings.subscriptionPlans.premium.maxFlats === -1
                          ? t('unlimited')
                          : settings.subscriptionPlans.premium.maxFlats,
                    })}
                  </p>
                  <div className="text-sm">
                    <p className="font-medium mb-1">{t('features')}</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {settings.subscriptionPlans.premium.features.map(
                        (feature, idx) => (
                          <li key={idx}>{feature}</li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('featureFlags')}</CardTitle>
              <CardDescription>{t('featureFlagsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(settings.featureFlags).map(
                  ([feature, enabled]) => (
                    <div
                      key={feature}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <Label className="font-medium capitalize">
                          {feature.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {enabled ? t('enabled') : t('disabled')}
                        </p>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('serviceConfig')}</CardTitle>
              <CardDescription>{t('serviceConfigDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">{t('smsGateway')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('provider', { name: settings.smsGateway.provider })}
                    </p>
                  </div>
                  <Switch checked={settings.smsGateway.enabled} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">{t('emailService')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('provider', { name: settings.emailService.provider })}
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
