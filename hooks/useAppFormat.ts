'use client'

import { useLocale } from 'next-intl'
import {
  formatCurrency as formatCurrencyBase,
  formatDate as formatDateBase,
  formatDateTime as formatDateTimeBase,
  formatMonthYear as formatMonthYearBase,
  formatNumber as formatNumberBase,
} from '@/lib/format/locale'
import type { AppLocale } from '@/lib/i18n/config'

/** Locale-aware formatting bound to the active app language. */
export function useAppFormat() {
  const locale = useLocale() as AppLocale

  return {
    locale,
    formatCurrency: (
      amount: number,
      options?: Omit<Parameters<typeof formatCurrencyBase>[1], 'language'>
    ) => formatCurrencyBase(amount, { ...options, language: locale }),
    formatNumber: (
      value: number,
      options?: Omit<Parameters<typeof formatNumberBase>[1], 'language'>
    ) => formatNumberBase(value, { ...options, language: locale }),
    formatDate: (
      date: Date | string | number,
      options?: Omit<Parameters<typeof formatDateBase>[1], 'language'>
    ) => formatDateBase(date, { ...options, language: locale }),
    formatDateTime: (
      date: Date | string | number,
      options?: Omit<Parameters<typeof formatDateTimeBase>[1], 'language'>
    ) => formatDateTimeBase(date, { ...options, language: locale }),
    formatMonthYear: (
      date: Date | string | number,
      options?: Omit<Parameters<typeof formatMonthYearBase>[1], 'language'>
    ) => formatMonthYearBase(date, { ...options, language: locale }),
  }
}
