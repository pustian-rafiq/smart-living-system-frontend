'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language/LanguageProvider'
import { useTheme } from '@/components/theme/ThemeProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Login() {
  const router = useRouter()
  const { t, language, toggle: toggleLang } = useLanguage()
  const { theme } = useTheme()
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // If starts with 880, keep it
    if (digits.startsWith('880')) {
      return digits.slice(0, 13) // Max 13 digits (880 + 10 digits)
    }
    // If starts with 0, add 880 prefix
    if (digits.startsWith('0')) {
      return '880' + digits.slice(1, 11) // 880 + 10 digits
    }
    // Otherwise, add 880 prefix
    return '880' + digits.slice(0, 10)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate phone number (should be 880 + 10 digits = 13 digits)
    if (phone.length !== 13) {
      setError(language === 'bn' ? 'অবৈধ ফোন নম্বর' : 'Invalid phone number')
      return
    }

    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      // Store phone in sessionStorage for OTP page
      sessionStorage.setItem('loginPhone', phone)
      router.push('/otp-verify')
    }, 1000)
  }

  const displayPhone = phone ? `+${phone.slice(0, 3)} ${phone.slice(3)}` : ''

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
          {/* Language Toggle */}
          <div className="flex justify-end mb-4">
            <Button
              onClick={toggleLang}
              variant="outline"
              size="sm"
            >
              {language === 'bn' ? 'English' : 'বাংলা'}
            </Button>
          </div>

        {/* Login Card */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl">
              {t.login.title}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {t.login.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Input */}
              <div className="space-y-2">
                <Label htmlFor="phone">{t.login.phoneLabel}</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-muted-foreground text-lg font-medium">
                      +880
                    </span>
                  </div>
                  <Input
                    type="tel"
                    id="phone"
                    value={displayPhone}
                    onChange={handlePhoneChange}
                    placeholder={t.login.phonePlaceholder}
                    className="pl-20 text-base sm:text-lg"
                    maxLength={17}
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              {/* Send OTP Button */}
              <Button
                type="submit"
                disabled={loading || phone.length !== 13}
                className="w-full text-base sm:text-lg h-12 sm:h-14"
                size="lg"
              >
                {loading ? t.common.loading : t.login.sendOtp}
              </Button>

              {/* Terms & Conditions */}
              <p className="text-xs sm:text-sm text-center text-muted-foreground">
                {t.login.terms}{' '}
                <a
                  href="/terms"
                  className="text-primary hover:underline"
                >
                  {t.login.termsLink}
                </a>{' '}
                {t.login.and}{' '}
                <a
                  href="/privacy"
                  className="text-primary hover:underline"
                >
                  {t.login.privacyLink}
                </a>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2024 Smart Living Ecosystem
        </p>
      </div>
    </div>
  )
}
