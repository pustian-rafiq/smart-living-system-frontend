'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { Bill } from '@/types/bill'
import { Banknote, Upload, CheckCircle2 } from 'lucide-react'
import { recordCashPaymentApi } from '@/lib/api/payments'
import { getDemoOwnerId } from '@/lib/api/demoUser'

const schema = z.object({
  amount: z.coerce.number().min(1, 'Amount is required'),
  receivedDate: z.string().min(1, 'Date is required'),
  receivedBy: z.string().optional(),
  receiptNote: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface RecordCashPaymentDialogProps {
  bill: Bill | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function RecordCashPaymentDialog({
  bill,
  open,
  onOpenChange,
  onSuccess,
}: RecordCashPaymentDialogProps) {
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [txnId, setTxnId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      amount: 0,
      receivedDate: new Date().toISOString().split('T')[0],
      receivedBy: '',
      receiptNote: '',
    },
  })

  useEffect(() => {
    if (!open || !bill) return
    setDone(false)
    setTxnId(null)
    setError(null)
    setReceiptFileName(null)
    form.reset({
      amount: bill.amount,
      receivedDate: new Date().toISOString().split('T')[0],
      receivedBy: '',
      receiptNote: '',
    })
  }, [open, bill, form])

  if (!bill) return null

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    setError(null)
    const result = await recordCashPaymentApi({
      billId: bill.id,
      billName: `${bill.month} ${bill.year} — ${bill.propertyName}`,
      propertyName: bill.propertyName,
      tenantName: bill.tenantName,
      amount: values.amount,
      receivedDate: values.receivedDate,
      receivedBy: values.receivedBy,
      receiptNote: values.receiptNote,
      receiptFileName: receiptFileName || undefined,
      ownerId: getDemoOwnerId(),
    })
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setTxnId(result.data.transaction.transactionId)
    setDone(true)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Record cash payment
          </DialogTitle>
          <DialogDescription>
            {bill.tenantName} · {bill.month} {bill.year}
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="space-y-4 py-4 text-center">
            <div className="mx-auto w-fit rounded-full bg-emerald-100 p-3 dark:bg-emerald-950/50">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold">Cash payment recorded</p>
              <p className="text-sm text-muted-foreground">
                Bill marked as paid. Payout ledger updated.
              </p>
              {txnId && (
                <p className="mt-2 font-mono text-xs">{txnId}</p>
              )}
            </div>
            <Button className="w-full" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="text-sm text-muted-foreground">Bill amount</p>
                <p className="text-xl font-bold text-primary">
                  ৳{bill.amount.toLocaleString()}
                </p>
              </div>

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount received (৳)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="receivedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Received date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="receivedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Received by (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Staff name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="receiptNote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={2}
                        placeholder="Reference or remarks"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Receipt photo (optional)</Label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center hover:bg-muted/50">
                  <Upload className="mb-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {receiptFileName || 'Upload scan or photo'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0]
                      setReceiptFileName(f?.name ?? null)
                    }}
                  />
                </label>
                <p className="text-sm text-muted-foreground">
                  Demo: filename only — real upload with backend later.
                </p>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Recording…' : 'Confirm cash received'}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
