'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ApiResult } from '@/lib/api/http'
import {
  SERVER_SEARCH_MIN_CHARS,
  emptyPage,
  type PaginatedData,
} from '@/lib/api/paging'

export type ServerPagedFetcher<T> = (params: {
  page: number
  pageSize: number
  search: string
  filters: Record<string, string>
}) => Promise<ApiResult<PaginatedData<T>>>

type Options<T> = {
  fetcher: ServerPagedFetcher<T>
  pageSize?: number
  minSearchChars?: number
  debounceMs?: number
  /** Extra server filters (role, status, …). Changing them resets to page 1. */
  filters?: Record<string, string>
  enabled?: boolean
}

export function useServerPagedList<T>({
  fetcher,
  pageSize: initialPageSize = 20,
  minSearchChars = SERVER_SEARCH_MIN_CHARS,
  debounceMs = 350,
  filters = {},
  enabled = true,
}: Options<T>) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [data, setData] = useState<PaginatedData<T>>(emptyPage(1, initialPageSize))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestId = useRef(0)

  const filterKey = useMemo(() => JSON.stringify(filters), [filters])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const trimmed = searchInput.trim()
      setDebouncedSearch(trimmed.length >= minSearchChars ? trimmed : '')
      setPage(1)
    }, debounceMs)
    return () => window.clearTimeout(handle)
  }, [searchInput, debounceMs, minSearchChars])

  useEffect(() => {
    setPage(1)
  }, [filterKey])

  const load = useCallback(async () => {
    if (!enabled) return
    const id = ++requestId.current
    setLoading(true)
    setError(null)
    const result = await fetcher({
      page,
      pageSize,
      search: debouncedSearch,
      filters,
    })
    if (id !== requestId.current) return
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setData(result.data)
  }, [enabled, fetcher, page, pageSize, debouncedSearch, filters])

  useEffect(() => {
    void load()
  }, [load])

  const updateItem = useCallback((matcher: (item: T) => boolean, next: T) => {
    setData(prev => ({
      ...prev,
      results: prev.results.map(item => (matcher(item) ? next : item)),
    }))
  }, [])

  const removeItem = useCallback((matcher: (item: T) => boolean) => {
    setData(prev => ({
      ...prev,
      results: prev.results.filter(item => !matcher(item)),
      count: Math.max(0, prev.count - 1),
    }))
  }, [])

  const searchActive = debouncedSearch.length >= minSearchChars
  const searchPending =
    searchInput.trim().length > 0 &&
    searchInput.trim().length < minSearchChars

  return {
    items: data.results,
    count: data.count,
    page: data.page,
    pageSize: data.pageSize,
    totalPages: data.totalPages,
    loading,
    error,
    searchInput,
    setSearchInput,
    searchActive,
    searchPending,
    minSearchChars,
    setPage,
    setPageSize: (size: number) => {
      setPageSize(size)
      setPage(1)
    },
    refetch: load,
    updateItem,
    removeItem,
  }
}
