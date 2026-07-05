import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description:
      'Find and manage mess, hostel, hotel & apartment living in Bangladesh.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: siteConfig.backgroundColor,
    theme_color: siteConfig.themeColor,
    lang: 'en',
    dir: 'ltr',
    categories: ['lifestyle', 'business', 'utilities'],
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
    ],
  }
}
