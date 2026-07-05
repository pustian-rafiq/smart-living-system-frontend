'use client'

import { useCallback, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  validateFile,
  type FileUploadPreset,
  type FileValidationResult,
} from '@/lib/security/file-upload'

export function useFileValidation(preset: FileUploadPreset) {
  const t = useTranslations('security.file')
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const validate = useCallback(
    (file: File | null | undefined): FileValidationResult => {
      if (!file) {
        const result = {
          valid: false as const,
          errorKey: 'fileRequired',
        }
        setError(t('fileRequired'))
        return result
      }

      const result = validateFile(file, preset)
      if (!result.valid) {
        setError(
          t(result.errorKey, result.errorParams as Record<string, string>)
        )
      } else {
        setError(null)
      }
      return result
    },
    [preset, t]
  )

  return { validate, error, clearError, setError }
}
