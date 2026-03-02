export type FlatStatus = 'available' | 'occupied' | 'maintenance'

export interface Renter {
  id: string
  name: string
  phone: string
  email?: string
  nid?: string
  address?: string
  joinedDate: string
}

export interface Flat {
  id: string
  flatNumber: string
  floor: number
  rent: number
  status: FlatStatus
  buildingId: string
  renter?: Renter
  area?: number
  bedrooms?: number
  bathrooms?: number
}

export interface Building {
  id: string
  name: string
  address: string
  city: string
  totalFloors: number
  totalFlats: number
  occupiedFlats: number
  createdAt: string
}

export interface Payment {
  id: string
  flatId: string
  amount: number
  month: string
  year: number
  status: 'paid' | 'pending' | 'overdue'
  paidDate?: string
  dueDate: string
}
