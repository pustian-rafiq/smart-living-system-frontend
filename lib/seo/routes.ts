import { mockHotels } from '@/data/mockHotels'
import { mockProperties } from '@/data/mockProperties'
import { absoluteUrl } from './site'

/** Paths that should be indexed and appear in the sitemap. */
export const publicIndexablePaths = [
  '/',
  '/search',
  '/properties',
  '/hotels',
  '/compare',
  '/terms',
  '/privacy',
  '/safety',
  '/faq',
  '/help',
  '/about',
  '/contact',
] as const

/** Auth / account flows — reachable but not indexed. */
export const publicNoIndexPaths = [
  '/login',
  '/otp-verify',
  '/role-selection',
  '/account/recover',
  '/account/change-phone',
] as const

/** Prefixes blocked in robots.txt and tagged noindex via middleware. */
export const privatePathPrefixes = [
  '/dashboard',
  '/admin',
  '/profile',
  '/bills',
  '/payments',
  '/mess',
  '/notifications',
  '/complaints',
  '/notices',
  '/messages',
  '/documents',
  '/reminders',
  '/expenses',
  '/reports',
  '/rentals',
  '/subscription',
  '/favorites',
  '/saved-searches',
  '/search-history',
  '/my-hotels',
  '/my-properties',
  '/my-listings',
  '/my-bookings',
] as const

export function isPrivatePath(pathname: string): boolean {
  return privatePathPrefixes.some(
    prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function isPublicNoIndexPath(pathname: string): boolean {
  return publicNoIndexPaths.some(
    path => pathname === path || pathname.startsWith(`${path}/`)
  )
}

export function shouldNoIndex(pathname: string): boolean {
  return isPrivatePath(pathname) || isPublicNoIndexPath(pathname)
}

/** All sitemap entries with optional change frequency hints. */
export function getSitemapEntries(): Array<{
  url: string
  lastModified?: Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority?: number
}> {
  const now = new Date()
  const staticEntries = publicIndexablePaths.map(path => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === '/' ? ('daily' as const) : ('weekly' as const),
    priority: path === '/' ? 1 : path === '/search' ? 0.9 : 0.7,
  }))

  const listingEntries = mockProperties
    .filter(p => p.available)
    .map(p => ({
      url: absoluteUrl(`/listings/${p.id}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  const hotelEntries = mockHotels.map(h => ({
    url: absoluteUrl(`/hotels/${h.id}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  return [...staticEntries, ...listingEntries, ...hotelEntries]
}
