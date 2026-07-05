'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
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
import { getAcceptAttribute, validateFile } from '@/lib/security/file-upload'
import { useAppFormat } from '@/hooks/useAppFormat'

type FormValues = {
  amount: number
  receivedDate: string
  receivedBy?: string
  receiptNote?: string
}

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
  const t = useTranslations('payments.recordCash')
  const tv = useTranslations('payments.resultView')
  const { formatCurrency } = useAppFormat()
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [txnId, setTxnId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const schema = useMemo(
    () =>
      z.object({
        amount: z.coerce.number().min(1, t('amountRequired')),
        receivedDate: z.string().min(1, t('dateRequired')),
        receivedBy: z.string().optional(),
        receiptNote: z.string().optional(),
      }),
    [t]
  )

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
            {t('title')}
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
              <p className="font-semibold">{t('successTitle')}</p>
              <p className="text-sm text-muted-foreground">{t('successDesc')}</p>
              {txnId && (
                <p className="mt-2 font-mono text-xs">{txnId}</p>
              )}
            </div>
            <Button className="w-full" onClick={() => onOpenChange(false)}>
              {tv('done')}
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="rounded-lg border bg-muted/40 p-3">
                <p className="text-sm text-muted-foreground">{t('billAmount')}</p>
                <p className="text-xl font-bold text-primary">
                  {formatCurrency(bill.amount)}
                </p>
              </div>

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('amountReceived')}</FormLabel>
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
                    <FormLabel>{t('receivedDate')}</FormLabel>
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
                    <FormLabel>{t('receivedBy')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('receivedByPlaceholder')} {...field} />
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
                    <FormLabel>{t('notes')}</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={2}
                        placeholder={t('notesPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>{t('receiptPhoto')}</Label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center hover:bg-muted/50">
                  <Upload className="mb-2 h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {receiptFileName || t('uploadPlaceholder')}
                  </span>
                  <input
                    type="file"
                    accept={getAcceptAttribute('receipt')}
                    className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0]
                      if (!f) {
                        setReceiptFileName(null)
                        return
                      }
                      const result = validateFile(f, 'receipt')
                      if (!result.valid) {
                        setReceiptFileName(null)
                        e.target.value = ''
                        setError(t('uploadHint'))
                        return
                      }
                      setReceiptFileName(result.file.name)
                      setError(null)
                    }}
                  />
                </label>
                <p className="text-sm text-muted-foreground">{t('uploadHint')}</p>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? t('recording') : t('confirm')}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
