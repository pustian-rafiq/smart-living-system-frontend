'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Login() {
  const router = useRouter()
  const t = useTranslations('auth.login')
  const tc = useTranslations('common')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.startsWith('880')) {
      return digits.slice(0, 13)
    }
    if (digits.startsWith('0')) {
      return '880' + digits.slice(1, 11)
    }
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

    if (phone.length !== 13) {
      setError(t('invalidPhone'))
      return
    }

    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      sessionStorage.setItem('loginPhone', phone)
      router.push('/otp-verify')
    }, 1000)
  }

  const displayPhone = phone ? `+${phone.slice(0, 3)} ${phone.slice(3)}` : ''

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl">{t('title')}</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {t('subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('phoneLabel')}</Label>
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
                    placeholder={t('phonePlaceholder')}
                    className="pl-20 text-base sm:text-lg"
                    maxLength={17}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading || phone.length !== 13}
                className="w-full text-base sm:text-lg h-12 sm:h-14"
                size="lg"
              >
                {loading ? tc('loading') : t('sendOtp')}
              </Button>

              <p className="text-xs sm:text-sm text-center text-muted-foreground">
                {t('terms')}{' '}
                <Link href="/terms" className="text-link hover:underline">
                  {t('termsLink')}
                </Link>{' '}
                {t('and')}{' '}
                <Link href="/privacy" className="text-link hover:underline">
                  {t('privacyLink')}
                </Link>
              </p>
              <p className="text-center text-xs text-muted-foreground">
                <Link href="/account/recover" className="text-link hover:underline">
                  {t('forgotAccess')}
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {tc('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  )
}
