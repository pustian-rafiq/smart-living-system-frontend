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
import { recoverAccount, requestRecoverOtp } from '@/lib/api/account'
import { applyAuthSession, nextPathAfterAuth } from '@/utils/auth'
import { KeyRound, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function AccountRecoverPage() {
  const router = useRouter()
  const t = useTranslations('account')
  const ta = useTranslations('auth.otp')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handleSendOtp = async (phone: string) => {
    const result = await requestRecoverOtp({ phone })
    if (!result.ok) return { error: result.error }
    return { devOtp: result.data.devOtp }
  }

  const handleSubmit = async (phone: string, otp: string) => {
    setLoading(true)
    setError(null)
    const result = await recoverAccount({ phone, otp })
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    applyAuthSession(result.data)
    setDone(true)
    const next = nextPathAfterAuth(result.data)
    setTimeout(() => router.push(next), 1200)
  }

  return (
    <Layout>
      <PageContainer className="max-w-lg">
        <PageHeader
          title={t('recover.title')}
          description={t('recover.description')}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="h-5 w-5" />
              {t('recover.cardTitle')}
            </CardTitle>
            <CardDescription>{t('recover.cardDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {done ? (
              <div className="py-6 text-center text-sm text-emerald-600">
                {t('recover.success')}
              </div>
            ) : (
              <PhoneOtpForm
                phoneLabel={t('recover.phoneLabel')}
                otpLabel={ta('hint')}
                submitLabel={t('recover.submit')}
                loading={loading}
                error={error}
                onSendOtp={handleSendOtp}
                onSubmit={handleSubmit}
              />
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-col gap-2 text-center text-sm">
          <Button asChild variant="ghost">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('recover.backToLogin')}
            </Link>
          </Button>
          <p className="text-muted-foreground">
            {t('recover.lostAccess')}{' '}
            <Link href="/contact" className="text-primary underline">
              {t('recover.contactSupport')}
            </Link>
          </p>
        </div>
      </PageContainer>
    </Layout>
  )
}
