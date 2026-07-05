import type { NavChildItem, NavItem } from './types'

function pathMatches(pathname: string, href: string): boolean {
  if (pathname === href) return true
  if (href !== '/' && pathname.startsWith(`${href}/`)) return true
  return false
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  if (pathname === prefix) return true
  return pathname.startsWith(`${prefix}/`)
}

export function isChildActive(pathname: string, child: NavChildItem): boolean {
  return pathMatches(pathname, child.href)
}

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.href && pathMatches(pathname, item.href)) return true

  if (item.matchPrefixes?.some(prefix => matchesPrefix(pathname, prefix))) {
    return true
  }

  if (item.children?.some(child => isChildActive(pathname, child))) {
    return true
  }

  return false
}

export function isHrefActive(
  pathname: string,
  href: string,
  matchPrefixes?: string[]
): boolean {
  if (pathMatches(pathname, href)) return true
  return matchPrefixes?.some(prefix => matchesPrefix(pathname, prefix)) ?? false
}
