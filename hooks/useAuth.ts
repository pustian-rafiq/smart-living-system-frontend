'use client'

import { useCallback, useEffect, useState } from 'react'
import type { UserRole } from '@/types'
import type { AdminRole } from '@/types/admin'
import { AUTH_SESSION_CHANGED } from '@/lib/auth/session-events'
import {
  getDisplayName,
  getLoginPhone,
  getStoredAdminRole,
  getStoredRole,
  hasCompleteSession,
  isAdminSession,
  isLoggedIn,
  isOtpVerified,
} from '@/utils/auth'

export type AuthState = {
  ready: boolean
  isLoggedIn: boolean
  isOtpVerified: boolean
  hasCompleteSession: boolean
  isAdminSession: boolean
  role: UserRole | null
  adminRole: AdminRole | null
  phone: string | null
  displayName: string
}

function readAuthState(): Omit<AuthState, 'ready'> {
  return {
    isLoggedIn: isLoggedIn(),
    isOtpVerified: isOtpVerified(),
    hasCompleteSession: hasCompleteSession(),
    isAdminSession: isAdminSession(),
    role: getStoredRole(),
    adminRole: getStoredAdminRole(),
    phone: getLoginPhone(),
    displayName: getDisplayName(),
  }
}

/** Client auth snapshot from sessionStorage (demo; replace with server session). */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    ready: false,
    ...readAuthState(),
  })

  const sync = useCallback(() => {
    setState({ ready: true, ...readAuthState() })
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener(AUTH_SESSION_CHANGED, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(AUTH_SESSION_CHANGED, sync)
    }
  }, [sync])

  return state
}
