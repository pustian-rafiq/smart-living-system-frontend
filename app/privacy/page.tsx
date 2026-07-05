'use client'

import { useTranslations } from 'next-intl'
import {
  LegalDocumentLayout,
  LegalSection,
} from '@/components/legal'
import { useLegalContent } from '@/hooks/useLegalContent'

export default function PrivacyPage() {
  const t = useTranslations('legal')
  const { privacySections } = useLegalContent()
  const toc = privacySections.map(s => ({ id: s.id, title: s.title }))

  return (
    <LegalDocumentLayout
      title={t('privacy.title')}
      description={t('privacy.description')}
      toc={toc}
    >
      {privacySections.map(section => (
        <LegalSection key={section.id} {...section} />
      ))}
    </LegalDocumentLayout>
  )
}
