import { apiRequest } from './client'
import type { RenterProfile } from '@/types/renterProfile'
import type { RenterHistory } from '@/types/renterHistory'
import type { ApiResult } from './http'
import { hasAuthTokens, getStoredUserId } from '@/utils/auth-tokens'

export async function fetchRenterProfile(
  _userId?: string,
): Promise<ApiResult<RenterProfile | null>> {
  return apiRequest<RenterProfile | null>('/profile/renter/')
}

export async function saveRenterProfile(
  _userId: string,
  patch: Partial<RenterProfile>,
): Promise<ApiResult<RenterProfile>> {
  return apiRequest<RenterProfile>('/profile/renter/', {
    method: 'PATCH',
    body: {
      documents: patch.documents,
      jobInfo: patch.jobInfo,
      familyMembers: patch.familyMembers,
      emergencyContacts: patch.emergencyContacts,
    },
  })
}

const emptyHistory = (renterId: string): RenterHistory => ({
  renterId,
  renterName: '',
  rentalHistories: [],
  paymentHistories: [],
  complaintHistories: [],
  ownerReferences: [],
  ownerRatings: [],
  totalRentals: 0,
  averageRating: 0,
  totalComplaints: 0,
  resolvedComplaints: 0,
})

/** Tenancy / bill / complaint history for a renter (self, owning owner, or admin). */
export async function fetchRenterHistory(
  userId?: string,
): Promise<ApiResult<RenterHistory>> {
  const id = userId || getStoredUserId()
  if (!id || !hasAuthTokens()) {
    return { ok: true, data: emptyHistory(id || '') }
  }
  return apiRequest<RenterHistory>(`/renters/${id}/history/`)
}
