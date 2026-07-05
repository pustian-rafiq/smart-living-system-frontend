'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader } from '@/components/page'
import {
  HelpCenterGrid,
  TrustContactCallout,
  LegalRelatedLinks,
} from '@/components/legal'
import { useLegalContent } from '@/hooks/useLegalContent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Shield } from 'lucide-react'

export default function HelpPage() {
  const t = useTranslations('legal')
  const { helpCategories } = useLegalContent()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return helpCategories
    return helpCategories.filter(
      c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.links.some(l => l.label.toLowerCase().includes(q))
    )
  }, [query, helpCategories])

  return (
    <Layout>
      <PageContainer>
        <PageHeader
          title={t('help.title')}
          description={t('help.description')}
          actions={
            <Button asChild variant="outline" size="sm">
              <Link href="/faq">{t('help.viewAllFaq')}</Link>
            </Button>
          }
        />

        <div className="relative mb-8 max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('help.searchPlaceholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <HelpCenterGrid categories={filtered} className="mb-10" />

        {filtered.length === 0 && (
          <p className="mb-8 text-center text-muted-foreground">
            {t('help.noResults')}{' '}
            <Link href="/faq" className="text-primary underline">
              FAQ
            </Link>{' '}
            {t('help.or')}{' '}
            <Link href="/contact" className="text-primary underline">
              {t('help.contactUs')}
            </Link>
            .
          </p>
        )}

        <div className="mb-10 rounded-xl border border-primary/20 bg-primary/5 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Shield className="h-8 w-8 shrink-0 text-primary" />
              <div>
                <p className="font-semibold">{t('help.safetyBanner.title')}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t('help.safetyBanner.description')}
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/safety">{t('help.safetyBanner.cta')}</Link>
            </Button>
          </div>
        </div>

        <TrustContactCallout />
        <LegalRelatedLinks className="mt-8" />
      </PageContainer>
    </Layout>
  )
}
