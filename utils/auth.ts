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
  sessionStorage.removeItem('userName')
  sessionStorage.removeItem('profilePhotoUrl')
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
