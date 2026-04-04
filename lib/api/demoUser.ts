/**
 * Demo identity for mock API (sessionStorage until real auth exists).
 */
const RENTER_KEY = 'demoRenterId'
const DEFAULT_RENTER = 'renter1'

export function getDemoRenterId(): string {
  if (typeof window === 'undefined') return DEFAULT_RENTER
  return sessionStorage.getItem(RENTER_KEY) || DEFAULT_RENTER
}

export function setDemoRenterId(id: string): void {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(RENTER_KEY, id)
}
