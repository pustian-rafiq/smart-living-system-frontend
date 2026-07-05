'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import {
  defaultLocale,
  isValidLocale,
  LOCALE_COOKIE,
  type AppLocale,
} from '@/lib/i18n/config'

const ONE_YEAR = 60 * 60 * 24 * 365

export async function setLocale(locale: AppLocale) {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}`)
  }

  const cookieStore = await cookies()
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: ONE_YEAR,
    sameSite: 'lax',
  })

  revalidatePath('/', 'layout')
}

export async function getStoredLocale(): Promise<AppLocale> {
  const cookieStore = await cookies()
  const value = cookieStore.get(LOCALE_COOKIE)?.value
  return value && isValidLocale(value) ? value : defaultLocale
}
