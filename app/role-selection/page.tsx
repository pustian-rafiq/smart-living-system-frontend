'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language/LanguageProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { UserRole } from '@/types'

export default function RoleSelection() {
  const router = useRouter()
  const { t, language, toggle: toggleLang } = useLanguage()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(false)

  // Check if OTP is verified
  useEffect(() => {
    const isVerified =
      typeof window !== 'undefined' && sessionStorage.getItem('otpVerified') === 'true'
    if (!isVerified) {
      router.push('/otp-verify')
    }
  }, [router])

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleContinue = async () => {
    if (!selectedRole) return

    setLoading(true)

    // Simulate API call to save role
    setTimeout(() => {
      setLoading(false)
      // Store role in sessionStorage
      sessionStorage.setItem('userRole', selectedRole)
      sessionStorage.setItem('isLoggedIn', 'true')

      // Navigate to dashboard
      router.push('/dashboard')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
          {/* Language Toggle */}
          <div className="flex justify-end mb-4">
            <Button onClick={toggleLang} variant="outline" size="sm">
              {language === 'bn' ? 'English' : 'বাংলা'}
            </Button>
          </div>

          {/* Role Selection Card */}
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl">
                {t.role.title}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {t.role.subtitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Role Options */}
              <div className="space-y-4">
                {/* Student/Renter Option */}
                <button
                  onClick={() => handleRoleSelect('renter')}
                  className={`w-full p-4 sm:p-6 rounded-xl border-2 transition-all text-left ${
                    selectedRole === 'renter'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                        selectedRole === 'renter'
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground/50'
                      }`}
                    >
                      {selectedRole === 'renter' && (
                        <Check className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold mb-1">
                        {t.role.student}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        {t.role.studentDesc}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Owner/Manager Option */}
                <button
                  onClick={() => handleRoleSelect('owner')}
                  className={`w-full p-4 sm:p-6 rounded-xl border-2 transition-all text-left ${
                    selectedRole === 'owner'
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                        selectedRole === 'owner'
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground/50'
                      }`}
                    >
                      {selectedRole === 'owner' && (
                        <Check className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold mb-1">
                        {t.role.owner}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        {t.role.ownerDesc}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleContinue}
                disabled={!selectedRole || loading}
                className="w-full h-12 sm:h-14 text-base sm:text-lg"
                size="lg"
              >
                {loading ? t.common.loading : t.role.continue}
              </Button>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
