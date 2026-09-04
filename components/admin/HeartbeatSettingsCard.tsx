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
import {
  fetchHeartbeatOverview,
  fetchHeartbeatPings,
  runHeartbeatJob,
  saveSystemSettings,
} from '@/lib/api/admin'
import type {
  HeartbeatConfig,
  HeartbeatPingRow,
  HeartbeatStats,
  SystemSettings,
} from '@/types/admin'

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export function HeartbeatSettingsCard({
  settings,
  onSettings,
}: {
  settings: SystemSettings
  onSettings: (next: SystemSettings) => void
}) {
  const [config, setConfig] = useState<HeartbeatConfig | null>(
    settings.heartbeat ?? null,
  )
  const [stats, setStats] = useState<HeartbeatStats | null>(null)
  const [pings, setPings] = useState<HeartbeatPingRow[]>([])
  const [saving, setSaving] = useState(false)
  const [running, setRunning] = useState(false)

  const refresh = () => {
    fetchHeartbeatOverview().then(result => {
      if (!result.ok) return
      setStats(result.data.stats)
      setConfig(result.data.config)
    })
    fetchHeartbeatPings().then(result => {
      if (result.ok) setPings(result.data)
    })
  }

  useEffect(() => {
    refresh()
  }, [])

  if (!config) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vacancy heartbeat</CardTitle>
          <CardDescription>Loading heartbeat settings…</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const patch = (partial: Partial<HeartbeatConfig>) =>
    setConfig({ ...config, ...partial })

  const save = async () => {
    setSaving(true)
    const next = { ...settings, heartbeat: config }
    const result = await saveSystemSettings(next)
    setSaving(false)
    if (result.ok) {
      onSettings(result.data)
      if (result.data.heartbeat) setConfig(result.data.heartbeat)
      toast.success('Heartbeat settings saved')
    } else {
      toast.error(result.error)
    }
  }

  const run = async (sendSms?: boolean) => {
    setRunning(true)
    const result = await runHeartbeatJob(
      sendSms === undefined ? undefined : { sendSms },
    )
    setRunning(false)
    if (result.ok) {
      toast.success(
        result.data.dryRun
          ? `Dry run: created ${result.data.created} confirm links (no SMS).`
          : `Sent ${result.data.sent} SMS (${result.data.failed} failed).`,
      )
      refresh()
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vacancy heartbeat (SMS link)</CardTitle>
        <CardDescription>
          Weekly owner SMS with a tap-to-confirm link. Live SMS only goes out
          when this switch is on AND HEARTBEAT_SMS_ENABLED=true on the server.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Toggle
            label="Scheduler enabled"
            hint="Celery Beat may run the job"
            checked={config.jobEnabled}
            onChange={jobEnabled => patch({ jobEnabled })}
          />
          <Toggle
            label="Send live SMS"
            hint={
              stats?.envSmsEnabled
                ? 'Server kill-switch is ON'
                : 'Server kill-switch is OFF (dry-run only)'
            }
            checked={config.smsEnabled}
            onChange={smsEnabled => patch({ smsEnabled })}
          />
          <Toggle
            label="Include apartments / listings"
            checked={config.includeListings}
            onChange={includeListings => patch({ includeListings })}
          />
          <Toggle
            label="Include hotels"
            checked={config.includeHotels}
            onChange={includeHotels => patch({ includeHotels })}
          />
          <Toggle
            label="Include mess / hostel"
            checked={config.includeMesses}
            onChange={includeMesses => patch({ includeMesses })}
          />
          <Toggle
            label="Only if currently available"
            checked={config.onlyAvailable}
            onChange={onlyAvailable => patch({ onlyAvailable })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label={`Weekday (${WEEKDAYS[config.weekday]})`}>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={config.weekday}
              onChange={e => patch({ weekday: Number(e.target.value) })}
            >
              {WEEKDAYS.map((label, idx) => (
                <option key={label} value={idx}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Hour (Asia/Dhaka)">
            <Input
              type="number"
              min={0}
              max={23}
              value={config.hour}
              onChange={e => patch({ hour: Number(e.target.value) })}
            />
          </Field>
          <Field label="Ask again after (days)">
            <Input
              type="number"
              min={1}
              max={30}
              value={config.intervalDays}
              onChange={e => patch({ intervalDays: Number(e.target.value) })}
            />
          </Field>
          <Field label="Link valid (hours)">
            <Input
              type="number"
              min={6}
              max={168}
              value={config.tokenTtlHours}
              onChange={e => patch({ tokenTtlHours: Number(e.target.value) })}
            />
          </Field>
          <Field label="Max SMS / owner / week">
            <Input
              type="number"
              min={0}
              max={20}
              value={config.maxSmsPerOwnerPerWeek}
              onChange={e =>
                patch({ maxSmsPerOwnerPerWeek: Number(e.target.value) })
              }
            />
          </Field>
          <Field label="Public site URL">
            <Input
              value={config.publicBaseUrl}
              placeholder="https://yoursite.com"
              onChange={e => patch({ publicBaseUrl: e.target.value })}
            />
          </Field>
        </div>

        <Field label="SMS template">
          <Textarea
            rows={3}
            value={config.messageTemplate}
            onChange={e => patch({ messageTemplate: e.target.value })}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Placeholders: {'{name}'} {'{city}'} {'{url}'} {'{hours}'}
          </p>
        </Field>

        <div className="flex flex-wrap gap-2">
          <Button onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save heartbeat settings'}
          </Button>
          <Button variant="outline" disabled={running} onClick={() => run(false)}>
            {running ? 'Running…' : 'Run now (dry run)'}
          </Button>
          <Button variant="secondary" disabled={running} onClick={() => run(true)}>
            Run now (try SMS)
          </Button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Stat label="This week created" value={stats.created} />
            <Stat label="SMS sent" value={stats.sent} />
            <Stat label="Confirmed" value={stats.confirmed} />
            <Stat label="Marked full" value={stats.markedFull} />
            <Stat label="Dry-run links" value={stats.dryRun} />
            <Stat label="Failed" value={stats.failed} />
            <Stat label="Pending" value={stats.pending} />
            <Stat label="Owners reached" value={stats.uniqueOwners} />
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Live SMS would send:{' '}
          {stats?.liveSmsWouldSend ? 'yes' : 'no (dry-run)'}. Schedule:{' '}
          {stats?.weekdayLabel} {config.hour}:00 Dhaka.
        </p>

        {pings.length > 0 && (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Owner</th>
                  <th className="px-3 py-2">Listing</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Link</th>
                </tr>
              </thead>
              <tbody>
                {pings.slice(0, 15).map(row => (
                  <tr key={row.id} className="border-t">
                    <td className="px-3 py-2">
                      {row.ownerName || row.ownerPhone}
                    </td>
                    <td className="px-3 py-2">
                      {row.targetName}
                      {row.dryRun ? ' · dry-run' : ''}
                    </td>
                    <td className="px-3 py-2 capitalize">
                      {row.status.replace('_', ' ')}
                    </td>
                    <td className="px-3 py-2">
                      <a className="text-primary underline" href={row.linkPath}>
                        Open
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Toggle({
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

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
