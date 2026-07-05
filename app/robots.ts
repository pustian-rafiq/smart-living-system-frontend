import type { MetadataRoute } from 'next'
import { privatePathPrefixes, publicNoIndexPaths } from '@/lib/seo/routes'
import { absoluteUrl, siteConfig } from '@/lib/seo/site'

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    '/api/',
    ...privatePathPrefixes,
    ...publicNoIndexPaths,
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: siteConfig.url,
  }
}
