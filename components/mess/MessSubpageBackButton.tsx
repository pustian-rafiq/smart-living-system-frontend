'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type MessSubpageBackButtonProps = {
  /** Used when there is no in-app previous page (direct link / refresh). */
  fallbackHref?: string
  className?: string
}

/**
 * Back control for mess child routes (`/mess/[id]/sms`, meals, etc.).
 * Prefers browser history when the user came from this app; otherwise falls back.
 */
export function MessSubpageBackButton({
  fallbackHref = '/mess',
  className,
}: MessSubpageBackButtonProps) {
  const router = useRouter()
  const tc = useTranslations('common')

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      try {
        const ref = document.referrer
        if (ref && new URL(ref).origin === window.location.origin) {
          router.back()
          return
        }
      } catch {
        // ignore invalid referrer
      }
    }
    router.push(fallbackHref)
  }

  return (
    <Button
      type="button"
      variant="ghost"
      className={cn('mb-2 -ml-2 h-9 px-2', className)}
      onClick={handleBack}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {tc('back')}
    </Button>
  )
}
