export type UserVerificationStatus =
  | 'unverified'
  | 'pending'
  | 'verified'
  | 'rejected'

export type UserVerificationType = 'nid' | 'phone' | 'document'

export interface UserVerificationRequest {
  id: string
  userId: string
  verificationType: UserVerificationType
  documentNumber?: string
  documentFileName?: string
  status: UserVerificationStatus
  submittedAt?: string
  reviewedAt?: string
  rejectionReason?: string
}
