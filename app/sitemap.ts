import type { MetadataRoute } from 'next'
import { getSitemapEntries } from '@/lib/seo/routes'

/** Refresh hourly so new listings get crawled without a redeploy. */
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemapEntries()
}
