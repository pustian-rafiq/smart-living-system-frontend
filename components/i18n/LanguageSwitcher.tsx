'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { setLocale } from '@/app/actions/locale'
import {
  localeLabels,
  LOCALE_STORAGE_KEY,
  type AppLocale,
} from '@/lib/i18n/config'
import { cn } from '@/lib/utils'

type LanguageSwitcherProps = {
  variant?: 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'icon'
  className?: string
  showLabel?: boolean
  id?: string
}

export function LanguageSwitcher({
  variant = 'outline',
  size = 'sm',
  className,
  showLabel = true,
  id,
}: LanguageSwitcherProps) {
  const locale = useLocale() as AppLocale
  const t = useTranslations('layout')
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const otherLocale: AppLocale = locale === 'en' ? 'bn' : 'en'

  const handleSwitch = () => {
    startTransition(async () => {
      await setLocale(otherLocale)
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCALE_STORAGE_KEY, otherLocale)
      }
      router.refresh()
    })
  }

  return (
    <Button
      type="button"
      id={id}
      variant={variant}
      size={size}
      className={cn('shrink-0', className)}
      onClick={handleSwitch}
      disabled={pending}
      aria-label={t('switchLanguage')}
      title={localeLabels[otherLocale]}
    >
      {showLabel ? localeLabels[otherLocale] : localeLabels[otherLocale].slice(0, 2)}
    </Button>
  )
}

/** Read current locale label for settings display */
export function useLocaleLabel() {
  const locale = useLocale() as AppLocale
  return localeLabels[locale]
}
