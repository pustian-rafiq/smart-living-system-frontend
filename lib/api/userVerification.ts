import {
  getUserVerification,
  submitUserVerification,
  getUserVerificationStatus,
} from '@/data/mockUserVerification'
import { getCurrentAccountUserId } from './account'
import { mockDelay, ok, err, type ApiResult } from './http'
import type {
  UserVerificationRequest,
  UserVerificationStatus,
} from '@/types/userVerification'

export async function fetchUserVerificationStatus(): Promise<
  ApiResult<{
    status: UserVerificationStatus
    request: UserVerificationRequest | null
  }>
> {
  await mockDelay(150)
  const userId = getCurrentAccountUserId()
  const request = getUserVerification(userId)
  const status = getUserVerificationStatus(userId)
  return ok({ status, request })
}

export async function submitVerificationRequest(data: {
  verificationType: 'nid' | 'phone' | 'document'
  documentNumber?: string
  documentFileName?: string
}): Promise<ApiResult<UserVerificationRequest>> {
  await mockDelay(400)
  if (data.verificationType === 'nid' && !data.documentNumber?.trim()) {
    return err('NID number is required')
  }
  const userId = getCurrentAccountUserId()
  const request = submitUserVerification(userId, data)
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('verificationStatus', request.status)
  }
  return ok(request)
}
