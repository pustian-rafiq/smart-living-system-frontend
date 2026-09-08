'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DailyMenuDialog } from '@/components/meal/DailyMenuDialog'
import { WeeklyScheduleDialog } from '@/components/meal/WeeklyScheduleDialog'
import { MealTimingDialog } from '@/components/meal/MealTimingDialog'
import { MenuCard } from '@/components/meal/MenuCard'
import { WeeklyMenuBoard } from '@/components/meal/WeeklyMenuBoard'
import {
  getDailyMenusByMess,
  getWeeklyScheduleByMess,
  getMealTimingByMess,
  addDailyMenu,
  updateDailyMenu,
  addWeeklySchedule,
  updateWeeklySchedule,
  updateMealTiming,
} from '@/lib/api/messDomain'
import { fetchMessById } from '@/lib/api/mess'
import { useMockQuery } from '@/hooks/useMockQuery'
import { getStoredRole } from '@/utils/auth'
import { useAppFormat } from '@/hooks/useAppFormat'
import { Plus, Calendar, Clock, UtensilsCrossed } from 'lucide-react'
import { MessSubpageBackButton } from '@/components/mess/MessSubpageBackButton'
import type { DailyMenu, WeeklySchedule, MealTiming } from '@/types/meal'
import { format } from 'date-fns'

