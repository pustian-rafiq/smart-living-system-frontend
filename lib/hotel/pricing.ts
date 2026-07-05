import { differenceInCalendarDays, eachDayOfInterval, format, getDay } from 'date-fns'
import type {
  BookingFeeBreakdown,
  Hotel,
  HotelPricingRules,
  Room,
} from '@/types/hotel'

export const DEFAULT_PRICING_RULES: HotelPricingRules = {
  weekendMultiplier: 1.15,
  serviceChargePercent: 10,
  vatPercent: 15,
  seasonalRules: [],
}

export const DEFAULT_CANCELLATION = {
  freeCancellationHours: 48,
  partialRefundHours: 24,
  partialRefundPercent: 50,
  noRefundWithinHours: 24,
  summary:
    'Free cancellation up to 48 hours before check-in. 50% refund between 48–24 hours. No refund within 24 hours of check-in.',
}

/** Fri (5) and Sat (6) nights count as weekend in BD leisure stays. */
function isWeekendNight(date: Date): boolean {
  const d = getDay(date)
  return d === 5 || d === 6
}

function seasonalMultiplier(
  date: Date,
  rules: HotelPricingRules
): number {
  const key = format(date, 'yyyy-MM-dd')
  let mult = 1
  for (const rule of rules.seasonalRules) {
    if (key >= rule.startDate && key < rule.endDate) {
      mult = Math.max(mult, rule.multiplier)
    }
  }
  return mult
}

/**
 * Calculate room nights with weekend + seasonal multipliers, then service charge & VAT.
 */
export function calculateBookingFees(
  room: Room,
  checkIn: Date,
  checkOut: Date,
  hotel?: Pick<Hotel, 'pricingRules' | 'advancePaymentPercent'>
): BookingFeeBreakdown {
  const nights = differenceInCalendarDays(checkOut, checkIn)
  if (nights <= 0) {
    return {
      nights: 0,
      baseRoomTotal: 0,
      weekendNights: 0,
      weekendSurcharge: 0,
      seasonalSurcharge: 0,
      subtotal: 0,
      serviceCharge: 0,
      vat: 0,
      total: 0,
      advanceAmount: 0,
      remainingAmount: 0,
      advancePercent: hotel?.advancePaymentPercent ?? 30,
    }
  }

  const rules = hotel?.pricingRules ?? DEFAULT_PRICING_RULES
  const nightsList = eachDayOfInterval({
    start: checkIn,
    end: new Date(checkOut.getTime() - 24 * 60 * 60 * 1000),
  })

  let baseRoomTotal = 0
  let weekendNights = 0
  let weekendSurcharge = 0
  let seasonalSurcharge = 0

  for (const night of nightsList) {
    const base = room.basePrice
    baseRoomTotal += base

    let nightPrice = base
    if (isWeekendNight(night) && rules.weekendMultiplier > 1) {
      const extra = base * (rules.weekendMultiplier - 1)
      weekendSurcharge += extra
      nightPrice += extra
      weekendNights += 1
    }

    const seasonMult = seasonalMultiplier(night, rules)
    if (seasonMult > 1) {
      const extra = nightPrice * (seasonMult - 1)
      seasonalSurcharge += extra
    }
  }

  const subtotal = Math.round(
    baseRoomTotal + weekendSurcharge + seasonalSurcharge
  )
  const serviceCharge = Math.round(
    (subtotal * rules.serviceChargePercent) / 100
  )
  const vat = Math.round(
    ((subtotal + serviceCharge) * rules.vatPercent) / 100
  )
  const total = subtotal + serviceCharge + vat
  const advancePercent = hotel?.advancePaymentPercent ?? 30
  const advanceAmount = Math.round((total * advancePercent) / 100)
  const remainingAmount = total - advanceAmount

  return {
    nights,
    baseRoomTotal: Math.round(baseRoomTotal),
    weekendNights,
    weekendSurcharge: Math.round(weekendSurcharge),
    seasonalSurcharge: Math.round(seasonalSurcharge),
    subtotal,
    serviceCharge,
    vat,
    total,
    advanceAmount,
    remainingAmount,
    advancePercent,
  }
}
