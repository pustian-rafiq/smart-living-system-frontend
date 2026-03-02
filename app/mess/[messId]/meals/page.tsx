'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DailyMenuDialog } from '@/components/meal/DailyMenuDialog'
import { WeeklyScheduleDialog } from '@/components/meal/WeeklyScheduleDialog'
import { MealTimingDialog } from '@/components/meal/MealTimingDialog'
import { MenuCard } from '@/components/meal/MenuCard'
import { WeeklyMenuView } from '@/components/meal/WeeklyMenuView'
import {
  getDailyMenusByMess,
  getWeeklyScheduleByMess,
  getMealTimingByMess,
  addDailyMenu,
  updateDailyMenu,
  addWeeklySchedule,
  updateMealTiming,
} from '@/data/mockMeals'
import { mockMess } from '@/data/mockMess'
import { getStoredRole } from '@/utils/auth'
import { Plus, Calendar, Clock, Settings, UtensilsCrossed } from 'lucide-react'
import type { DailyMenu, WeeklySchedule } from '@/types/meal'
import { format } from 'date-fns'

export default function MealManagementPage() {
  const params = useParams()
  const router = useRouter()
  const role = getStoredRole()
  const messId = params.messId as string

  const mess = mockMess.find(m => m.id === messId)
  const [dailyMenus, setDailyMenus] = useState(getDailyMenusByMess(messId))
  const [weeklySchedule, setWeeklySchedule] = useState(getWeeklyScheduleByMess(messId))
  const [mealTiming, setMealTiming] = useState(getMealTimingByMess(messId))
  const [isDailyMenuDialogOpen, setIsDailyMenuDialogOpen] = useState(false)
  const [isWeeklyScheduleDialogOpen, setIsWeeklyScheduleDialogOpen] = useState(false)
  const [isMealTimingDialogOpen, setIsMealTimingDialogOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState<DailyMenu | null>(null)
  const [editingSchedule, setEditingSchedule] = useState<WeeklySchedule | null>(null)

  if (role !== 'owner') {
    router.replace('/dashboard')
    return null
  }

  if (!mess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <p className="text-center">Mess not found</p>
        </div>
      </Layout>
    )
  }

  const handleDailyMenuSubmit = (data: any) => {
    if (editingMenu) {
      updateDailyMenu(editingMenu.id, data)
    } else {
      addDailyMenu(data)
    }
    setDailyMenus(getDailyMenusByMess(messId))
    setEditingMenu(null)
  }

  const handleWeeklyScheduleSubmit = (data: any) => {
    if (editingSchedule) {
      // Update logic would go here
    } else {
      addWeeklySchedule(data)
    }
    setWeeklySchedule(getWeeklyScheduleByMess(messId))
    setEditingSchedule(null)
  }

  const handleMealTimingSubmit = (data: any) => {
    updateMealTiming(messId, data)
    setMealTiming(getMealTimingByMess(messId))
  }

  const todayMenu = useMemo(
    () => dailyMenus.find(m => m.date === format(new Date(), 'yyyy-MM-dd')),
    [dailyMenus]
  )

  return (
    <Layout userRole="owner">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Meal Management</h1>
          <p className="text-muted-foreground">{mess.name}</p>
        </div>

        {/* Quick Actions */}
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
            <span>Add Daily Menu</span>
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
            <span>Weekly Schedule</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col items-center justify-center gap-2 p-6"
            onClick={() => setIsMealTimingDialogOpen(true)}
          >
            <Clock className="h-6 w-6" />
            <span>Meal Timings</span>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList>
            <TabsTrigger value="today">Today's Menu</TabsTrigger>
            <TabsTrigger value="daily">Daily Menus</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
          </TabsList>

          {/* Today's Menu */}
          <TabsContent value="today" className="space-y-4">
            {todayMenu ? (
              <MenuCard menu={todayMenu} mealTiming={mealTiming} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">No menu set for today</p>
                  <Button onClick={() => setIsDailyMenuDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Today's Menu
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Daily Menus */}
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
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">No daily menus created yet</p>
                  <Button onClick={() => setIsDailyMenuDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Daily Menu
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Weekly Schedule */}
          <TabsContent value="weekly" className="space-y-4">
            {weeklySchedule ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Active Weekly Schedule</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(weeklySchedule.weekStartDate), 'MMM dd')} -{' '}
                      {format(new Date(weeklySchedule.weekEndDate), 'MMM dd')}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingSchedule(weeklySchedule)
                      setIsWeeklyScheduleDialogOpen(true)
                    }}
                  >
                    Edit Schedule
                  </Button>
                </div>
                <WeeklyMenuView schedule={weeklySchedule} mealTiming={mealTiming} />
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">No weekly schedule set</p>
                  <Button onClick={() => setIsWeeklyScheduleDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Weekly Schedule
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <DailyMenuDialog
          menu={editingMenu}
          messId={messId}
          open={isDailyMenuDialogOpen}
          onOpenChange={(open) => {
            setIsDailyMenuDialogOpen(open)
            if (!open) setEditingMenu(null)
          }}
          onSubmit={handleDailyMenuSubmit}
        />
        <WeeklyScheduleDialog
          schedule={editingSchedule}
          messId={messId}
          open={isWeeklyScheduleDialogOpen}
          onOpenChange={(open) => {
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
