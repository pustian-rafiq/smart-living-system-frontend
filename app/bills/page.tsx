'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useStoredRole } from '@/hooks/useStoredRole'
import { Layout } from '@/components/layout/Layout'
import { EmptyState, LoadingState } from '@/components/page'
import { BillCard } from '@/components/bill/BillCard'
import { GenerateBillDialog } from '@/components/bill/GenerateBillDialog'
import { BillTemplateDialog } from '@/components/bill/BillTemplateDialog'
import { MeterReadingDialog } from '@/components/bill/MeterReadingDialog'
import { BillGenerationRuleDialog } from '@/components/bill/BillGenerationRuleDialog'
import { BulkBillDialog } from '@/components/bulk/BulkBillDialog'
import { SchedulePaymentDialog } from '@/components/payment/SchedulePaymentDialog'
import { PayBillDialog } from '@/components/payment/PayBillDialog'
import { RecordCashPaymentDialog } from '@/components/payment/RecordCashPaymentDialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Plus,
  Filter,
  FileText,
  Settings,
  Calendar,
  Zap,
  Edit,
  Trash2,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import {
  fetchBillsBoard,
  scheduleBillPayment,
  getMeterReading,
  getPreviousMeterReading,
} from '@/lib/api/bills'
import { getDemoTenantId, getDemoOwnerId } from '@/lib/api/demoUser'
import type { Building, Flat, Renter } from '@/types/building'
import type { Mess } from '@/types/mess'
import type {
  Bill,
  BillStatus,
  BillTemplate,
  BillGenerationRule,
  MeterReading,
} from '@/types/bill'
import type { BulkBillGenerationData } from '@/types/bulk'
import type { PaymentMethod } from '@/types/payment'
import { useConfirm } from '@/components/feedback'

