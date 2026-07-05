import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import {
  defaultLocale,
  isValidLocale,
  LOCALE_COOKIE,
  type AppLocale,
} from '@/lib/i18n/config'
import { loadMessages } from '@/lib/i18n/load-messages'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value
  const locale: AppLocale =
    cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : defaultLocale

  return {
    locale,
    messages: await loadMessages(locale),
  }
})
