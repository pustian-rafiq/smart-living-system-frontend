'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const DISMISS_KEY = 'pwa-install-dismissed'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const t = useTranslations('seo.pwa')
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(DISMISS_KEY)) return
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1')
    setVisible(false)
    setDeferred(null)
  }

  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') dismiss()
    else setVisible(false)
    setDeferred(null)
  }

  if (!visible || !deferred) return null

  return (
    <div
      role="dialog"
      aria-labelledby="pwa-install-title"
      className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border bg-card p-4 shadow-lg md:bottom-6 md:left-auto md:right-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Download className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p id="pwa-install-title" className="font-semibold">
            {t('installTitle')}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('installDescription')}
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={install}>
              {t('installAction')}
            </Button>
            <Button size="sm" variant="ghost" onClick={dismiss}>
              {t('dismiss')}
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={dismiss}
          aria-label={t('dismiss')}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
