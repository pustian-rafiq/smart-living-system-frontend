'use client'

import { Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, LoadingState } from '@/components/page'
import { PaymentResultContent } from '@/components/payment/PaymentResultContent'

export default function PaymentResultPage() {
  const t = useTranslations('payments.result')

  return (
    <Layout>
      <PageContainer className="max-w-lg">
        <Suspense fallback={<LoadingState label={t('loading')} />}>
          <PaymentResultContent />
        </Suspense>
      </PageContainer>
    </Layout>
  )
}
