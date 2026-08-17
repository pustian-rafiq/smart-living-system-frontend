import { UserRole } from '@/types'
import type { AdminRole } from '@/types/admin'
import type { UserVerificationStatus } from '@/types/userVerification'
import type { AuthSession, AuthUser } from '@/lib/api/auth'
import { notifyAuthSessionChanged } from '@/lib/auth/session-events'
import {
  clearDemoIdentity,
  syncDemoIdentityForRole,
} from '@/lib/auth/demo-identity'
import { clearAuthTokens, setAuthTokens } from '@/utils/auth-tokens'

export const getStoredRole = (): UserRole | null => {
  if (typeof window === 'undefined') return null
  const role = sessionStorage.getItem('userRole') as UserRole | null
  return role || null
}

export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem('isLoggedIn') === 'true'
}

export const isOtpVerified = (): boolean => {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem('otpVerified') === 'true'
}

export const getLoginPhone = (): string | null => {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('loginPhone')
}

export const hasCompleteSession = (): boolean => {
  return isLoggedIn() && isOtpVerified() && getStoredRole() !== null
}

export const setUserSession = (params: {
  role: UserRole
  phone?: string
  name?: string
}): void => {
  if (typeof window === 'undefined') return
  sessionStorage.setItem('isLoggedIn', 'true')
  sessionStorage.setItem('otpVerified', 'true')
  sessionStorage.setItem('userRole', params.role)
  if (params.phone) sessionStorage.setItem('loginPhone', params.phone)
  if (params.name) sessionStorage.setItem('userName', params.name)
  syncDemoIdentityForRole(params.role)
  notifyAuthSessionChanged()
}

/** Apply OTP/role API session to sessionStorage + JWT tokens. */
export function applyAuthSession(
  session: AuthSession,
  options?: { complete?: boolean },
): void {
  if (typeof window === 'undefined') return

  setAuthTokens({
    access: session.access,
    refresh: session.refresh,
    userId: session.user.id,
  })

  const phoneDigits = session.user.phoneDigits
  sessionStorage.setItem('loginPhone', phoneDigits)
  sessionStorage.setItem('otpVerified', 'true')

  const complete =
    options?.complete ??
    (session.user.roleSelected && !session.needsRoleSelection)

  if (complete) {
    sessionStorage.setItem('isLoggedIn', 'true')
    sessionStorage.setItem('userRole', session.user.role)
    if (session.user.name) {
      sessionStorage.setItem('userName', session.user.name)
    }
    if (session.user.profilePhotoUrl) {
      sessionStorage.setItem('profilePhotoUrl', session.user.profilePhotoUrl)
    }
    if (session.user.role === 'admin' && session.adminRole) {
      sessionStorage.setItem('adminRole', session.adminRole)
      sessionStorage.setItem('adminId', session.user.id)
    } else {
      sessionStorage.removeItem('adminRole')
      sessionStorage.removeItem('adminId')
    }
    syncDemoIdentityForRole(session.user.role)
  } else {
    sessionStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('userRole')
  }

  // Cache available roles for role-selection UI
  sessionStorage.setItem(
    'availableRoles',
    JSON.stringify(session.availableRoles),
  )
  if (session.adminRole) {
    sessionStorage.setItem('pendingAdminRole', session.adminRole)
  } else {
    sessionStorage.removeItem('pendingAdminRole')
  }

  notifyAuthSessionChanged()
}

export function getAvailableRolesFromSession(): UserRole[] {
  if (typeof window === 'undefined') return ['renter', 'owner']
  try {
    const raw = sessionStorage.getItem('availableRoles')
    if (!raw) return ['renter', 'owner']
    return JSON.parse(raw) as UserRole[]
  } catch {
    return ['renter', 'owner']
  }
}

export function getPendingAdminRole(): AdminRole | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('pendingAdminRole') as AdminRole | null
}

export const getVerificationStatus = (): UserVerificationStatus => {
  if (typeof window === 'undefined') return 'unverified'
  const stored = sessionStorage.getItem(
    'verificationStatus',
  ) as UserVerificationStatus | null
  return stored || 'unverified'
}

export const setVerificationStatus = (
  status: UserVerificationStatus,
): void => {
  if (typeof window === 'undefined') return
  sessionStorage.setItem('verificationStatus', status)
}

export const logout = (): void => {
  if (typeof window === 'undefined') return
  const refresh = sessionStorage.getItem('refreshToken')
  clearAuthTokens()
  sessionStorage.removeItem('isLoggedIn')
  sessionStorage.removeItem('userRole')
  sessionStorage.removeItem('loginPhone')
  sessionStorage.removeItem('otpVerified')
  sessionStorage.removeItem('userName')
  sessionStorage.removeItem('profilePhotoUrl')
  sessionStorage.removeItem('adminRole')
  sessionStorage.removeItem('adminId')
  sessionStorage.removeItem('verificationStatus')
  sessionStorage.removeItem('availableRoles')
  sessionStorage.removeItem('pendingAdminRole')
  sessionStorage.removeItem('devOtp')
  clearDemoIdentity()
  notifyAuthSessionChanged()
  if (refresh) {
    void import('@/lib/api/client').then(({ apiRequest }) =>
      apiRequest('/auth/logout/', {
        method: 'POST',
        auth: false,
        body: { refresh },
      }),
    )
  }
}

export const getStoredAdminRole = (): AdminRole | null => {
  if (typeof window === 'undefined') return null
  const role = sessionStorage.getItem('adminRole') as AdminRole | null
  return role || null
}

export const isAdminSession = (): boolean => {
  return getStoredRole() === 'admin' && getStoredAdminRole() !== null
}

export const setAdminSession = (params: {
  phone: string
  adminRole: AdminRole
  adminId?: string
  name?: string
}): void => {
  /**
   * @deprecated Prefer applyAuthSession after real OTP verify.
   * Does NOT store JWTs — admin API calls will return empty without tokens.
   */
  if (typeof window === 'undefined') return
  sessionStorage.setItem('isLoggedIn', 'true')
  sessionStorage.setItem('otpVerified', 'true')
  sessionStorage.setItem('userRole', 'admin')
  sessionStorage.setItem('loginPhone', params.phone)
  sessionStorage.setItem('adminRole', params.adminRole)
  sessionStorage.setItem('adminId', params.adminId ?? 'admin1')
  if (params.name) sessionStorage.setItem('userName', params.name)
  notifyAuthSessionChanged()
}

export const getDisplayName = (): string => {
  if (typeof window === 'undefined') return 'Guest'
  const storedName = sessionStorage.getItem('userName')
  if (storedName) return storedName
  const phone = sessionStorage.getItem('loginPhone')
  if (phone) return `User ${phone.slice(-4)}`
  return 'Guest'
}

export const getProfilePhotoUrl = (): string | null => {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('profilePhotoUrl')
}

export function syncUserDisplay(user: AuthUser): void {
  if (typeof window === 'undefined') return
  if (user.name) sessionStorage.setItem('userName', user.name)
  if (user.profilePhotoUrl) {
    sessionStorage.setItem('profilePhotoUrl', user.profilePhotoUrl)
  }
  sessionStorage.setItem('loginPhone', user.phoneDigits)
  notifyAuthSessionChanged()
}
