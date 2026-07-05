'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/page'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { OwnerPaymentAnalyticsPanel } from '@/components/payment/OwnerPaymentAnalytics'
import { PayoutLedgerTable } from '@/components/payment/PayoutLedgerTable'
import { CommissionBreakdownCard } from '@/components/payment/CommissionBreakdownCard'
import {
  getOwnerPayouts,
  getOwnerPaymentAnalytics,
} from '@/data/mockPayouts'
import { getDemoOwnerId } from '@/lib/api/demoUser'
import { BarChart3, Wallet, FileText } from 'lucide-react'

export function OwnerPaymentsPanel() {
  const ownerId = getDemoOwnerId()
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => setTick(t => t + 1), [])

  const payouts = getOwnerPayouts(ownerId)
  const analytics = getOwnerPaymentAnalytics(ownerId)
  const latest = payouts[0]

  return (
    <>
      <PageHeader
        title="Payments & payouts"
        description="Track collections, platform commission, and settlement status."
        actions={
          <Button variant="outline" asChild>
            <Link href="/bills">
              <FileText className="mr-2 h-4 w-4" />
              Manage bills
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

      <Tabs defaultValue="payouts" className="space-y-6" key={tick}>
        <TabsList>
          <TabsTrigger value="payouts">
            <Wallet className="mr-2 h-4 w-4" />
            Payout ledger
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payouts">
          <PayoutLedgerTable payouts={payouts} onUpdated={refresh} />
        </TabsContent>

        <TabsContent value="analytics">
          <OwnerPaymentAnalyticsPanel analytics={analytics} />
        </TabsContent>
      </Tabs>
    </>
  )
}
