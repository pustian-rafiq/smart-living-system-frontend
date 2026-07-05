export const locales = ['en', 'bn'] as const
export type AppLocale = (typeof locales)[number]

export const defaultLocale: AppLocale = 'en'

export const LOCALE_COOKIE = 'NEXT_LOCALE'
export const LOCALE_STORAGE_KEY = 'language'

export const localeLabels: Record<AppLocale, string> = {
  en: 'English',
  bn: 'বাংলা',
}

export function isValidLocale(value: string | undefined | null): value is AppLocale {
  return value === 'en' || value === 'bn'
}

export function getLocaleCode(locale: AppLocale): 'en-BD' | 'bn-BD' {
  return locale === 'bn' ? 'bn-BD' : 'en-BD'
}

/** @deprecated Use `AppLocale` from `@/lib/i18n/config` */
export type Language = AppLocale
