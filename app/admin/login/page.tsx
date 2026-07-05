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
  getAdminRoleForPhone,
  ADMIN_ROLE_LABELS,
} from '@/lib/admin/permissions'
import { isAdminSession, setAdminSession } from '@/utils/auth'
import { fetchAdminUsers } from '@/lib/api/admin'
import type { AdminUser } from '@/types/admin'

const MOCK_OTP = '123456'

function AdminLoginForm() {
  const t = useTranslations('admin.login')
  const tc = useTranslations('common')
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/admin'

  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])

  useEffect(() => {
    fetchAdminUsers().then(result => {
      if (result.ok) setAdminUsers(result.data)
    })
  }, [])

  useEffect(() => {
    if (isAdminSession()) {
      router.replace(next)
    }
  }, [router, next])

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.startsWith('880')) return digits.slice(0, 13)
    if (digits.startsWith('0')) return '880' + digits.slice(1, 11)
    return '880' + digits.slice(0, 10)
  }

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const normalized = formatPhone(phone)
    if (normalized.length !== 13) {
      setError(t('invalidPhone'))
      return
    }
    const adminRole = getAdminRoleForPhone(normalized)
    if (!adminRole) {
      setError(t('notRegistered'))
      return
    }
    setPhone(normalized)
    setStep('otp')
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (otp !== MOCK_OTP) {
      setError(t('invalidOtp'))
      return
    }

    setLoading(true)
    const adminRole = getAdminRoleForPhone(phone)!
    const adminUser = adminUsers.find(
      u => u.phone.replace(/\D/g, '') === phone
    )

    setAdminSession({
      phone,
      adminRole,
      adminId: adminUser?.id,
      name: adminUser?.name,
    })

    setTimeout(() => {
      setLoading(false)
      router.replace(next)
    }, 400)
  }

  const quickLogin = (demoPhone: string) => {
    const adminRole = getAdminRoleForPhone(demoPhone)!
    const adminUser = adminUsers.find(
      u => u.phone.replace(/\D/g, '') === demoPhone
    )
    setAdminSession({
      phone: demoPhone,
      adminRole,
      adminId: adminUser?.id,
      name: adminUser?.name,
    })
    router.replace(next)
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
              {step === 'phone' ? t('enterPhone') : t('verifyOtp')}
            </CardTitle>
            <CardDescription>
              {step === 'phone'
                ? t('phoneDesc')
                : t('otpDesc', { phone: displayPhone, otp: MOCK_OTP })}
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
                <Button type="submit" className="w-full">
                  {t('sendOtp')}
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
