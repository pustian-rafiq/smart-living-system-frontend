'use client'

import { useTranslations } from 'next-intl'
import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export function OfflineBanner() {
  const online = useOnlineStatus()
  const t = useTranslations('feedback.offline')

  if (online) return null

  return (
    <div
      role="alert"
      className="sticky top-0 z-[60] flex items-center justify-center gap-2 border-b border-amber-500/30 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 dark:bg-amber-950/80 dark:text-amber-100"
    >
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
      <p>
        <span className="font-medium">{t('title')}</span>{' '}
        {t('description')}
      </p>
    </div>
  )
}
