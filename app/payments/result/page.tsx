'use client'

import { Suspense } from 'react'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, LoadingState } from '@/components/page'
import { PaymentResultContent } from '@/components/payment/PaymentResultContent'

export default function PaymentResultPage() {
  return (
    <Layout>
      <PageContainer className="max-w-lg">
        <Suspense fallback={<LoadingState label="Loading payment…" />}>
          <PaymentResultContent />
        </Suspense>
      </PageContainer>
    </Layout>
  )
}
