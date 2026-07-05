import { getRenterHistory } from '@/data/mockRenterHistory'
import {
  getRenterProfile,
  updateRenterProfile,
} from '@/data/mockRenterProfile'
import type { RenterProfile } from '@/types/renterProfile'
import { getDemoUserId } from './demoUser'
import { mockDelay, ok, type ApiResult } from './http'

export async function fetchRenterProfile(
  userId?: string
): Promise<ApiResult<RenterProfile | null>> {
  await mockDelay()
  return ok(getRenterProfile(userId || getDemoUserId()))
}

export async function saveRenterProfile(
  userId: string,
  patch: Partial<RenterProfile>
): Promise<ApiResult<void>> {
  await mockDelay(150)
  updateRenterProfile(userId, patch)
  return ok(undefined)
}

export async function fetchRenterHistory(userId?: string) {
  await mockDelay()
  return ok(getRenterHistory(userId || getDemoUserId()))
}
