'use client'

import { useId } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VisuallyHidden } from '@/components/a11y/VisuallyHidden'
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
import { useAppFormat } from '@/hooks/useAppFormat'

interface OwnerPaymentAnalyticsProps {
  analytics: OwnerPaymentAnalytics
}

export function OwnerPaymentAnalyticsPanel({
  analytics,
}: OwnerPaymentAnalyticsProps) {
  const t = useTranslations('payments.analytics')
  const { formatCurrency } = useAppFormat()
  const chartTitleId = useId()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">{t('title')}</h3>
        <CommissionRateBadge rate={analytics.commissionRate} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Wallet}
          label={t('totalCollected')}
          value={formatCurrency(analytics.totalCollected)}
          tone="primary"
        />
        <StatCard
          icon={TrendingUp}
          label={t('netEarnings')}
          value={formatCurrency(analytics.netEarnings)}
          tone="emerald"
        />
        <StatCard
          icon={Percent}
          label={t('commissionPaid')}
          value={formatCurrency(analytics.totalCommission)}
          tone="muted"
        />
        <StatCard
          icon={Clock}
          label={t('pendingPayout')}
          value={formatCurrency(analytics.pendingPayouts)}
          tone="amber"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle id={chartTitleId} className="text-base">
            {t('monthlyChart')}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <figure role="figure" aria-labelledby={chartTitleId}>
            <VisuallyHidden as="figcaption">{t('chartCaption')}</VisuallyHidden>
            <div aria-hidden="true" className="h-full w-full" tabIndex={0}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={v => `৳${v / 1000}k`} />
                  <Tooltip formatter={(v: number) => [formatCurrency(v), '']} />
                  <Legend />
                  <Bar
                    dataKey="gross"
                    name={t('gross')}
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="net"
                    name={t('net')}
                    fill="hsl(142 76% 36%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <VisuallyHidden as="span">
              <table>
                <caption>{t('monthlyChart')}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t('month')}</th>
                    <th scope="col">{t('gross')}</th>
                    <th scope="col">{t('net')}</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.monthlyTrend.map(row => (
                    <tr key={row.month}>
                      <th scope="row">{row.month}</th>
                      <td>{formatCurrency(row.gross)}</td>
                      <td>{formatCurrency(row.net)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </VisuallyHidden>
          </figure>
        </CardContent>
      </Card>

      {analytics.collectionByMethod.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('byMethod')}</CardTitle>
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
                    {t('paymentsCount', { count: row.count })}
                  </p>
                </div>
                <p className="font-bold">{formatCurrency(row.amount)}</p>
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
