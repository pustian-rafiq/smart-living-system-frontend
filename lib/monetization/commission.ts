import { mockSystemSettings } from '@/data/mockAdmin'
import { DEFAULT_COMMISSION_RATE } from '@/lib/payment/constants'
import type { BookingCommission } from '@/types/subscription'

export function getCommissionRate(): number {
  return mockSystemSettings.commissionRate ?? DEFAULT_COMMISSION_RATE
}

export function calculateBookingCommission(
  grossAmount: number,
  rate?: number
): BookingCommission {
  const commissionRate = rate ?? getCommissionRate()
  const commissionAmount = Math.round((grossAmount * commissionRate) / 100)
  const netAmount = grossAmount - commissionAmount
  return { grossAmount, commissionRate, commissionAmount, netAmount }
}
