/**
 * Demo identity keys in sessionStorage (until real auth backend).
 */
import type { UserRole } from '@/types'

const RENTER_KEY = 'demoRenterId'
const OWNER_KEY = 'demoOwnerId'
const TENANT_KEY = 'demoTenantId'
const CHAT_USER_KEY = 'demoChatUserId'

export const DEFAULT_RENTER = 'renter1'
export const DEFAULT_OWNER = 'owner1'
export const DEFAULT_TENANT_ID = 'r1'
export const DEFAULT_CHAT_USER_ID = 'user1'

export function getDemoRenterId(): string {
  if (typeof window === 'undefined') return DEFAULT_RENTER
  return sessionStorage.getItem(RENTER_KEY) || DEFAULT_RENTER
}

export function setDemoRenterId(id: string): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(RENTER_KEY, id)
}

export function getDemoOwnerId(): string {
  if (typeof window === 'undefined') return DEFAULT_OWNER
  return sessionStorage.getItem(OWNER_KEY) || DEFAULT_OWNER
}

export function setDemoOwnerId(id: string): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(OWNER_KEY, id)
}

export function getDemoTenantId(): string {
  if (typeof window === 'undefined') return DEFAULT_TENANT_ID
  return sessionStorage.getItem(TENANT_KEY) || DEFAULT_TENANT_ID
}

export function setDemoTenantId(id: string): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(TENANT_KEY, id)
}

export function getDemoChatUserId(): string {
  if (typeof window === 'undefined') return DEFAULT_CHAT_USER_ID
  return sessionStorage.getItem(CHAT_USER_KEY) || DEFAULT_CHAT_USER_ID
}

export function setDemoChatUserId(id: string): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(CHAT_USER_KEY, id)
}

export function syncDemoIdentityForRole(role: UserRole): void {
  if (typeof window === 'undefined') return

  if (role === 'owner') {
    if (!sessionStorage.getItem(OWNER_KEY)) {
      setDemoOwnerId(DEFAULT_OWNER)
    }
    return
  }

  if (role === 'renter') {
    if (!sessionStorage.getItem(RENTER_KEY)) {
      setDemoRenterId(DEFAULT_RENTER)
    }
    setDemoTenantId(DEFAULT_TENANT_ID)
    setDemoChatUserId(DEFAULT_CHAT_USER_ID)
  }
}

export function clearDemoIdentity(): void {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(RENTER_KEY)
  sessionStorage.removeItem(OWNER_KEY)
  sessionStorage.removeItem(TENANT_KEY)
  sessionStorage.removeItem(CHAT_USER_KEY)
}

function readStoredRole(): UserRole | null {
  if (typeof window === 'undefined') return null
  const role = sessionStorage.getItem('userRole') as UserRole | null
  return role || null
}

export function getDemoUserId(role?: UserRole | null): string {
  const resolved = role ?? readStoredRole() ?? 'renter'

  if (resolved === 'owner') return getDemoOwnerId()
  if (resolved === 'admin') {
    if (typeof window === 'undefined') return 'admin1'
    return sessionStorage.getItem('adminId') || 'admin1'
  }
  return getDemoTenantId()
}

export function resolvePaymentUserId(userId: string): string {
  if (userId === 'renter1' || userId === 'user1') return DEFAULT_TENANT_ID
  return userId
}

export function getDemoRenterProfile(): {
  id: string
  name: string
  phone: string
  email: string
} {
  const phone =
    (typeof window !== 'undefined'
      ? sessionStorage.getItem('loginPhone')
      : null) || '+8801711111111'
  const name =
    (typeof window !== 'undefined'
      ? sessionStorage.getItem('userName')
      : null) || 'Rahim Uddin'
  const normalized = phone.startsWith('+')
    ? phone
    : `+880${phone.replace(/^0/, '')}`

  return {
    id: getDemoTenantId(),
    name,
    phone: normalized,
    email: 'rahim@example.com',
  }
}
