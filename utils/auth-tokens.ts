/** JWT token storage (sessionStorage — matches existing auth session). */

const ACCESS_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'
const USER_ID_KEY = 'userId'

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(REFRESH_KEY)
}

export function getStoredUserId(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(USER_ID_KEY)
}

export function setAuthTokens(params: {
  access: string
  refresh: string
  userId?: string
}): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(ACCESS_KEY, params.access)
  sessionStorage.setItem(REFRESH_KEY, params.refresh)
  if (params.userId) {
    sessionStorage.setItem(USER_ID_KEY, params.userId)
  }
}

export function clearAuthTokens(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(ACCESS_KEY)
  sessionStorage.removeItem(REFRESH_KEY)
  sessionStorage.removeItem(USER_ID_KEY)
}

export function hasAuthTokens(): boolean {
  return Boolean(getAccessToken() && getRefreshToken())
}
