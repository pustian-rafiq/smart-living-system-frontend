import { UserRole } from '@/types'
import type { AdminRole } from '@/types/admin'
import type { UserVerificationStatus } from '@/types/userVerification'
import { notifyAuthSessionChanged } from '@/lib/auth/session-events'
import {
  clearDemoIdentity,
  syncDemoIdentityForRole,
} from '@/lib/auth/demo-identity'

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

export const getVerificationStatus = (): UserVerificationStatus => {
  if (typeof window === 'undefined') return 'unverified'
  const stored = sessionStorage.getItem(
    'verificationStatus'
  ) as UserVerificationStatus | null
  return stored || 'unverified'
}

export const setVerificationStatus = (
  status: UserVerificationStatus
): void => {
  if (typeof window === 'undefined') return
  sessionStorage.setItem('verificationStatus', status)
}

export const logout = (): void => {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem('isLoggedIn')
  sessionStorage.removeItem('userRole')
  sessionStorage.removeItem('loginPhone')
  sessionStorage.removeItem('otpVerified')
  sessionStorage.removeItem('userName')
  sessionStorage.removeItem('profilePhotoUrl')
  sessionStorage.removeItem('adminRole')
  sessionStorage.removeItem('adminId')
  sessionStorage.removeItem('verificationStatus')
  clearDemoIdentity()
  notifyAuthSessionChanged()
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
