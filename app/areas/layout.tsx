import type { Metadata } from 'next'
import { createPageMetadata, createSeoLayout } from '@/lib/seo/segment-layout'

export const generateMetadata: () => Promise<Metadata> =
  createPageMetadata('areasSeo')

export default createSeoLayout('areasSeo')
