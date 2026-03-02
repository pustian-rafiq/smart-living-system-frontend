'use client'

import { ReactNode, useEffect, useState } from 'react'
import { AppHeader } from './AppHeader'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { BottomNavigation } from './BottomNavigation'
import { getStoredRole, isLoggedIn } from '@/utils/auth'
import { UserRole } from '@/types'

interface LayoutProps {
  children: ReactNode
  userRole?: UserRole
}

export const Layout = ({ children, userRole }: LayoutProps) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('renter')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get role from props or sessionStorage
    const storedRole = userRole || getStoredRole()
    if (storedRole) {
      setCurrentRole(storedRole)
    }
  }, [userRole])

  const isUserLoggedIn = mounted && isLoggedIn()

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-200">
      <AppHeader />
      {/* Desktop Navigation */}
      {isUserLoggedIn && (
        <div className="hidden md:block">
          <Navbar userRole={currentRole} />
        </div>
      )}
      <main className="flex-grow pb-16 md:pb-0">
        {children}
      </main>
      {/* Desktop Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>
      {/* Mobile Bottom Navigation */}
      {isUserLoggedIn && (
        <div className="md:hidden">
          <BottomNavigation userRole={currentRole} />
        </div>
      )}
    </div>
  )
}
