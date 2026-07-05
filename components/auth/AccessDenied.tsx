'use client'

import { useTranslations } from 'next-intl'
import { ShieldAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { UserRole } from '@/types'

type AccessDeniedProps = {
  role?: UserRole | null
}

export function AccessDenied({ role }: AccessDeniedProps) {
  const router = useRouter()
  const t = useTranslations('security.accessDenied')
  const isAdmin = role === 'admin'

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <ShieldAlert className="h-12 w-12 text-destructive" aria-hidden />
      <div>
        <h2 className="text-lg font-semibold">{t('title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('description')}</p>
      </div>
      <Button
        onClick={() => router.push(isAdmin ? '/admin' : '/dashboard')}
      >
        {isAdmin ? t('backToAdmin') : t('backToDashboard')}
      </Button>
    </div>
  )
}
