// Keys mapped to locales seo.json pages.*
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
  'setPin',
  'roleSelection',
  'accountRecover',
  'accountChangePhone',
  'listingNotFound',
  'roommates',
  'areaCompare',
  'universities',
  'areasSeo',
] as const

export type SeoPageKey = (typeof seoPageKeys)[number]
