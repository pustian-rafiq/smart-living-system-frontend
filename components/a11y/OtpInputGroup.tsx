'use client'

import { useId, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface OtpInputGroupProps {
  value: string[]
  onChange: (next: string[]) => void
  onComplete?: (otp: string) => void
  length?: number
  disabled?: boolean
  error?: string
  label?: string
  hint?: string
  autoFocus?: boolean
  className?: string
}

export function OtpInputGroup({
  value,
  onChange,
  onComplete,
  length = 6,
  disabled,
  error,
  label = 'One-time password',
  hint,
  autoFocus = true,
  className,
}: OtpInputGroupProps) {
  const groupId = useId()
  const labelId = `${groupId}-label`
  const hintId = hint ? `${groupId}-hint` : undefined
  const errorId = error ? `${groupId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const digits = value.length === length ? value : Array.from({ length }, (_, i) => value[i] ?? '')

  const commit = (next: string[]) => {
    onChange(next)
    if (next.every(d => d !== '') && next.join('').length === length) {
      onComplete?.(next.join(''))
    }
  }

  const handleChange = (index: number, raw: string) => {
    if (raw.length > 1) {
      const pasted = raw.replace(/\D/g, '').slice(0, length).split('')
      const next = [...digits]
      pasted.forEach((digit, i) => {
        if (index + i < length) next[index + i] = digit
      })
      commit(next)
      const focusIndex = Math.min(index + pasted.length, length - 1)
      inputRefs.current[focusIndex]?.focus()
      return
    }

    const digit = raw.replace(/\D/g, '')
    const next = [...digits]
    next[index] = digit
    commit(next)
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label id={labelId} className="sr-only">
        {label}
      </Label>
      {hint ? (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      <div
        role="group"
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className="flex justify-center gap-2 sm:gap-3"
      >
        {digits.map((digit, index) => (
          <Input
            key={index}
            ref={el => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={`${label}, digit ${index + 1} of ${length}`}
            maxLength={length}
            value={digit}
            disabled={disabled}
            autoFocus={autoFocus && index === 0}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            className="h-12 w-12 text-center text-xl font-bold sm:h-14 sm:w-14 sm:text-2xl"
          />
        ))}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-center text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