export default function MealManagementPage() {
  const t = useTranslations('mess')
  const tc = useTranslations('common')
  const { formatDate } = useAppFormat()
  const params = useParams()
  const router = useRouter()
  const role = getStoredRole()
  const messId = params.messId as string

  const loadMess = useCallback(() => fetchMessById(messId), [messId])
  const { data: mess } = useMockQuery(loadMess)
  const [dailyMenus, setDailyMenus] = useState<DailyMenu[]>([])
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule | undefined>()
  const [mealTiming, setMealTiming] = useState<MealTiming | undefined>()
  const [isDailyMenuDialogOpen, setIsDailyMenuDialogOpen] = useState(false)
  const [isWeeklyScheduleDialogOpen, setIsWeeklyScheduleDialogOpen] =
    useState(false)
  const [isMealTimingDialogOpen, setIsMealTimingDialogOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<DailyMenu | null>(null)
  const [editingSchedule, setEditingSchedule] = useState<WeeklySchedule | null>(
    null
  )

  useEffect(() => {
    void getDailyMenusByMess(messId).then(setDailyMenus)
    void getWeeklyScheduleByMess(messId).then(setWeeklySchedule)
    void getMealTimingByMess(messId).then(setMealTiming)
  }, [messId])

  useEffect(() => {
    if (role !== 'owner') {
      router.replace('/dashboard')
    }
  }, [role, router])

  const todayMenu = useMemo(
    () => dailyMenus.find(m => m.date === format(new Date(), 'yyyy-MM-dd')),
    [dailyMenus]
  )

  if (role !== 'owner') {
    return null
  }

  if (!mess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <p className="text-center">{t('notFound')}</p>
        </div>
      </Layout>
    )
  }

  const handleDailyMenuSubmit = async (
    data: Parameters<typeof addDailyMenu>[0]
  ) => {
    if (editingMenu) {
      await updateDailyMenu(editingMenu.id, { ...data, messId })
    } else {
      await addDailyMenu(data)
    }
    setDailyMenus(await getDailyMenusByMess(messId))
    setEditingMenu(null)
  }

  const handleWeeklyScheduleSubmit = async (
    data: Parameters<typeof addWeeklySchedule>[0]
  ) => {
    if (editingSchedule) {
      await updateWeeklySchedule(editingSchedule.id, {
        ...data,
        messId,
      })
    } else {
      await addWeeklySchedule(data)
    }
    setWeeklySchedule(await getWeeklyScheduleByMess(messId))
    setEditingSchedule(null)
  }

  const handleMealTimingSubmit = async (
    data: Parameters<typeof updateMealTiming>[1]
  ) => {
    const updated = await updateMealTiming(messId, data)
    if (updated) setMealTiming(updated)
  }

  return (
    <Layout userRole="owner">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <MessSubpageBackButton fallbackHref="/mess" />
          <h1 className="text-2xl font-bold mb-2">
            {t('meals.managementTitle')}
          </h1>
          <p className="text-muted-foreground">{mess.name}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
          <Button
            variant="outline"
            className="h-auto flex-col items-center justify-center gap-2 p-6"
            onClick={() => {
              setEditingMenu(null)
              setIsDailyMenuDialogOpen(true)
            }}
          >
            <Plus className="h-6 w-6" />
            <span>{t('meals.addDailyMenu')}</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col items-center justify-center gap-2 p-6"
            onClick={() => {
              setEditingSchedule(null)
              setIsWeeklyScheduleDialogOpen(true)
            }}
          >
            <Calendar className="h-6 w-6" />
            <span>{t('meals.weeklySchedule')}</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col items-center justify-center gap-2 p-6"
            onClick={() => setIsMealTimingDialogOpen(true)}
          >
            <Clock className="h-6 w-6" />
            <span>{t('meals.mealTimings')}</span>
          </Button>
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList>
            <TabsTrigger value="today">{t('meals.tabs.today')}</TabsTrigger>
            <TabsTrigger value="daily">{t('meals.tabs.daily')}</TabsTrigger>
            <TabsTrigger value="weekly">{t('meals.tabs.weekly')}</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            {todayMenu ? (
              <MenuCard menu={todayMenu} mealTiming={mealTiming} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    {t('meals.emptyToday')}
                  </p>
                  <Button onClick={() => setIsDailyMenuDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('meals.createTodayMenu')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            {dailyMenus.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {dailyMenus.map(menu => (
                  <div key={menu.id} className="relative">
                    <MenuCard menu={menu} mealTiming={mealTiming} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setEditingMenu(menu)
                        setIsDailyMenuDialogOpen(true)
                      }}
                    >
                      {tc('edit')}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    {t('meals.emptyDaily')}
                  </p>
                  <Button onClick={() => setIsDailyMenuDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('meals.createDailyMenu')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            {weeklySchedule ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {t('meals.activeWeeklySchedule')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(weeklySchedule.weekStartDate, {
                        style: 'short',
                      })}{' '}
                      -{' '}
                      {formatDate(weeklySchedule.weekEndDate, {
                        style: 'short',
                      })}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingSchedule(weeklySchedule)
                      setIsWeeklyScheduleDialogOpen(true)
                    }}
                  >
                    {t('meals.editSchedule')}
                  </Button>
                </div>
                <WeeklyMenuBoard
                  key={weeklySchedule.id}
                  schedule={weeklySchedule}
                  mealTiming={mealTiming}
                />
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    {t('meals.emptyWeekly')}
                  </p>
                  <Button onClick={() => setIsWeeklyScheduleDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('meals.createWeeklySchedule')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DailyMenuDialog
          menu={editingMenu}
          messId={messId}
          open={isDailyMenuDialogOpen}
          onOpenChange={open => {
            setIsDailyMenuDialogOpen(open)
            if (!open) setEditingMenu(null)
          }}
          onSubmit={handleDailyMenuSubmit}
        />
        <WeeklyScheduleDialog
          schedule={editingSchedule}
          messId={messId}
          open={isWeeklyScheduleDialogOpen}
          onOpenChange={open => {
            setIsWeeklyScheduleDialogOpen(open)
            if (!open) setEditingSchedule(null)
          }}
          onSubmit={handleWeeklyScheduleSubmit}
        />
        <MealTimingDialog
          timing={mealTiming}
          messId={messId}
          open={isMealTimingDialogOpen}
          onOpenChange={setIsMealTimingDialogOpen}
          onSubmit={handleMealTimingSubmit}
        />
      </div>
    </Layout>
  )
}
