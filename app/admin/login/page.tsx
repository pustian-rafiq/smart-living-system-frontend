'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
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
import { Badge } from '@/components/ui/badge'
import { Shield, ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  DEMO_ADMIN_PHONES,
  ADMIN_ROLE_LABELS,
} from '@/lib/admin/permissions'
import { applyAuthSession, isAdminSession, hasCompleteSession } from '@/utils/auth'
import { hasAuthTokens } from '@/utils/auth-tokens'
import { loginWithPin, requestOtp, selectRole, startLogin, verifyOtp } from '@/lib/api/auth'
import type { AuthSession } from '@/lib/api/auth'
import type { ApiResult } from '@/lib/api/http'

function toE164(digitsOrE164: string): string {
  const digits = digitsOrE164.replace(/\D/g, '')
  return digits.startsWith('880') ? `+${digits}` : `+880${digits.replace(/^0/, '')}`
}

async function establishAdminSession(
  phoneE164: string,
  otp: string,
): Promise<ApiResult<AuthSession>> {
  const verified = await verifyOtp({ phone: phoneE164, otp, purpose: 'login' })
  if (!verified.ok) return verified

  let session = verified.data

  if (session.needsRoleSelection || !session.user.roleSelected) {
    const canBeAdmin =
      Boolean(session.adminRole) ||
      session.availableRoles.includes('admin')
    if (!canBeAdmin) {
      return {
        ok: false,
        error: 'This phone is not registered as a platform admin.',
        code: 'FORBIDDEN',
      }
    }
    const selected = await selectRole('admin')
    if (!selected.ok) return selected
    session = selected.data
  }

  if (session.user.role !== 'admin' || !session.adminRole) {
    return {
      ok: false,
      error: 'Admin access is not available for this account.',
      code: 'FORBIDDEN',
    }
  }

  applyAuthSession(session, { complete: !session.needsPinSetup })
  return { ok: true, data: session }
}

function AdminLoginForm() {
  const t = useTranslations('admin.login')
  const tc = useTranslations('common')
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/admin'

  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [pin, setPin] = useState('')
  const [step, setStep] = useState<'phone' | 'otp' | 'pin'>('phone')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [devHint, setDevHint] = useState<string | null>(null)

  useEffect(() => {
    if (isAdminSession() && hasAuthTokens() && hasCompleteSession()) {
      router.replace(next)
    }
  }, [router, next])

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.startsWith('880')) return digits.slice(0, 13)
    if (digits.startsWith('0')) return '880' + digits.slice(1, 11)
    return '880' + digits.slice(0, 10)
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setDevHint(null)
    const normalized = formatPhone(phone)
    if (normalized.length !== 13) {
      setError(t('invalidPhone'))
      return
    }
    setLoading(true)
    const result = await startLogin({ phone: toE164(normalized) })
    setLoading(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setPhone(normalized)
    if (result.data.next === 'pin') {
      setStep('pin')
      setPin('')
      return
    }
    if (result.data.devOtp) {
      setDevHint(result.data.devOtp)
      setOtp(result.data.devOtp)
    }
    setStep('otp')
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (otp.length !== 6) {
      setError(t('invalidOtp'))
      return
    }

    setLoading(true)
    const result = await establishAdminSession(toE164(phone), otp)
    setLoading(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    router.replace(result.data.needsPinSetup ? '/set-pin' : next)
  }

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (pin.length < 4) {
      setError(t('invalidOtp'))
      return
    }
    setLoading(true)
    const loggedIn = await loginWithPin({ phone: toE164(phone), pin })
    setLoading(false)
    if (!loggedIn.ok) {
      setError(loggedIn.error)
      setPin('')
      return
    }
    let session = loggedIn.data
    if (session.needsRoleSelection || session.user.role !== 'admin') {
      if (!session.availableRoles.includes('admin') && !session.adminRole) {
        setError('This phone is not registered as a platform admin.')
        return
      }
      const selected = await selectRole('admin')
      if (!selected.ok) {
        setError(selected.error)
        return
      }
      session = selected.data
    }
    if (session.user.role !== 'admin' || !session.adminRole) {
      setError('Admin access is not available for this account.')
      return
    }
    applyAuthSession(session, { complete: !session.needsPinSetup })
    router.replace(session.needsPinSetup ? '/set-pin' : next)
  }

  const quickLogin = async (demoPhone: string) => {
    setError('')
    setLoading(true)
    const e164 = toE164(demoPhone)

    const requested = await requestOtp({ phone: e164, purpose: 'login' })
    if (!requested.ok) {
      setLoading(false)
      setError(requested.error)
      return
    }

    const code = requested.data.devOtp || '123456'
    const result = await establishAdminSession(e164, code)
    setLoading(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    router.replace(result.data.needsPinSetup ? '/set-pin' : next)
  }

  const displayPhone = phone
    ? `+${phone.slice(0, 3)} ${phone.slice(3)}`
    : ''

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('platformStaff')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {step === 'phone'
                ? t('enterPhone')
                : step === 'pin'
                  ? t('enterPhone')
                  : t('verifyOtp')}
            </CardTitle>
            <CardDescription>
              {step === 'phone'
                ? t('phoneDesc')
                : step === 'pin'
                  ? displayPhone
                  : t('otpDesc', {
                      phone: displayPhone,
                      otp: devHint || '******',
                    })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-phone">{t('phoneLabel')}</Label>
                  <Input
                    id="admin-phone"
                    type="tel"
                    placeholder={t('phonePlaceholder')}
                    value={phone ? displayPhone : ''}
                    onChange={e => setPhone(formatPhone(e.target.value))}
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t('signingIn') : t('sendOtp')}
                </Button>
              </form>
            ) : step === 'pin' ? (
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-pin">PIN</Label>
                  <Input
                    id="admin-pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={pin}
                    onChange={e =>
                      setPin(e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || pin.length < 4}
                >
                  {loading ? t('signingIn') : t('signInAdmin')}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setStep('phone')
                    setPin('')
                    setError('')
                  }}
                >
                  {t('changeNumber')}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-otp">{t('otpLabel')}</Label>
                  <Input
                    id="admin-otp"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={e =>
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                    }
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? t('signingIn') : t('signInAdmin')}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setStep('phone')
                    setOtp('')
                    setError('')
                    setDevHint(null)
                  }}
                >
                  {t('changeNumber')}
                </Button>
              </form>
            )}

            <div className="border-t pt-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {t('demoQuickLogin')}
              </p>
              <div className="space-y-2">
                {Object.entries(DEMO_ADMIN_PHONES).map(([num, role]) => (
                  <Button
                    key={num}
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                    disabled={loading}
                    onClick={() => quickLogin(num)}
                  >
                    <span>
                      +{num.slice(0, 3)} {num.slice(3)}
                    </span>
                    <Badge variant="secondary">{ADMIN_ROLE_LABELS[role]}</Badge>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button asChild variant="ghost" className="w-full">
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToUserLogin')}
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  const tc = useTranslations('common')
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          {tc('loading')}
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}
