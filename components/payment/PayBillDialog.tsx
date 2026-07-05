'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { DownloadBillButton } from '@/components/bill/DownloadBillButton'
import type { Bill } from '@/types/bill'
import type { PaymentMethod, PaymentTransaction } from '@/types/payment'
import { payBill } from '@/lib/api/payments'
import { getDemoTenantId } from '@/lib/api/demoUser'
import { Wallet, Smartphone } from 'lucide-react'
import { PaymentMethodSelector, getPaymentMethodOption } from '@/components/payment/PaymentMethodSelector'
import { PaymentProcessingState } from '@/components/payment/PaymentProcessingState'
import {
  PaymentResultView,
  PaymentResultBackButton,
  PaymentHistoryLink,
  paymentResultHref,
} from '@/components/payment/PaymentResultView'
import Link from 'next/link'

type Step = 'method' | 'confirm' | 'processing' | 'result'

interface PayBillDialogProps {
  bill: Bill | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (bill: Bill, transaction: PaymentTransaction) => void
  userId?: string
}

export function PayBillDialog({
  bill,
  open,
  onOpenChange,
  onSuccess,
  userId,
}: PayBillDialogProps) {
  const [step, setStep] = useState<Step>('method')
  const [method, setMethod] = useState<PaymentMethod>('bKash')
  const [accountNumber, setAccountNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(
    null
  )

  useEffect(() => {
    if (!open) return
    setStep('method')
    setMethod('bKash')
    setAccountNumber('')
    setError(null)
    setTransaction(null)
  }, [open, bill?.id])

  if (!bill) return null

  const selected = getPaymentMethodOption(method)
  const billName = `${bill.month} ${bill.year} — ${bill.propertyName}`
  const tenantId = userId || getDemoTenantId()

  const submitPayment = async () => {
    setError(null)
    if (selected?.needsAccount) {
      const digits = accountNumber.replace(/\D/g, '')
      if (digits.length < 11) {
        setError('Enter a valid 11-digit wallet / account number')
        return
      }
    }

    setStep('processing')
    const result = await payBill({
      billId: bill.id,
      billName,
      propertyName: bill.propertyName,
      tenantName: bill.tenantName,
      amount: bill.amount,
      paymentMethod: method,
      accountNumber: selected?.needsAccount ? accountNumber.trim() : undefined,
      userId: tenantId,
    })

    if (!result.ok) {
      setError(result.error)
      setStep('confirm')
      return
    }

    setTransaction(result.data)
    setStep('result')

    if (result.data.status === 'completed') {
      onSuccess?.(
        {
          ...bill,
          status: 'paid',
          paidDate: new Date().toISOString().split('T')[0],
        },
        result.data
      )
    }
  }

  const resultVariant =
    transaction?.status === 'completed'
      ? 'completed'
      : transaction?.status === 'pending'
        ? 'pending'
        : 'failed'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Pay bill
          </DialogTitle>
          <DialogDescription>
            {bill.month} {bill.year} · {bill.propertyName}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Amount due</p>
              <p className="text-2xl font-bold text-primary">
                ৳{bill.amount.toLocaleString()}
              </p>
            </div>
            <Badge
              variant="outline"
              className={
                bill.status === 'overdue'
                  ? 'border-red-200 bg-red-50 text-red-800'
                  : 'border-amber-200 bg-amber-50 text-amber-900'
              }
            >
              {bill.status}
            </Badge>
          </div>
        </div>

        {step === 'method' && (
          <div className="space-y-4">
            <PaymentMethodSelector value={method} onChange={setMethod} />
            <Button className="w-full" onClick={() => setStep('confirm')}>
              Continue
            </Button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <PaymentResultBackButton onClick={() => setStep('method')} />

            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground">Paying with</p>
              <p className="font-semibold">{method}</p>
            </div>

            {selected?.needsAccount && (
              <div className="space-y-2">
                <Label htmlFor="wallet">Wallet / account number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="wallet"
                    className="pl-9"
                    placeholder="01XXXXXXXXX"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    inputMode="numeric"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Demo mode — no real money is charged until gateway is connected.
                </p>
              </div>
            )}

            {method === 'Cash' && (
              <p className="text-sm text-muted-foreground">
                Cash is recorded as pending until your property owner confirms
                receipt.
              </p>
            )}

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button className="w-full" onClick={submitPayment}>
              Pay ৳{bill.amount.toLocaleString()}
            </Button>
          </div>
        )}

        {step === 'processing' && (
          <PaymentProcessingState methodLabel={method} />
        )}

        {step === 'result' && transaction && (
          <PaymentResultView
            variant={resultVariant}
            transactionId={transaction.transactionId}
            methodLabel={transaction.paymentMethod}
            failureReason={transaction.failureReason}
            onRetry={() => {
              setTransaction(null)
              setStep('confirm')
            }}
            onDone={() => onOpenChange(false)}
            receiptAction={
              transaction.status === 'completed' ? (
                <DownloadBillButton
                  bill={{
                    ...bill,
                    status: 'paid',
                    paidDate: new Date().toISOString().split('T')[0],
                  }}
                  className="w-full"
                />
              ) : undefined
            }
            secondaryAction={
              <>
                <PaymentHistoryLink onClick={() => onOpenChange(false)} />
                <Button variant="link" className="w-full" asChild>
                  <Link
                    href={paymentResultHref(
                      transaction.transactionId,
                      transaction.status
                    )}
                    onClick={() => onOpenChange(false)}
                  >
                    Open payment status page
                  </Link>
                </Button>
              </>
            }
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
