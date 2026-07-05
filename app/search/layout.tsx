import type { Metadata } from 'next'
import { createPageMetadata, createSeoLayout } from '@/lib/seo/segment-layout'
import type { SeoPageKey } from '@/lib/seo/page-keys'

export const generateMetadata: () => Promise<Metadata> =
  createPageMetadata('search')

export default createSeoLayout('search')
