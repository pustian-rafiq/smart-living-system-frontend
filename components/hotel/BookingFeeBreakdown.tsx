'use client'

import type { BookingFeeBreakdown as Fees } from '@/types/hotel'
import { cn } from '@/lib/utils'

interface BookingFeeBreakdownProps {
  fees: Fees
  className?: string
  showAdvance?: boolean
}

function Row({
  label,
  value,
  muted,
  bold,
}: {
  label: string
  value: string
  muted?: boolean
  bold?: boolean
}) {
  return (
    <div
      className={cn(
        'flex justify-between gap-3 text-sm',
        muted && 'text-muted-foreground',
        bold && 'text-base font-bold'
      )}
    >
      <span>{label}</span>
      <span className={cn(bold && 'text-primary')}>{value}</span>
    </div>
  )
}

/** Reusable tax/fee breakdown for hotel booking summary & invoices. */
export function BookingFeeBreakdown({
  fees,
  className,
  showAdvance = true,
}: BookingFeeBreakdownProps) {
  if (fees.nights <= 0) {
    return (
      <p className={cn('text-sm text-muted-foreground', className)}>
        Select dates and a room to see pricing.
      </p>
    )
  }

  const money = (n: number) => `৳${n.toLocaleString()}`

  return (
    <div className={cn('space-y-2', className)}>
      <Row
        label={`Room (${fees.nights} night${fees.nights > 1 ? 's' : ''})`}
        value={money(fees.baseRoomTotal)}
      />
      {fees.weekendSurcharge > 0 && (
        <Row
          label={`Weekend surcharge (${fees.weekendNights} night${fees.weekendNights > 1 ? 's' : ''})`}
          value={money(fees.weekendSurcharge)}
          muted
        />
      )}
      {fees.seasonalSurcharge > 0 && (
        <Row
          label="Seasonal surcharge"
          value={money(fees.seasonalSurcharge)}
          muted
        />
      )}
      <Row label="Subtotal" value={money(fees.subtotal)} />
      <Row label="Service charge" value={money(fees.serviceCharge)} muted />
      <Row label="VAT" value={money(fees.vat)} muted />
      <div className="border-t pt-2">
        <Row label="Total" value={money(fees.total)} bold />
      </div>
      {showAdvance && (
        <div className="space-y-1 rounded-md bg-muted/50 p-2">
          <Row
            label={`Pay now (${fees.advancePercent}% advance)`}
            value={money(fees.advanceAmount)}
          />
          <Row
            label="Pay at hotel"
            value={money(fees.remainingAmount)}
            muted
          />
        </div>
      )}
    </div>
  )
}
