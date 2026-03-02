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
  }
}

export interface AgreementRenewal {
  id: string
  agreementId: string
  newStartDate: string
  newEndDate: string
  newMonthlyRent?: number
  documentUrl: string
  renewedAt: string
  renewedBy: string
}
