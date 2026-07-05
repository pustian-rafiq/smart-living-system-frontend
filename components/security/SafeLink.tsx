'use client'

import Link from 'next/link'
import { isSafeHref, sanitizeUrl } from '@/lib/security/sanitize'
import { cn } from '@/lib/utils'

type SafeLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
  external?: boolean
}

/** Renders a link only when href uses an allowed scheme. */
export function SafeLink({ href, children, className, external }: SafeLinkProps) {
  const safe = sanitizeUrl(href)

  if (!safe || !isSafeHref(href)) {
    return <span className={className}>{children}</span>
  }

  if (external || safe.startsWith('http')) {
    return (
      <a
        href={safe}
        className={cn(className)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={safe} className={cn(className)}>
      {children}
    </Link>
  )
}
