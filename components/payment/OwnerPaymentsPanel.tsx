'use client'

import { useCallback } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { PageHeader } from '@/components/page'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { OwnerPaymentAnalyticsPanel } from '@/components/payment/OwnerPaymentAnalytics'
import { PayoutLedgerTable } from '@/components/payment/PayoutLedgerTable'
import { CommissionBreakdownCard } from '@/components/payment/CommissionBreakdownCard'
import {
  fetchOwnerPayouts,
  fetchOwnerPaymentAnalytics,
} from '@/lib/api/payments'
import { getDemoOwnerId } from '@/lib/api/demoUser'
import { useMockQuery } from '@/hooks/useMockQuery'
import { BarChart3, Wallet, FileText } from 'lucide-react'

export function OwnerPaymentsPanel() {
  const t = useTranslations('payments.owner')
  const ownerId = getDemoOwnerId()

  const loadPayouts = useCallback(
    () => fetchOwnerPayouts(ownerId),
    [ownerId]
  )
  const loadAnalytics = useCallback(
    () => fetchOwnerPaymentAnalytics(ownerId),
    [ownerId]
  )

  const { data: payouts = [], refetch: refetchPayouts } =
    useMockQuery(loadPayouts)
  const { data: analytics } = useMockQuery(loadAnalytics)

  const refresh = useCallback(() => refetchPayouts(), [refetchPayouts])

  const latest = payouts[0]

  return (
    <>
      <PageHeader
        title={t('panelTitle')}
        description={t('panelDescription')}
        actions={
          <Button variant="outline" asChild>
            <Link href="/bills">
              <FileText className="mr-2 h-4 w-4" />
              {t('manageBills')}
            </Link>
          </Button>
        }
      />

      {latest && (
        <div className="mb-6">
          <CommissionBreakdownCard
            grossAmount={latest.grossAmount}
            commissionRate={latest.commissionRate}
            commissionAmount={latest.commissionAmount}
            netAmount={latest.netAmount}
          />
        </div>
      )}

      <Tabs defaultValue="payouts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="payouts">
            <Wallet className="mr-2 h-4 w-4" />
            {t('payoutLedger')}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            {t('analytics')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payouts">
          <PayoutLedgerTable payouts={payouts} onUpdated={refresh} />
        </TabsContent>

        <TabsContent value="analytics">
          {analytics && <OwnerPaymentAnalyticsPanel analytics={analytics} />}
        </TabsContent>
      </Tabs>
    </>
  )
}
