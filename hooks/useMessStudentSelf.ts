'use client'

import { useCallback, useMemo } from 'react'
import { getCurrentAccountUserId } from '@/lib/api/account'
import { fetchMessStudents } from '@/lib/api/mess'
import { useMockQuery } from '@/hooks/useMockQuery'
import type { Student } from '@/types/mess'

/**
 * The signed-in renter's own mess record.
 *
 * Matches strictly on the account id: a boarder whose record was added by the
 * owner but never linked to an account has no record here, and must never be
 * shown someone else's.
 */
export function useMessStudentSelf(): {
  student: Student | undefined
  loading: boolean
} {
  const userId = getCurrentAccountUserId()
  const loadStudents = useCallback(() => fetchMessStudents(), [])
  const { data: students, loading } = useMockQuery(loadStudents)

  const student = useMemo(
    () =>
      userId ? students?.find(s => s.userId && s.userId === userId) : undefined,
    [students, userId]
  )

  return { student, loading }
}
