'use client'

import { useState, useMemo } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReminderCard } from '@/components/reminder/ReminderCard'
import { ReminderSettingsDialog } from '@/components/reminder/ReminderSettingsDialog'
import {
  getReminderSettings,
  updateReminderSettings,
  getReminders,
  getReminderHistory,
} from '@/data/mockReminders'
import { getStoredRole } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import { Bell, Settings, History, CheckCircle2, Clock, XCircle } from 'lucide-react'
import type { ReminderSettings } from '@/types/reminder'

export default function RemindersPage() {
  const router = useRouter()
  const role = getStoredRole()

  const [settings, setSettings] = useState<ReminderSettings>(getReminderSettings('r1'))
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  const reminders = useMemo(
    () =>
      getReminders('r1', {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
      }),
    [statusFilter, typeFilter]
  )

  const history = useMemo(() => getReminderHistory('r1'), [])

  const handleSettingsUpdate = (newSettings: ReminderSettings) => {
    updateReminderSettings('r1', newSettings)
    setSettings(newSettings)
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
            <h1 className="text-2xl font-bold mb-2">Reminders</h1>
            <p className="text-muted-foreground">
              Manage your automatic reminders and notification preferences
            </p>
          </div>
          <Button onClick={() => setIsSettingsDialogOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Sent
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
                Pending
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
                Failed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{history.totalFailed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Reminders */}
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Reminders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="rent_due">Rent Due</SelectItem>
                  <SelectItem value="bill_due">Bill Due</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
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
              <Card>
                <CardContent className="py-12 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No reminders found</p>
                </CardContent>
              </Card>
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
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No pending reminders</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {history.reminders.filter(r => r.status === 'sent' || r.status === 'failed').length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {history.reminders
                  .filter(r => r.status === 'sent' || r.status === 'failed')
                  .map(reminder => (
                    <ReminderCard key={reminder.id} reminder={reminder} />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No reminder history</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Settings Dialog */}
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
