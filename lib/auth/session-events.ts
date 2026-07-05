/** Decouple session mutations from React hooks to avoid import cycles. */

export const AUTH_SESSION_CHANGED = 'auth-session-changed'

export function notifyAuthSessionChanged(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED))
}
