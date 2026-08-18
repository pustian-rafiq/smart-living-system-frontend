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
import { loginWithPin, requestOtp, startLogin } from '@/lib/api/auth'
import { applyAuthSession, nextPathAfterAuth } from '@/utils/auth'

export default function Login() {
  const router = useRouter()
  const t = useTranslations('auth.login')
  const tc = useTranslations('common')
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [step, setStep] = useState<'phone' | 'pin'>('phone')
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

  const goToOtp = (devOtp?: string) => {
    sessionStorage.setItem('loginPhone', phone)
    if (devOtp) {
      sessionStorage.setItem('devOtp', devOtp)
    } else {
      sessionStorage.removeItem('devOtp')
    }
    router.push('/otp-verify')
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (phone.length !== 13) {
      setError(t('invalidPhone'))
      return
    }

    setLoading(true)
    const result = await startLogin({ phone })
    setLoading(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    sessionStorage.setItem('loginPhone', phone)
    if (result.data.next === 'pin') {
      setStep('pin')
      setPin('')
      return
    }

    goToOtp(result.data.devOtp)
  }

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (pin.length < 4 || pin.length > 6) {
      setError(t('invalidPin'))
      return
    }

    setLoading(true)
    const result = await loginWithPin({ phone, pin })
    setLoading(false)

    if (!result.ok) {
      setError(result.error)
      setPin('')
      return
    }

    applyAuthSession(result.data)
    router.push(nextPathAfterAuth(result.data))
  }

  const handleForgotPin = async () => {
    setError('')
    setLoading(true)
    const result = await requestOtp({ phone, purpose: 'login' })
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    sessionStorage.setItem('pinReset', 'true')
    goToOtp(result.data.devOtp)
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
              {step === 'pin' ? t('pinSubtitle') : t('subtitle')}
            </CardDescription>
            {step === 'pin' && (
              <p className="text-sm font-medium text-foreground pt-2">
                {displayPhone}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
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
                  {loading ? tc('loading') : t('continue')}
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
                  <Link
                    href="/account/recover"
                    className="text-link hover:underline"
                  >
                    {t('forgotAccess')}
                  </Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handlePinSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pin">{t('pinLabel')}</Label>
                  <Input
                    id="pin"
                    type="password"
                    inputMode="numeric"
                    autoComplete="current-password"
                    maxLength={6}
                    value={pin}
                    onChange={e => {
                      setPin(e.target.value.replace(/\D/g, '').slice(0, 6))
                      setError('')
                    }}
                    placeholder={t('pinPlaceholder')}
                    className="text-center text-2xl tracking-[0.4em] h-14"
                    required
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={loading || pin.length < 4}
                  className="w-full text-base sm:text-lg h-12 sm:h-14"
                  size="lg"
                >
                  {loading ? tc('loading') : t('signIn')}
                </Button>

                <div className="flex flex-col items-center gap-2">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    disabled={loading}
                    onClick={handleForgotPin}
                  >
                    {t('forgotPin')}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStep('phone')
                      setPin('')
                      setError('')
                    }}
                  >
                    {t('changeNumber')}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {tc('copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </div>
  )
}
