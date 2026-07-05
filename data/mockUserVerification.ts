import type {
  UserVerificationRequest,
  UserVerificationStatus,
} from '@/types/userVerification'

const store: Record<string, UserVerificationRequest> = {}

export function getUserVerification(
  userId: string
): UserVerificationRequest | null {
  return store[userId] ?? null
}

export function getUserVerificationStatus(
  userId: string
): UserVerificationStatus {
  return store[userId]?.status ?? 'unverified'
}

export function submitUserVerification(
  userId: string,
  data: {
    verificationType: UserVerificationRequest['verificationType']
    documentNumber?: string
    documentFileName?: string
  }
): UserVerificationRequest {
  const existing = store[userId]
  if (existing?.status === 'pending') return existing

  const request: UserVerificationRequest = {
    id: `uv-${Date.now()}`,
    userId,
    verificationType: data.verificationType,
    documentNumber: data.documentNumber,
    documentFileName: data.documentFileName,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  }
  store[userId] = request
  return request
}

export function syncVerificationToSession(userId: string): UserVerificationStatus {
  return getUserVerificationStatus(userId)
}
