'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ApiResult } from '@/lib/api/http'

type State<T> = {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Loads mock-API data with loading/error state. Wrap `fetcher` in `useCallback` at the call site
 * when parameters change, or pass a stable reference.
 */
export function useMockQuery<T>(
  fetcher: () => Promise<ApiResult<T>>
): State<T> & {
  refetch: () => Promise<void>
} {
  const [state, setState] = useState<State<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const run = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const result = await fetcher()
      if (result.ok) {
        setState({ data: result.data, loading: false, error: null })
      } else {
        setState({ data: null, loading: false, error: result.error })
      }
    } catch (e) {
      setState({
        data: null,
        loading: false,
        error: e instanceof Error ? e.message : 'Something went wrong',
      })
    }
  }, [fetcher])

  useEffect(() => {
    void run()
  }, [run])

  return { ...state, refetch: run }
}
