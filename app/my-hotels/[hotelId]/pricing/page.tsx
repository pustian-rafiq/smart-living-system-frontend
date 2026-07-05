'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  EmptyState,
} from '@/components/page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CancellationPolicyCard } from '@/components/hotel/CancellationPolicyCard'
import { mockHotels, updateHotelPricing } from '@/data/mockHotels'
import type { SeasonalPriceRule } from '@/types/hotel'
import { DEFAULT_PRICING_RULES } from '@/lib/hotel/pricing'
import { Plus, Trash2, Hotel } from 'lucide-react'

export default function HotelPricingPage() {
  const params = useParams()
  const router = useRouter()
  const hotelId = params.hotelId as string
  const hotel = mockHotels.find(h => h.id === hotelId)

  const initial = hotel?.pricingRules ?? DEFAULT_PRICING_RULES
  const [weekendMultiplier, setWeekendMultiplier] = useState(
    initial.weekendMultiplier
  )
  const [serviceChargePercent, setServiceChargePercent] = useState(
    initial.serviceChargePercent
  )
  const [vatPercent, setVatPercent] = useState(initial.vatPercent)
  const [seasonalRules, setSeasonalRules] = useState<SeasonalPriceRule[]>(
    initial.seasonalRules
  )
  const [saved, setSaved] = useState(false)

  const [newRule, setNewRule] = useState({
    name: '',
    startDate: '',
    endDate: '',
    multiplier: 1.2,
  })

  const policy = hotel?.cancellationPolicy

  const previewNote = useMemo(() => {
    return `Weekend nights ×${weekendMultiplier}. Service ${serviceChargePercent}% + VAT ${vatPercent}%. ${seasonalRules.length} seasonal rule(s).`
  }, [weekendMultiplier, serviceChargePercent, vatPercent, seasonalRules.length])

  if (!hotel) {
    return (
      <Layout>
        <PageContainer>
          <EmptyState title="Hotel not found" icon={Hotel}>
            <Button asChild variant="outline">
              <Link href="/my-hotels">Back</Link>
            </Button>
          </EmptyState>
        </PageContainer>
      </Layout>
    )
  }

  const addSeason = () => {
    if (!newRule.name || !newRule.startDate || !newRule.endDate) return
    setSeasonalRules(prev => [
      ...prev,
      {
        id: `season-${Date.now()}`,
        name: newRule.name,
        startDate: newRule.startDate,
        endDate: newRule.endDate,
        multiplier: newRule.multiplier,
      },
    ])
    setNewRule({ name: '', startDate: '', endDate: '', multiplier: 1.2 })
  }

  const save = () => {
    updateHotelPricing(hotelId, {
      weekendMultiplier,
      serviceChargePercent,
      vatPercent,
      seasonalRules,
    })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title={`Pricing · ${hotel.name}`}
          description="Weekend, seasonal rates, service charge, and VAT for guest invoices."
          actions={
            <Button variant="outline" onClick={() => router.push('/my-hotels')}>
              Back to hotels
            </Button>
          }
        />

        {saved && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Pricing rules saved. New bookings will use these rates.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Base multipliers & taxes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Weekend multiplier (Fri–Sat nights)</Label>
                <Input
                  type="number"
                  step="0.05"
                  min={1}
                  max={3}
                  value={weekendMultiplier}
                  onChange={e =>
                    setWeekendMultiplier(parseFloat(e.target.value) || 1)
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service charge %</Label>
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    value={serviceChargePercent}
                    onChange={e =>
                      setServiceChargePercent(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>VAT %</Label>
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    value={vatPercent}
                    onChange={e =>
                      setVatPercent(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{previewNote}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Seasonal rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {seasonalRules.map(rule => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{rule.name}</p>
                      <p className="text-muted-foreground">
                        {rule.startDate} → {rule.endDate} · ×{rule.multiplier}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setSeasonalRules(prev =>
                          prev.filter(r => r.id !== rule.id)
                        )
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                {seasonalRules.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No seasonal rules yet.
                  </p>
                )}
              </div>

              <div className="space-y-2 rounded-lg border border-dashed p-3">
                <Label>Add seasonal period</Label>
                <Input
                  placeholder="Name (e.g. Eid holiday)"
                  value={newRule.name}
                  onChange={e =>
                    setNewRule(r => ({ ...r, name: e.target.value }))
                  }
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={newRule.startDate}
                    onChange={e =>
                      setNewRule(r => ({ ...r, startDate: e.target.value }))
                    }
                  />
                  <Input
                    type="date"
                    value={newRule.endDate}
                    onChange={e =>
                      setNewRule(r => ({ ...r, endDate: e.target.value }))
                    }
                  />
                </div>
                <Input
                  type="number"
                  step="0.05"
                  min={1}
                  max={3}
                  value={newRule.multiplier}
                  onChange={e =>
                    setNewRule(r => ({
                      ...r,
                      multiplier: parseFloat(e.target.value) || 1,
                    }))
                  }
                />
                <Button type="button" variant="outline" size="sm" onClick={addSeason}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add rule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <CancellationPolicyCard policy={policy} />
        </div>

        <div className="mt-6 flex gap-2">
          <Button onClick={save}>Save pricing rules</Button>
          <Button variant="outline" asChild>
            <Link href={`/my-hotels/${hotelId}/rooms`}>Manage rooms</Link>
          </Button>
        </div>
      </PageContainer>
    </Layout>
  )
}
