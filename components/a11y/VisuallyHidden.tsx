import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Screen-reader-only text — visually hidden but accessible to assistive tech. */
export function VisuallyHidden({
  children,
  as: Tag = 'span',
  className,
}: {
  children: ReactNode
  as?: 'span' | 'p' | 'h2' | 'h3' | 'caption'
  className?: string
}) {
  return (
    <Tag className={cn('sr-only', className)}>
      {children}
    </Tag>
  )
}
