'use client'

import { useState, useId } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface PhoneOtpFormProps {
  phoneLabel?: string
  otpLabel?: string
  submitLabel: string
  loading?: boolean
  error?: string | null
  onSubmit: (phone: string, otp: string) => void
  /** Called when user taps Send OTP. Return error string or optional dev OTP. */
  onSendOtp?: (
    phone: string,
  ) => Promise<{ error?: string; devOtp?: string } | void>
  requireOtp?: boolean
  defaultPhone?: string
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.startsWith('880')) return digits.slice(0, 13)
  if (digits.startsWith('0')) return '880' + digits.slice(1, 11)
  return '880' + digits.slice(0, 10)
}

export function PhoneOtpForm({
  phoneLabel = 'Phone number (+880)',
  otpLabel = 'Verification OTP',
  submitLabel,
  loading,
  error,
  onSubmit,
  onSendOtp,
  requireOtp = true,
  defaultPhone = '',
}: PhoneOtpFormProps) {
  const formId = useId()
  const phoneHintId = `${formId}-phone-hint`
  const otpHintId = `${formId}-otp-hint`
  const errorId = error ? `${formId}-error` : undefined

  const [phone, setPhone] = useState(defaultPhone)
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const displayPhone = phone
    ? `+${phone.slice(0, 3)} ${phone.slice(3)}`
    : ''

  const handleSendOtp = async () => {
    const normalized = formatPhone(phone)
    if (normalized.length !== 13) return
    setPhone(normalized)
    setLocalError(null)

    if (onSendOtp) {
      setSending(true)
      const result = await onSendOtp(normalized)
      setSending(false)
      if (result?.error) {
        setLocalError(result.error)
        return
      }
      if (result?.devOtp) {
        setOtp(result.devOtp)
      }
    }

    setOtpSent(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = formatPhone(phone)
    if (normalized.length !== 13) return
    if (requireOtp && otp.length !== 6) return
    onSubmit(normalized, otp)
  }

  const displayError = error || localError

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor={`${formId}-phone`}>{phoneLabel}</Label>
        <Input
          id={`${formId}-phone`}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+880 1712 345678"
          value={phone ? displayPhone : ''}
          onChange={e => {
            setPhone(formatPhone(e.target.value))
            setOtpSent(false)
            setLocalError(null)
          }}
          aria-describedby={phoneHintId}
          aria-invalid={displayError ? true : undefined}
          required
          disabled={loading || sending}
        />
        <p id={phoneHintId} className="text-xs text-muted-foreground">
          Bangladesh mobile number starting with +880
        </p>
      </div>

      {requireOtp && (
        <>
          {!otpSent ? (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleSendOtp}
              disabled={
                formatPhone(phone).length !== 13 || loading || sending
              }
              aria-describedby={phoneHintId}
            >
              {sending ? 'Sending…' : 'Send OTP'}
            </Button>
          ) : (
            <div className="space-y-2">
              <Label htmlFor={`${formId}-otp`}>{otpLabel}</Label>
              <Input
                id={`${formId}-otp`}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="6-digit code"
                value={otp}
                onChange={e =>
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                aria-describedby={[otpHintId, errorId].filter(Boolean).join(' ')}
                aria-invalid={displayError ? true : undefined}
                required
                disabled={loading}
              />
              <p id={otpHintId} className="text-xs text-muted-foreground">
                Enter the 6-digit code sent to your phone.
              </p>
            </div>
          )}
        </>
      )}

      {displayError && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {displayError}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={
          loading ||
          sending ||
          formatPhone(phone).length !== 13 ||
          (requireOtp && (!otpSent || otp.length !== 6))
        }
      >
        {loading ? 'Please wait…' : submitLabel}
      </Button>
    </form>
  )
}
