'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeader, LoadingState } from '@/components/page'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  PaymentResultView,
  PaymentHistoryLink,
} from '@/components/payment/PaymentResultView'
import { ReceiptViewDialog } from '@/components/payment/ReceiptViewDialog'
import { fetchPaymentByTxnId } from '@/lib/api/payments'
import { getBillById } from '@/data/mockBills'
import type { PaymentTransaction } from '@/types/payment'
import type { Bill } from '@/types/bill'
import { ArrowLeft, Receipt } from 'lucide-react'

export function PaymentResultContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const txn = searchParams.get('txn')
  const statusParam = searchParams.get('status')

  const [loading, setLoading] = useState(true)
  const [payment, setPayment] = useState<PaymentTransaction | null>(null)
  const [bill, setBill] = useState<Bill | null>(null)
  const [receiptOpen, setReceiptOpen] = useState(false)

  useEffect(() => {
    if (!txn) {
      setLoading(false)
      return
    }
    fetchPaymentByTxnId(txn).then(result => {
      if (result.ok && result.data) {
        setPayment(result.data)
        setBill(getBillById(result.data.billId) ?? null)
      }
      setLoading(false)
    })
  }, [txn])

  const variant =
    (payment?.status as 'completed' | 'pending' | 'failed') ||
    (statusParam === 'success'
      ? 'completed'
      : statusParam === 'pending'
        ? 'pending'
        : 'failed')

  if (loading) {
    return <LoadingState label="Loading payment…" />
  }

  return (
    <>
      <PageHeader
        title="Payment status"
        description="Track your payment confirmation and receipt."
      />

      {!payment ? (
        <Card>
          <CardContent className="space-y-4 py-10 text-center">
            <p className="text-muted-foreground">
              Payment not found. It may still be processing.
            </p>
            <Button asChild variant="outline">
              <Link href="/payments">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to payments
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <PaymentResultView
              variant={variant}
              transactionId={payment.transactionId}
              methodLabel={payment.paymentMethod}
              failureReason={payment.failureReason}
              onRetry={() => router.push('/bills')}
              onDone={() => router.push('/payments')}
              receiptAction={
                bill && payment.status === 'completed' ? (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => setReceiptOpen(true)}
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    View & download receipt
                  </Button>
                ) : undefined
              }
              secondaryAction={<PaymentHistoryLink />}
            />
          </CardContent>
        </Card>
      )}

      <ReceiptViewDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        bill={bill}
        payment={payment}
      />
    </>
  )
}
