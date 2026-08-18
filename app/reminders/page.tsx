'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { EmptyState, LoadingState } from '@/components/page'
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
import { ReminderCard } from '@/components/reminder/ReminderCard'
import { ReminderSettingsDialog } from '@/components/reminder/ReminderSettingsDialog'
import {
  fetchReminderSettings,
  saveReminderSettings,
  fetchReminders,
  fetchReminderHistory,
} from '@/lib/api/reminders'
import { getCurrentAccountUserId } from '@/lib/api/account'
import { getStoredRole } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import {
  Bell,
  Settings,
  History,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react'
import type { Reminder, ReminderHistory, ReminderSettings } from '@/types/reminder'

export default function RemindersPage() {
  const router = useRouter()
  const role = getStoredRole()
  const t = useTranslations('tools.reminders')
  const tc = useTranslations('common')

  const userId = getCurrentAccountUserId()
  const [settings, setSettings] = useState<ReminderSettings | null>(null)
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [history, setHistory] = useState<ReminderHistory | null>(null)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  const loadReminders = useCallback(async () => {
    const result = await fetchReminders(userId, {
      status: statusFilter !== 'all' ? statusFilter : undefined,
      type: typeFilter !== 'all' ? typeFilter : undefined,
    })
    if (result.ok) setReminders(result.data)
  }, [userId, statusFilter, typeFilter])

  useEffect(() => {
    if (role !== 'renter') return
    let mounted = true
    setIsLoading(true)
    Promise.all([
      fetchReminderSettings(userId).then(result => {
        if (result.ok) setSettings(result.data)
      }),
      fetchReminderHistory(userId).then(result => {
        if (result.ok) setHistory(result.data)
      }),
      loadReminders(),
    ]).finally(() => {
      if (mounted) setIsLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [role, userId, loadReminders])

  useEffect(() => {
    if (role === 'renter' && !isLoading) loadReminders()
  }, [role, loadReminders])

  const handleSettingsUpdate = async (newSettings: ReminderSettings) => {
    const result = await saveReminderSettings(userId, newSettings)
    if (result.ok) setSettings(result.data)
  }

  useEffect(() => {
    if (role !== 'renter') {
      router.replace('/dashboard')
    }
  }, [role, router])

  if (role !== 'renter') {
    return null
  }

  if (isLoading || !settings || !history) {
    return (
      <Layout userRole="renter">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <LoadingState label={tc('loading')} variant="skeleton" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout userRole="renter">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{t('title')}</h1>
            <p className="text-muted-foreground">{t('description')}</p>
          </div>
          <Button onClick={() => setIsSettingsDialogOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            {tc('settings')}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {t('stats.sent')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{history.totalSent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                {t('stats.pending')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{history.totalPending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                {t('stats.failed')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{history.totalFailed}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">{t('tabs.all')}</TabsTrigger>
              <TabsTrigger value="pending">{t('tabs.pending')}</TabsTrigger>
              <TabsTrigger value="history">{t('tabs.history')}</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('types.all')}</SelectItem>
                  <SelectItem value="rent_due">{t('types.rentDue')}</SelectItem>
                  <SelectItem value="bill_due">{t('types.billDue')}</SelectItem>
                  <SelectItem value="maintenance">{t('types.maintenance')}</SelectItem>
                  <SelectItem value="custom">{t('types.custom')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="space-y-4">
            {reminders.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reminders.map(reminder => (
                  <ReminderCard key={reminder.id} reminder={reminder} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Bell}
                title={t('emptyTitle')}
                description={t('noRemindersFound')}
              />
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {reminders.filter(r => r.status === 'pending').length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reminders
                  .filter(r => r.status === 'pending')
                  .map(reminder => (
                    <ReminderCard key={reminder.id} reminder={reminder} />
                  ))}
              </div>
            ) : (
              <EmptyState
                icon={Clock}
                title={t('tabs.pending')}
                description={t('noPendingReminders')}
              />
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {history.reminders.filter(
              r => r.status === 'sent' || r.status === 'failed'
            ).length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {history.reminders
                  .filter(r => r.status === 'sent' || r.status === 'failed')
                  .map(reminder => (
                    <ReminderCard key={reminder.id} reminder={reminder} />
                  ))}
              </div>
            ) : (
              <EmptyState
                icon={History}
                title={t('tabs.history')}
                description={t('noReminderHistory')}
              />
            )}
          </TabsContent>
        </Tabs>

        <ReminderSettingsDialog
          settings={settings}
          open={isSettingsDialogOpen}
          onOpenChange={setIsSettingsDialogOpen}
          onSubmit={handleSettingsUpdate}
        />
      </div>
    </Layout>
  )
}
