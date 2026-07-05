'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Phone } from 'lucide-react'
import { getStoredRole, isAdminSession } from '@/utils/auth'
import { fetchRenters } from '@/lib/api/buildings'
import { getDemoUserId } from '@/lib/api/demoUser'
import { useMockQuery } from '@/hooks/useMockQuery'
import { RenterDashboard } from '@/components/dashboard/RenterDashboard'
import { OwnerDashboard } from '@/components/dashboard/OwnerDashboard'
import { AdminDashboard } from '@/components/dashboard/AdminDashboard'
import type { UserRole } from '@/types'

function Icon({
  path,
  className = 'h-6 w-6',
}: {
  path: string
  className?: string
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

function VerificationBadge({ label }: { label: string }) {
  return (
    <Badge
      variant="outline"
      className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
    >
      <Check className="h-3.5 w-3.5 mr-1" />
      {label}
    </Badge>
  )
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const td = useTranslations('dashboard')
  const [role, setRole] = useState<UserRole>('renter')
  const [name, setName] = useState('Rahim')
  const [phone, setPhone] = useState('+8801712345678')
  const [email, setEmail] = useState('rahim@example.com')

  // Renter controls
  const [city, setCity] = useState('Dhaka')
  const [area, setArea] = useState('Mirpur')
  const [search, setSearch] = useState('')

  const currentUserId = getDemoUserId(role)
  const loadRenters = useCallback(() => fetchRenters(), [])
  const { data: renters } = useMockQuery(loadRenters)
  const currentRenter = renters?.find(r => r.id === currentUserId)

  useEffect(() => {
    const loggedIn =
      typeof window !== 'undefined' &&
      sessionStorage.getItem('isLoggedIn') === 'true'
    if (!loggedIn) {
      router.replace('/login')
      return
    }

    const storedRole = sessionStorage.getItem('userRole') as UserRole | null
    if (storedRole === 'admin') {
      if (isAdminSession()) {
        router.replace('/admin')
        return
      }
      router.replace('/admin/login')
      return
    }
    if (storedRole) setRole(storedRole)

    const storedPhone = sessionStorage.getItem('loginPhone')
    if (storedPhone) {
      setPhone(storedPhone)
      setName('User ' + storedPhone.slice(-4))
    }

    // Load renter data if available
    if (currentRenter) {
      setName(currentRenter.name)
      setPhone(currentRenter.phone)
      if (currentRenter.email) setEmail(currentRenter.email)
    }
  }, [router, currentRenter])

  const areasByCity: Record<string, string[]> = useMemo(
    () => ({
      Dhaka: ['Mirpur', 'Uttara', 'Dhanmondi', 'Mohammadpur', 'Bashundhara'],
      Chattogram: ['Pahartali', 'Panchlaish', 'Halishahar', 'Agrabad'],
      Sylhet: ['Zindabazar', 'Amberkhana', 'Shibgonj'],
      Khulna: ['Sonadanga', 'Khalishpur', 'Daulatpur'],
    }),
    []
  )

  useEffect(() => {
    const list = areasByCity[city] || []
    if (!list.includes(area)) setArea(list[0] || '')
  }, [city, area, areasByCity])

  return (
    <Layout userRole={role}>
      <div className="relative min-h-screen pb-20 md:pb-6">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 mt-4 md:mb-8 md:mt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                {role === 'renter' ? (
                  <Avatar className="h-14 w-14 md:h-16 md:w-16 border-2 border-primary/20">
                    <AvatarImage src={undefined} alt={name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl md:text-2xl font-bold">
                      {name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 border border-border flex items-center justify-center md:h-16 md:w-16">
                    <Icon
                      path="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
                      className="h-6 w-6 md:h-7 md:w-7"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground md:text-base">
                    {td('welcomeBack')}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <h1 className="truncate text-xl font-bold md:text-2xl lg:text-3xl">
                      {name}
                    </h1>
                    <VerificationBadge label={td('verified')} />
                  </div>
                  {role === 'renter' && phone && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {phone}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="md:size-default"
                >
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    {td('profile')}
                  </Link>
                </Button>
                {role === 'renter' && (
                  <div className="hidden md:flex gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/search">
                        <Icon
                          path="M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.35-4.35"
                          className="h-4 w-4 mr-2"
                        />
                        {td('search')}
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/bills">
                        <Icon
                          path="M9 14l2 2 4-4M7 3h10a2 2 0 012 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 012-2z"
                          className="h-4 w-4 mr-2"
                        />
                        {td('bills')}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Role-based Dashboard */}
          {role === 'renter' && (
            <RenterDashboard
              renterId={currentUserId}
              name={name}
              phone={phone}
              email={email}
              city={city}
              area={area}
              search={search}
              onCityChange={setCity}
              onAreaChange={setArea}
              onSearchChange={setSearch}
              areasByCity={areasByCity}
            />
          )}

          {role === 'owner' && <OwnerDashboard ownerId={currentUserId} />}

          {role === 'admin' && <AdminDashboard adminId={currentUserId} />}
        </div>
      </div>
    </Layout>
  )
}
