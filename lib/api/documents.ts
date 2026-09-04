import type { RentalAgreement, AgreementRenewal } from '@/types/agreement'
import type { Checklist, ChecklistCategory } from '@/types/checklist'
import type { Building, Flat } from '@/types/building'
import { apiRequest } from './client'
import type { ApiResult } from './http'
import { hasAuthTokens } from '@/utils/auth-tokens'
import { fetchBuildings, fetchAllFlats } from './buildings'

/** Preset categories — mirrors backend documents/constants.py */
export const checklistCategories: ChecklistCategory[] = [
  {
    id: 'cat1',
    name: 'Living Room',
    items: [
      'Sofa',
      'Coffee Table',
      'TV Stand',
      'Curtains',
      'Lighting',
      'Flooring',
      'Walls',
      'Ceiling',
      'Windows',
      'Doors',
    ],
  },
  {
    id: 'cat2',
    name: 'Kitchen',
    items: [
      'Refrigerator',
      'Stove',
      'Microwave',
      'Sink',
      'Cabinets',
      'Countertops',
      'Tiles',
      'Exhaust Fan',
      'Water Taps',
      'Dishwasher',
    ],
  },
  {
    id: 'cat3',
    name: 'Bedroom',
    items: [
      'Bed Frame',
      'Mattress',
      'Wardrobe',
      'Dressing Table',
      'Mirror',
      'Curtains',
      'Lighting',
      'Flooring',
      'Walls',
      'AC Unit',
    ],
  },
  {
    id: 'cat4',
    name: 'Bathroom',
    items: [
      'Toilet',
      'Shower',
      'Sink',
      'Mirror',
      'Tiles',
      'Water Taps',
      'Exhaust Fan',
      'Lighting',
      'Doors',
      'Windows',
    ],
  },
  {
    id: 'cat5',
    name: 'Balcony/Veranda',
    items: ['Railings', 'Flooring', 'Walls', 'Lighting', 'Doors', 'Windows'],
  },
  {
    id: 'cat6',
    name: 'Common Areas',
    items: [
      'Staircase',
      'Elevator',
      'Lobby',
      'Parking',
      'Security',
      'Generator',
    ],
  },
]

export async function fetchAgreements(
  _userId?: string,
): Promise<ApiResult<RentalAgreement[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<RentalAgreement[]>('/agreements/')
}

export async function fetchActiveAgreement(
  _userId?: string,
): Promise<ApiResult<RentalAgreement | undefined>> {
  if (!hasAuthTokens()) return { ok: true, data: undefined }
  const result = await apiRequest<RentalAgreement | null>(
    '/agreements/active/',
  )
  if (!result.ok) return result
  return { ok: true, data: result.data ?? undefined }
}

export async function createAgreement(
  agreement: Omit<RentalAgreement, 'id'> & { id?: string },
): Promise<ApiResult<RentalAgreement>> {
  return apiRequest<RentalAgreement>('/agreements/', {
    method: 'POST',
    body: agreement,
  })
}

export async function patchAgreement(
  id: string,
  updates: Partial<RentalAgreement>,
): Promise<ApiResult<RentalAgreement | undefined>> {
  const result = await apiRequest<RentalAgreement>(`/agreements/${id}/`, {
    method: 'PATCH',
    body: updates,
  })
  if (!result.ok) {
    if (result.code === 'NOT_FOUND') return { ok: true, data: undefined }
    return result
  }
  return result
}

export async function signAgreement(
  id: string,
  payload: {
    role: 'tenant' | 'owner'
    signature: string
    signedName: string
  },
): Promise<ApiResult<RentalAgreement>> {
  return apiRequest<RentalAgreement>(`/agreements/${id}/sign/`, {
    method: 'POST',
    body: payload,
  })
}

