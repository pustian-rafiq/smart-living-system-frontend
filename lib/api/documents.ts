import type { RentalAgreement, AgreementRenewal } from '@/types/agreement'
import type { Checklist } from '@/types/checklist'
import type { Building, Flat } from '@/types/building'
import {
  getAgreementsByUserId,
  getActiveAgreement,
  addAgreement,
  updateAgreement,
  addRenewal,
} from '@/data/mockAgreements'
import {
  getChecklistsByUserId,
  addChecklist,
  updateChecklist,
  checklistCategories,
} from '@/data/mockChecklists'
import { fetchBuildings, fetchAllFlats } from './buildings'
import { getDemoUserId } from './demoUser'
import { mockDelay, ok, type ApiResult } from './http'

export async function fetchAgreements(
  userId?: string
): Promise<ApiResult<RentalAgreement[]>> {
  await mockDelay()
  return ok(getAgreementsByUserId(userId || getDemoUserId()))
}

export async function fetchActiveAgreement(
  userId?: string
): Promise<ApiResult<RentalAgreement | undefined>> {
  await mockDelay(100)
  return ok(getActiveAgreement(userId || getDemoUserId()))
}

export async function createAgreement(
  agreement: RentalAgreement
): Promise<ApiResult<RentalAgreement>> {
  await mockDelay(150)
  return ok(addAgreement(agreement))
}

export async function patchAgreement(
  id: string,
  updates: Partial<RentalAgreement>
): Promise<ApiResult<RentalAgreement | undefined>> {
  await mockDelay(100)
  return ok(updateAgreement(id, updates))
}

export async function createAgreementRenewal(
  renewal: AgreementRenewal
): Promise<ApiResult<AgreementRenewal>> {
  await mockDelay(150)
  return ok(addRenewal(renewal))
}

export async function fetchChecklists(
  userId?: string
): Promise<ApiResult<Checklist[]>> {
  await mockDelay()
  return ok(getChecklistsByUserId(userId || getDemoUserId()))
}

export async function createChecklist(
  checklist: Omit<Checklist, 'id'>
): Promise<ApiResult<Checklist>> {
  await mockDelay(150)
  return ok(addChecklist(checklist))
}

export async function patchChecklist(
  checklistId: string,
  updates: Partial<Checklist>
): Promise<ApiResult<Checklist | undefined>> {
  await mockDelay(100)
  return ok(updateChecklist(checklistId, updates))
}

export async function fetchDocumentBuildings(): Promise<
  ApiResult<Building[]>
> {
  return fetchBuildings()
}

export async function fetchAgreementFormData(): Promise<
  ApiResult<{ buildings: Building[]; flats: Flat[] }>
> {
  const [buildings, flats] = await Promise.all([
    fetchBuildings(),
    fetchAllFlats(),
  ])
  if (!buildings.ok) return buildings
  if (!flats.ok) return flats
  return ok({ buildings: buildings.data, flats: flats.data })
}

export { checklistCategories }