export default function BillsPage() {
  const t = useTranslations('bills')
  const tc = useTranslations('common')
  const { confirm } = useConfirm()
  const [bills, setBills] = useState<Bill[]>([])
  const [templates, setTemplates] = useState<BillTemplate[]>([])
  const [rules, setRules] = useState<BillGenerationRule[]>([])
  const [meterReadings, setMeterReadings] = useState<MeterReading[]>([])
  const [buildings, setBuildings] = useState<Building[]>([])
  const [flats, setFlats] = useState<Flat[]>([])
  const [renters, setRenters] = useState<Renter[]>([])
  const [messList, setMessList] = useState<Mess[]>([])
  const [boardReady, setBoardReady] = useState(false)
  const [statusFilter, setStatusFilter] = useState<BillStatus | 'all'>('all')
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [isMeterReadingDialogOpen, setIsMeterReadingDialogOpen] =
    useState(false)
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)
  const [isBulkBillDialogOpen, setIsBulkBillDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<
    BillTemplate | undefined
  >()
  const [selectedRule, setSelectedRule] = useState<
    BillGenerationRule | undefined
  >()
  const [selectedReading, setSelectedReading] = useState<
    MeterReading | undefined
  >()
  const [selectedBillForPayment, setSelectedBillForPayment] =
    useState<Bill | null>(null)
  const [isSchedulePaymentDialogOpen, setIsSchedulePaymentDialogOpen] =
    useState(false)
  const [payBillTarget, setPayBillTarget] = useState<Bill | null>(null)
  const [isPayBillOpen, setIsPayBillOpen] = useState(false)
  const [cashBillTarget, setCashBillTarget] = useState<Bill | null>(null)
  const [isCashDialogOpen, setIsCashDialogOpen] = useState(false)

  const { ready, isOwner } = useStoredRole()
  const tenantId = getDemoTenantId()

  const loadBoard = useCallback(async () => {
    const result = await fetchBillsBoard()
    if (result.ok) {
      setBills(result.data.bills)
      setTemplates(result.data.templates)
      setRules(result.data.rules)
      setMeterReadings(result.data.meterReadings)
      setBuildings(result.data.buildings)
      setFlats(result.data.flats)
      setRenters(result.data.renters)
      setMessList(result.data.messList)
    }
    setBoardReady(true)
  }, [])

  useEffect(() => {
    loadBoard()
  }, [loadBoard])

  // Deep-links: /bills?action=generate | /bills?status=overdue
  useEffect(() => {
    if (!ready) return
    const params = new URLSearchParams(window.location.search)
    if (params.get('action') === 'generate' && isOwner) {
      setIsGenerateDialogOpen(true)
    }
    const status = params.get('status')
    if (
      status === 'paid' ||
      status === 'unpaid' ||
      status === 'overdue' ||
      status === 'all'
    ) {
      setStatusFilter(status)
    }
  }, [ready, isOwner])

  // Filter bills based on role and status
  const filteredBills = useMemo(() => {
    let filtered = [...bills]

    if (!isOwner) {
      filtered = filtered.filter(b => b.tenantId === tenantId)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter)
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.month} 1, ${a.year}`)
      const dateB = new Date(`${b.month} 1, ${b.year}`)
      return dateB.getTime() - dateA.getTime()
    })
  }, [bills, statusFilter, isOwner, tenantId])

  const refreshBills = () => {
    loadBoard()
  }

  const handleRecordCash = (bill: Bill) => {
    setCashBillTarget(bill)
    setIsCashDialogOpen(true)
  }

  const handleSchedulePayment = (bill: Bill) => {
    setSelectedBillForPayment(bill)
    setIsSchedulePaymentDialogOpen(true)
  }

  const handlePayNow = (bill: Bill) => {
    setPayBillTarget(bill)
    setIsPayBillOpen(true)
  }

  const handlePaySuccess = (paidBill: Bill) => {
    setBills(prev => prev.map(b => (b.id === paidBill.id ? paidBill : b)))
  }

  const handleSchedulePaymentSubmit = (data: {
    billId: string
    billName: string
    amount: number
    scheduledDate: string
    scheduledTime?: string
    paymentMethod: string
    accountNumber?: string
    reminderEnabled: boolean
    reminderDays: number[]
    autoRetry: boolean
    maxRetries?: number
  }) => {
    scheduleBillPayment({
      userId: tenantId,
      billId: data.billId,
      billName: data.billName,
      amount: data.amount,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime || '10:00',
      paymentMethod: data.paymentMethod as PaymentMethod,
      accountNumber: data.accountNumber,
      status: 'scheduled',
      reminderEnabled: data.reminderEnabled,
      reminderDays: data.reminderDays,
      autoRetry: data.autoRetry,
      maxRetries: data.maxRetries ?? 0,
      retryCount: 0,
    })
    setSelectedBillForPayment(null)
    setIsSchedulePaymentDialogOpen(false)
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

  const handleBulkBillSubmit = (data: BulkBillGenerationData) => {
    const building = buildings.find(b => b.id === data.buildingId)
    if (!data.buildingId || !building) {
      setIsBulkBillDialogOpen(false)
      return
    }
    const flatIds =
      data.flatIds && data.flatIds.length > 0
        ? data.flatIds
        : flats.filter(f => f.buildingId === data.buildingId).map(f => f.id)

    const newBills: Bill[] = []
    for (const flatId of flatIds) {
      const flat = flats.find(f => f.id === flatId)
      if (!flat?.renter) continue
      const amount = flat.rent
      newBills.push({
        id: `bill-bulk-${flatId}-${Date.now()}`,
        tenantName: flat.renter.name,
        tenantId: flat.renter.id,
        propertyType: 'apartment',
        propertyName: building.name,
        propertyId: data.buildingId,
        flatNumber: flat.flatNumber,
        month: data.month,
        year: data.year,
        amount,
        dueDate: new Date(data.year, months.indexOf(data.month), 5)
          .toISOString()
          .split('T')[0],
        status: 'unpaid',
        items: [
          {
            id: `item-${flatId}-${Date.now()}`,
            description: 'Monthly rent',
            amount,
            type: 'rent',
          },
        ],
        createdAt: new Date().toISOString().split('T')[0],
      })
    }
    if (newBills.length) setBills([...newBills, ...bills])
    setIsBulkBillDialogOpen(false)
  }

  const handleGenerate = (data: any) => {
    // Get property name
    const property = [...buildings, ...messList].find(
      p => p.id === data.propertyId
    )
    const propertyName = property?.name || t('misc.unknownProperty')

    // Get tenant name
    const tenant = renters.find(tenantItem => tenantItem.id === data.tenantId)
    const tenantName = tenant?.name || t('misc.unknownTenant')

    // Get flat number if apartment
    let flatNumber: string | undefined
    if (data.flatId) {
      const flat = flats.find(f => f.id === data.flatId)
      flatNumber = flat?.flatNumber
    }

    // Get meter reading if available
    const meterReading = getMeterReading(
      data.propertyId,
      data.flatId,
      undefined,
      data.month,
      data.year
    )

    const newBill: Bill = {
      id: `bill${Date.now()}`,
      tenantName,
      tenantId: data.tenantId,
      propertyType: data.propertyType,
      propertyName,
      propertyId: data.propertyId,
      flatNumber,
      month: data.month,
      year: data.year,
      amount: data.items.reduce(
        (sum: number, item: any) => sum + (item.amount || 0),
        0
      ),
      dueDate: new Date(data.year, months.indexOf(data.month), 5)
        .toISOString()
        .split('T')[0],
      status: 'unpaid',
      items: data.items.map((item: any, idx: number) => ({
        id: `item${idx}`,
        description: item.description,
        amount: item.amount || 0,
        type: item.type,
        calculationType: item.calculationType,
        unitRate: item.unitRate,
        previousReading: item.previousReading,
        currentReading: item.currentReading,
        consumption: item.consumption,
      })),
      templateId: data.templateId,
      meterReadings: meterReading,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setBills([newBill, ...bills])
    setIsGenerateDialogOpen(false)
  }

  const handleTemplateSubmit = (data: any) => {
    if (selectedTemplate) {
      setTemplates(
        templates.map(t =>
          t.id === selectedTemplate.id
            ? {
                ...t,
                ...data,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : t
        )
      )
    } else {
      const newTemplate: BillTemplate = {
        id: `template${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      }
      setTemplates([...templates, newTemplate])
    }
    setIsTemplateDialogOpen(false)
    setSelectedTemplate(undefined)
  }

  const handleMeterReadingSubmit = (data: any) => {
    // Get previous reading for consumption calculation
    const prevReading = getPreviousMeterReading(
      data.propertyId,
      data.flatId,
      data.seatId,
      data.month,
      data.year
    )

    if (selectedReading) {
      setMeterReadings(
        meterReadings.map(r =>
          r.id === selectedReading.id
            ? { ...r, ...data, submittedAt: new Date().toISOString() }
            : r
        )
      )
    } else {
      const newReading: MeterReading = {
        id: `reading${Date.now()}`,
        ...data,
        submittedAt: new Date().toISOString(),
        submittedBy: getDemoOwnerId(),
        previousElectricity: prevReading?.electricity,
        previousGas: prevReading?.gas,
        previousWater: prevReading?.water,
        electricityConsumption:
          data.electricity && prevReading?.electricity
            ? data.electricity - prevReading.electricity
            : undefined,
        gasConsumption:
          data.gas && prevReading?.gas ? data.gas - prevReading.gas : undefined,
        waterConsumption:
          data.water && prevReading?.water
            ? data.water - prevReading.water
            : undefined,
      }
      setMeterReadings([...meterReadings, newReading])
    }
    setIsMeterReadingDialogOpen(false)
    setSelectedReading(undefined)
  }

  const handleRuleSubmit = (data: any) => {
    if (selectedRule) {
      setRules(
        rules.map(r =>
          r.id === selectedRule.id
            ? {
                ...r,
                ...data,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : r
        )
      )
    } else {
      const newRule: BillGenerationRule = {
        id: `rule${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        lastRun: undefined,
        nextRun: calculateNextRun(data.schedule),
      }
      setRules([...rules, newRule])
    }
    setIsRuleDialogOpen(false)
    setSelectedRule(undefined)
  }

  const calculateNextRun = (schedule: any): string => {
    const now = new Date()
    if (schedule.type === 'monthly') {
      const next = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        schedule.dayOfMonth || 1
      )
      return next.toISOString().split('T')[0]
    }
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
  }

  const handleToggleTemplate = (template: BillTemplate) => {
    setTemplates(
      templates.map(t =>
        t.id === template.id
          ? {
              ...t,
              isActive: !t.isActive,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : t
      )
    )
  }

  const handleToggleRule = (rule: BillGenerationRule) => {
    setRules(
      rules.map(r =>
        r.id === rule.id
          ? {
              ...r,
              isActive: !r.isActive,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : r
      )
    )
  }

  const handleDeleteTemplate = async (template: BillTemplate) => {
    const ok = await confirm({
      title: t('confirm.deleteTemplateTitle'),
      description: t('confirm.deleteTemplateDesc', { name: template.name }),
      variant: 'destructive',
    })
    if (!ok) return
    setTemplates(templates.filter(t => t.id !== template.id))
  }

  const handleDeleteRule = async (rule: BillGenerationRule) => {
    const ok = await confirm({
      title: t('confirm.deleteRuleTitle'),
      description: t('confirm.deleteRuleDesc', { name: rule.name }),
      variant: 'destructive',
    })
    if (!ok) return
    setRules(rules.filter(r => r.id !== rule.id))
  }

  const statusCounts = {
    all: filteredBills.length,
    paid: bills.filter(b => b.status === 'paid').length,
    unpaid: bills.filter(b => b.status === 'unpaid').length,
    overdue: bills.filter(b => b.status === 'overdue').length,
  }

  const activeTemplates = templates.filter(t => t.isActive)
  const activeRules = rules.filter(r => r.isActive)

  // Wait for client role so owner/renter trees match after hydration
  if (!ready || !boardReady) {
    return (
      <Layout>
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <LoadingState label={tc('loading')} variant="skeleton" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {isOwner ? t('owner.title') : t('renter.title')}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isOwner ? t('owner.description') : t('renter.description')}
            </p>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Button onClick={() => setIsGenerateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('actions.generateBill')}
              </Button>
              <Button
                onClick={() => setIsBulkBillDialogOpen(true)}
                variant="outline"
              >
                <FileText className="mr-2 h-4 w-4" />
                {t('actions.bulkGenerate')}
              </Button>
            </div>
          )}
        </div>

        {isOwner ? (
          <Tabs defaultValue="bills" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bills">
                <FileText className="mr-2 h-4 w-4" />
                {t('tabs.bills')}
              </TabsTrigger>
              <TabsTrigger value="templates">
                <Settings className="mr-2 h-4 w-4" />
                {t('tabs.templates')}
              </TabsTrigger>
              <TabsTrigger value="readings">
                <Calendar className="mr-2 h-4 w-4" />
                {t('tabs.meterReadings')}
              </TabsTrigger>
              <TabsTrigger value="automation">
                <Zap className="mr-2 h-4 w-4" />
                {t('tabs.automation')}
              </TabsTrigger>
            </TabsList>

            {/* Bills Tab */}
            <TabsContent value="bills" className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('filters.status')}</span>
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={value =>
                    setStatusFilter(value as BillStatus | 'all')
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t('filters.all', { count: statusCounts.all })}
                    </SelectItem>
                    <SelectItem value="paid">
                      {t('filters.paid', { count: statusCounts.paid })}
                    </SelectItem>
                    <SelectItem value="unpaid">
                      {t('filters.unpaid', { count: statusCounts.unpaid })}
                    </SelectItem>
                    <SelectItem value="overdue">
                      {t('filters.overdue', { count: statusCounts.overdue })}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredBills.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title={t('empty.billsTitle')}
                  description={
                    statusFilter !== 'all'
                      ? t('empty.billsDescFiltered', {
                          status: t(`status.${statusFilter}`),
                        })
                      : t('empty.billsDescDefault')
                  }
                >
                  <Button onClick={() => setIsGenerateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('actions.generateBill')}
                  </Button>
                </EmptyState>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredBills.map(bill => (
                    <BillCard
                      key={bill.id}
                      bill={bill}
                      onMarkPaid={isOwner ? handleRecordCash : undefined}
                      onSchedulePayment={handleSchedulePayment}
                      showTenantName={true}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{t('templates.title')}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('templates.description')}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSelectedTemplate(undefined)
                    setIsTemplateDialogOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('actions.createTemplate')}
                </Button>
              </div>

              {templates.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg font-semibold text-muted-foreground">
                      {t('empty.templatesTitle')}
                    </p>
                    <Button
                      onClick={() => setIsTemplateDialogOpen(true)}
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t('actions.createTemplate')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {templates.map(template => {
                    const property = [...buildings, ...messList].find(
                      p => p.id === template.propertyId
                    )
                    return (
                      <Card key={template.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                {template.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {template.description || t('templates.noDescription')}
                              </CardDescription>
                            </div>
                            <Badge
                              variant={
                                template.isActive ? 'default' : 'secondary'
                              }
                            >
                              {template.isActive
                                ? t('templates.active')
                                : t('templates.inactive')}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t('templates.propertyLabel')}
                              </span>
                              <span className="font-medium">
                                {property?.name || t('misc.notAvailable')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t('templates.typeLabel')}
                              </span>
                              <span className="font-medium capitalize">
                                {template.propertyType}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t('templates.itemsLabel')}
                              </span>
                              <span className="font-medium">
                                {template.items.length}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={template.isActive}
                                onCheckedChange={() =>
                                  handleToggleTemplate(template)
                                }
                              />
                              <span className="text-sm text-muted-foreground">
                                {t('templates.active')}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedTemplate(template)
                                  setIsTemplateDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTemplate(template)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* Meter Readings Tab */}
            <TabsContent value="readings" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{t('meterReadings.title')}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('meterReadings.recordDesc')}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSelectedReading(undefined)
                    setIsMeterReadingDialogOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('actions.addReading')}
                </Button>
              </div>

              {meterReadings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg font-semibold text-muted-foreground">
                      {t('empty.readingsTitle')}
                    </p>
                    <Button
                      onClick={() => setIsMeterReadingDialogOpen(true)}
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t('actions.addReading')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {meterReadings.map(reading => {
                    const property = [...buildings, ...messList].find(
                      p => p.id === reading.propertyId
                    )
                    return (
                      <Card key={reading.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {property?.name || t('misc.unknownProperty')}
                          </CardTitle>
                          <CardDescription>
                            {reading.month} {reading.year}
                            {(() => {
                              const flatNumber = reading.flatId
                                ? flats.find(f => f.id === reading.flatId)
                                    ?.flatNumber
                                : undefined
                              return flatNumber
                                ? ` • ${t('misc.flatPrefix', { number: flatNumber })}`
                                : null
                            })()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {reading.electricity !== undefined && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {t('meterReadings.electricity')}
                              </span>
                              <div className="text-right">
                                <span className="font-medium">
                                  {t('meterReadings.units', {
                                    count: reading.electricity,
                                  })}
                                </span>
                                {reading.electricityConsumption && (
                                  <Badge variant="outline" className="ml-2">
                                    +{reading.electricityConsumption}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          {reading.gas !== undefined && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {t('meterReadings.gas')}
                              </span>
                              <div className="text-right">
                                <span className="font-medium">
                                  {t('meterReadings.units', {
                                    count: reading.gas,
                                  })}
                                </span>
                                {reading.gasConsumption && (
                                  <Badge variant="outline" className="ml-2">
                                    +{reading.gasConsumption}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          {reading.water !== undefined && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {t('meterReadings.water')}
                              </span>
                              <div className="text-right">
                                <span className="font-medium">
                                  {t('meterReadings.units', {
                                    count: reading.water,
                                  })}
                                </span>
                                {reading.waterConsumption && (
                                  <Badge variant="outline" className="ml-2">
                                    +{reading.waterConsumption}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          <div className="pt-2 border-t">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full"
                              onClick={() => {
                                setSelectedReading(reading)
                                setIsMeterReadingDialogOpen(true)
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              {t('actions.edit')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* Automation Tab */}
            <TabsContent value="automation" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{t('automation.rulesTitle')}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('automation.rulesDescription')}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSelectedRule(undefined)
                    setIsRuleDialogOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {t('actions.createRule')}
                </Button>
              </div>

              {rules.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg font-semibold text-muted-foreground">
                      {t('empty.rulesTitle')}
                    </p>
                    <Button
                      onClick={() => setIsRuleDialogOpen(true)}
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t('actions.createRule')}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {rules.map(rule => {
                    const template = templates.find(
                      t => t.id === rule.templateId
                    )
                    return (
                      <Card key={rule.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">
                                {rule.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {rule.description || t('templates.noDescription')}
                              </CardDescription>
                            </div>
                            <Badge
                              variant={rule.isActive ? 'default' : 'secondary'}
                            >
                              {rule.isActive
                                ? t('templates.active')
                                : t('templates.inactive')}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t('automation.templateLabel')}
                              </span>
                              <span className="font-medium">
                                {template?.name || t('misc.notAvailable')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t('automation.scheduleLabel')}
                              </span>
                              <span className="font-medium capitalize">
                                {rule.schedule.type}
                                {rule.schedule.type === 'monthly' &&
                                  rule.schedule.dayOfMonth && (
                                    <span>
                                      {' '}
                                      •{' '}
                                      {t('automation.dayOfMonth', {
                                        day: rule.schedule.dayOfMonth,
                                      })}
                                    </span>
                                  )}
                              </span>
                            </div>
                            {rule.nextRun && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t('automation.nextRun')}:
                                </span>
                                <span className="font-medium">
                                  {rule.nextRun}
                                </span>
                              </div>
                            )}
                            {rule.lastRun && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {t('automation.lastRun')}:
                                </span>
                                <span className="font-medium">
                                  {rule.lastRun}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={rule.isActive}
                                onCheckedChange={() => handleToggleRule(rule)}
                              />
                              <span className="text-sm text-muted-foreground">
                                {t('templates.active')}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedRule(rule)
                                  setIsRuleDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteRule(rule)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          // Renter view - simple bills list
          <>
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{t('filters.status')}</span>
              </div>
              <Select
                value={statusFilter}
                onValueChange={value =>
                  setStatusFilter(value as BillStatus | 'all')
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t('filters.all', { count: statusCounts.all })}
                  </SelectItem>
                  <SelectItem value="paid">
                    {t('filters.paid', { count: statusCounts.paid })}
                  </SelectItem>
                  <SelectItem value="unpaid">
                    {t('filters.unpaid', { count: statusCounts.unpaid })}
                  </SelectItem>
                  <SelectItem value="overdue">
                    {t('filters.overdue', { count: statusCounts.overdue })}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredBills.length === 0 ? (
              <EmptyState
                icon={FileText}
                title={t('empty.renterTitle')}
                description={t('empty.renterDesc')}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBills.map(bill => (
                  <BillCard
                    key={bill.id}
                    bill={bill}
                    onPayNow={handlePayNow}
                    onSchedulePayment={handleSchedulePayment}
                    showTenantName={false}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Dialogs */}
        {isOwner && (
          <>
            <GenerateBillDialog
              open={isGenerateDialogOpen}
              onOpenChange={setIsGenerateDialogOpen}
              onGenerate={handleGenerate}
            />
            <BillTemplateDialog
              open={isTemplateDialogOpen}
              onOpenChange={open => {
                setIsTemplateDialogOpen(open)
                if (!open) setSelectedTemplate(undefined)
              }}
              onSubmit={handleTemplateSubmit}
              template={selectedTemplate}
            />
            <MeterReadingDialog
              open={isMeterReadingDialogOpen}
              onOpenChange={open => {
                setIsMeterReadingDialogOpen(open)
                if (!open) setSelectedReading(undefined)
              }}
              onSubmit={handleMeterReadingSubmit}
              reading={selectedReading}
            />
            <BillGenerationRuleDialog
              open={isRuleDialogOpen}
              onOpenChange={open => {
                setIsRuleDialogOpen(open)
                if (!open) setSelectedRule(undefined)
              }}
              onSubmit={handleRuleSubmit}
              rule={selectedRule}
            />
            <BulkBillDialog
              open={isBulkBillDialogOpen}
              onOpenChange={setIsBulkBillDialogOpen}
              onSubmit={handleBulkBillSubmit}
            />
          </>
        )}

        <SchedulePaymentDialog
          payment={null}
          billId={selectedBillForPayment?.id}
          open={isSchedulePaymentDialogOpen}
          onOpenChange={open => {
            setIsSchedulePaymentDialogOpen(open)
            if (!open) setSelectedBillForPayment(null)
          }}
          onSubmit={handleSchedulePaymentSubmit}
        />

        <PayBillDialog
          bill={payBillTarget}
          open={isPayBillOpen}
          onOpenChange={open => {
            setIsPayBillOpen(open)
            if (!open) setPayBillTarget(null)
          }}
          onSuccess={handlePaySuccess}
        />

        <RecordCashPaymentDialog
          bill={cashBillTarget}
          open={isCashDialogOpen}
          onOpenChange={open => {
            setIsCashDialogOpen(open)
            if (!open) setCashBillTarget(null)
          }}
          onSuccess={refreshBills}
        />
      </div>
    </Layout>
  )
}
