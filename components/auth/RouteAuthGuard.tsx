'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  getDefaultPathForRole,
  isAdminPath,
  isAdminPublicPath,
  isAuthFlowPath,
  isProtectedPath,
  isPublicPath,
  isRoleAllowed,
} from '@/lib/auth'
import {
  getLoginPhone,
  getStoredRole,
  hasCompleteSession,
  isAdminSession,
  isLoggedIn,
  isOtpVerified,
  isPinResetFlow,
  needsPinSetup,
} from '@/utils/auth'
import { hasAuthTokens } from '@/utils/auth-tokens'
import { LoadingState } from '@/components/page'
import { AccessDenied } from './AccessDenied'

type GuardState = 'loading' | 'ready' | 'denied'

export function RouteAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, setState] = useState<GuardState>('loading')

  useEffect(() => {
    const next = searchParams.get('next') || pathname
    const role = getStoredRole()
    const pinNeeded = needsPinSetup()
    const pinReset = isPinResetFlow()
    const authed = isOtpVerified() && hasAuthTokens()

    const finish = (nextState: GuardState) => setState(nextState)

    if (isAdminPath(pathname) && !isAdminPublicPath(pathname)) {
      if (pinNeeded && authed) {
        router.replace('/set-pin')
        return
      }
      if (!isAdminSession()) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`)
        return
      }
      finish('ready')
      return
    }

    if (isAuthFlowPath(pathname)) {
      if (pathname === '/login' && hasCompleteSession()) {
        router.replace(getDefaultPathForRole(role ?? 'renter'))
        return
      }
      if (pathname === '/otp-verify' && !getLoginPhone()) {
        router.replace('/login')
        return
      }
      if (pathname === '/otp-verify' && hasCompleteSession()) {
        router.replace(getDefaultPathForRole(role ?? 'renter'))
        return
      }
      if (pathname === '/set-pin') {
        if (!authed) {
          router.replace('/login')
          return
        }
        if (!pinNeeded && !pinReset && hasCompleteSession()) {
          router.replace(getDefaultPathForRole(role ?? 'renter'))
          return
        }
        if (!pinNeeded && !pinReset) {
          router.replace('/role-selection')
          return
        }
      }
      if (pathname === '/role-selection') {
        if (!authed) {
          router.replace('/login')
          return
        }
        if (pinNeeded || pinReset) {
          router.replace('/set-pin')
          return
        }
        if (isLoggedIn() && hasCompleteSession()) {
          router.replace(getDefaultPathForRole(role ?? 'renter'))
          return
        }
      }
      finish('ready')
      return
    }

    if (pathname === '/account/change-phone' && !isLoggedIn()) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
      return
    }

    if (/^\/hotels\/[^/]+\/book/.test(pathname) && !isLoggedIn()) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
      return
    }

    if (isProtectedPath(pathname) && !isPublicPath(pathname)) {
      if (!isLoggedIn() || !isOtpVerified()) {
        if (authed && pinNeeded) {
          router.replace('/set-pin')
          return
        }
        if (authed && !hasCompleteSession()) {
          router.replace('/role-selection')
          return
        }
        router.replace(`/login?next=${encodeURIComponent(next)}`)
        return
      }
      if (pinNeeded && pathname !== '/set-pin') {
        router.replace('/set-pin')
        return
      }
      if (!hasCompleteSession() && pathname !== '/role-selection') {
        router.replace('/role-selection')
        return
      }

      if (role && !isRoleAllowed(pathname, role)) {
        finish('denied')
        return
      }
    }

    finish('ready')
  }, [pathname, router, searchParams])

  if (state === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState message="Loading…" />
      </div>
    )
  }

  if (state === 'denied') {
    return <AccessDenied role={getStoredRole()} />
  }

  return <>{children}</>
}
