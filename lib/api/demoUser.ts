/**
 * Demo identity for mock API (sessionStorage until real auth exists).
 */
const RENTER_KEY = 'demoRenterId'
const OWNER_KEY = 'demoOwnerId'
const DEFAULT_RENTER = 'renter1'
const DEFAULT_OWNER = 'owner1'

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

export function getDemoRenterProfile(): {
  id: string
  name: string
  phone: string
  email: string
} {
  const phone =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('loginPhone') || '+8801711111111'
      : '+8801711111111'
  return {
    id: getDemoRenterId(),
    name: 'Rahim Uddin',
    phone: phone.startsWith('+') ? phone : `+880${phone.replace(/^0/, '')}`,
    email: 'rahim@example.com',
  }
}
