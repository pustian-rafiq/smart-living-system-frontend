'use client'

import { useTranslations } from 'next-intl'

/** Resolve navigation label keys from the `nav` namespace. */
export function useNavLabels() {
  const t = useTranslations('nav')
  return {
    label: (key: string) => t(key),
  }
}
