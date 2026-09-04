'use client'

import { useEffect } from 'react'
import { isLoggedIn } from '@/utils/auth'
import { registerWebPush } from '@/lib/push/register'

/** Registers the service worker and Web Push subscription for logged-in users. */
export function PushRegistrar() {
  useEffect(() => {
    if (!isLoggedIn()) return
    if (typeof window === 'undefined') return
    void registerWebPush()
  }, [])
  return null
}
