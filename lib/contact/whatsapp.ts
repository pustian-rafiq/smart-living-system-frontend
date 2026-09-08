/**
 * WhatsApp deep links for owner ↔ renter contact.
 *
 * Numbers are stored E.164 (+8801XXXXXXXXX) by the API; wa.me wants digits
 * only. Links are empty when no reachable number was saved, so callers can
 * hide the action instead of sending people to a dead chat.
 */

const BD_COUNTRY_CODE = '880'

/** Digits-only international number, or '' when the input is unusable. */
export function toWhatsAppDigits(raw?: string | null): string {
  const digits = (raw || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith(BD_COUNTRY_CODE)) return digits
  // Local Bangladesh formats: 01XXXXXXXXX and 1XXXXXXXXX
  if (digits.length === 11 && digits.startsWith('01')) {
    return `${BD_COUNTRY_CODE}${digits.slice(1)}`
  }
  if (digits.length === 10 && digits.startsWith('1')) {
    return `${BD_COUNTRY_CODE}${digits}`
  }
  return digits
}

export function hasWhatsApp(number?: string | null): boolean {
  return toWhatsAppDigits(number).length >= 10
}

/** wa.me link with an optional pre-filled message, or '' when unavailable. */
export function whatsappLink(
  number?: string | null,
  message?: string
): string {
  if (!hasWhatsApp(number)) return ''
  const digits = toWhatsAppDigits(number)
  const text = message?.trim()
  return text
    ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${digits}`
}
