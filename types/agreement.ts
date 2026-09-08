export interface RentalAgreement {
  id: string
  userId: string
  propertyId: string
  propertyName: string
  flatId?: string
  flatNumber?: string
  agreementType: 'rental' | 'lease' | 'sublease'
  startDate: string
  endDate: string
  monthlyRent: number
  securityDeposit: number
  /** Storage key of a privately stored upload. `documentUrl` is signed per read. */
  documentKey?: string
  documentUrl: string
  documentName: string
  documentSize: number // in bytes
  uploadedAt: string
  uploadedBy: string
  expiryDate: string
  renewalReminderDays: number[] // e.g., [30, 15, 7] means reminders 30, 15, and 7 days before expiry
  status: 'active' | 'expired' | 'renewed' | 'terminated'
  terms?: {
    duration: number // months
    noticePeriod: number // days
    renewalTerms?: string
    specialConditions?: string[]
    templateKey?: string
    templateName?: string
    templateNameBn?: string
    maxDepositMonths?: number
    provisions?: {
      key: string
      section: string
      title: string
      description: string
    }[]
    warnings?: string[]
    landlordName?: string
    tenantName?: string
    propertyAddress?: string
    prcaCompliant?: boolean
    generatedAt?: string
  }
  tenantSignature?: string
  ownerSignature?: string
  tenantSignedAt?: string | null
  ownerSignedAt?: string | null
  tenantSignedName?: string
  ownerSignedName?: string
  signatureStatus?: 'unsigned' | 'partially_signed' | 'fully_signed' | 'tenant_signed' | 'owner_signed'
}

export interface AgreementRenewal {
  id: string
  agreementId: string
  newStartDate: string
  newEndDate: string
  newMonthlyRent?: number
  documentKey?: string
  documentUrl: string
  renewedAt: string
  renewedBy: string
}
