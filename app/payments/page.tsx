'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { Layout } from '@/components/layout/Layout'
import {
  PageContainer,
  PageHeader,
  EmptyState,
  LoadingState,
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
import {
  getScheduledPaymentsByUserId,
  getPaymentSchedulesByUserId,
  getPaymentTransactionsByUserId,
  addScheduledPayment,
  updateScheduledPayment,
  cancelScheduledPayment,
} from '@/data/mockPayments'
import { getBillsByTenantId } from '@/data/mockBills'
import { useStoredRole } from '@/hooks/useStoredRole'
import { getDemoRenterId } from '@/lib/api/demoUser'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Settings,
  History,
  Wallet,
  Receipt,
} from 'lucide-react'
import type { ScheduledPayment, PaymentTransaction } from '@/types/payment'
import type { Bill } from '@/types/bill'
import { openBillPdf } from '@/lib/download/billReceipt'
import { getBillById } from '@/data/mockBills'

export default function PaymentsPage() {
  const router = useRouter()
  const { ready, isRenter } = useStoredRole()
  const userId = getDemoRenterId()

  const [tick, setTick] = useState(0)
  const [scheduledPayments, setScheduledPayments] = useState(() =>
    getScheduledPaymentsByUserId(userId)
  )
  const [transactions, setTransactions] = useState(() =>
    getPaymentTransactionsByUserId(userId)
  )
  const [paymentSchedules] = useState(() =>
    getPaymentSchedulesByUserId(userId)
  )
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<ScheduledPayment | null>(
    null
  )
  const [payBillTarget, setPayBillTarget] = useState<Bill | null>(null)
  const [isPayBillOpen, setIsPayBillOpen] = useState(false)

  const refresh = useCallback(() => {
    setScheduledPayments(getScheduledPaymentsByUserId(userId))
    setTransactions(getPaymentTransactionsByUserId(userId))
    setTick(t => t + 1)
  }, [userId])

  const unpaidBills = getBillsByTenantId(userId).filter(
    b => b.status === 'unpaid' || b.status === 'overdue'
  )

  const filteredScheduled =
    statusFilter === 'all'
      ? scheduledPayments
      : scheduledPayments.filter(p => p.status === statusFilter)

  const upcomingPayments = scheduledPayments.filter(
    p => p.status === 'scheduled' && new Date(p.scheduledDate) >= new Date()
  )

  const handleSchedulePayment = (data: any) => {
    if (editingPayment) {
      updateScheduledPayment(editingPayment.id, { ...editingPayment, ...data })
    } else {
      addScheduledPayment({
        userId,
        billId: data.billId,
        billName: data.billName,
        amount: data.amount,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime || '10:00',
        paymentMethod: data.paymentMethod,
        accountNumber: data.accountNumber,
        status: 'scheduled',
        reminderEnabled: data.reminderEnabled,
        reminderDays: data.reminderDays,
        autoRetry: data.autoRetry,
        maxRetries: data.maxRetries ?? 0,
        retryCount: 0,
      })
    }
    setEditingPayment(null)
    refresh()
  }

  const handleViewReceipt = (payment: PaymentTransaction) => {
    const bill = getBillById(payment.billId)
    if (bill) {
      openBillPdf({
        ...bill,
        status: 'paid',
        paidDate: payment.completedAt?.slice(0, 10) || bill.paidDate,
      })
    }
  }

  if (!ready) {
    return (
      <Layout>
        <PageContainer>
          <LoadingState label="Loading payments…" />
        </PageContainer>
      </Layout>
    )
  }

  if (!isRenter) {
    router.replace('/dashboard')
    return null
  }

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title="Payments"
          description="Pay bills now, review history, and manage scheduled payments."
          actions={
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <Link href="/bills">
                  <Receipt className="mr-2 h-4 w-4" />
                  My bills
                </Link>
              </Button>
              <Button
                onClick={() => {
                  setEditingPayment(null)
                  setIsScheduleDialogOpen(true)
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Schedule
              </Button>
            </div>
          }
        />

        {/* Unpaid bills CTA */}
        {unpaidBills.length > 0 && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Wallet className="h-5 w-5 text-primary" />
                Pay outstanding bills
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
                      Due {new Date(bill.dueDate).toLocaleDateString()} ·{' '}
                      <Badge variant="outline" className="ml-1 capitalize">
                        {bill.status}
                      </Badge>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-primary">
                      ৳{bill.amount.toLocaleString()}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => {
                        setPayBillTarget(bill)
                        setIsPayBillOpen(true)
                      }}
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <History className="h-4 w-4 text-emerald-600" />
                Paid (history)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {transactions.filter(t => t.status === 'completed').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-blue-600" />
                Scheduled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {scheduledPayments.filter(p => p.status === 'scheduled').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-amber-600" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{upcomingPayments.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <XCircle className="h-4 w-4 text-red-600" />
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {
                  [
                    ...transactions.filter(t => t.status === 'failed'),
                    ...scheduledPayments.filter(p => p.status === 'failed'),
                  ].length
                }
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="history" className="space-y-6" key={tick}>
          <TabsList>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              Payment history
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              <Calendar className="mr-2 h-4 w-4" />
              Scheduled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            {transactions.length === 0 ? (
              <EmptyState
                title="No payments yet"
                description="Pay a bill from My Bills — completed payments appear here."
                icon={History}
              >
                <Button asChild>
                  <Link href="/bills">Go to bills</Link>
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
            <div className="flex justify-end">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredScheduled.length === 0 ? (
              <EmptyState
                title="No scheduled payments"
                description="Schedule a future payment with reminders."
                icon={Calendar}
              >
                <Button onClick={() => setIsScheduleDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule payment
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
                    onCancel={p => {
                      if (
                        confirm('Cancel this scheduled payment?')
                      ) {
                        cancelScheduledPayment(p.id)
                        refresh()
                      }
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
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-5 w-5" />
                Recurring schedules
              </CardTitle>
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
                      {schedule.frequency} · ৳
                      {schedule.amount.toLocaleString()} ·{' '}
                      {schedule.paymentMethod}
                    </p>
                  </div>
                  <Badge variant={schedule.isActive ? 'default' : 'outline'}>
                    {schedule.isActive ? 'Active' : 'Inactive'}
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
      </PageContainer>
    </Layout>
  )
}
