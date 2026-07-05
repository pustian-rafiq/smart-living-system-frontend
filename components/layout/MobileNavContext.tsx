'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { usePathname } from 'next/navigation'
import { getStoredRole, isLoggedIn } from '@/utils/auth'
import type { UserRole } from '@/types'
import { MobileNavDrawer } from './MobileNavDrawer'

interface MobileNavContextValue {
  isOpen: boolean
  openMenu: () => void
  closeMenu: () => void
  setIsOpen: (open: boolean) => void
}

const MobileNavContext = createContext<MobileNavContextValue | null>(null)

export function useMobileNav() {
  const context = useContext(MobileNavContext)
  if (!context) {
    throw new Error('useMobileNav must be used within MobileNavProvider')
  }
  return context
}

interface MobileNavProviderProps {
  children: ReactNode
  userRole?: UserRole
}

export function MobileNavProvider({
  children,
  userRole: userRoleProp,
}: MobileNavProviderProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>('renter')
  const [userName, setUserName] = useState('Guest')
  const [isVerified, setIsVerified] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setMounted(true)
    const logged = isLoggedIn()
    setLoggedIn(logged)
    const role = userRoleProp || getStoredRole() || 'renter'
    setUserRole(role)
    if (logged) {
      const phone = sessionStorage.getItem('loginPhone')
      if (phone) {
        setUserName('User ' + phone.slice(-4))
        setIsVerified(true)
      }
    }
  }, [userRoleProp])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const openMenu = useCallback(() => setIsOpen(true), [])
  const closeMenu = useCallback(() => setIsOpen(false), [])

  const value = useMemo(
    () => ({ isOpen, openMenu, closeMenu, setIsOpen }),
    [isOpen, openMenu, closeMenu]
  )

  return (
    <MobileNavContext.Provider value={value}>
      {children}
      {mounted && loggedIn && (
        <MobileNavDrawer
          open={isOpen}
          onOpenChange={setIsOpen}
          userRole={userRole}
          userName={userName}
          isVerified={isVerified}
        />
      )}
    </MobileNavContext.Provider>
  )
}
