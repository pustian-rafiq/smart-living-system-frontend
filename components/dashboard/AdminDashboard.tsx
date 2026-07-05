'use client'

import Link from 'next/link'
import { useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatCard } from './StatCard'
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  AlertCircle,
  FileCheck,
  MessageSquare,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react'
import { fetchAdminDashboardData } from '@/lib/api/admin'
import { useMockQuery } from '@/hooks/useMockQuery'

interface AdminDashboardProps {
  adminId: string
}

export function AdminDashboard({ adminId }: AdminDashboardProps) {
  const loadDashboard = useCallback(() => fetchAdminDashboardData(), [])
  const { data } = useMockQuery(loadDashboard)

  if (!data) {
    return null
  }

  const {
    analytics,
    pendingVerifications,
    openDisputes,
    inProgressDisputes,
    openComplaints,
    pendingFraudReports,
    investigatingFraudReports,
  } = data

  const stats = [
    {
      title: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      icon: Users,
      growth: `+${analytics.growthMetrics.usersGrowth}%`,
      link: '/admin/users',
    },
    {
      title: 'Total Properties',
      value: analytics.totalProperties.toLocaleString(),
      icon: Building2,
      growth: `+${analytics.growthMetrics.propertiesGrowth}%`,
      link: '/admin/properties',
    },
    {
      title: 'Active Bookings',
      value: analytics.activeBookings.toLocaleString(),
      icon: Calendar,
      growth: `+${analytics.growthMetrics.bookingsGrowth}%`,
      link: '/admin/bookings',
    },
    {
      title: 'Monthly Revenue',
      value: `৳${analytics.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      growth: `+${analytics.growthMetrics.revenueGrowth}%`,
      link: '/admin/analytics',
    },
  ]

  const quickActions = [
    {
      title: 'Pending Verifications',
      count: pendingVerifications.length,
      icon: FileCheck,
      link: '/admin/verification',
    },
    {
      title: 'Open Disputes',
      count: openDisputes.length + inProgressDisputes.length,
      icon: MessageSquare,
      link: '/admin/disputes',
    },
    {
      title: 'Open Complaints',
      count: openComplaints.length,
      icon: AlertCircle,
      link: '/admin/complaints',
    },
    {
      title: 'Fraud Reports',
      count: pendingFraudReports.length + investigatingFraudReports.length,
      icon: ShieldAlert,
      link: '/admin/fraud-reports',
    },
  ]

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold md:text-2xl mb-2">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">
          Overview of platform statistics and activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link key={index} href={stat.link}>
              <Card className="cursor-pointer transition-all hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 md:text-sm">
                        {stat.title}
                      </p>
                      <p className="text-xl font-bold md:text-2xl">
                        {stat.value}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        <span>{stat.growth}</span>
                      </div>
                    </div>
                    <div className="rounded-full p-2 bg-primary/10">
                      <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h2 className="text-lg font-bold md:text-xl lg:text-2xl">
            Quick Actions
          </h2>
          <Button asChild variant="ghost" size="sm" className="md:size-default">
            <Link href="/admin">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                        <p className="text-2xl font-bold">{action.count}</p>
                      </div>
                      <div className="rounded-full p-2 bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
