'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  PageHeader,
  EmptyState,
} from '@/components/page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ScheduledPaymentCard } from '@/components/payment/ScheduledPaymentCard'
import { SchedulePaymentDialog } from '@/components/payment/SchedulePaymentDialog'
import { PaymentHistoryCard } from '@/components/payment/PaymentHistoryCard'
import { PayBillDialog } from '@/components/payment/PayBillDialog'
import { ReceiptViewDialog } from '@/components/payment/ReceiptViewDialog'
import {
  fetchPaymentHistory,
  fetchScheduledPayments,
  fetchPaymentSchedules,
  createScheduledPayment,
  patchScheduledPayment,
  cancelScheduledPaymentApi,
} from '@/lib/api/payments'
import { fetchBillsForTenant, fetchBillById } from '@/lib/api/bills'
import { getDemoTenantId } from '@/lib/api/demoUser'
import { useMockQuery } from '@/hooks/useMockQuery'
import { useAppFormat } from '@/hooks/useAppFormat'
import {
  Calendar,
  Plus,
  History,
  Wallet,
  Receipt,
} from 'lucide-react'
import type { ScheduledPayment, PaymentTransaction } from '@/types/payment'
import type { Bill } from '@/types/bill'
import { useConfirm } from '@/components/feedback'

export function RenterPaymentsPanel() {
  const t = useTranslations('payments.renter')
  const tc = useTranslations('common')
  const { formatCurrency, formatDate } = useAppFormat()
  const { confirm } = useConfirm()
  const userId = getDemoTenantId()

  const loadPayments = useCallback(
    () => fetchPaymentHistory(userId),
    [userId]
  )
  const loadScheduled = useCallback(
    () => fetchScheduledPayments(userId),
    [userId]
  )
  const loadSchedules = useCallback(
    () => fetchPaymentSchedules(userId),
    [userId]
  )
  const loadBills = useCallback(
    () => fetchBillsForTenant(userId),
    [userId]
  )

  const { data: transactions = [], refetch: refetchTransactions } =
    useMockQuery(loadPayments)
  const { data: scheduledPayments = [], refetch: refetchScheduled } =
    useMockQuery(loadScheduled)
  const { data: paymentSchedules = [] } = useMockQuery(loadSchedules)
  const { data: tenantBills = [] } = useMockQuery(loadBills)

  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<ScheduledPayment | null>(
    null
  )
  const [payBillTarget, setPayBillTarget] = useState<Bill | null>(null)
  const [isPayBillOpen, setIsPayBillOpen] = useState(false)
  const [receiptBill, setReceiptBill] = useState<Bill | null>(null)
  const [receiptPayment, setReceiptPayment] = useState<PaymentTransaction | null>(
    null
  )
  const [receiptOpen, setReceiptOpen] = useState(false)

  const refresh = useCallback(() => {
    refetchTransactions()
    refetchScheduled()
  }, [refetchTransactions, refetchScheduled])

  const unpaidBills = tenantBills.filter(
    b => b.status === 'unpaid' || b.status === 'overdue'
  )

  const filteredScheduled =
    statusFilter === 'all'
      ? scheduledPayments
      : scheduledPayments.filter(p => p.status === statusFilter)

  const handleSchedulePayment = (data: {
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
    if (editingPayment) {
      patchScheduledPayment(editingPayment.id, { ...editingPayment, ...data }).then(
        () => refresh()
      )
    } else {
      createScheduledPayment({
        userId,
        billId: data.billId,
        billName: data.billName,
        amount: data.amount,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime || '10:00',
        paymentMethod: data.paymentMethod as ScheduledPayment['paymentMethod'],
        accountNumber: data.accountNumber,
        status: 'scheduled',
        reminderEnabled: data.reminderEnabled,
        reminderDays: data.reminderDays,
        autoRetry: data.autoRetry,
        maxRetries: data.maxRetries ?? 0,
        retryCount: 0,
      }).then(() => refresh())
    }
    setEditingPayment(null)
    refresh()
  }

  const handleViewReceipt = async (payment: PaymentTransaction) => {
    const result = await fetchBillById(payment.billId)
    if (result.ok && result.data) {
      setReceiptBill(result.data)
      setReceiptPayment(payment)
      setReceiptOpen(true)
    }
  }

  return (
    <>
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/bills">
                <Receipt className="mr-2 h-4 w-4" />
                {t('myBills')}
              </Link>
            </Button>
            <Button
              onClick={() => {
                setEditingPayment(null)
                setIsScheduleDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('schedule')}
            </Button>
          </div>
        }
      />

      {unpaidBills.length > 0 && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="h-5 w-5 text-primary" />
              {t('outstandingTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unpaidBills.slice(0, 3).map(bill => (
              <div
                key={bill.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background p-3"
              >
                <div>
                  <p className="font-medium">
                    {bill.month} {bill.year} · {bill.propertyName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('due', { date: formatDate(bill.dueDate) })}{' '}
                    <Badge variant="outline" className="ml-1 capitalize">
                      {bill.status === 'overdue'
                        ? tc('status.overdue')
                        : tc('status.unpaid')}
                    </Badge>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-primary">
                    {formatCurrency(bill.amount)}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setPayBillTarget(bill)
                      setIsPayBillOpen(true)
                    }}
                  >
                    {t('actions.payNow')}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            {t('tabs.history')}
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            <Calendar className="mr-2 h-4 w-4" />
            {t('tabs.scheduled')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          {transactions.length === 0 ? (
            <EmptyState
              title={t('empty.historyEmptyTitle')}
              description={t('empty.historyEmptyDesc')}
              icon={History}
            >
              <Button asChild>
                <Link href="/bills">{t('goToBills')}</Link>
              </Button>
            </EmptyState>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {transactions.map(payment => (
                <PaymentHistoryCard
                  key={payment.id}
                  payment={payment}
                  onViewReceipt={handleViewReceipt}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="flex flex-wrap justify-end">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-auto min-w-[7.5rem] flex-1 sm:w-[160px] sm:flex-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{tc('allStatus')}</SelectItem>
                <SelectItem value="scheduled">{t('statusScheduled')}</SelectItem>
                <SelectItem value="completed">{tc('status.completed')}</SelectItem>
                <SelectItem value="failed">{tc('status.failed')}</SelectItem>
                <SelectItem value="cancelled">{tc('status.cancelled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredScheduled.length === 0 ? (
            <EmptyState
              title={t('empty.scheduledTitle')}
              description={t('empty.scheduledDesc')}
              icon={Calendar}
            >
              <Button onClick={() => setIsScheduleDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('actions.schedule')}
              </Button>
            </EmptyState>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredScheduled.map(payment => (
                <ScheduledPaymentCard
                  key={payment.id}
                  payment={payment}
                  onEdit={p => {
                    setEditingPayment(p)
                    setIsScheduleDialogOpen(true)
                  }}
                  onCancel={async p => {
                    const ok = await confirm({
                      title: t('confirmCancelTitle'),
                      description: t('confirmCancelDesc'),
                      variant: 'destructive',
                    })
                    if (!ok) return
                    cancelScheduledPaymentApi(p.id).then(() => refresh())
                  }}
                  showActions={
                    payment.status === 'scheduled' ||
                    payment.status === 'pending'
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {paymentSchedules.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">{t('recurringSchedules')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentSchedules.map(schedule => (
              <div
                key={schedule.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{schedule.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {schedule.frequency} · {formatCurrency(schedule.amount)} ·{' '}
                    {schedule.paymentMethod}
                  </p>
                </div>
                <Badge variant={schedule.isActive ? 'default' : 'outline'}>
                  {schedule.isActive
                    ? tc('status.active')
                    : tc('status.inactive')}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <SchedulePaymentDialog
        payment={editingPayment}
        open={isScheduleDialogOpen}
        onOpenChange={open => {
          setIsScheduleDialogOpen(open)
          if (!open) setEditingPayment(null)
        }}
        onSubmit={handleSchedulePayment}
      />

      <PayBillDialog
        bill={payBillTarget}
        open={isPayBillOpen}
        onOpenChange={open => {
          setIsPayBillOpen(open)
          if (!open) setPayBillTarget(null)
        }}
        onSuccess={() => refresh()}
      />

      <ReceiptViewDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        bill={receiptBill}
        payment={receiptPayment}
      />
    </>
  )
}
