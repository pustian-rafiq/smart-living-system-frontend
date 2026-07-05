'use client'

import { useCallback, useEffect, useState } from 'react'

export type OnboardingKey = 'owner' | 'mess' | 'hotel'

const STORAGE_PREFIX = 'sls_onboarding_'

function storageKey(key: OnboardingKey) {
  return `${STORAGE_PREFIX}${key}_done`
}

export function useOnboarding(key: OnboardingKey) {
  const [done, setDone] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(storageKey(key))
    setDone(stored === 'true')
  }, [key])

  const complete = useCallback(() => {
    localStorage.setItem(storageKey(key), 'true')
    setDone(true)
  }, [key])

  const reset = useCallback(() => {
    localStorage.removeItem(storageKey(key))
    setDone(false)
  }, [key])

  const shouldShow = mounted && !done

  return { shouldShow, complete, reset, done: mounted && done }
}
