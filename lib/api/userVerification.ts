import { apiRequest } from './client'
import type { ApiResult } from './http'
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
  return apiRequest('/account/verification/')
}

export async function submitVerificationRequest(data: {
  verificationType: 'nid' | 'phone' | 'document' | 'police'
  documentNumber?: string
  documentFileName?: string
  file?: File | null
}): Promise<ApiResult<UserVerificationRequest>> {
  const form = new FormData()
  form.append('verificationType', data.verificationType)
  if (data.documentNumber) form.append('documentNumber', data.documentNumber)
  if (data.documentFileName) {
    form.append('documentFileName', data.documentFileName)
  }
  if (data.file) form.append('file', data.file)
  return apiRequest<UserVerificationRequest>('/account/verification/', {
    method: 'POST',
    formData: form,
  })
}
