import type { Building, Flat, Renter } from '@/types/building'

export const mockRenters: Renter[] = [
  {
    id: 'r1',
    name: 'Rahim Uddin',
    phone: '+8801712345678',
    email: 'rahim@example.com',
    nid: '1234567890123',
    address: 'Village: Shyampur, District: Dhaka',
    joinedDate: '2024-01-15',
  },
  {
    id: 'r2',
    name: 'Fatima Begum',
    phone: '+8801712345679',
    email: 'fatima@example.com',
    nid: '1234567890124',
    address: 'Village: Mirpur, District: Dhaka',
    joinedDate: '2024-02-01',
  },
  {
    id: 'r3',
    name: 'Karim Ahmed',
    phone: '+8801712345680',
    email: 'karim@example.com',
    nid: '1234567890125',
    address: 'Village: Uttara, District: Dhaka',
    joinedDate: '2024-01-20',
  },
  {
    id: 'r4',
    name: 'Sadia Islam',
    phone: '+8801712345681',
    email: 'sadia@example.com',
    nid: '1234567890126',
    address: 'Village: Dhanmondi, District: Dhaka',
    joinedDate: '2024-02-10',
  },
]

export const mockBuildings: Building[] = [
  {
    id: 'b1',
    name: 'Green Valley Apartments',
    address: 'House 45, Road 7, Block C, Mirpur-10',
    city: 'Dhaka',
    totalFloors: 5,
    totalFlats: 20,
    occupiedFlats: 15,
    createdAt: '2023-06-15',
  },
  {
    id: 'b2',
    name: 'Sunshine Tower',
    address: 'Flat 4B, Building 12, Sector 7, Uttara',
    city: 'Dhaka',
    totalFloors: 8,
    totalFlats: 32,
    occupiedFlats: 28,
    createdAt: '2023-08-20',
  },
  {
    id: 'b3',
    name: 'Modern Heights',
    address: 'House 23, Road 27, Dhanmondi',
    city: 'Dhaka',
    totalFloors: 6,
    totalFlats: 24,
    occupiedFlats: 18,
    createdAt: '2023-09-10',
  },
]

export const mockFlats: Flat[] = [
  // Building 1 - Green Valley Apartments
  { id: 'f1', flatNumber: '1A', floor: 1, rent: 12000, status: 'occupied', buildingId: 'b1', area: 850, bedrooms: 2, bathrooms: 1, renter: mockRenters[0] },
  { id: 'f2', flatNumber: '1B', floor: 1, rent: 12000, status: 'occupied', buildingId: 'b1', area: 850, bedrooms: 2, bathrooms: 1, renter: mockRenters[1] },
  { id: 'f3', flatNumber: '2A', floor: 2, rent: 15000, status: 'occupied', buildingId: 'b1', area: 1100, bedrooms: 3, bathrooms: 2 },
  { id: 'f4', flatNumber: '2B', floor: 2, rent: 15000, status: 'available', buildingId: 'b1', area: 1100, bedrooms: 3, bathrooms: 2 },
  { id: 'f5', flatNumber: '3A', floor: 3, rent: 15000, status: 'occupied', buildingId: 'b1', area: 1100, bedrooms: 3, bathrooms: 2 },
  { id: 'f6', flatNumber: '3B', floor: 3, rent: 15000, status: 'maintenance', buildingId: 'b1', area: 1100, bedrooms: 3, bathrooms: 2 },
  { id: 'f7', flatNumber: '4A', floor: 4, rent: 18000, status: 'occupied', buildingId: 'b1', area: 1300, bedrooms: 3, bathrooms: 2 },
  { id: 'f8', flatNumber: '4B', floor: 4, rent: 18000, status: 'occupied', buildingId: 'b1', area: 1300, bedrooms: 3, bathrooms: 2 },
  { id: 'f9', flatNumber: '5A', floor: 5, rent: 18000, status: 'available', buildingId: 'b1', area: 1300, bedrooms: 3, bathrooms: 2 },
  { id: 'f10', flatNumber: '5B', floor: 5, rent: 18000, status: 'occupied', buildingId: 'b1', area: 1300, bedrooms: 3, bathrooms: 2 },
  
  // Building 2 - Sunshine Tower
  { id: 'f11', flatNumber: '101', floor: 1, rent: 20000, status: 'occupied', buildingId: 'b2', area: 1400, bedrooms: 3, bathrooms: 2, renter: mockRenters[2] },
  { id: 'f12', flatNumber: '102', floor: 1, rent: 20000, status: 'occupied', buildingId: 'b2', area: 1400, bedrooms: 3, bathrooms: 2 },
  { id: 'f13', flatNumber: '201', floor: 2, rent: 22000, status: 'occupied', buildingId: 'b2', area: 1600, bedrooms: 4, bathrooms: 2 },
  { id: 'f14', flatNumber: '202', floor: 2, rent: 22000, status: 'available', buildingId: 'b2', area: 1600, bedrooms: 4, bathrooms: 2 },
  { id: 'f15', flatNumber: '301', floor: 3, rent: 25000, status: 'occupied', buildingId: 'b2', area: 1800, bedrooms: 4, bathrooms: 3 },
  { id: 'f16', flatNumber: '302', floor: 3, rent: 25000, status: 'occupied', buildingId: 'b2', area: 1800, bedrooms: 4, bathrooms: 3 },
  { id: 'f17', flatNumber: '401', floor: 4, rent: 25000, status: 'occupied', buildingId: 'b2', area: 1800, bedrooms: 4, bathrooms: 3 },
  { id: 'f18', flatNumber: '402', floor: 4, rent: 25000, status: 'maintenance', buildingId: 'b2', area: 1800, bedrooms: 4, bathrooms: 3 },
  
  // Building 3 - Modern Heights
  { id: 'f19', flatNumber: 'A1', floor: 1, rent: 15000, status: 'occupied', buildingId: 'b3', area: 1000, bedrooms: 2, bathrooms: 2, renter: mockRenters[3] },
  { id: 'f20', flatNumber: 'A2', floor: 1, rent: 15000, status: 'available', buildingId: 'b3', area: 1000, bedrooms: 2, bathrooms: 2 },
  { id: 'f21', flatNumber: 'B1', floor: 2, rent: 17000, status: 'occupied', buildingId: 'b3', area: 1200, bedrooms: 3, bathrooms: 2 },
  { id: 'f22', flatNumber: 'B2', floor: 2, rent: 17000, status: 'occupied', buildingId: 'b3', area: 1200, bedrooms: 3, bathrooms: 2 },
  { id: 'f23', flatNumber: 'C1', floor: 3, rent: 20000, status: 'occupied', buildingId: 'b3', area: 1400, bedrooms: 3, bathrooms: 2 },
  { id: 'f24', flatNumber: 'C2', floor: 3, rent: 20000, status: 'available', buildingId: 'b3', area: 1400, bedrooms: 3, bathrooms: 2 },
]
