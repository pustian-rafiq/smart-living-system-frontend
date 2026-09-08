/**
 * SEO-friendly URLs for public detail pages.
 *
 * Public paths are `/<base>/<slug>-<uuid>`: the UUID keeps lookups and old
 * links working, the slug carries the keywords search engines and people read.
 */

const UUID_TAIL = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i
const UUID_ONLY = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const MAX_SLUG_LENGTH = 70

export function slugify(input: string): string {
  return (input || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, '')
}

/** True when the value is a bare entity id with no slug in front of it. */
export function isEntityId(value: string): boolean {
  return UUID_ONLY.test(value)
}

/** Pull the entity id out of a `<slug>-<uuid>` route param. */
export function extractEntityId(param: string | string[] | undefined): string {
  const raw = Array.isArray(param) ? param[0] : param
  if (!raw) return ''
  let decoded = raw
  try {
    decoded = decodeURIComponent(raw)
  } catch {
    /* malformed escape — use the raw value */
  }
  const match = decoded.match(UUID_TAIL)
  return match ? match[1] : decoded
}

function entityPath(base: string, id: string, parts: (string | undefined | null)[]): string {
  // Non-UUID ids (mock/demo data) can't be split back out of a slug.
  if (!UUID_ONLY.test(id)) return `${base}/${id}`
  const slug = slugify(parts.filter(Boolean).join(' '))
  return slug ? `${base}/${slug}-${id}` : `${base}/${id}`
}

export function listingPath(property: {
  id: string
  name?: string
  area?: string
  city?: string
}): string {
  return entityPath('/listings', property.id, [
    property.name,
    property.area,
    property.city,
  ])
}

export function hotelPath(hotel: {
  id: string
  name?: string
  area?: string
  city?: string
}): string {
  return entityPath('/hotels', hotel.id, [hotel.name, hotel.area, hotel.city])
}

export function messPath(mess: {
  id: string
  name?: string
  city?: string
}): string {
  return entityPath('/messes', mess.id, [mess.name, mess.city])
}
