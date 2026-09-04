'use client'

import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader } from '@/components/page'
import { OwnerSubscriptionPanel, AdCampaignsPanel } from '@/components/monetization'

export default function SubscriptionPage() {
  const t = useTranslations('portfolio.subscription')

  return (
    <Layout userRole="owner">
      <PageContainer>
        <PageHeader title={t('title')} description={t('description')} />
        <div className="space-y-8">
          <OwnerSubscriptionPanel />
          <AdCampaignsPanel />
        </div>
      </PageContainer>
    </Layout>
  )
}
