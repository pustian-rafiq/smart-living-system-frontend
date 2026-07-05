import type { Metadata } from 'next'
import { createPageMetadata, createSeoLayout } from '@/lib/seo/segment-layout'

export const generateMetadata: () => Promise<Metadata> =
  createPageMetadata('faq')

export default createSeoLayout('faq')
