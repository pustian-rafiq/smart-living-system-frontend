'use client'

import { useTranslations } from 'next-intl'
import {
  LegalDocumentLayout,
  LegalSection,
} from '@/components/legal'
import { useLegalContent } from '@/hooks/useLegalContent'

export default function TermsPage() {
  const t = useTranslations('legal')
  const { termsSections } = useLegalContent()
  const toc = termsSections.map(s => ({ id: s.id, title: s.title }))

  return (
    <LegalDocumentLayout
      title={t('terms.title')}
      description={t('terms.description')}
      toc={toc}
    >
      {termsSections.map(section => (
        <LegalSection key={section.id} {...section} />
      ))}
    </LegalDocumentLayout>
  )
}
