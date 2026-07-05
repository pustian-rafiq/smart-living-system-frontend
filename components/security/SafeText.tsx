'use client'

import { cn } from '@/lib/utils'
import { sanitizePlainText } from '@/lib/security/sanitize'

type SafeTextProps = {
  children: string
  /** Optional max length when rendering untrusted content */
  maxLength?: number
  as?: 'p' | 'span' | 'div'
  className?: string
}

/**
 * Renders user-generated plain text safely (React escapes by default;
 * this also strips control chars and optional truncation).
 */
export function SafeText({
  children,
  maxLength,
  as: Tag = 'p',
  className,
}: SafeTextProps) {
  const text = sanitizePlainText(children, maxLength)
  return (
    <Tag className={cn('whitespace-pre-wrap break-words', className)}>{text}</Tag>
  )
}
