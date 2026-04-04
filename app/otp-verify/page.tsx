'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language/LanguageProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

export default function OTPVerify() {
  const router = useRouter()
  const { t, language, toggle: toggleLang } = useLanguage()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Get phone from sessionStorage
  const phone =
    typeof window !== 'undefined' ? sessionStorage.getItem('loginPhone') : null

  // Mock OTP for auto-read (in real app, this would come from SMS)
  const mockOtp = '123456'
  const [hasAutoRead, setHasAutoRead] = useState(false)

  // Auto-read OTP simulation
  useEffect(() => {
    // Simulate auto-reading OTP after 2 seconds (only once)
    if (!hasAutoRead) {
      const timer = setTimeout(() => {
        const otpArray = mockOtp.split('')
        setOtp(otpArray)
        setHasAutoRead(true)
        // Auto-focus last input
        setTimeout(() => {
          inputRefs.current[5]?.focus()
        }, 100)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [hasAutoRead])

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('')
      const newOtp = [...otp]
      pastedOtp.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit.replace(/\D/g, '')
        }
      })
      setOtp(newOtp)
      // Focus next empty input or last input
      const nextIndex = Math.min(index + pastedOtp.length, 5)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    // Single digit input
    const digit = value.replace(/\D/g, '')
    if (digit) {
      const newOtp = [...otp]
      newOtp[index] = digit
      setOtp(newOtp)

      // Move to next input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    } else {
      // Backspace - clear current and move to previous
      const newOtp = [...otp]
      newOtp[index] = ''
      setOtp(newOtp)
      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
    setError('')
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const otpString = otp.join('')

    if (otpString.length !== 6) {
      setError(
        language === 'bn' ? 'সম্পূর্ণ OTP লিখুন' : 'Please enter complete OTP'
      )
      return
    }

    setLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      if (otpString === mockOtp) {
        // Store verified status
        sessionStorage.setItem('otpVerified', 'true')
        router.push('/role-selection')
      } else {
        setError(language === 'bn' ? 'ভুল OTP' : 'Invalid OTP')
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    }, 1000)
  }

  const handleResend = () => {
    setTimer(60)
    setCanResend(false)
    setOtp(['', '', '', '', '', ''])
    setError('')
    inputRefs.current[0]?.focus()
    // In real app, trigger resend OTP API call
  }

  const handleChangeNumber = () => {
    sessionStorage.removeItem('loginPhone')
    router.push('/login')
  }

  useEffect(() => {
    if (!phone) {
      router.push('/login')
    }
  }, [phone, router])

  if (!phone) {
    return null
  }

  const displayPhone = `+${phone.slice(0, 3)} ${phone.slice(3)}`

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <Button onClick={toggleLang} variant="outline" size="sm">
            {language === 'bn' ? 'English' : 'বাংলা'}
          </Button>
        </div>

        {/* OTP Card */}
        <Card className="w-full">
          <CardHeader>
            {/* Back Button */}
            <Button
              onClick={() => router.back()}
              variant="ghost"
              size="sm"
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.common.back}
            </Button>
            <CardTitle className="text-2xl sm:text-3xl text-center">
              {t.otp.title}
            </CardTitle>
            <CardDescription className="text-center">
              {t.otp.subtitle}
            </CardDescription>
            <p className="text-sm font-medium text-primary text-center">
              {displayPhone}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OTP Inputs */}
            <div className="space-y-4">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={el => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold"
                  />
                ))}
              </div>
              {error && (
                <p className="text-sm text-center text-destructive">{error}</p>
              )}
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              disabled={loading || otp.join('').length !== 6}
              className="w-full h-12 sm:h-14 text-base sm:text-lg"
              size="lg"
            >
              {loading ? t.common.loading : t.otp.verify}
            </Button>

            {/* Resend OTP */}
            <div className="text-center space-y-2">
              {!canResend ? (
                <p className="text-sm text-muted-foreground">
                  {t.otp.resendIn} {timer} {t.otp.seconds}
                </p>
              ) : (
                <Button onClick={handleResend} variant="link" size="sm">
                  {t.otp.resend}
                </Button>
              )}
              <div className="pt-2">
                <Button onClick={handleChangeNumber} variant="ghost" size="sm">
                  {t.otp.changeNumber}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
