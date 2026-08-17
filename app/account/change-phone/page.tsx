'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { PageContainer, PageHeader } from '@/components/page'
import { PhoneOtpForm } from '@/components/auth/PhoneOtpForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  requestPhoneChange,
  requestPhoneChangeOtp,
} from '@/lib/api/account'
import { getLoginPhone, syncUserDisplay } from '@/utils/auth'
import { Phone, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ChangePhonePage() {
  const router = useRouter()
  const t = useTranslations('account')
  const ta = useTranslations('auth.otp')
  const [currentPhone, setCurrentPhone] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setCurrentPhone(getLoginPhone())
  }, [])

  const displayCurrent = currentPhone
    ? `+${currentPhone.slice(0, 3)} ${currentPhone.slice(3)}`
    : '—'

  const handleSendOtp = async (phone: string) => {
    const result = await requestPhoneChangeOtp({ newPhone: phone })
    if (!result.ok) return { error: result.error }
    return { devOtp: result.data.devOtp }
  }

  const handleSubmit = async (phone: string, otp: string) => {
    setLoading(true)
    setError(null)
    const result = await requestPhoneChange({ newPhone: phone, otp })
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    syncUserDisplay(result.data.user)
    setDone(true)
    setCurrentPhone(result.data.phoneDigits)
  }

  return (
    <Layout>
      <PageContainer className="max-w-lg">
        <PageHeader
          title={t('changePhone.title')}
          description={t('changePhone.description')}
        />

        <Card className="mb-4 border-dashed">
          <CardContent className="flex items-center gap-3 p-4 text-sm">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">{t('changePhone.currentNumber')}</p>
              <p className="font-medium">{displayCurrent}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('changePhone.newPhoneTitle')}</CardTitle>
            <CardDescription>{t('changePhone.newPhoneDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {done ? (
              <div className="space-y-4 py-4 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                <p className="font-medium">{t('changePhone.successTitle')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('changePhone.successDetail')}
                </p>
                <Button onClick={() => router.push('/profile')}>
                  {t('changePhone.backToProfile')}
                </Button>
              </div>
            ) : (
              <PhoneOtpForm
                phoneLabel={t('changePhone.phoneLabel')}
                otpLabel={ta('hint')}
                submitLabel={t('changePhone.confirmSubmit')}
                loading={loading}
                error={error}
                onSendOtp={handleSendOtp}
                onSubmit={handleSubmit}
              />
            )}
          </CardContent>
        </Card>

        <Button asChild variant="ghost" className="mt-6 w-full">
          <Link href="/profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('changePhone.backToProfile')}
          </Link>
        </Button>
      </PageContainer>
    </Layout>
  )
}
