'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsChart } from '@/components/admin/AnalyticsChart'
import { fetchAdminAnalytics } from '@/lib/api/admin'
import type { AnalyticsData } from '@/types/admin'
import { TrendingUp } from 'lucide-react'

export default function AdminAnalyticsPage() {
  const t = useTranslations('admin.analytics')
  const td = useTranslations('admin.dashboard')
  const ts = useTranslations('search.page.propertyTypes')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  const load = useCallback(async () => {
    const result = await fetchAdminAnalytics()
    if (result.ok) setAnalytics(result.data)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (!analytics) {
    return (
      <AdminLayout>
        <div className="max-w-7xl p-8 text-muted-foreground">Loading...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{t('dashboardTitle')}</h2>
          <p className="text-muted-foreground">{t('dashboardDesc')}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AnalyticsChart
            title={t('userDistribution')}
            data={[
              {
                label: td('renters'),
                value: analytics.usersByRole.renters,
                color: 'blue',
              },
              {
                label: td('owners'),
                value: analytics.usersByRole.owners,
                color: 'green',
              },
              {
                label: td('admins'),
                value: analytics.usersByRole.admins,
                color: 'purple',
              },
            ]}
            total={analytics.totalUsers}
          />

          <AnalyticsChart
            title={t('propertyDistribution')}
            data={[
              {
                label: ts('mess'),
                value: analytics.propertiesByType.mess,
                color: 'blue',
              },
              {
                label: ts('apartment'),
                value: analytics.propertiesByType.apartment,
                color: 'green',
              },
              {
                label: ts('hotel'),
                value: analytics.propertiesByType.hotel,
                color: 'purple',
              },
            ]}
            total={analytics.totalProperties}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('usersGrowth')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">
                  +{analytics.growthMetrics.usersGrowth}%
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('propertiesGrowth')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">
                  +{analytics.growthMetrics.propertiesGrowth}%
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('bookingsGrowth')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">
                  +{analytics.growthMetrics.bookingsGrowth}%
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('revenueGrowth')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">
                  +{analytics.growthMetrics.revenueGrowth}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t('cityWiseStats')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">{t('city')}</th>
                    <th className="text-right p-2">{t('properties')}</th>
                    <th className="text-right p-2">{t('bookings')}</th>
                    <th className="text-right p-2">{t('revenue')}</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.cityWiseStats.map((city, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{city.city}</td>
                      <td className="p-2 text-right">{city.properties}</td>
                      <td className="p-2 text-right">{city.bookings}</td>
                      <td className="p-2 text-right font-semibold">
                        ৳{(city.revenue / 1000000).toFixed(1)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
