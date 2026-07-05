'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Search, Building2, CheckCircle } from 'lucide-react'
import { isLoggedIn } from '@/utils/auth'

export function CTASection() {
  const router = useRouter()
  const t = useTranslations('home')
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(isLoggedIn())
  }, [])

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5">
          <CardHeader className="text-center">
            <CardTitle className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
              {t('cta.title')}
            </CardTitle>
            <CardDescription className="mx-auto max-w-2xl text-lg">
              {t('cta.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="group w-full sm:w-auto"
              onClick={() => router.push(loggedIn ? '/search' : '/login')}
            >
              <Search className="mr-2 h-5 w-5" />
              {loggedIn ? t('cta.browseProperties') : t('cta.findAccommodation')}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => router.push(loggedIn ? '/dashboard' : '/login')}
            >
              <Building2 className="mr-2 h-5 w-5" />
              {loggedIn ? t('cta.manageProperties') : t('cta.listProperty')}
            </Button>
          </CardContent>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 px-6 pb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{t('cta.benefitFree')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{t('cta.benefitNoFees')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{t('cta.benefitVerified')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>{t('cta.benefitSupport')}</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
