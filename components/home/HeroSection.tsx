'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Search,
  Building2,
  Shield,
  CheckCircle,
} from 'lucide-react'
import { isLoggedIn } from '@/utils/auth'

export function HeroSection() {
  const router = useRouter()
  const t = useTranslations('home')
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(isLoggedIn())
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-12 sm:py-16 lg:py-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm backdrop-blur-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-medium">{t('hero.badge')}</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="block">{t('hero.titleLine1')}</span>
            <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t('hero.titleLine2')}
            </span>
            <span className="block">{t('hero.titleLine3')}</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            {t('hero.subtitle')}
          </p>

          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group w-full sm:w-auto"
              onClick={() => router.push(loggedIn ? '/search' : '/login')}
            >
              <Search className="mr-2 h-5 w-5" />
              {loggedIn ? t('hero.browseProperties') : t('hero.getStarted')}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => router.push(loggedIn ? '/dashboard' : '/login')}
            >
              <Building2 className="mr-2 h-5 w-5" />
              {loggedIn ? t('hero.goToDashboard') : t('hero.listProperty')}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{t('hero.trustVerified')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{t('hero.trustPayments')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{t('hero.trustSupport')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