export async function createAgreementRenewal(
  renewal: Omit<AgreementRenewal, 'id'> & { id?: string },
): Promise<ApiResult<AgreementRenewal>> {
  return apiRequest<AgreementRenewal>(
    `/agreements/${renewal.agreementId}/renewals/`,
    {
      method: 'POST',
      body: renewal,
    },
  )
}

export async function fetchChecklists(
  _userId?: string,
): Promise<ApiResult<Checklist[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<Checklist[]>('/checklists/')
}

export async function createChecklist(
  checklist: Omit<Checklist, 'id'> & { id?: string },
): Promise<ApiResult<Checklist>> {
  return apiRequest<Checklist>('/checklists/', {
    method: 'POST',
    body: checklist,
  })
}

export async function patchChecklist(
  checklistId: string,
  updates: Partial<Checklist>,
): Promise<ApiResult<Checklist | undefined>> {
  const result = await apiRequest<Checklist>(`/checklists/${checklistId}/`, {
    method: 'PATCH',
    body: updates,
  })
  if (!result.ok) {
    if (result.code === 'NOT_FOUND') return { ok: true, data: undefined }
    return result
  }
  return result
}

export async function fetchDocumentBuildings(): Promise<
  ApiResult<Building[]>
> {
  return fetchBuildings()
}

export async function fetchAgreementFormData(): Promise<
  ApiResult<{ buildings: Building[]; flats: Flat[] }>
> {
  if (!hasAuthTokens()) {
    return { ok: true, data: { buildings: [], flats: [] } }
  }
  const result = await apiRequest<{ buildings: Building[]; flats: Flat[] }>(
    '/agreements/form-data/',
  )
  if (result.ok) return result
  // Fallback to portfolio endpoints
  const [buildings, flats] = await Promise.all([
    fetchBuildings(),
    fetchAllFlats(),
  ])
  if (!buildings.ok) return buildings
  if (!flats.ok) return flats
  return { ok: true, data: { buildings: buildings.data, flats: flats.data } }
}

export interface PRCAProvision {
  key: string
  section: string
  title: string
  description: string
}

export interface PRCATemplate {
  key: string
  name: string
  nameBn: string
  type: string
  defaultDurationMonths: number
  defaultNoticeDays: number
  maxDepositMonths: number
  provisions: PRCAProvision[]
}

export interface PRCATerms {
  templateKey: string
  templateName: string
  templateNameBn: string
  duration: number
  noticePeriod: number
  maxDepositMonths: number
  provisions: PRCAProvision[]
  renewalTerms: string
  specialConditions: string[]
  warnings: string[]
  landlordName: string
  tenantName: string
  propertyAddress: string
  prcaCompliant: boolean
  generatedAt: string
  stampDuty?: {
    durationMonths: number
    annualRent: number
    requiresRegistration: boolean
    indicativeStampDutyRate: number
    indicativeStampDutyAmount: number
    notes: string[]
  }
  rentIncreaseRules?: {
    currentRent: number
    allowedOnlyWhen: string[]
    prohibited: string[]
    receiptRequired: boolean
    summary: string
  }
  receiptObligation?: string
}

export async function fetchPRCATemplates(): Promise<ApiResult<PRCATemplate[]>> {
  return apiRequest<PRCATemplate[]>('/agreements/templates/', { auth: false })
}

export async function generatePRCATerms(data: {
  templateKey: string
  monthlyRent: number
  securityDeposit: number
  startDate: string
  endDate: string
  noticeDays?: number
  specialConditions?: string[]
  landlordName?: string
  tenantName?: string
  propertyAddress?: string
}): Promise<ApiResult<PRCATerms>> {
  return apiRequest<PRCATerms>('/agreements/generate-terms/', {
    method: 'POST',
    body: data,
  })
}

export async function fetchChecklistCategories(): Promise<
  ApiResult<ChecklistCategory[]>
> {
  const result = await apiRequest<ChecklistCategory[]>(
    '/checklists/categories/',
    { auth: false },
  )
  if (!result.ok) return { ok: true, data: checklistCategories }
  return result
}
