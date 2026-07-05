'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader } from '@/components/page'
import {
  SafetyTipsList,
  TrustContactCallout,
  LegalRelatedLinks,
} from '@/components/legal'
import { useLegalContent } from '@/hooks/useLegalContent'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Phone, Shield } from 'lucide-react'

export default function SafetyPage() {
  const t = useTranslations('legal')
  const { safetyTips, LEGAL_LAST_UPDATED } = useLegalContent()

  const safetyCards = [
    { key: 'verifyFirst', icon: Shield },
    { key: 'neverShareOtp', icon: Phone },
    { key: 'usePlatformPay', icon: AlertTriangle },
  ] as const

  return (
    <Layout>
      <PageContainer className="max-w-4xl">
        <PageHeader
          title={t('safety.title')}
          description={t('safety.description')}
          actions={
            <Button asChild variant="destructive" size="sm">
              <Link href="/complaints">{t('safety.reportFraud')}</Link>
            </Button>
          }
        />

        <Card className="mb-8 border-destructive/30 bg-destructive/5">
          <CardContent className="flex gap-4 p-5 sm:p-6">
            <AlertTriangle className="h-8 w-8 shrink-0 text-destructive" />
            <div>
              <p className="font-semibold text-foreground">
                {t('safety.scamAlert.title')}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t('safety.scamAlert.body')}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {t('lastUpdated', { date: LEGAL_LAST_UPDATED })}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {safetyCards.map(({ key, icon: Icon }) => (
            <Card key={key} className="border-border/80">
              <CardContent className="p-4 text-center">
                <Icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="font-medium">{t(`safety.cards.${key}.title`)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t(`safety.cards.${key}.text`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <SafetyTipsList tips={safetyTips} />

        <TrustContactCallout />
        <LegalRelatedLinks className="mt-8" />
      </PageContainer>
    </Layout>
  )
}
