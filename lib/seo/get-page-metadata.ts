import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import type { AppLocale } from '@/lib/i18n/config'
import { buildMetadata } from './build-metadata'
import type { SeoPageKey } from './page-keys'

export type PageMetadataOptions = {
  path?: string
  noindex?: boolean
  title?: string
  description?: string
  keywords?: string[]
  images?: Array<{ url: string; alt?: string }>
}

const defaultPaths: Partial<Record<SeoPageKey, string>> = {
  home: '/',
  search: '/search',
  properties: '/properties',
  hotels: '/hotels',
  compare: '/compare',
  roommates: '/roommates',
  areaCompare: '/areas/compare',
  universities: '/university',
  areasSeo: '/areas',
  terms: '/terms',
  privacy: '/privacy',
  safety: '/safety',
  faq: '/faq',
  help: '/help',
  about: '/about',
  contact: '/contact',
  login: '/login',
  otpVerify: '/otp-verify',
  setPin: '/set-pin',
  roleSelection: '/role-selection',
  accountRecover: '/account/recover',
  accountChangePhone: '/account/change-phone',
}

const noIndexPages: SeoPageKey[] = [
  'login',
  'otpVerify',
  'setPin',
  'roleSelection',
  'accountRecover',
  'accountChangePhone',
]

export async function getPageMetadata(
  pageKey: SeoPageKey,
  options: PageMetadataOptions = {}
): Promise<Metadata> {
  const locale = (await getLocale()) as AppLocale
  const t = await getTranslations({ locale, namespace: 'seo' })

  const title = options.title ?? t(`pages.${pageKey}.title`)
  const description = options.description ?? t(`pages.${pageKey}.description`)
  const keywordsRaw = t(`pages.${pageKey}.keywords`)
  const keywords =
    options.keywords ??
    (keywordsRaw &&
    keywordsRaw.length > 0 &&
    !keywordsRaw.startsWith('seo.pages')
      ? keywordsRaw
          .split(',')
          .map(k => k.trim())
          .filter(Boolean)
      : undefined)

  return buildMetadata({
    title,
    description,
    path: options.path ?? defaultPaths[pageKey] ?? '/',
    locale,
    noindex: options.noindex ?? noIndexPages.includes(pageKey),
    keywords,
    images: options.images,
  })
}

export async function getListingMetadata(property: {
  id: string
  name: string
  area: string
  city: string
  type: string
  rent: number
  description: string
  images: string[]
  verified: boolean
}): Promise<Metadata> {
  const locale = (await getLocale()) as AppLocale
  const t = await getTranslations({ locale, namespace: 'seo' })

  const title = t('listing.title', {
    name: property.name,
    area: property.area,
    city: property.city,
  })
  const description =
    property.description.length > 155
      ? `${property.description.slice(0, 152)}…`
      : property.description
  const priceLine = t('listing.priceLine', {
    rent: property.rent.toLocaleString(locale === 'bn' ? 'bn-BD' : 'en-BD'),
    type: property.type,
  })
  const fullDescription = `${priceLine}. ${description}`

  return buildMetadata({
    title,
    description: fullDescription,
    path: `/listings/${property.id}`,
    locale,
    keywords: [
      property.type,
      property.city,
      property.area,
      'rent Bangladesh',
      property.verified ? 'verified listing' : '',
    ].filter(Boolean),
    images: property.images[0]
      ? [{ url: property.images[0], alt: property.name }]
      : undefined,
  })
}

export async function getListingNotFoundMetadata(): Promise<Metadata> {
  return getPageMetadata('listingNotFound', { path: '/listings' })
}

/** Re-export for layouts — thin wrapper. */
export function createPageMetadata(
  pageKey: SeoPageKey,
  options?: PageMetadataOptions
) {
  return () => getPageMetadata(pageKey, options)
}
