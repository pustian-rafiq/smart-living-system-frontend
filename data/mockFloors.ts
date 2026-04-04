import type { Floor, FloorStats } from '@/types/floor'
import { mockFlats } from './mockBuildings'

// Generate floors based on existing flats
export const mockFloors: Floor[] = [
  {
    id: 'fl1',
    buildingId: 'b1',
    floorNumber: 1,
    name: 'Ground Floor',
    totalFlats: 4,
    occupiedFlats: 3,
    availableFlats: 1,
    maintenanceFlats: 0,
    flats: mockFlats.filter(f => f.buildingId === 'b1' && f.floor === 1),
    notes: 'Ground floor with easy access',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'fl2',
    buildingId: 'b1',
    floorNumber: 2,
    name: 'First Floor',
    totalFlats: 4,
    occupiedFlats: 2,
    availableFlats: 2,
    maintenanceFlats: 0,
    flats: mockFlats.filter(f => f.buildingId === 'b1' && f.floor === 2),
    notes: '',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'fl3',
    buildingId: 'b1',
    floorNumber: 3,
    name: 'Second Floor',
    totalFlats: 4,
    occupiedFlats: 4,
    availableFlats: 0,
    maintenanceFlats: 0,
    flats: mockFlats.filter(f => f.buildingId === 'b1' && f.floor === 3),
    notes: 'Fully occupied',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'fl4',
    buildingId: 'b2',
    floorNumber: 1,
    name: 'Ground Floor',
    totalFlats: 6,
    occupiedFlats: 5,
    availableFlats: 0,
    maintenanceFlats: 1,
    flats: mockFlats.filter(f => f.buildingId === 'b2' && f.floor === 1),
    notes: 'One flat under maintenance',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
  },
  {
    id: 'fl5',
    buildingId: 'b2',
    floorNumber: 2,
    name: 'First Floor',
    totalFlats: 6,
    occupiedFlats: 4,
    availableFlats: 2,
    maintenanceFlats: 0,
    flats: mockFlats.filter(f => f.buildingId === 'b2' && f.floor === 2),
    notes: '',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
  {
    id: 'fl6',
    buildingId: 'b3',
    floorNumber: 1,
    name: 'Ground Floor',
    totalFlats: 4,
    occupiedFlats: 2,
    availableFlats: 2,
    maintenanceFlats: 0,
    flats: mockFlats.filter(f => f.buildingId === 'b3' && f.floor === 1),
    notes: '',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
]

// Helper functions
export function getFloorsByBuilding(buildingId: string): Floor[] {
  return mockFloors
    .filter(floor => floor.buildingId === buildingId)
    .sort((a, b) => a.floorNumber - b.floorNumber)
}

export function getFloorById(floorId: string): Floor | undefined {
  return mockFloors.find(floor => floor.id === floorId)
}

export function getFloorStats(floorId: string): FloorStats | undefined {
  const floor = getFloorById(floorId)
  if (!floor) return undefined

  const totalRent = floor.flats.reduce((sum, flat) => sum + flat.rent, 0)
  const collectedRent = floor.flats
    .filter(flat => flat.status === 'occupied')
    .reduce((sum, flat) => sum + flat.rent, 0)
  const pendingRent = totalRent - collectedRent
  const occupancyRate =
    floor.totalFlats > 0 ? (floor.occupiedFlats / floor.totalFlats) * 100 : 0

  return {
    floorId: floor.id,
    floorNumber: floor.floorNumber,
    totalFlats: floor.totalFlats,
    occupiedFlats: floor.occupiedFlats,
    availableFlats: floor.availableFlats,
    maintenanceFlats: floor.maintenanceFlats,
    totalRent,
    collectedRent,
    pendingRent,
    occupancyRate,
  }
}

export function addFloor(
  floor: Omit<Floor, 'id' | 'createdAt' | 'updatedAt'>
): Floor {
  const newFloor: Floor = {
    ...floor,
    id: `fl${mockFloors.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockFloors.push(newFloor)
  return newFloor
}

export function updateFloor(
  floorId: string,
  updates: Partial<Floor>
): Floor | undefined {
  const index = mockFloors.findIndex(f => f.id === floorId)
  if (index === -1) return undefined

  mockFloors[index] = {
    ...mockFloors[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockFloors[index]
}

export function deleteFloor(floorId: string): boolean {
  const index = mockFloors.findIndex(f => f.id === floorId)
  if (index === -1) return false
  mockFloors.splice(index, 1)
  return true
}
