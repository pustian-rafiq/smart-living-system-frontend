'use client'

import { useState, useMemo } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScheduledPaymentCard } from '@/components/payment/ScheduledPaymentCard'
import { SchedulePaymentDialog } from '@/components/payment/SchedulePaymentDialog'
import {
  getScheduledPaymentsByUserId,
  getPaymentSchedulesByUserId,
  addScheduledPayment,
  updateScheduledPayment,
  cancelScheduledPayment,
} from '@/data/mockPayments'
import { getStoredRole } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import { Calendar, Plus, Clock, CheckCircle2, XCircle, Settings } from 'lucide-react'
import type { ScheduledPayment } from '@/types/payment'

export default function PaymentsPage() {
  const router = useRouter()
  const role = getStoredRole()

  const [scheduledPayments, setScheduledPayments] = useState(
    getScheduledPaymentsByUserId('r1')
  )
  const [paymentSchedules, setPaymentSchedules] = useState(
    getPaymentSchedulesByUserId('r1')
  )
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<ScheduledPayment | null>(null)

  const filteredPayments = useMemo(() => {
    if (statusFilter === 'all') return scheduledPayments
    return scheduledPayments.filter(p => p.status === statusFilter)
  }, [scheduledPayments, statusFilter])

  const upcomingPayments = useMemo(
    () =>
      scheduledPayments.filter(
        p => p.status === 'scheduled' && new Date(p.scheduledDate) >= new Date()
      ),
    [scheduledPayments]
  )

  const handleSchedulePayment = (data: any) => {
    if (editingPayment) {
      const updated = updateScheduledPayment(editingPayment.id, {
        ...editingPayment,
        ...data,
      })
      if (updated) {
        setScheduledPayments(getScheduledPaymentsByUserId('r1'))
      }
    } else {
      addScheduledPayment({
        userId: 'r1',
        billId: data.billId,
        billName: data.billName,
        amount: data.amount,
        scheduledDate: data.scheduledDate,
        scheduledTime: data.scheduledTime,
        paymentMethod: data.paymentMethod,
        accountNumber: data.accountNumber,
        status: 'scheduled',
        reminderEnabled: data.reminderEnabled,
        reminderDays: data.reminderDays,
        autoRetry: data.autoRetry,
        maxRetries: data.maxRetries || 0,
        retryCount: 0,
      })
      setScheduledPayments(getScheduledPaymentsByUserId('r1'))
    }
    setEditingPayment(null)
  }

  const handleEditPayment = (payment: ScheduledPayment) => {
    setEditingPayment(payment)
    setIsScheduleDialogOpen(true)
  }

  const handleCancelPayment = (payment: ScheduledPayment) => {
    if (confirm('Are you sure you want to cancel this scheduled payment?')) {
      cancelScheduledPayment(payment.id)
      setScheduledPayments(getScheduledPaymentsByUserId('r1'))
    }
  }

  if (role !== 'renter') {
    router.replace('/dashboard')
    return null
  }

  return (
    <Layout userRole="renter">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Payment Scheduling</h1>
            <p className="text-muted-foreground">
              Schedule payments and manage automatic payment reminders
            </p>
          </div>
          <Button onClick={() => {
            setEditingPayment(null)
            setIsScheduleDialogOpen(true)
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Payment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
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
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{upcomingPayments.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {scheduledPayments.filter(p => p.status === 'completed').length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {scheduledPayments.filter(p => p.status === 'failed').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payments */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Payments</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="all" className="space-y-4">
            {filteredPayments.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPayments.map(payment => (
                  <ScheduledPaymentCard
                    key={payment.id}
                    payment={payment}
                    onEdit={handleEditPayment}
                    onCancel={handleCancelPayment}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">No scheduled payments</p>
                  <Button onClick={() => setIsScheduleDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Payment
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingPayments.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcomingPayments.map(payment => (
                  <ScheduledPaymentCard
                    key={payment.id}
                    payment={payment}
                    onEdit={handleEditPayment}
                    onCancel={handleCancelPayment}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No upcoming payments</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {scheduledPayments.filter(p => p.status === 'completed' || p.status === 'failed' || p.status === 'cancelled').length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {scheduledPayments
                  .filter(p => p.status === 'completed' || p.status === 'failed' || p.status === 'cancelled')
                  .map(payment => (
                    <ScheduledPaymentCard
                      key={payment.id}
                      payment={payment}
                      showActions={false}
                    />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No payment history</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Payment Schedules */}
        {paymentSchedules.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Recurring Payment Schedules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentSchedules.map(schedule => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{schedule.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {schedule.frequency} • ৳{schedule.amount.toLocaleString()} • {schedule.paymentMethod}
                      </p>
                    </div>
                    <Badge variant={schedule.isActive ? 'default' : 'outline'}>
                      {schedule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialog */}
        <SchedulePaymentDialog
          payment={editingPayment}
          open={isScheduleDialogOpen}
          onOpenChange={(open) => {
            setIsScheduleDialogOpen(open)
            if (!open) setEditingPayment(null)
          }}
          onSubmit={handleSchedulePayment}
        />
      </div>
    </Layout>
  )
}
