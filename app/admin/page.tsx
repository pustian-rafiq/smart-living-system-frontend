'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  AlertCircle,
  FileCheck,
  MessageSquare,
  TrendingUp,
  FileText,
  ShieldAlert,
} from 'lucide-react'
import {
  fetchAdminDashboardData,
} from '@/lib/api/admin'
import type { AnalyticsData } from '@/types/admin'
import type { Complaint } from '@/types/complaint'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const t = useTranslations('admin.dashboard')
  const tProp = useTranslations('search.page.propertyTypes')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [pendingVerificationsCount, setPendingVerificationsCount] = useState(0)
  const [openDisputesCount, setOpenDisputesCount] = useState(0)
  const [pendingFraud, setPendingFraud] = useState(0)
  const [investigatingFraud, setInvestigatingFraud] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchAdminDashboardData().then(result => {
      if (cancelled) return
      if (!result.ok) {
        setError(result.error)
        return
      }
      const data = result.data
      setAnalytics(data.analytics)
      setComplaints(data.openComplaints)
      setPendingVerificationsCount(data.pendingVerifications.length)
      setOpenDisputesCount(
        data.openDisputes.length + data.inProgressDisputes.length,
      )
      setPendingFraud(data.pendingFraudReports.length)
      setInvestigatingFraud(data.investigatingFraudReports.length)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-7xl space-y-2 p-8">
          <p className="font-medium text-destructive">Failed to load dashboard</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-sm text-muted-foreground">
            Sign in again at /admin/login so a JWT is stored, then refresh.
          </p>
        </div>
      </AdminLayout>
    )
  }

  if (!analytics) {
    return (
      <AdminLayout>
        <div className="max-w-7xl p-8 text-muted-foreground">Loading...</div>
      </AdminLayout>
    )
  }

  const stats = [
    {
      title: t('stats.totalUsers'),
      value: analytics.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      growth: `+${analytics.growthMetrics.usersGrowth}%`,
      link: '/admin/users',
    },
    {
      title: t('stats.totalProperties'),
      value: analytics.totalProperties.toLocaleString(),
      icon: Building2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      growth: `+${analytics.growthMetrics.propertiesGrowth}%`,
      link: '/admin/properties',
    },
    {
      title: t('stats.totalBookings'),
      value: analytics.totalBookings.toLocaleString(),
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      growth: `+${analytics.growthMetrics.bookingsGrowth}%`,
      link: '/admin/bookings',
    },
    {
      title: t('stats.totalRevenue'),
      value: `৳${(analytics.totalRevenue / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      growth: `+${analytics.growthMetrics.revenueGrowth}%`,
      link: '/admin/analytics',
    },
  ]

  const quickActions = [
    {
      title: t('pending.verifications'),
      count: pendingVerificationsCount,
      icon: FileCheck,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      link: '/admin/verifications?status=pending',
    },
    {
      title: t('pending.disputes'),
      count: openDisputesCount,
      icon: MessageSquare,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      link: '/admin/disputes',
    },
    {
      title: t('pending.complaints'),
      count: complaints.filter(c => c.status !== 'resolved').length,
      icon: AlertCircle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      link: '/admin/complaints',
    },
    {
      title: t('pending.fraud'),
      count: pendingFraud + investigatingFraud,
      icon: ShieldAlert,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      link: '/admin/fraud-reports',
    },
    {
      title: t('auditLogs'),
      count: t('view'),
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      link: '/admin/audit-logs',
    },
  ]

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{t('overviewTitle')}</h2>
          <p className="text-muted-foreground">{t('overviewDesc')}</p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Link key={index} href={stat.link}>
                <Card className="cursor-pointer transition-all hover:shadow-md">
                  <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        <span>{stat.growth}</span>
                      </div>
                    </div>
                    <div className={`rounded-full p-3 ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('quickActions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <Link key={index} href={action.link}>
                        <Card className="cursor-pointer transition-all hover:shadow-md">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium mb-1">
                                  {action.title}
                                </p>
                                <p className="text-2xl font-bold">
                                  {action.count}
                                </p>
                              </div>
                              <div
                                className={`rounded-full p-2 ${action.bgColor}`}
                              >
                                <Icon className={`h-5 w-5 ${action.color}`} />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t('userDistribution')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('renters')}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${(analytics.usersByRole.renters / analytics.totalUsers) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {analytics.usersByRole.renters}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('owners')}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: `${(analytics.usersByRole.owners / analytics.totalUsers) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {analytics.usersByRole.owners}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('admins')}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{
                            width: `${(analytics.usersByRole.admins / analytics.totalUsers) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {analytics.usersByRole.admins}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t('propertyTypes')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{tProp('mess')}</span>
                      <span className="text-sm text-muted-foreground">
                        {analytics.propertiesByType.mess}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${(analytics.propertiesByType.mess / analytics.totalProperties) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{tProp('apartment')}</span>
                      <span className="text-sm text-muted-foreground">
                        {analytics.propertiesByType.apartment}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${(analytics.propertiesByType.apartment / analytics.totalProperties) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{tProp('hotel')}</span>
                      <span className="text-sm text-muted-foreground">
                        {analytics.propertiesByType.hotel}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{
                          width: `${(analytics.propertiesByType.hotel / analytics.totalProperties) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{t('topCities')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.cityWiseStats
                    .slice(0, 5)
                    .map((city, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium">{city.city}</p>
                          <p className="text-xs text-muted-foreground">
                            {t('cityStats', {
                              properties: city.properties,
                              bookings: city.bookings,
                            })}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          ৳{(city.revenue / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
