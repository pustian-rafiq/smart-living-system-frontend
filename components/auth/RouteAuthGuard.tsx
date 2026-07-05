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
} from '@/utils/auth'
import { LoadingState } from '@/components/page'
import { AccessDenied } from './AccessDenied'

type GuardState = 'loading' | 'ready' | 'denied'

/**
 * Client-side route gate for demo auth (sessionStorage).
 * Production: pair with middleware + httpOnly cookies + server authorization.
 */
export function RouteAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, setState] = useState<GuardState>('loading')

  useEffect(() => {
    const next = searchParams.get('next') || pathname
    const role = getStoredRole()

    const finish = (nextState: GuardState) => setState(nextState)

    // Admin area (except login)
    if (isAdminPath(pathname) && !isAdminPublicPath(pathname)) {
      if (!isAdminSession()) {
        router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`)
        return
      }
      finish('ready')
      return
    }

    // Auth flow pages
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
      if (pathname === '/role-selection') {
        if (!isOtpVerified()) {
          router.replace('/login')
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

    // Account recover is public; change-phone needs login
    if (pathname === '/account/change-phone' && !isLoggedIn()) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
      return
    }

    // Hotel booking requires login
    if (/^\/hotels\/[^/]+\/book/.test(pathname) && !isLoggedIn()) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
      return
    }

    // Protected app routes
    if (isProtectedPath(pathname) && !isPublicPath(pathname)) {
      if (!isLoggedIn() || !isOtpVerified()) {
        router.replace(`/login?next=${encodeURIComponent(next)}`)
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
