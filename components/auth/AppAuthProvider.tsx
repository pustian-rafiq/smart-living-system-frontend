'use client'

import { Suspense, useEffect } from 'react'
import { RouteAuthGuard } from './RouteAuthGuard'
import { assertNoSecretsInPublicEnv } from '@/lib/security/client-env'

export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    assertNoSecretsInPublicEnv()
  }, [])
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <RouteAuthGuard>{children}</RouteAuthGuard>
    </Suspense>
  )
}

export { UserVerificationPanel } from './UserVerificationPanel'
export { PhoneOtpForm } from './PhoneOtpForm'
