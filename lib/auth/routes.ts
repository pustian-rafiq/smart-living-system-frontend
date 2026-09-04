/** Routes that never require login */
const PUBLIC_EXACT = new Set([
  '/',
  '/about',
  '/contact',
  '/terms',
  '/privacy',
  '/help',
  '/faq',
  '/safety',
  '/login',
  '/otp-verify',
  '/role-selection',
  '/search',
  '/properties',
  '/compare',
  '/roommates',
  '/areas/compare',
  '/hotels',
  '/messes',
  '/university',
  '/areas',
  '/offline',
  '/account/recover',
  '/admin/login',
  '/set-pin',
])

/** Prefixes open without login (browse-only) */
const PUBLIC_PREFIXES = [
  '/listings/',
  '/areas/',
  '/messes/',
  '/university/',
  '/hotels/',
]

/** Auth flow — redirect if already fully logged in */
export const AUTH_FLOW_PATHS = new Set([
  '/login',
  '/otp-verify',
  '/role-selection',
  '/set-pin',
])

export function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true
  if (PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) return true
  // Hotel detail pages (not booking checkout — that is handled separately)
  if (/^\/hotels\/[^/]+$/.test(pathname)) return true
  // City/area mess SEO: /dhaka/dhanmondi/mess
  if (/^\/[^/]+\/[^/]+\/mess$/.test(pathname)) return true
  return false
}

export function isAdminPath(pathname: string): boolean {
  return pathname.startsWith('/admin')
}

export function isAdminPublicPath(pathname: string): boolean {
  return pathname === '/admin/login'
}

export function isProtectedPath(pathname: string): boolean {
  if (isPublicPath(pathname)) return false
  if (isAdminPublicPath(pathname)) return false
  return true
}

export function isAuthFlowPath(pathname: string): boolean {
  return AUTH_FLOW_PATHS.has(pathname)
}
