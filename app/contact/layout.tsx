import type { Metadata } from 'next'
import { createPageMetadata, createSeoLayout } from '@/lib/seo/segment-layout'

export const generateMetadata: () => Promise<Metadata> =
  createPageMetadata('contact')

export default createSeoLayout('contact')
