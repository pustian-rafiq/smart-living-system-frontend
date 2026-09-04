'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/lib/feedback/toast'
import { fetchPushAdminStats, saveSystemSettings } from '@/lib/api/admin'
import { sendTestPush } from '@/lib/api/push'
import { registerWebPush } from '@/lib/push/register'
import type { PushAdminStats, PushConfig, SystemSettings } from '@/types/admin'

export function PushSettingsCard({
  settings,
  onSettings,
}: {
  settings: SystemSettings
  onSettings: (next: SystemSettings) => void
}) {
  const [config, setConfig] = useState<PushConfig | null>(settings.push ?? null)
  const [stats, setStats] = useState<PushAdminStats | null>(null)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)

  const refresh = () => {
    fetchPushAdminStats().then(result => {
      if (!result.ok) return
      setStats(result.data)
      setConfig(result.data.config)
    })
  }

  useEffect(() => {
    refresh()
  }, [])

  if (!config) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Web push notifications</CardTitle>
          <CardDescription>Loading push settings…</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const patch = (partial: Partial<PushConfig>) => setConfig({ ...config, ...partial })

  const save = async () => {
    setSaving(true)
    const next = { ...settings, push: config }
    const result = await saveSystemSettings(next)
    setSaving(false)
    if (result.ok) {
      onSettings(result.data)
      if (result.data.push) setConfig(result.data.push)
      toast.success('Push settings saved')
      refresh()
    } else {
      toast.error(result.error)
    }
  }

  const test = async () => {
    setTesting(true)
    const registered = await registerWebPush()
    if (registered !== 'subscribed') {
      setTesting(false)
      toast.error(
        registered === 'blocked'
          ? 'Notifications are blocked in this browser.'
          : 'Enable push, generate VAPID keys, and allow notifications first.',
      )
      return
    }
    const result = await sendTestPush()
    setTesting(false)
    if (result.ok) toast.success('Test notification sent to this browser.')
    else toast.error(result.error)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Web push notifications</CardTitle>
        <CardDescription>
          Browser / installed-app alerts. Owners get vacancy checks here first;
          SMS is only used if you allow it as fallback.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {!stats?.configured && (
          <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            VAPID keys are missing. Run{' '}
            <code>python manage.py generate_vapid_keys</code> and add them to{' '}
            <code>.env</code>, then restart the API.
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <Row
            label="Enable web push"
            hint="Master switch (also needs PUSH_ENABLED in .env)"
            checked={config.enabled}
            onChange={enabled => patch({ enabled })}
          />
          <Row
            label="Use for vacancy heartbeat"
            hint="Send the weekly still-available prompt as a push"
            checked={config.heartbeatEnabled}
            onChange={heartbeatEnabled => patch({ heartbeatEnabled })}
          />
          <Row
            label="Prefer push over SMS"
            hint="If push is delivered, skip the SMS"
            checked={config.preferPushOverSms}
            onChange={preferPushOverSms => patch({ preferPushOverSms })}
          />
          <Row
            label="SMS if push fails"
            hint="Fall back to SMS when the device has no subscription"
            checked={config.smsIfPushFails}
            onChange={smsIfPushFails => patch({ smsIfPushFails })}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Notification title</Label>
            <Input
              value={config.titleTemplate}
              onChange={e => patch({ titleTemplate: e.target.value })}
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notification body</Label>
            <Textarea
              rows={2}
              value={config.bodyTemplate}
              onChange={e => patch({ bodyTemplate: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Placeholders: {'{name}'} {'{city}'} {'{hours}'} {'{url}'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save push settings'}
          </Button>
          <Button variant="outline" onClick={test} disabled={testing}>
            {testing ? 'Sending…' : 'Enable & send test to this browser'}
          </Button>
        </div>
        {stats && (
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Stat label="Subscribed users" value={stats.subscribers} />
            <Stat label="Devices" value={stats.devices} />
            <Stat label="Opted out" value={stats.optedOutUsers} />
            <Stat
              label="Live send"
              value={stats.liveWouldSend ? 1 : 0}
              text={stats.liveWouldSend ? 'yes' : 'no'}
            />
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Env PUSH_ENABLED: {stats?.envEnabled ? 'on' : 'off'}. VAPID keys:{' '}
          {stats?.configured ? 'present' : 'missing'}. HTTPS (or localhost) is
          required for the browser to subscribe.
        </p>
      </CardContent>
    </Card>
  )
}

function Row({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
      <div>
        <Label className="font-medium">{label}</Label>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

function Stat({
  label,
  value,
  text,
}: {
  label: string
  value: number
  text?: string
}) {
  return (
    <div className="rounded-md border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{text ?? value}</p>
    </div>
  )
}
