'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader } from '@/components/page'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, HeartHandshake, Shield, Sparkles } from 'lucide-react'

const pillarKeys = [
  { key: 'allInOne', icon: Building2 },
  { key: 'trustByDesign', icon: Shield },
  { key: 'fairForBoth', icon: HeartHandshake },
] as const

export default function About() {
  const t = useTranslations('legal')

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title={t('about.title')}
          description={t('about.description')}
        />

        <div className="prose prose-neutral dark:prose-invert mb-10 max-w-none">
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t('about.intro')}
          </p>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {pillarKeys.map(({ key, icon: Icon }) => (
            <Card key={key} className="border-border/80">
              <CardHeader>
                <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">
                  {t(`about.pillars.${key}.title`)}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {t(`about.pillars.${key}.text`)}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-start gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 h-8 w-8 shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-foreground">
                  {t('about.tryFlow.title')}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t('about.tryFlow.description')}
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/search">{t('about.tryFlow.cta')}</Link>
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    </Layout>
  )
}
