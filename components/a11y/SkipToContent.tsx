'use client'

import { useTranslations } from 'next-intl'

/** First-focusable skip link — jumps past header/nav to main content. */
export function SkipToContent({ targetId = 'main-content' }: { targetId?: string }) {
  const t = useTranslations('layout')

  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      {t('skipToContent')}
    </a>
  )
}
