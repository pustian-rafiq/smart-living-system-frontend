import type { RentalAgreement, AgreementRenewal } from '@/types/agreement'

export const mockAgreements: RentalAgreement[] = [
  {
    id: 'agr1',
    userId: 'r1',
    propertyId: 'b1',
    propertyName: 'Green Valley Apartments',
    flatId: 'f1',
    flatNumber: '3A',
    agreementType: 'rental',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    monthlyRent: 15000,
    securityDeposit: 30000,
    documentUrl: '/documents/agreement-r1-b1-f1.pdf',
    documentName: 'Rental_Agreement_Green_Valley_3A.pdf',
    documentSize: 245760, // ~240 KB
    uploadedAt: '2024-01-01T10:00:00Z',
    uploadedBy: 'owner1',
    expiryDate: '2024-12-31',
    renewalReminderDays: [30, 15, 7],
    status: 'active',
    terms: {
      duration: 12,
      noticePeriod: 30,
      renewalTerms: 'Automatic renewal for same terms unless notice given',
      specialConditions: [
        'No pets allowed',
        'No smoking',
        'Maintenance responsibility: Tenant',
      ],
    },
  },
  {
    id: 'agr2',
    userId: 'r2',
    propertyId: 'b2',
    propertyName: 'Sunset Tower',
    flatId: 'f11',
    flatNumber: '5B',
    agreementType: 'lease',
    startDate: '2023-06-01',
    endDate: '2024-05-31',
    monthlyRent: 18000,
    securityDeposit: 36000,
    documentUrl: '/documents/agreement-r2-b2-f11.pdf',
    documentName: 'Lease_Agreement_Sunset_Tower_5B.pdf',
    documentSize: 312000,
    uploadedAt: '2023-06-01T09:30:00Z',
    uploadedBy: 'owner2',
    expiryDate: '2024-05-31',
    renewalReminderDays: [60, 30, 15],
    status: 'expired',
    terms: {
      duration: 12,
      noticePeriod: 60,
      renewalTerms: 'Subject to rent review',
    },
  },
]

export const mockRenewals: AgreementRenewal[] = [
  {
    id: 'ren1',
    agreementId: 'agr2',
    newStartDate: '2024-06-01',
    newEndDate: '2025-05-31',
    newMonthlyRent: 19000,
    documentUrl: '/documents/renewal-ren1.pdf',
    renewedAt: '2024-05-15T14:00:00Z',
    renewedBy: 'owner2',
  },
]

// Helper functions
export function getAgreementsByUserId(userId: string): RentalAgreement[] {
  return mockAgreements
    .filter(agreement => agreement.userId === userId)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
}

export function getAgreementById(agreementId: string): RentalAgreement | undefined {
  return mockAgreements.find(agreement => agreement.id === agreementId)
}

export function getActiveAgreement(userId: string): RentalAgreement | undefined {
  return mockAgreements.find(
    agreement =>
      agreement.userId === userId &&
      agreement.status === 'active' &&
      new Date(agreement.endDate) >= new Date()
  )
}

export function getRenewalsByAgreementId(agreementId: string): AgreementRenewal[] {
  return mockRenewals
    .filter(renewal => renewal.agreementId === agreementId)
    .sort((a, b) => new Date(b.renewedAt).getTime() - new Date(a.renewedAt).getTime())
}

export function addAgreement(agreement: Omit<RentalAgreement, 'id'>): RentalAgreement {
  const newAgreement: RentalAgreement = {
    ...agreement,
    id: `agr${mockAgreements.length + 1}`,
  }
  mockAgreements.push(newAgreement)
  return newAgreement
}

export function updateAgreement(
  agreementId: string,
  updates: Partial<RentalAgreement>
): RentalAgreement | undefined {
  const index = mockAgreements.findIndex(a => a.id === agreementId)
  if (index === -1) return undefined

  mockAgreements[index] = {
    ...mockAgreements[index],
    ...updates,
  }
  return mockAgreements[index]
}

export function addRenewal(renewal: Omit<AgreementRenewal, 'id'>): AgreementRenewal {
  const newRenewal: AgreementRenewal = {
    ...renewal,
    id: `ren${mockRenewals.length + 1}`,
  }
  mockRenewals.push(newRenewal)
  return newRenewal
}
