import type { Building, Flat, Renter } from '@/types/building'
import type { Mess } from '@/types/mess'
import type { Floor, FloorStats } from '@/types/floor'
import { mockBuildings, mockFlats, mockRenters } from '@/data/mockBuildings'
import { mockMess } from '@/data/mockMess'
import {
  mockFloors,
  getFloorsByBuilding,
  getFloorById,
  getFloorStats,
  addFloor,
  updateFloor,
  deleteFloor,
} from '@/data/mockFloors'
import { getDemoOwnerId } from './demoUser'
import { mockDelay, ok, err, type ApiResult } from './http'

export async function fetchBuildings(
  ownerId?: string
): Promise<ApiResult<Building[]>> {
  await mockDelay()
  const id = ownerId || getDemoOwnerId()
  return ok(mockBuildings.filter(b => b.ownerId === id))
}

export async function fetchAllBuildings(): Promise<ApiResult<Building[]>> {
  await mockDelay()
  return ok([...mockBuildings])
}

export async function fetchBuildingById(
  id: string
): Promise<ApiResult<Building | undefined>> {
  await mockDelay(100)
  return ok(mockBuildings.find(b => b.id === id))
}

export async function fetchFlatsByBuilding(
  buildingId: string
): Promise<ApiResult<Flat[]>> {
  await mockDelay()
  return ok(mockFlats.filter(f => f.buildingId === buildingId))
}

export async function fetchAllFlats(): Promise<ApiResult<Flat[]>> {
  await mockDelay()
  return ok([...mockFlats])
}

export async function fetchRenters(): Promise<ApiResult<Renter[]>> {
  await mockDelay()
  return ok([...mockRenters])
}

export async function fetchFloorsByBuilding(
  buildingId: string
): Promise<ApiResult<Floor[]>> {
  await mockDelay()
  return ok(getFloorsByBuilding(buildingId))
}

export async function fetchFloorById(
  floorId: string
): Promise<ApiResult<Floor | undefined>> {
  await mockDelay(100)
  return ok(getFloorById(floorId))
}

export async function fetchFloorStats(
  floorId: string
): Promise<ApiResult<FloorStats | undefined>> {
  await mockDelay(100)
  return ok(getFloorStats(floorId))
}

export async function createFloor(
  buildingId: string,
  data: Parameters<typeof addFloor>[1]
): Promise<ApiResult<Floor>> {
  await mockDelay(150)
  return ok(addFloor(buildingId, data))
}

export async function patchFloor(
  floorId: string,
  data: Parameters<typeof updateFloor>[1]
): Promise<ApiResult<Floor>> {
  await mockDelay(100)
  const updated = updateFloor(floorId, data)
  if (!updated) return err('Floor not found', 'NOT_FOUND')
  return ok(updated)
}

export async function removeFloor(floorId: string): Promise<ApiResult<boolean>> {
  await mockDelay(100)
  return ok(deleteFloor(floorId))
}

export async function saveFlatsSnapshot(
  flats: Flat[]
): Promise<ApiResult<Flat[]>> {
  await mockDelay(50)
  mockFlats.length = 0
  mockFlats.push(...flats)
  return ok([...mockFlats])
}

export type OwnerPortfolioSnapshot = {
  buildings: Building[]
  flats: Flat[]
  messList: Mess[]
}

/** Buildings + flats + mess for bulk dialogs and owner tools */
export async function fetchOwnerPortfolioSnapshot(
  ownerId?: string
): Promise<ApiResult<OwnerPortfolioSnapshot>> {
  await mockDelay()
  const id = ownerId || getDemoOwnerId()
  return ok({
    buildings: mockBuildings.filter(b => b.ownerId === id),
    flats: [...mockFlats],
    messList: [...mockMess],
  })
}

export {
  getFloorsByBuilding,
  getFloorById,
  getFloorStats,
  addFloor,
  updateFloor,
  deleteFloor,
}
