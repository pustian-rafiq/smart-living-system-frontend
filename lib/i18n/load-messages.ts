import type { AppLocale } from './config'

const namespaces = [
  'common',
  'auth',
  'nav',
  'dashboard',
  'layout',
  'property',
  'profile',
  'feedback',
  'bills',
  'payments',
  'mess',
  'hotels',
  'admin',
  'search',
  'legal',
  'portfolio',
  'tools',
  'home',
  'account',
  'seo',
  'security',
  'living',
  'contact',
] as const

export type MessageNamespace = (typeof namespaces)[number]

export async function loadMessages(locale: AppLocale) {
  const entries = await Promise.all(
    namespaces.map(async ns => {
      const mod = await import(`@/locales/${locale}/${ns}.json`)
      return [ns, mod.default] as const
    })
  )
  return Object.fromEntries(entries)
}
