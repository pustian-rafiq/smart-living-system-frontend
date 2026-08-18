'use client'

import { Suspense, useEffect, useState } from 'react'
import { RouteAuthGuard } from './RouteAuthGuard'
import { assertNoSecretsInPublicEnv } from '@/lib/security/client-env'
import { restoreSessionFromCookie } from '@/lib/auth/restore-session'

export function AppAuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    assertNoSecretsInPublicEnv()
    let cancelled = false
    restoreSessionFromCookie().finally(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    )
  }

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
