/** Keys mapped to `locales/*/seo.json` → `pages.*` */
export const seoPageKeys = [
  'home',
  'search',
  'properties',
  'hotels',
  'compare',
  'terms',
  'privacy',
  'safety',
  'faq',
  'help',
  'about',
  'contact',
  'login',
  'otpVerify',
  'roleSelection',
  'accountRecover',
  'accountChangePhone',
  'listingNotFound',
] as const

export type SeoPageKey = (typeof seoPageKeys)[number]
