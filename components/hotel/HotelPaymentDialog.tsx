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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { BookingFeeBreakdown } from '@/components/hotel/BookingFeeBreakdown'
import type { BookingFeeBreakdown as Fees } from '@/types/hotel'
import {
  CheckCircle2,
  Loader2,
  Wallet,
  XCircle,
  ArrowLeft,
  Smartphone,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type HotelPayMethod = 'bkash' | 'nagad' | 'rocket' | 'cash'

const METHODS: {
  id: HotelPayMethod
  label: string
  needsAccount: boolean
}[] = [
  { id: 'bkash', label: 'bKash', needsAccount: true },
  { id: 'nagad', label: 'Nagad', needsAccount: true },
  { id: 'rocket', label: 'Rocket', needsAccount: true },
  { id: 'cash', label: 'Cash at hotel', needsAccount: false },
]

export interface HotelPaymentResult {
  paymentMethod: HotelPayMethod
  accountNumber?: string
  transactionId: string
  paidAmount: number
}

interface HotelPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fees: Fees
  hotelName: string
  onPaid: (result: HotelPaymentResult) => void
}

type Step = 'method' | 'confirm' | 'processing' | 'result'

export function HotelPaymentDialog({
  open,
  onOpenChange,
  fees,
  hotelName,
  onPaid,
}: HotelPaymentDialogProps) {
  const [step, setStep] = useState<Step>('method')
  const [method, setMethod] = useState<HotelPayMethod>('bkash')
  const [accountNumber, setAccountNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<HotelPaymentResult | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!open) return
    setStep('method')
    setMethod('bkash')
    setAccountNumber('')
    setError(null)
    setResult(null)
    setFailed(false)
  }, [open])

  const selected = METHODS.find(m => m.id === method)!
  const payAmount = fees.advanceAmount

  const pay = async () => {
    setError(null)
    if (selected.needsAccount) {
      const digits = accountNumber.replace(/\D/g, '')
      if (digits.length < 11) {
        setError('Enter a valid 11-digit wallet number')
        return
      }
    }
    setStep('processing')
    await new Promise(r => setTimeout(r, 1400))

    // Cash = pay at hotel (booking confirmed, advance 0 paid digitally)
    if (method === 'cash') {
      const cashResult: HotelPaymentResult = {
        paymentMethod: 'cash',
        transactionId: `CSH-${Date.now().toString().slice(-8)}`,
        paidAmount: 0,
      }
      setResult(cashResult)
      setFailed(false)
      setStep('result')
      onPaid(cashResult)
      return
    }

    if (Math.random() < 0.1) {
      setFailed(true)
      setStep('result')
      return
    }

    const paid: HotelPaymentResult = {
      paymentMethod: method,
      accountNumber: accountNumber.trim(),
      transactionId: `${method.toUpperCase()}-${Date.now().toString().slice(-8)}`,
      paidAmount: payAmount,
    }
    setResult(paid)
    setFailed(false)
    setStep('result')
    onPaid(paid)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Pay booking advance
          </DialogTitle>
          <DialogDescription>{hotelName}</DialogDescription>
        </DialogHeader>

        <BookingFeeBreakdown fees={fees} />

        {step === 'method' && (
          <div className="space-y-4">
            <Label>Payment method</Label>
            <RadioGroup
              value={method}
              onValueChange={v => setMethod(v as HotelPayMethod)}
              className="space-y-2"
            >
              {METHODS.map(m => (
                <label
                  key={m.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-3',
                    method === m.id && 'border-primary bg-primary/5'
                  )}
                >
                  <RadioGroupItem value={m.id} />
                  <span className="font-medium">{m.label}</span>
                </label>
              ))}
            </RadioGroup>
            <Button className="w-full" onClick={() => setStep('confirm')}>
              Continue
            </Button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              className="-ml-2"
              onClick={() => setStep('method')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Change method
            </Button>
            {selected.needsAccount ? (
              <div className="space-y-2">
                <Label>Wallet number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="01XXXXXXXXX"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Demo mode — no real money is charged. Paying advance ৳
                  {payAmount.toLocaleString()}.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Booking will be confirmed. Full amount is due at check-in.
              </p>
            )}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button className="w-full" onClick={pay}>
              {method === 'cash'
                ? 'Confirm booking'
                : `Pay ৳${payAmount.toLocaleString()} advance`}
            </Button>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-medium">Processing payment…</p>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-4 text-center">
            {failed ? (
              <>
                <XCircle className="mx-auto h-10 w-10 text-red-600" />
                <p className="font-semibold">Payment failed</p>
                <p className="text-sm text-muted-foreground">
                  Please try another method.
                </p>
                <Button onClick={() => setStep('confirm')}>Try again</Button>
              </>
            ) : (
              result && (
                <>
                  <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                  <p className="font-semibold">Booking confirmed</p>
                  <p className="font-mono text-sm">{result.transactionId}</p>
                  <Button className="w-full" onClick={() => onOpenChange(false)}>
                    Continue
                  </Button>
                </>
              )
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
