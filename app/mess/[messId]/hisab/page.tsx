'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { format } from 'date-fns'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoadingState } from '@/components/page'
import {
  addMemberDeposit,
  closeHisabMonth,
  createMealOffRequest,
  fetchHisabGrid,
  fetchHisabMonth,
  fetchMealOffRequests,
  fetchMemberDeposits,
  fetchMessById,
  fetchMessStudents,
  markAllHisabMeals,
  reopenHisabMonth,
  reviewMealOffRequest,
  saveHisabGrid,
  updateMessMealPricing,
  updateMessUtilities,
} from '@/lib/api/mess'
import { useMockQuery } from '@/hooks/useMockQuery'
import { formatCurrency } from '@/lib/format/locale'
import { getStoredRole } from '@/utils/auth'
import { toast } from '@/lib/feedback/toast'
import type { HisabGridRow } from '@/types/mess'
import { Calculator, Check, RotateCcw, Save } from 'lucide-react'

export default function MessHisabPage() {
  const t = useTranslations('mess.hisab')
  const tc = useTranslations('common')
  const params = useParams()
  const router = useRouter()
  const messId = String(params.messId || '')
  const role = getStoredRole()
  const isOwner = role === 'owner' || role === 'admin'

  const today = format(new Date(), 'yyyy-MM-dd')
  const [date, setDate] = useState(today)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [rows, setRows] = useState<HisabGridRow[]>([])
  const [saving, setSaving] = useState(false)
  const [guestPrice, setGuestPrice] = useState('')
  const [mealsPerDay, setMealsPerDay] = useState('3')
  const [depositStudentId, setDepositStudentId] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [waterAvail, setWaterAvail] = useState('24_7')
  const [powerAvail, setPowerAvail] = useState('24_7')
  const [hasIps, setHasIps] = useState(false)
  const [hasGenerator, setHasGenerator] = useState(false)
  const [hasFilter, setHasFilter] = useState(false)

  const loadMess = useCallback(() => fetchMessById(messId), [messId])
  const loadGrid = useCallback(() => fetchHisabGrid(messId, date), [messId, date])
  const loadMonth = useCallback(
    () => fetchHisabMonth(messId, month, year),
    [messId, month, year],
  )
  const loadOff = useCallback(() => fetchMealOffRequests(messId), [messId])
  const loadDeposits = useCallback(() => fetchMemberDeposits(messId), [messId])
  const loadStudents = useCallback(() => fetchMessStudents(messId), [messId])

  const { data: mess, loading: messLoading, refetch: refetchMess } = useMockQuery(loadMess)
  const { data: grid, loading: gridLoading, refetch: refetchGrid } = useMockQuery(loadGrid)
  const { data: monthData, loading: monthLoading, refetch: refetchMonth } =
    useMockQuery(loadMonth)
  const { data: offs, refetch: refetchOff } = useMockQuery(loadOff)
  const { data: deposits, refetch: refetchDep } = useMockQuery(loadDeposits)
  const { data: students } = useMockQuery(loadStudents)

  useEffect(() => {
    if (grid?.rows) setRows(grid.rows)
  }, [grid])

  useEffect(() => {
    if (!mess) return
    setGuestPrice(
      mess.mealSystem?.guestMealPrice != null
        ? String(mess.mealSystem.guestMealPrice)
        : '',
    )
    setMealsPerDay(String(mess.mealSystem?.mealsPerDay || 3))
    const w = mess.utilities?.water?.profile
    const e = mess.utilities?.electricity?.profile
    if (w?.availability) setWaterAvail(w.availability)
    if (e?.availability) setPowerAvail(e.availability)
    setHasFilter(Boolean(w?.hasFilter))
    setHasIps(Boolean(e?.hasIps))
    setHasGenerator(Boolean(e?.hasGenerator))
  }, [mess])

  const updateCell = (studentId: string, field: keyof HisabGridRow, value: number) => {
    setRows(prev =>
      prev.map(r => (r.studentId === studentId ? { ...r, [field]: value } : r)),
    )
  }

  const handleSaveGrid = async () => {
    setSaving(true)
    const result = await saveHisabGrid(
      messId,
      date,
      rows.map(r => ({
        studentId: r.studentId,
        breakfast: r.breakfast,
        lunch: r.lunch,
        dinner: r.dinner,
        guestBreakfast: r.guestBreakfast,
        guestLunch: r.guestLunch,
        guestDinner: r.guestDinner,
        notes: r.notes,
      })),
    )
    setSaving(false)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(t('saved'))
    refetchGrid()
    refetchMonth()
  }

  const handleMarkAll = async (on: boolean) => {
    const result = await markAllHisabMeals(messId, date, on)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    refetchGrid()
  }

  const handleClose = async () => {
    const result = await closeHisabMonth(messId, month, year)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(t('monthClosed'))
    refetchMonth()
  }

  const handleReopen = async () => {
    const result = await reopenHisabMonth(messId, month, year)
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(t('monthReopened'))
    refetchMonth()
  }

  const handleSavePricing = async () => {
    const result = await updateMessMealPricing(messId, {
      mealsPerDay: Number(mealsPerDay) || 3,
      guestMealPrice: guestPrice === '' ? null : Number(guestPrice),
      vegetarianOption: Boolean(mess?.mealSystem?.vegetarianOption),
    })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(t('pricingSaved'))
    refetchMess()
  }

  const handleSaveUtilities = async () => {
    const result = await updateMessUtilities(messId, {
      waterProfile: {
        availability: waterAvail,
        hasFilter,
      },
      electricityProfile: {
        availability: powerAvail,
        hasIps,
        hasGenerator,
      },
    })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    toast.success(t('utilitiesSaved'))
    refetchMess()
  }

  const handleDeposit = async () => {
    if (!depositStudentId || !depositAmount) return
    const result = await addMemberDeposit(messId, {
      studentId: depositStudentId,
      amount: Number(depositAmount),
      date: today,
    })
    if (!result.ok) {
      toast.error(result.error)
      return
    }
    setDepositAmount('')
    toast.success(t('depositAdded'))
    refetchDep()
    refetchMonth()
  }

  if (messLoading) {
    return (
      <Layout>
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <LoadingState label={t('loading')} />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-7xl space-y-6 px-4 py-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Button variant="ghost" className="mb-2 -ml-2" onClick={() => router.back()}>
              ← {tc('back')}
            </Button>
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <Calculator className="h-6 w-6" />
              {t('title')}
            </h1>
            <p className="text-muted-foreground">
              {mess?.name} · {t('subtitle')}
            </p>
          </div>
          {monthData ? (
            <Badge variant={monthData.status === 'closed' ? 'secondary' : 'default'}>
              {monthData.status === 'closed' ? t('closed') : t('open')} ·{' '}
              {formatCurrency(monthData.mealRate)}/{t('meal')}
            </Badge>
          ) : null}
        </div>

        <Tabs defaultValue="grid">
          <TabsList className="flex h-auto flex-wrap gap-1">
            <TabsTrigger value="grid">{t('tabGrid')}</TabsTrigger>
            <TabsTrigger value="month">{t('tabMonth')}</TabsTrigger>
            <TabsTrigger value="deposits">{t('tabDeposits')}</TabsTrigger>
            <TabsTrigger value="mealOff">{t('tabMealOff')}</TabsTrigger>
            {isOwner ? (
              <TabsTrigger value="settings">{t('tabSettings')}</TabsTrigger>
            ) : null}
          </TabsList>

          <TabsContent value="grid" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
                <CardTitle className="text-lg">{t('dailyGrid')}</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-auto"
                  />
                  {isOwner ? (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleMarkAll(true)}>
                        {t('markAllOn')}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleMarkAll(false)}>
                        {t('markAllOff')}
                      </Button>
                      <Button size="sm" onClick={handleSaveGrid} disabled={saving}>
                        <Save className="mr-1 h-4 w-4" />
                        {t('save')}
                      </Button>
                    </>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent>
                {gridLoading ? (
                  <LoadingState label={t('loading')} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-sm">
                      <thead>
                        <tr className="border-b text-left text-muted-foreground">
                          <th className="p-2">{t('member')}</th>
                          <th className="p-2">B</th>
                          <th className="p-2">L</th>
                          <th className="p-2">D</th>
                          <th className="p-2">G-B</th>
                          <th className="p-2">G-L</th>
                          <th className="p-2">G-D</th>
                          <th className="p-2">{t('total')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map(row => (
                          <tr key={row.studentId} className="border-b border-muted/60">
                            <td className="p-2 font-medium">
                              {row.name}
                              {row.seatNumber ? (
                                <span className="ml-1 text-xs text-muted-foreground">
                                  · {row.seatNumber}
                                </span>
                              ) : null}
                            </td>
                            {(
                              [
                                'breakfast',
                                'lunch',
                                'dinner',
                                'guestBreakfast',
                                'guestLunch',
                                'guestDinner',
                              ] as const
                            ).map(field => (
                              <td key={field} className="p-1">
                                <Input
                                  type="number"
                                  min={0}
                                  max={field.startsWith('guest') ? 20 : 3}
                                  step={field.startsWith('guest') ? 1 : 0.5}
                                  className="h-8 w-16"
                                  disabled={!isOwner || monthData?.status === 'closed'}
                                  value={row[field]}
                                  onChange={e =>
                                    updateCell(
                                      row.studentId,
                                      field,
                                      Number(e.target.value) || 0,
                                    )
                                  }
                                />
                              </td>
                            ))}
                            <td className="p-2 tabular-nums">
                              {Number(row.breakfast) +
                                Number(row.lunch) +
                                Number(row.dinner)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {!rows.length ? (
                      <p className="py-8 text-center text-muted-foreground">
                        {t('noMembers')}
                      </p>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="month" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
                <CardTitle className="text-lg">{t('monthSummary')}</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    type="number"
                    className="w-20"
                    value={month}
                    min={1}
                    max={12}
                    onChange={e => setMonth(Number(e.target.value) || 1)}
                  />
                  <Input
                    type="number"
                    className="w-24"
                    value={year}
                    onChange={e => setYear(Number(e.target.value) || year)}
                  />
                  {isOwner && monthData?.status === 'open' ? (
                    <Button size="sm" onClick={handleClose}>
                      <Check className="mr-1 h-4 w-4" />
                      {t('closeMonth')}
                    </Button>
                  ) : null}
                  {isOwner && monthData?.status === 'closed' ? (
                    <Button size="sm" variant="outline" onClick={handleReopen}>
                      <RotateCcw className="mr-1 h-4 w-4" />
                      {t('reopenMonth')}
                    </Button>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {monthLoading || !monthData ? (
                  <LoadingState label={t('loading')} />
                ) : (
                  <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <Stat label={t('bazaar')} value={formatCurrency(monthData.bazaarTotal)} />
                      <Stat label={t('fixed')} value={formatCurrency(monthData.fixedTotal)} />
                      <Stat label={t('totalMeals')} value={String(monthData.totalMeals)} />
                      <Stat
                        label={t('mealRate')}
                        value={formatCurrency(monthData.mealRate)}
                      />
                    </div>
                    {monthData.paymentTodo ? (
                      <p className="rounded-lg border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        {t('paymentTodo')}
                      </p>
                    ) : null}
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[640px] text-sm">
                        <thead>
                          <tr className="border-b text-left text-muted-foreground">
                            <th className="p-2">{t('member')}</th>
                            <th className="p-2">{t('meals')}</th>
                            <th className="p-2">{t('mealCost')}</th>
                            <th className="p-2">{t('guest')}</th>
                            <th className="p-2">{t('fixedShare')}</th>
                            <th className="p-2">{t('deposits')}</th>
                            <th className="p-2">{t('due')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monthData.members.map(m => (
                            <tr key={m.studentId} className="border-b">
                              <td className="p-2 font-medium">{m.name}</td>
                              <td className="p-2">{m.mealCount}</td>
                              <td className="p-2">{formatCurrency(m.mealCost)}</td>
                              <td className="p-2">{formatCurrency(m.guestCost)}</td>
                              <td className="p-2">{formatCurrency(m.fixedShare)}</td>
                              <td className="p-2">{formatCurrency(m.deposits)}</td>
                              <td className="p-2 font-semibold text-primary">
                                {formatCurrency(m.due)}
                                {m.credit > 0 ? (
                                  <span className="ml-1 text-xs text-emerald-700">
                                    (+{formatCurrency(m.credit)})
                                  </span>
                                ) : null}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-muted-foreground">{monthData.note}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('depositsTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isOwner ? (
                  <div className="flex flex-wrap gap-2">
                    <select
                      className="h-10 rounded-md border px-3 text-sm"
                      value={depositStudentId}
                      onChange={e => setDepositStudentId(e.target.value)}
                    >
                      <option value="">{t('selectMember')}</option>
                      {(students || []).map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      placeholder={t('amount')}
                      className="w-32"
                      value={depositAmount}
                      onChange={e => setDepositAmount(e.target.value)}
                    />
                    <Button onClick={handleDeposit}>{t('addDeposit')}</Button>
                  </div>
                ) : null}
                <ul className="divide-y rounded-lg border">
                  {(deposits || []).map(d => (
                    <li
                      key={d.id}
                      className="flex items-center justify-between px-3 py-2 text-sm"
                    >
                      <span>
                        {d.studentName} · {d.date}
                        {d.note ? (
                          <span className="text-muted-foreground"> — {d.note}</span>
                        ) : null}
                      </span>
                      <span className="font-medium">{formatCurrency(d.amount)}</span>
                    </li>
                  ))}
                  {!deposits?.length ? (
                    <li className="px-3 py-6 text-center text-muted-foreground">
                      {t('noDeposits')}
                    </li>
                  ) : null}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mealOff" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
                <CardTitle className="text-lg">{t('mealOffTitle')}</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const start = today
                    const result = await createMealOffRequest(messId, {
                      startDate: start,
                      endDate: start,
                      reason: 'Meal off',
                      studentId: isOwner ? students?.[0]?.id : undefined,
                    })
                    if (!result.ok) {
                      toast.error(result.error)
                      return
                    }
                    toast.success(t('mealOffCreated'))
                    refetchOff()
                  }}
                >
                  {t('requestMealOff')}
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(offs || []).map(req => (
                    <li
                      key={req.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">
                          {req.studentName} · {req.startDate} → {req.endDate}
                        </p>
                        <p className="text-muted-foreground">{req.reason || '—'}</p>
                        <Badge className="mt-1" variant="outline">
                          {req.status}
                        </Badge>
                      </div>
                      {isOwner && req.status === 'pending' ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={async () => {
                              const r = await reviewMealOffRequest(
                                messId,
                                req.id,
                                true,
                              )
                              if (!r.ok) toast.error(r.error)
                              else refetchOff()
                            }}
                          >
                            {t('approve')}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              const r = await reviewMealOffRequest(
                                messId,
                                req.id,
                                false,
                              )
                              if (!r.ok) toast.error(r.error)
                              else refetchOff()
                            }}
                          >
                            {t('reject')}
                          </Button>
                        </div>
                      ) : null}
                    </li>
                  ))}
                  {!offs?.length ? (
                    <p className="py-6 text-center text-muted-foreground">
                      {t('noMealOff')}
                    </p>
                  ) : null}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {isOwner ? (
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('pricingTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <label className="text-sm">
                    {t('mealsPerDay')}
                    <Input
                      className="mt-1 w-24"
                      value={mealsPerDay}
                      onChange={e => setMealsPerDay(e.target.value)}
                    />
                  </label>
                  <label className="text-sm">
                    {t('guestPrice')}
                    <Input
                      className="mt-1 w-32"
                      value={guestPrice}
                      onChange={e => setGuestPrice(e.target.value)}
                      placeholder="50"
                    />
                  </label>
                  <Button className="self-end" onClick={handleSavePricing}>
                    {t('savePricing')}
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('utilitiesTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <label className="text-sm">
                      {t('waterAvail')}
                      <select
                        className="mt-1 block h-10 rounded-md border px-2"
                        value={waterAvail}
                        onChange={e => setWaterAvail(e.target.value)}
                      >
                        <option value="24_7">24/7</option>
                        <option value="limited">Limited</option>
                        <option value="frequent_problem">Frequent problem</option>
                      </select>
                    </label>
                    <label className="text-sm">
                      {t('powerAvail')}
                      <select
                        className="mt-1 block h-10 rounded-md border px-2"
                        value={powerAvail}
                        onChange={e => setPowerAvail(e.target.value)}
                      >
                        <option value="24_7">24/7</option>
                        <option value="limited">Limited</option>
                        <option value="frequent_problem">Frequent problem</option>
                      </select>
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={hasFilter}
                        onChange={e => setHasFilter(e.target.checked)}
                      />
                      {t('hasFilter')}
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={hasIps}
                        onChange={e => setHasIps(e.target.checked)}
                      />
                      IPS
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={hasGenerator}
                        onChange={e => setHasGenerator(e.target.checked)}
                      />
                      {t('hasGenerator')}
                    </label>
                  </div>
                  <Button onClick={handleSaveUtilities}>{t('saveUtilities')}</Button>
                  {mess?.utilities ? (
                    <p className="text-sm text-muted-foreground">
                      {t('scoresPreview', {
                        water: mess.utilities.water.score,
                        power: mess.utilities.electricity.score,
                      })}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </TabsContent>
          ) : null}
        </Tabs>
      </div>
    </Layout>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  )
}
