/** Canonical site configuration for SEO, sitemap, and PWA. */
export const siteConfig = {
  name: 'SmartBasa',
  shortName: 'SmartBasa',
  /** Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://smartbasa.com). */
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'http://localhost:3000',
  defaultOgImage: '/opengraph-image',
  twitterHandle: '@smartbasa',
  locale: 'en_BD',
  themeColor: '#0f766e',
  backgroundColor: '#ffffff',
} as const

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${siteConfig.url}${normalized}`
}
