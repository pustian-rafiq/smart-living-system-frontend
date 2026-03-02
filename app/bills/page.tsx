'use client'

import { useState, useMemo } from 'react'
import { Layout } from '@/components/layout/Layout'
import { BillCard } from '@/components/bill/BillCard'
import { GenerateBillDialog } from '@/components/bill/GenerateBillDialog'
import { BillTemplateDialog } from '@/components/bill/BillTemplateDialog'
import { MeterReadingDialog } from '@/components/bill/MeterReadingDialog'
import { BillGenerationRuleDialog } from '@/components/bill/BillGenerationRuleDialog'
import { BulkBillDialog } from '@/components/bulk/BulkBillDialog'
import { SchedulePaymentDialog } from '@/components/payment/SchedulePaymentDialog'
import { getScheduledPaymentsByUserId } from '@/data/mockPayments'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { mockBills } from '@/data/mockBills'
import {
  mockBillTemplates,
  mockBillGenerationRules,
  mockMeterReadings,
  getTemplatesByProperty,
  getActiveTemplates,
  getActiveRules,
} from '@/data/mockBillTemplates'
import { mockBuildings, mockFlats } from '@/data/mockBuildings'
import { mockMess } from '@/data/mockMess'
import type { Bill, BillStatus, BillTemplate, BillGenerationRule, MeterReading } from '@/types/bill'
import { getStoredRole } from '@/utils/auth'

