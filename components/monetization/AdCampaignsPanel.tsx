'use client'

import { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useMockQuery } from '@/hooks/useMockQuery'
import {
  createAdCampaign,
  endAdCampaign,
  fetchAdCampaigns,
  fetchCampaignAnalytics,
} from '@/lib/api/subscriptions'
import { fetchOwnerListings } from '@/lib/api/properties'
import { toast } from '@/lib/feedback/toast'
import { format } from 'date-fns'

export function AdCampaignsPanel() {
  const [tick, setTick] = useState(0)
  const [name, setName] = useState('Featured campaign')
  const [listingId, setListingId] = useState('')
  const [durationDays, setDurationDays] = useState('7')
  const [bidAmount, setBidAmount] = useState('50')
  const [saving, setSaving] = useState(false)

  const loadCampaigns = useCallback(() => fetchAdCampaigns(), [tick])
  const loadAnalytics = useCallback(() => fetchCampaignAnalytics(), [tick])
  const loadListings = useCallback(() => fetchOwnerListings(), [tick])

  const { data: campaigns } = useMockQuery(loadCampaigns)
  const { data: analytics } = useMockQuery(loadAnalytics)
  const { data: listings } = useMockQuery(loadListings)

  const create = async () => {
    if (!listingId) {
      toast.error('Select a listing to advertise')
      return
    }
    setSaving(true)
    const result = await createAdCampaign({
      name: name.trim() || 'Campaign',
      targetType: 'listing',
      listingId,
      durationDays: Number(durationDays) || 7,
      bidAmount: Number(bidAmount) || 50,
    })
    setSaving(false)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success('Campaign started')
    setTick(t => t + 1)
  }

  return (
    <div className="space-y-4 rounded-xl border p-4">
      <div>
        <h3 className="text-lg font-semibold">Ad campaigns</h3>
        <p className="text-sm text-muted-foreground">
          Time-boxed boosts with quality ranking, slot caps, and vacancy flash.
        </p>
      </div>

      {analytics && (
        <div className="grid gap-3 sm:grid-cols-4">
          <Stat label="Active" value={String(analytics.activeCampaigns)} />
          <Stat label="Impressions" value={String(analytics.impressions)} />
          <Stat label="Clicks" value={String(analytics.clicks)} />
          <Stat label="Spend" value={`৳${analytics.spend}`} />
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Campaign name</Label>
          <Input className="mt-1.5" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <Label>Listing</Label>
          <Select value={listingId} onValueChange={setListingId}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Choose listing" />
            </SelectTrigger>
            <SelectContent>
              {(listings ?? []).map(p => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Duration (days)</Label>
          <Input
            className="mt-1.5"
            value={durationDays}
            onChange={e => setDurationDays(e.target.value)}
          />
        </div>
        <div>
          <Label>Bid amount</Label>
          <Input
            className="mt-1.5"
            value={bidAmount}
            onChange={e => setBidAmount(e.target.value)}
          />
        </div>
      </div>
      <Button type="button" onClick={create} disabled={saving}>
        {saving ? 'Starting…' : 'Start campaign'}
      </Button>

      <ul className="space-y-2">
        {(campaigns ?? []).map(c => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
          >
            <div>
              <p className="font-medium">
                {c.name}{' '}
                {c.vacancyFlash && (
                  <Badge variant="secondary" className="ml-1">
                    Vacancy flash
                  </Badge>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {c.status} · rank {c.rankScore} · ends{' '}
                {format(new Date(c.endsAt), 'MMM d')}
              </p>
            </div>
            {c.isLive && (
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  const r = await endAdCampaign(c.id)
                  if (!r.ok) toast.error(r.error)
                  else {
                    toast.success('Campaign ended')
                    setTick(t => t + 1)
                  }
                }}
              >
                End
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}
