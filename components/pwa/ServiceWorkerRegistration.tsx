'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'

    if (process.env.NODE_ENV !== 'production' && !isLocalhost) return

    navigator.serviceWorker
      .register('/sw.js')
      .catch(err => console.error('Service worker registration failed:', err))
  }, [])

  return null
}
