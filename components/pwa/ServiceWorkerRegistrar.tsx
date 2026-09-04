'use client'

import { useEffect } from 'react'

/** Always register the offline-capable service worker (push optional). */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return
    void navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  }, [])
  return null
}
