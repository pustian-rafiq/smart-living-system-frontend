import type { ReactNode } from 'react'
import type { SeoPageKey } from './page-keys'
import { createPageMetadata } from './get-page-metadata'

/** Minimal pass-through layout with locale-aware metadata for a route segment. */
export function createSeoLayout(pageKey: SeoPageKey) {
  return function SeoLayout({ children }: { children: ReactNode }) {
    return children
  }
}

export { createPageMetadata }
