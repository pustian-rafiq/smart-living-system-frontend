'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MenuCard } from '@/components/meal/MenuCard'
import { WeeklyMenuView } from '@/components/meal/WeeklyMenuView'
import { MealPreferenceDialog } from '@/components/meal/MealPreferenceDialog'
import {
  getDailyMenuByDate,
  getDailyMenusByMess,
  getWeeklyScheduleByMess,
  getMealTimingByMess,
  getMealPreferenceByUser,
  updateMealPreference,
} from '@/lib/api/messDomain'
import { fetchMessById, fetchMessStudents } from '@/lib/api/mess'
import { getDemoTenantId } from '@/lib/api/demoUser'
import { useMockQuery } from '@/hooks/useMockQuery'
import { getStoredRole } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import { Calendar, Heart, UtensilsCrossed } from 'lucide-react'
import { format } from 'date-fns'

export default function StudentMenuPage() {
  const t = useTranslations('mess')
  const router = useRouter()
  const role = getStoredRole()
  const tenantId = getDemoTenantId()

  const loadStudents = useCallback(() => fetchMessStudents(), [])
  const { data: students } = useMockQuery(loadStudents)
  const student = students?.[0]

  const loadMess = useCallback(() => fetchMessById('m1'), [])
  const { data: mess } = useMockQuery(loadMess)

  const [mealPreference, setMealPreference] = useState(
    getMealPreferenceByUser(tenantId, mess?.id || '')
  )
  const [isPreferenceDialogOpen, setIsPreferenceDialogOpen] = useState(false)

  useEffect(() => {
    if (mess?.id) {
      setMealPreference(getMealPreferenceByUser(tenantId, mess.id))
    }
  }, [mess?.id, tenantId])

  const todayMenu = useMemo(
    () => getDailyMenuByDate(mess?.id || '', format(new Date(), 'yyyy-MM-dd')),
    [mess]
  )

  const weeklySchedule = useMemo(
    () => getWeeklyScheduleByMess(mess?.id || ''),
    [mess]
  )

  const mealTiming = useMemo(() => getMealTimingByMess(mess?.id || ''), [mess])

  const menuHistory = useMemo(
    () => getDailyMenusByMess(mess?.id || '', 7),
    [mess]
  )

  useEffect(() => {
    if (role !== 'renter') {
      router.replace('/dashboard')
    }
  }, [role, router])

  if (role !== 'renter') {
    return null
  }

  if (!student || !mess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <p className="text-center">
            {t('studentDashboard.emptyStudentInfo')}
          </p>
        </div>
      </Layout>
    )
  }

  const handlePreferenceSubmit = (data: {
    preferences: Parameters<typeof updateMealPreference>[2]
  }) => {
    const updated = updateMealPreference(tenantId, mess.id, data.preferences)
    setMealPreference(updated)
  }

  return (
    <Layout userRole="renter">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {t('studentMenu.title')}
            </h1>
            <p className="text-muted-foreground">{mess.name}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsPreferenceDialogOpen(true)}
          >
            <Heart className="h-4 w-4 mr-2" />
            {t('studentMenu.preferences')}
          </Button>
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList>
            <TabsTrigger value="today">
              {t('studentMenu.tabs.today')}
            </TabsTrigger>
            <TabsTrigger value="week">
              {t('studentMenu.tabs.week')}
            </TabsTrigger>
            <TabsTrigger value="history">
              {t('studentMenu.tabs.history')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            {todayMenu ? (
              <MenuCard menu={todayMenu} mealTiming={mealTiming} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    {t('studentMenu.empty.today')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="week" className="space-y-4">
            {weeklySchedule ? (
              <WeeklyMenuView
                schedule={weeklySchedule}
                mealTiming={mealTiming}
              />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    {t('studentMenu.empty.week')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {menuHistory.length > 0 ? (
              menuHistory.map(menu => (
                <MenuCard key={menu.id} menu={menu} mealTiming={mealTiming} />
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    {t('studentMenu.empty.history')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <MealPreferenceDialog
          open={isPreferenceDialogOpen}
          onOpenChange={setIsPreferenceDialogOpen}
          preference={mealPreference}
          onSubmit={handlePreferenceSubmit}
        />
      </div>
    </Layout>
  )
}
