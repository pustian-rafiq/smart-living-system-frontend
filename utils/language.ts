import type { AppLocale } from '@/lib/i18n/config'
import {
  defaultLocale,
  isValidLocale,
  LOCALE_STORAGE_KEY,
} from '@/lib/i18n/config'

/** Client-side locale read — defaults to English. Prefer `useLocale()` in components. */
export function getLanguage(): AppLocale {
  if (typeof window === 'undefined') return defaultLocale
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored && isValidLocale(stored)) return stored
  return defaultLocale
}

export function setLanguage(lang: AppLocale): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOCALE_STORAGE_KEY, lang)
}

export function toggleLanguage(): AppLocale {
  const current = getLanguage()
  const next: AppLocale = current === 'en' ? 'bn' : 'en'
  setLanguage(next)
  return next
}

/** @deprecated Use `@/lib/i18n/config` — `AppLocale` */
export type Language = AppLocale

/** @deprecated Use namespace JSON + `useTranslations()` */
export const translations = {} as const
