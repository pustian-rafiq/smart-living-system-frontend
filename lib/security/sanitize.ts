/**
 * XSS mitigation helpers for user-generated content.
 * React text nodes are escaped by default; use these for URLs, plain text normalization,
 * and any future rich-text rendering.
 */

const CONTROL_CHARS = /[\0-\x08\x0B\x0C\x0E-\x1F\x7F]/g

/** Strip null bytes and control characters from display text. */
export function sanitizePlainText(text: string, maxLength?: number): string {
  let value = text.replace(CONTROL_CHARS, '')
  if (maxLength !== undefined && value.length > maxLength) {
    value = value.slice(0, maxLength)
  }
  return value
}

/** Allow only safe URL schemes for links and downloads. */
export function sanitizeUrl(
  url: string,
  base?: string
): string | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    const resolved =
      typeof window !== 'undefined'
        ? new URL(trimmed, base ?? window.location.origin)
        : new URL(trimmed, base ?? 'https://localhost')

    const allowed = new Set(['http:', 'https:', 'mailto:', 'tel:'])
    if (!allowed.has(resolved.protocol)) return null

    if (resolved.protocol === 'http:' || resolved.protocol === 'https:') {
      return resolved.href
    }

    return resolved.href
  } catch {
    return null
  }
}

/** Block javascript: and data: in href attributes. */
export function isSafeHref(href: string): boolean {
  return sanitizeUrl(href) !== null
}

/**
 * Escape HTML entities when building HTML strings outside React (e.g. download templates).
 * Prefer React children for UI.
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Safe blob/data URLs for in-app image previews only (not for navigation). */
export function isSafePreviewUrl(url: string): boolean {
  return (
    url.startsWith('blob:') ||
    url.startsWith('data:image/') ||
    sanitizeUrl(url) !== null
  )
}
