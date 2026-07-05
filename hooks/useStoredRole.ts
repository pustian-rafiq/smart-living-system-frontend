'use client'

import { useEffect, useState } from 'react'
import { getStoredRole } from '@/utils/auth'
import type { UserRole } from '@/types'

/**
 * Reads role from sessionStorage only after mount so SSR and the first
 * client render match (avoids hydration errors from role-specific UI).
 */
export function useStoredRole(defaultRole: UserRole = 'renter') {
  const [role, setRole] = useState<UserRole>(defaultRole)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setRole(getStoredRole() || defaultRole)
    setReady(true)
  }, [defaultRole])

  return {
    role,
    ready,
    isOwner: role === 'owner',
    isRenter: role === 'renter',
    isAdmin: role === 'admin',
  }
}
