/**
 * Shared paginated list types + query builder for server-driven tables.
 */

export type PaginatedData<T> = {
  results: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
  next: string | null
  previous: string | null
}

export type PageQuery = {
  page?: number
  pageSize?: number
  search?: string
  [key: string]: string | number | undefined
}

/** Minimum characters before search is sent to the API. */
export const SERVER_SEARCH_MIN_CHARS = 3

export function buildPageQuery(params: PageQuery): string {
  const qs = new URLSearchParams()
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 20
  qs.set('page', String(page))
  qs.set('page_size', String(pageSize))

  const search = (params.search || '').trim()
  if (search.length >= SERVER_SEARCH_MIN_CHARS) {
    qs.set('search', search)
  }

  for (const [key, value] of Object.entries(params)) {
    if (key === 'page' || key === 'pageSize' || key === 'search') continue
    if (value === undefined || value === '' || value === 'all') continue
    qs.set(key, String(value))
  }
  return qs.toString()
}

export function emptyPage<T>(page = 1, pageSize = 20): PaginatedData<T> {
  return {
    results: [],
    count: 0,
    page,
    pageSize,
    totalPages: 1,
    next: null,
    previous: null,
  }
}
