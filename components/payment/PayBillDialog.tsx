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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { DownloadBillButton } from '@/components/bill/DownloadBillButton'
import type { Bill } from '@/types/bill'
import type { PaymentMethod, PaymentTransaction } from '@/types/payment'
import { payBill } from '@/lib/api/payments'
import { getDemoRenterId } from '@/lib/api/demoUser'
import {
  CheckCircle2,
  Loader2,
  Wallet,
  XCircle,
  ArrowLeft,
  Smartphone,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type Step = 'method' | 'confirm' | 'processing' | 'result'

const METHODS: {
  id: PaymentMethod
  label: string
  hint: string
  needsAccount: boolean
}[] = [
  {
    id: 'bKash',
    label: 'bKash',
    hint: 'Pay with your bKash wallet',
    needsAccount: true,
  },
  {
    id: 'Nagad',
    label: 'Nagad',
    hint: 'Pay with your Nagad wallet',
    needsAccount: true,
  },
  {
    id: 'Rocket',
    label: 'Rocket',
    hint: 'Pay with Rocket (DBBL)',
    needsAccount: true,
  },
  {
    id: 'Cash',
    label: 'Cash',
    hint: 'Record cash payment (office / agent)',
    needsAccount: false,
  },
]

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

  const selected = METHODS.find(m => m.id === method)!
  const billName = `${bill.month} ${bill.year} — ${bill.propertyName}`

  const goConfirm = () => {
    setError(null)
    setStep('confirm')
  }

  const submitPayment = async () => {
    setError(null)
    if (selected.needsAccount) {
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
      amount: bill.amount,
      paymentMethod: method,
      accountNumber: selected.needsAccount ? accountNumber.trim() : undefined,
      userId: userId || getDemoRenterId(),
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
            <div>
              <Label className="mb-2 block">Payment method</Label>
              <RadioGroup
                value={method}
                onValueChange={v => setMethod(v as PaymentMethod)}
                className="space-y-2"
              >
                {METHODS.map(m => (
                  <label
                    key={m.id}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors',
                      method === m.id && 'border-primary bg-primary/5'
                    )}
                  >
                    <RadioGroupItem value={m.id} id={m.id} className="mt-0.5" />
                    <div>
                      <p className="font-medium">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.hint}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>
            <Button className="w-full" onClick={goConfirm}>
              Continue
            </Button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="-ml-2"
              onClick={() => setStep('method')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Change method
            </Button>

            <div className="rounded-lg border p-3 text-sm">
              <p className="text-muted-foreground">Paying with</p>
              <p className="font-semibold">{method}</p>
            </div>

            {selected.needsAccount && (
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
                  Demo mode — no real money is charged.
                </p>
              </div>
            )}

            {!selected.needsAccount && (
              <p className="text-sm text-muted-foreground">
                Cash payments are recorded immediately for demo. In production,
                the owner confirms receipt.
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
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div>
              <p className="font-semibold">Processing payment…</p>
              <p className="text-sm text-muted-foreground">
                Connecting to {method} gateway
              </p>
            </div>
          </div>
        )}

        {step === 'result' && transaction && (
          <div className="space-y-4">
            {transaction.status === 'completed' ? (
              <>
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-950/50">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-lg font-semibold">Payment successful</p>
                  <p className="text-sm text-muted-foreground">
                    Your bill is marked as paid.
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm">
                  <p className="text-muted-foreground">Transaction ID</p>
                  <p className="font-mono font-medium">
                    {transaction.transactionId}
                  </p>
                  <p className="mt-2 text-muted-foreground">Method</p>
                  <p className="font-medium">{transaction.paymentMethod}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <DownloadBillButton
                    bill={{
                      ...bill,
                      status: 'paid',
                      paidDate: new Date().toISOString().split('T')[0],
                    }}
                    className="w-full"
                  />
                  <Button variant="outline" asChild className="w-full">
                    <Link
                      href="/payments"
                      onClick={() => onOpenChange(false)}
                    >
                      View payment history
                    </Link>
                  </Button>
                  <Button onClick={() => onOpenChange(false)} className="w-full">
                    Done
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <div className="rounded-full bg-red-100 p-3 dark:bg-red-950/50">
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <p className="text-lg font-semibold">Payment failed</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.failureReason || 'Please try again.'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => onOpenChange(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setTransaction(null)
                      setStep('confirm')
                    }}
                  >
                    Try again
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
