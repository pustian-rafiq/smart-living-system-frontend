'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalyticsChart } from '@/components/admin/AnalyticsChart'
import { mockAnalytics } from '@/data/mockAdmin'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Platform statistics and insights
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* User Distribution */}
          <AnalyticsChart
            title="User Distribution"
            data={[
              { label: 'Renters', value: mockAnalytics.usersByRole.renters, color: 'blue' },
              { label: 'Owners', value: mockAnalytics.usersByRole.owners, color: 'green' },
              { label: 'Admins', value: mockAnalytics.usersByRole.admins, color: 'purple' },
            ]}
            total={mockAnalytics.totalUsers}
          />

          {/* Property Distribution */}
          <AnalyticsChart
            title="Property Distribution"
            data={[
              { label: 'Mess', value: mockAnalytics.propertiesByType.mess, color: 'blue' },
              { label: 'Apartment', value: mockAnalytics.propertiesByType.apartment, color: 'green' },
              { label: 'Hotel', value: mockAnalytics.propertiesByType.hotel, color: 'purple' },
            ]}
            total={mockAnalytics.totalProperties}
          />
        </div>

        {/* Growth Metrics */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Users Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">
                  +{mockAnalytics.growthMetrics.usersGrowth}%
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Properties Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">
                  +{mockAnalytics.growthMetrics.propertiesGrowth}%
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Bookings Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">
                  +{mockAnalytics.growthMetrics.bookingsGrowth}%
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">
                  +{mockAnalytics.growthMetrics.revenueGrowth}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* City-wise Statistics */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>City-wise Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">City</th>
                    <th className="text-right p-2">Properties</th>
                    <th className="text-right p-2">Bookings</th>
                    <th className="text-right p-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAnalytics.cityWiseStats.map((city, index) => (
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
