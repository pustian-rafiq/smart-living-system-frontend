'use client'

import { Layout } from '@/components/layout/Layout'
import { PageContainer, LoadingState } from '@/components/page'
import { useStoredRole } from '@/hooks/useStoredRole'
import { RenterPaymentsPanel } from '@/components/payment/RenterPaymentsPanel'
import { OwnerPaymentsPanel } from '@/components/payment/OwnerPaymentsPanel'

export default function PaymentsPage() {
  const { ready, isRenter, isOwner } = useStoredRole()

  if (!ready) {
    return (
      <Layout>
        <PageContainer>
          <LoadingState label="Loading payments…" />
        </PageContainer>
      </Layout>
    )
  }

  return (
    <Layout>
      <PageContainer>
        {isRenter && <RenterPaymentsPanel />}
        {isOwner && <OwnerPaymentsPanel />}
        {!isRenter && !isOwner && (
          <LoadingState label="Payments are available for renters and owners." />
        )}
      </PageContainer>
    </Layout>
  )
}
