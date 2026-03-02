import type { Flat } from './building'

export interface Floor {
  id: string
  buildingId: string
  floorNumber: number
  name?: string
  totalFlats: number
  occupiedFlats: number
  availableFlats: number
  maintenanceFlats: number
  flats: Flat[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface FloorStats {
  floorId: string
  floorNumber: number
  totalFlats: number
  occupiedFlats: number
  availableFlats: number
  maintenanceFlats: number
  totalRent: number
  collectedRent: number
  pendingRent: number
  occupancyRate: number
}

export interface FloorFormData {
  floorNumber: number
  name?: string
  notes?: string
}
