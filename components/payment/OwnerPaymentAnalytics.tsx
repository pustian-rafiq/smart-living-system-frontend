'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { OwnerPaymentAnalytics } from '@/types/payment'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { TrendingUp, Wallet, Clock, Percent } from 'lucide-react'
import { CommissionRateBadge } from '@/components/payment/CommissionBreakdownCard'

interface OwnerPaymentAnalyticsProps {
  analytics: OwnerPaymentAnalytics
}

export function OwnerPaymentAnalyticsPanel({
  analytics,
}: OwnerPaymentAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">Payment analytics</h3>
        <CommissionRateBadge rate={analytics.commissionRate} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="Total collected"
          value={`৳${analytics.totalCollected.toLocaleString()}`}
          tone="primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Net earnings"
          value={`৳${analytics.netEarnings.toLocaleString()}`}
          tone="emerald"
        />
        <StatCard
          icon={Percent}
          label="Commission paid"
          value={`৳${analytics.totalCommission.toLocaleString()}`}
          tone="muted"
        />
        <StatCard
          icon={Clock}
          label="Pending payout"
          value={`৳${analytics.pendingPayouts.toLocaleString()}`}
          tone="amber"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly collection vs net</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} tickFormatter={v => `৳${v / 1000}k`} />
              <Tooltip
                formatter={(v: number) => [`৳${v.toLocaleString()}`, '']}
              />
              <Legend />
              <Bar
                dataKey="gross"
                name="Gross"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="net"
                name="Net"
                fill="hsl(142 76% 36%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {analytics.collectionByMethod.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">By payment method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.collectionByMethod.map(row => (
              <div
                key={row.method}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{row.method}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.count} payment{row.count !== 1 ? 's' : ''}
                  </p>
                </div>
                <p className="font-bold">৳{row.amount.toLocaleString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Wallet
  label: string
  value: string
  tone: 'primary' | 'emerald' | 'muted' | 'amber'
}) {
  const colors = {
    primary: 'text-primary',
    emerald: 'text-emerald-600',
    muted: 'text-muted-foreground',
    amber: 'text-amber-600',
  }
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Icon className={`h-4 w-4 ${colors[tone]}`} />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-xl font-bold ${colors[tone]}`}>{value}</p>
      </CardContent>
    </Card>
  )
}
