'use client'

import { useState, useMemo, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
} from '@/data/mockMeals'
import { mockMess, mockStudents } from '@/data/mockMess'
import { getStoredRole } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import { Calendar, Heart, UtensilsCrossed } from 'lucide-react'
import { format, addDays, subDays } from 'date-fns'

export default function StudentMenuPage() {
  const router = useRouter()
  const role = getStoredRole()

  // In real app, get from auth
  const student = mockStudents[0]
  const mess = mockMess.find(m => m.id === 'm1')
  const [mealPreference, setMealPreference] = useState(
    getMealPreferenceByUser('r1', mess?.id || '')
  )
  const [isPreferenceDialogOpen, setIsPreferenceDialogOpen] = useState(false)

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
          <p className="text-center">Student information not found</p>
        </div>
      </Layout>
    )
  }

  const handlePreferenceSubmit = (data: any) => {
    const updated = updateMealPreference('r1', mess.id, data.preferences)
    setMealPreference(updated)
  }

  return (
    <Layout userRole="renter">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Meal Menu</h1>
            <p className="text-muted-foreground">{mess.name}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsPreferenceDialogOpen(true)}
          >
            <Heart className="h-4 w-4 mr-2" />
            Preferences
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="history">Menu History</TabsTrigger>
          </TabsList>

          {/* Today's Menu */}
          <TabsContent value="today" className="space-y-4">
            {todayMenu ? (
              <MenuCard menu={todayMenu} mealTiming={mealTiming} />
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    No menu available for today
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Weekly Schedule */}
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
                    No weekly schedule available
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Menu History */}
          <TabsContent value="history" className="space-y-4">
            {menuHistory.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {menuHistory.map(menu => (
                  <MenuCard key={menu.id} menu={menu} mealTiming={mealTiming} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    No menu history available
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Preference Dialog */}
        <MealPreferenceDialog
          preference={mealPreference}
          messId={mess.id}
          open={isPreferenceDialogOpen}
          onOpenChange={setIsPreferenceDialogOpen}
          onSubmit={handlePreferenceSubmit}
        />
      </div>
    </Layout>
  )
}
