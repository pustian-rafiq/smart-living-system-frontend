'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader } from '@/components/page'
import {
  FaqList,
  FaqCategoryFilter,
  TrustContactCallout,
  LegalRelatedLinks,
} from '@/components/legal'
import { useLegalContent } from '@/hooks/useLegalContent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function FaqPage() {
  const t = useTranslations('legal')
  const { faqItems, FAQ_CATEGORIES } = useLegalContent()
  const allCategory = FAQ_CATEGORIES[0]
  const [category, setCategory] = useState(allCategory)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    let list = faqItems
    if (category !== allCategory) {
      list = list.filter(f => f.category === category)
    }
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        f =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
      )
    }
    return list
  }, [category, query, faqItems, allCategory])

  return (
    <Layout>
      <PageContainer className="max-w-3xl">
        <PageHeader
          title={t('faq.title')}
          description={t('faq.description')}
          actions={
            <Button asChild variant="outline" size="sm">
              <Link href="/help">{t('faq.helpCenter')}</Link>
            </Button>
          }
        />

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('faq.searchPlaceholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <FaqCategoryFilter
          categories={FAQ_CATEGORIES}
          active={category}
          onChange={setCategory}
        />

        <div className="mt-6">
          {filtered.length > 0 ? (
            <FaqList items={filtered} />
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              {t('faq.noResults')}{' '}
              <Link href="/contact" className="text-primary underline">
                {t('faq.askSupport')}
              </Link>
            </p>
          )}
        </div>

        <TrustContactCallout />
        <LegalRelatedLinks className="mt-8" />
      </PageContainer>
    </Layout>
  )
}
