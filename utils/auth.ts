import { UserRole } from '@/types'

export const getStoredRole = (): UserRole | null => {
  if (typeof window === 'undefined') return null
  const role = sessionStorage.getItem('userRole') as UserRole | null
  return role || null
}

export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem('isLoggedIn') === 'true'
}

export const logout = (): void => {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem('isLoggedIn')
  sessionStorage.removeItem('userRole')
  sessionStorage.removeItem('loginPhone')
  sessionStorage.removeItem('otpVerified')
}
