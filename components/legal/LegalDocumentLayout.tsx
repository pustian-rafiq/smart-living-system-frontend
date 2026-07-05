'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader } from '@/components/page'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Shield, HelpCircle, MessageCircle } from 'lucide-react'
import { useLegalContent } from '@/hooks/useLegalContent'
import { cn } from '@/lib/utils'

const relatedLinkKeys = [
  { href: '/terms', labelKey: 'terms', icon: FileText },
  { href: '/privacy', labelKey: 'privacy', icon: Shield },
  { href: '/help', labelKey: 'help', icon: HelpCircle },
  { href: '/faq', labelKey: 'faq', icon: HelpCircle },
  { href: '/safety', labelKey: 'safety', icon: Shield },
  { href: '/contact', labelKey: 'contact', icon: MessageCircle },
] as const

interface LegalDocumentLayoutProps {
  title: string
  description: string
  children: React.ReactNode
  toc?: { id: string; title: string }[]
}

export function LegalDocumentLayout({
  title,
  description,
  children,
  toc,
}: LegalDocumentLayoutProps) {
  const t = useTranslations('legal')
  const { LEGAL_LAST_UPDATED } = useLegalContent()

  return (
    <Layout>
      <PageContainer className="max-w-6xl">
        <PageHeader title={title} description={description} />
        <p className="mb-8 text-sm text-muted-foreground">
          {t('lastUpdated', { date: LEGAL_LAST_UPDATED })}
        </p>

        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          {toc && toc.length > 0 && (
            <nav
              className="hidden lg:block"
              aria-label="Table of contents"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t('onThisPage')}
              </p>
              <ul className="sticky top-24 space-y-2 text-sm">
                {toc.map(item => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {item.title.replace(/^\d+\.\s*/, '')}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="min-w-0 space-y-8">{children}</div>
        </div>

        <LegalRelatedLinks className="mt-12" />
      </PageContainer>
    </Layout>
  )
}

export function LegalSection({
  id,
  title,
  paragraphs,
  bullets,
}: {
  id: string
  title: string
  paragraphs: string[]
  bullets?: string[]
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="mb-3 text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {bullets && bullets.length > 0 && (
          <ul className="list-disc space-y-2 pl-5">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export function LegalRelatedLinks({ className }: { className?: string }) {
  const t = useTranslations('legal')

  return (
    <Card className={cn('border-dashed bg-muted/30', className)}>
      <CardContent className="p-6">
        <p className="mb-4 font-semibold">{t('relatedLinks')}</p>
        <div className="flex flex-wrap gap-2">
          {relatedLinkKeys.map(({ href, labelKey, icon: Icon }) => (
            <Button key={href} asChild variant="outline" size="sm">
              <Link href={href}>
                <Icon className="mr-2 h-4 w-4" />
                {t(`links.${labelKey}`)}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function TrustContactCallout() {
  const t = useTranslations('legal')

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">{t('callout.title')}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('callout.description')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/contact">{t('callout.contactSupport')}</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/complaints">{t('callout.reportIssue')}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
