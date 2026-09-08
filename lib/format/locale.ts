import type { AppLocale } from '@/lib/i18n/config'
import { defaultLocale, getLocaleCode as mapLocaleCode } from '@/lib/i18n/config'

export type { AppLocale as Language }
export type LocaleCode = 'bn-BD' | 'en-BD'

export function getLocaleCode(language?: AppLocale): LocaleCode {
  const lang = language ?? defaultLocale
  return mapLocaleCode(lang)
}

/** Bangladesh Taka — locale-aware (bn-BD / en-BD). */
export function formatCurrency(
  amount: number,
  options?: { language?: AppLocale; compact?: boolean }
): string {
  const locale = getLocaleCode(options?.language)
  if (options?.compact && Math.abs(amount) >= 1000) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'BDT',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount)
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(
  value: number,
  options?: { language?: AppLocale; decimals?: number }
): string {
  const locale = getLocaleCode(options?.language)
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: options?.decimals ?? 0,
    maximumFractionDigits: options?.decimals ?? 0,
  }).format(value)
}

type DateStyle = 'short' | 'medium' | 'long' | 'full'

const DATE_STYLE_MAP: Record<
  DateStyle,
  Intl.DateTimeFormatOptions['dateStyle']
> = {
  short: 'short',
  medium: 'medium',
  long: 'long',
  full: 'full',
}

/** Explicit day/month/year — Bangladesh standard (e.g. 06/09/2026). */
const BD_NUMERIC_DATE: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
}

export function formatDate(
  date: Date | string | number,
  options?: { language?: AppLocale; style?: DateStyle }
): string {
  const locale = getLocaleCode(options?.language)
  const d = date instanceof Date ? date : new Date(date)
  const style = options?.style ?? 'medium'

  // Prefer explicit DMY for short so en-BD/bn-BD never fall back to US MDY.
  if (style === 'short') {
    return new Intl.DateTimeFormat(locale, BD_NUMERIC_DATE).format(d)
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: DATE_STYLE_MAP[style],
  }).format(d)
}

export function formatDateTime(
  date: Date | string | number,
  options?: {
    language?: AppLocale
    dateStyle?: DateStyle
    timeStyle?: 'short' | 'medium'
  }
): string {
  const locale = getLocaleCode(options?.language)
  const d = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat(locale, {
    dateStyle: DATE_STYLE_MAP[options?.dateStyle ?? 'medium'],
    timeStyle: options?.timeStyle ?? 'short',
  }).format(d)
}

export function formatMonthYear(
  date: Date | string | number,
  options?: { language?: AppLocale }
): string {
  const locale = getLocaleCode(options?.language)
  const d = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(d)
}