export default function BillsPage() {
  const [bills, setBills] = useState(mockBills)
  const [templates, setTemplates] = useState(mockBillTemplates)
  const [rules, setRules] = useState(mockBillGenerationRules)
  const [meterReadings, setMeterReadings] = useState(mockMeterReadings)
  const [statusFilter, setStatusFilter] = useState<BillStatus | 'all'>('all')
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [isMeterReadingDialogOpen, setIsMeterReadingDialogOpen] = useState(false)
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)
  const [isBulkBillDialogOpen, setIsBulkBillDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<BillTemplate | undefined>()
  const [selectedRule, setSelectedRule] = useState<BillGenerationRule | undefined>()
  const [selectedReading, setSelectedReading] = useState<MeterReading | undefined>()

  // Get user role
  const userRole = getStoredRole() || 'renter'
  const isOwner = userRole === 'owner'

  // Filter bills based on role and status
  const filteredBills = useMemo(() => {
    let filtered = [...bills]

    if (!isOwner) {
      filtered = filtered.filter(b => b.tenantId === 'r1')
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter)
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(`${a.month} 1, ${a.year}`)
      const dateB = new Date(`${b.month} 1, ${b.year}`)
      return dateB.getTime() - dateA.getTime()
    })
  }, [bills, statusFilter, isOwner])

  const handleDownload = (bill: Bill) => {
    alert(`Downloading receipt for ${bill.month} ${bill.year} bill...`)
  }

  const handleMarkPaid = (bill: Bill) => {
    setBills(bills.map(b =>
      b.id === bill.id
        ? { ...b, status: 'paid' as BillStatus, paidDate: new Date().toISOString().split('T')[0] }
        : b
    ))
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const handleGenerate = (data: any) => {
    // Get property name
    const property = [...mockBuildings, ...mockMess].find(p => p.id === data.propertyId)
    const propertyName = property?.name || 'Unknown Property'

    // Get tenant name
    const tenant = mockRenters.find(t => t.id === data.tenantId)
    const tenantName = tenant?.name || 'Unknown Tenant'

    // Get flat number if apartment
    let flatNumber: string | undefined
    if (data.flatId) {
      const flat = mockFlats.find(f => f.id === data.flatId)
      flatNumber = flat?.flatNumber
    }

    // Get meter reading if available
    const { getMeterReading } = require('@/data/mockBillTemplates')
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
      amount: data.items.reduce((sum: number, item: any) => sum + (item.amount || 0), 0),
      dueDate: new Date(data.year, months.indexOf(data.month), 5).toISOString().split('T')[0],
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
      setTemplates(templates.map(t =>
        t.id === selectedTemplate.id
          ? { ...t, ...data, updatedAt: new Date().toISOString().split('T')[0] }
          : t
      ))
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
    const { getPreviousMeterReading } = require('@/data/mockBillTemplates')
    const prevReading = getPreviousMeterReading(
      data.propertyId,
      data.flatId,
      data.seatId,
      data.month,
      data.year
    )

    if (selectedReading) {
      setMeterReadings(meterReadings.map(r =>
        r.id === selectedReading.id
          ? { ...r, ...data, submittedAt: new Date().toISOString() }
          : r
      ))
    } else {
      const newReading: MeterReading = {
        id: `reading${Date.now()}`,
        ...data,
        submittedAt: new Date().toISOString(),
        submittedBy: 'owner1',
        previousElectricity: prevReading?.electricity,
        previousGas: prevReading?.gas,
        previousWater: prevReading?.water,
        electricityConsumption: data.electricity && prevReading?.electricity
          ? data.electricity - prevReading.electricity
          : undefined,
        gasConsumption: data.gas && prevReading?.gas
          ? data.gas - prevReading.gas
          : undefined,
        waterConsumption: data.water && prevReading?.water
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
      setRules(rules.map(r =>
        r.id === selectedRule.id
          ? { ...r, ...data, updatedAt: new Date().toISOString().split('T')[0] }
          : r
      ))
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
      const next = new Date(now.getFullYear(), now.getMonth() + 1, schedule.dayOfMonth || 1)
      return next.toISOString().split('T')[0]
    }
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }

  const handleToggleTemplate = (template: BillTemplate) => {
    setTemplates(templates.map(t =>
      t.id === template.id
        ? { ...t, isActive: !t.isActive, updatedAt: new Date().toISOString().split('T')[0] }
        : t
    ))
  }

  const handleToggleRule = (rule: BillGenerationRule) => {
    setRules(rules.map(r =>
      r.id === rule.id
        ? { ...r, isActive: !r.isActive, updatedAt: new Date().toISOString().split('T')[0] }
        : r
    ))
  }

  const handleDeleteTemplate = (template: BillTemplate) => {
    if (confirm(`Are you sure you want to delete template "${template.name}"?`)) {
      setTemplates(templates.filter(t => t.id !== template.id))
    }
  }

  const handleDeleteRule = (rule: BillGenerationRule) => {
    if (confirm(`Are you sure you want to delete rule "${rule.name}"?`)) {
      setRules(rules.filter(r => r.id !== rule.id))
    }
  }

  const statusCounts = {
    all: filteredBills.length,
    paid: bills.filter(b => b.status === 'paid').length,
    unpaid: bills.filter(b => b.status === 'unpaid').length,
    overdue: bills.filter(b => b.status === 'overdue').length,
  }

  const activeTemplates = templates.filter(t => t.isActive)
  const activeRules = rules.filter(r => r.isActive)

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {isOwner ? 'Bills Management' : 'My Bills'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isOwner
                ? 'Manage bills, templates, meter readings, and automation'
                : 'View and manage your monthly bills'}
            </p>
          </div>
          {isOwner && (
            <div className="flex gap-2">
              <Button onClick={() => setIsGenerateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Generate Bill
              </Button>
              <Button onClick={() => setIsBulkBillDialogOpen(true)} variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Bulk Generate
              </Button>
            </div>
          )}
        </div>

        {isOwner ? (
          <Tabs defaultValue="bills" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bills">
                <FileText className="mr-2 h-4 w-4" />
                Bills
              </TabsTrigger>
              <TabsTrigger value="templates">
                <Settings className="mr-2 h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="readings">
                <Calendar className="mr-2 h-4 w-4" />
                Meter Readings
              </TabsTrigger>
              <TabsTrigger value="automation">
                <Zap className="mr-2 h-4 w-4" />
                Automation
              </TabsTrigger>
            </TabsList>

            {/* Bills Tab */}
            <TabsContent value="bills" className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter by Status:</span>
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BillStatus | 'all')}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ({statusCounts.all})</SelectItem>
                    <SelectItem value="paid">Paid ({statusCounts.paid})</SelectItem>
                    <SelectItem value="unpaid">Unpaid ({statusCounts.unpaid})</SelectItem>
                    <SelectItem value="overdue">Overdue ({statusCounts.overdue})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredBills.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg font-semibold text-muted-foreground">No bills found</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {statusFilter !== 'all'
                        ? `No bills with status "${statusFilter}"`
                        : 'Generate your first bill to get started'}
                    </p>
                    <Button onClick={() => setIsGenerateDialogOpen(true)} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Generate Bill
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredBills.map((bill) => (
                    <BillCard
                      key={bill.id}
                      bill={bill}
                      onDownload={handleDownload}
                      onMarkPaid={handleMarkPaid}
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
                  <h2 className="text-xl font-semibold">Bill Templates</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create reusable templates for automated bill generation
                  </p>
                </div>
                <Button onClick={() => {
                  setSelectedTemplate(undefined)
                  setIsTemplateDialogOpen(true)
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>

              {templates.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg font-semibold text-muted-foreground">No templates found</p>
                    <Button onClick={() => setIsTemplateDialogOpen(true)} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Template
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {templates.map((template) => {
                    const property = [...mockBuildings, ...mockMess].find(p => p.id === template.propertyId)
                    return (
                      <Card key={template.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                              <CardDescription className="mt-1">
                                {template.description || 'No description'}
                              </CardDescription>
                            </div>
                            <Badge variant={template.isActive ? 'default' : 'secondary'}>
                              {template.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Property:</span>
                              <span className="font-medium">{property?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Type:</span>
                              <span className="font-medium capitalize">{template.propertyType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Items:</span>
                              <span className="font-medium">{template.items.length}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={template.isActive}
                                onCheckedChange={() => handleToggleTemplate(template)}
                              />
                              <span className="text-sm text-muted-foreground">Active</span>
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
                  <h2 className="text-xl font-semibold">Meter Readings</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Record meter readings for utility bill calculation
                  </p>
                </div>
                <Button onClick={() => {
                  setSelectedReading(undefined)
                  setIsMeterReadingDialogOpen(true)
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Reading
                </Button>
              </div>

              {meterReadings.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg font-semibold text-muted-foreground">No meter readings found</p>
                    <Button onClick={() => setIsMeterReadingDialogOpen(true)} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Reading
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {meterReadings.map((reading) => {
                    const property = [...mockBuildings, ...mockMess].find(p => p.id === reading.propertyId)
                    return (
                      <Card key={reading.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {property?.name || 'Unknown Property'}
                          </CardTitle>
                          <CardDescription>
                            {reading.month} {reading.year}
                            {reading.flatId && ` • Flat ${mockFlats.find(f => f.id === reading.flatId)?.flatNumber}`}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {reading.electricity !== undefined && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Electricity:</span>
                              <div className="text-right">
                                <span className="font-medium">{reading.electricity} units</span>
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
                              <span className="text-muted-foreground">Gas:</span>
                              <div className="text-right">
                                <span className="font-medium">{reading.gas} units</span>
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
                              <span className="text-muted-foreground">Water:</span>
                              <div className="text-right">
                                <span className="font-medium">{reading.water} units</span>
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
                              Edit
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
                  <h2 className="text-xl font-semibold">Automation Rules</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure automated bill generation schedules
                  </p>
                </div>
                <Button onClick={() => {
                  setSelectedRule(undefined)
                  setIsRuleDialogOpen(true)
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Rule
                </Button>
              </div>

              {rules.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-lg font-semibold text-muted-foreground">No automation rules found</p>
                    <Button onClick={() => setIsRuleDialogOpen(true)} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Rule
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {rules.map((rule) => {
                    const template = templates.find(t => t.id === rule.templateId)
                    return (
                      <Card key={rule.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{rule.name}</CardTitle>
                              <CardDescription className="mt-1">
                                {rule.description || 'No description'}
                              </CardDescription>
                            </div>
                            <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                              {rule.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Template:</span>
                              <span className="font-medium">{template?.name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Schedule:</span>
                              <span className="font-medium capitalize">
                                {rule.schedule.type}
                                {rule.schedule.type === 'monthly' && rule.schedule.dayOfMonth && (
                                  <span> • Day {rule.schedule.dayOfMonth}</span>
                                )}
                              </span>
                            </div>
                            {rule.nextRun && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Next Run:</span>
                                <span className="font-medium">{rule.nextRun}</span>
                              </div>
                            )}
                            {rule.lastRun && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Last Run:</span>
                                <span className="font-medium">{rule.lastRun}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={rule.isActive}
                                onCheckedChange={() => handleToggleRule(rule)}
                              />
                              <span className="text-sm text-muted-foreground">Active</span>
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
                <span className="text-sm font-medium">Filter by Status:</span>
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BillStatus | 'all')}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ({statusCounts.all})</SelectItem>
                  <SelectItem value="paid">Paid ({statusCounts.paid})</SelectItem>
                  <SelectItem value="unpaid">Unpaid ({statusCounts.unpaid})</SelectItem>
                  <SelectItem value="overdue">Overdue ({statusCounts.overdue})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredBills.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-lg font-semibold text-muted-foreground">No bills found</p>
                  <p className="mt-2 text-sm text-muted-foreground">You have no bills yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBills.map((bill) => (
                  <BillCard
                    key={bill.id}
                    bill={bill}
                    onDownload={handleDownload}
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
              onOpenChange={(open) => {
                setIsTemplateDialogOpen(open)
                if (!open) setSelectedTemplate(undefined)
              }}
              onSubmit={handleTemplateSubmit}
              template={selectedTemplate}
            />
            <MeterReadingDialog
              open={isMeterReadingDialogOpen}
              onOpenChange={(open) => {
                setIsMeterReadingDialogOpen(open)
                if (!open) setSelectedReading(undefined)
              }}
              onSubmit={handleMeterReadingSubmit}
              reading={selectedReading}
            />
            <BillGenerationRuleDialog
              open={isRuleDialogOpen}
              onOpenChange={(open) => {
                setIsRuleDialogOpen(open)
                if (!open) setSelectedRule(undefined)
              }}
              onSubmit={handleRuleSubmit}
              rule={selectedRule}
            />
            {selectedBillForPayment && (
              <SchedulePaymentDialog
                payment={null}
                billId={selectedBillForPayment.id}
                open={isSchedulePaymentDialogOpen}
                onOpenChange={(open) => {
                  setIsSchedulePaymentDialogOpen(open)
                  if (!open) setSelectedBillForPayment(null)
                }}
                onSubmit={handleSchedulePaymentSubmit}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

