'use client'

import { useLocale } from 'next-intl'
import type { AppLocale } from '@/lib/i18n/config'
import * as en from '@/data/legalContent/en'
import * as bn from '@/data/legalContent/bn'

const contentByLocale = { en, bn } as const

export function useLegalContent() {
  const locale = useLocale() as AppLocale
  return contentByLocale[locale] ?? contentByLocale.en
}
