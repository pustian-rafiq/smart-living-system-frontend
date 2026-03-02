'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Building2, Calendar, DollarSign, AlertCircle, FileCheck, MessageSquare, TrendingUp, FileText } from 'lucide-react'
import { mockAnalytics, mockVerificationRequests, mockDisputes } from '@/data/mockAdmin'
import { mockComplaints } from '@/data/mockComplaints'
import { getVerificationRequestsByStatus, getDisputesByStatus } from '@/data/mockAdmin'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const pendingVerifications = getVerificationRequestsByStatus('pending')
  const openDisputes = getDisputesByStatus('open')
  const inProgressDisputes = getDisputesByStatus('in_progress')

  const stats = [
    {
      title: 'Total Users',
      value: mockAnalytics.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      growth: `+${mockAnalytics.growthMetrics.usersGrowth}%`,
      link: '/admin/users',
    },
    {
      title: 'Total Properties',
      value: mockAnalytics.totalProperties.toLocaleString(),
      icon: Building2,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      growth: `+${mockAnalytics.growthMetrics.propertiesGrowth}%`,
      link: '/admin/properties',
    },
    {
      title: 'Total Bookings',
      value: mockAnalytics.totalBookings.toLocaleString(),
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      growth: `+${mockAnalytics.growthMetrics.bookingsGrowth}%`,
      link: '/admin/bookings',
    },
    {
      title: 'Total Revenue',
      value: `৳${(mockAnalytics.totalRevenue / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      growth: `+${mockAnalytics.growthMetrics.revenueGrowth}%`,
      link: '/admin/analytics',
    },
  ]

  const quickActions = [
    {
      title: 'Pending Verifications',
      count: pendingVerifications.length,
      icon: FileCheck,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      link: '/admin/verifications?status=pending',
    },
    {
      title: 'Open Disputes',
      count: openDisputes.length + inProgressDisputes.length,
      icon: MessageSquare,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      link: '/admin/disputes',
    },
    {
      title: 'Open Complaints',
      count: mockComplaints.filter(c => c.status !== 'resolved').length,
      icon: AlertCircle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      link: '/admin/complaints',
    },
    {
      title: 'Audit Logs',
      count: 'View',
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      link: '/admin/audit-logs',
    },
  ]

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Overview of platform statistics and activities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
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
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <Link key={index} href={action.link}>
                        <Card className="cursor-pointer transition-all hover:shadow-md">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium mb-1">{action.title}</p>
                                <p className="text-2xl font-bold">{action.count}</p>
                              </div>
                              <div className={`rounded-full p-2 ${action.bgColor}`}>
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

            {/* User Distribution */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Renters</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${(mockAnalytics.usersByRole.renters / mockAnalytics.totalUsers) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {mockAnalytics.usersByRole.renters}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Owners</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{
                            width: `${(mockAnalytics.usersByRole.owners / mockAnalytics.totalUsers) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {mockAnalytics.usersByRole.owners}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Admins</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{
                            width: `${(mockAnalytics.usersByRole.admins / mockAnalytics.totalUsers) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {mockAnalytics.usersByRole.admins}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Property Distribution */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Property Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Mess</span>
                      <span className="text-sm text-muted-foreground">
                        {mockAnalytics.propertiesByType.mess}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${(mockAnalytics.propertiesByType.mess / mockAnalytics.totalProperties) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Apartment</span>
                      <span className="text-sm text-muted-foreground">
                        {mockAnalytics.propertiesByType.apartment}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${(mockAnalytics.propertiesByType.apartment / mockAnalytics.totalProperties) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Hotel</span>
                      <span className="text-sm text-muted-foreground">
                        {mockAnalytics.propertiesByType.hotel}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500"
                        style={{
                          width: `${(mockAnalytics.propertiesByType.hotel / mockAnalytics.totalProperties) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* City-wise Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Top Cities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnalytics.cityWiseStats.slice(0, 5).map((city, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{city.city}</p>
                        <p className="text-xs text-muted-foreground">
                          {city.properties} properties, {city.bookings} bookings
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
