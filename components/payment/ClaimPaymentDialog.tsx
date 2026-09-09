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
import { Textarea } from '@/components/ui/textarea'
import type { Bill } from '@/types/bill'
import type { PaymentMethod } from '@/types/payment'
import {
  createPaymentClaim,
  fetchPaymentInstructions,
} from '@/lib/api/payments'
import { useAppFormat } from '@/hooks/useAppFormat'
import { ClipboardCheck } from 'lucide-react'

interface ClaimPaymentDialogProps {
  bill?: Bill | null
  messId?: string
  studentId?: string
  defaultAmount?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ClaimPaymentDialog({
  bill,
  messId,
  studentId,
  defaultAmount,
  open,
  onOpenChange,
  onSuccess,
}: ClaimPaymentDialogProps) {
  const { formatCurrency } = useAppFormat()
  const [amount, setAmount] = useState(0)
  const [method, setMethod] = useState<PaymentMethod>('bKash')
  const [trxId, setTrxId] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [instructions, setInstructions] = useState<string>('')

  useEffect(() => {
    if (!open) return
    setDone(false)
    setError(null)
    setTrxId('')
    setNote('')
    setMethod('bKash')
    const remaining = bill
      ? Math.max(0, bill.amount - (bill.amountPaid ?? 0))
      : defaultAmount || 0
    setAmount(remaining)

    const load = async () => {
      const result = await fetchPaymentInstructions({
        billId: bill?.id,
        messId,
      })
      if (!result.ok) return
      const i = result.data
      const lines = [
        i.bkashNumber ? `bKash: ${i.bkashNumber}` : '',
        i.nagadNumber ? `Nagad: ${i.nagadNumber}` : '',
        i.rocketNumber ? `Rocket: ${i.rocketNumber}` : '',
        i.bankAccountNumber
          ? `Bank: ${i.bankName || ''} ${i.bankAccountNumber} (${i.bankAccountName || ''})`
          : '',
        i.paymentNote || '',
      ].filter(Boolean)
      setInstructions(
        lines.length
          ? lines.join('\n')
          : 'Ask the owner for their bKash / Nagad number, pay, then submit TrxID.'
      )
    }
    void load()
  }, [open, bill, messId, defaultAmount])

  const submit = async () => {
    setSubmitting(true)
    setError(null)
    const result = await createPaymentClaim({
      billId: bill?.id,
      messId,
      studentId,
      amount,
      paymentMethod: method,
      transactionId: trxId,
      note,
    })
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setDone(true)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            I paid — submit TrxID
          </DialogTitle>
          <DialogDescription>
            Pay the owner directly, then tell them here. They confirm before
            your balance updates.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="space-y-3 py-2 text-center">
            <p className="font-semibold">Claim submitted</p>
            <p className="text-sm text-muted-foreground">
              Waiting for owner confirmation.
            </p>
            <Button className="w-full" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {instructions && (
              <pre className="whitespace-pre-wrap rounded-lg border bg-muted/40 p-3 text-xs">
                {instructions}
              </pre>
            )}
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                min={1}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
              />
              {bill && (
                <p className="text-xs text-muted-foreground">
                  Bill {formatCurrency(bill.amount)}
                  {bill.amountPaid
                    ? ` · paid ${formatCurrency(bill.amountPaid)}`
                    : ''}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Method</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={method}
                onChange={e => setMethod(e.target.value as PaymentMethod)}
              >
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>TrxID</Label>
              <Input
                value={trxId}
                onChange={e => setTrxId(e.target.value)}
                placeholder="Required for digital payments"
              />
            </div>
            <div className="space-y-2">
              <Label>Note</Label>
              <Textarea
                rows={2}
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              className="w-full"
              disabled={submitting || amount <= 0}
              onClick={submit}
            >
              {submitting ? 'Submitting…' : 'Submit claim'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
