import type { Checklist, ChecklistCategory } from '@/types/checklist'

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
    items: [
      'Railings',
      'Flooring',
      'Walls',
      'Lighting',
      'Doors',
      'Windows',
    ],
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

export const mockChecklists: Checklist[] = [
  {
    id: 'chk1',
    userId: 'r1',
    propertyId: 'b1',
    propertyName: 'Green Valley Apartments',
    flatId: 'f1',
    flatNumber: '3A',
    type: 'move_in',
    completedAt: '2024-01-01T10:00:00Z',
    completedBy: 'r1',
    items: [
      {
        id: 'item1',
        category: 'Living Room',
        name: 'Sofa',
        status: 'good',
        notes: 'Clean and in good condition',
        photos: ['/photos/move-in/sofa-1.jpg'],
        estimatedValue: 25000,
      },
      {
        id: 'item2',
        category: 'Living Room',
        name: 'TV Stand',
        status: 'fair',
        notes: 'Minor scratches on surface',
        photos: ['/photos/move-in/tv-stand-1.jpg'],
        estimatedValue: 8000,
      },
      {
        id: 'item3',
        category: 'Kitchen',
        name: 'Refrigerator',
        status: 'good',
        notes: 'Working perfectly',
        photos: ['/photos/move-in/fridge-1.jpg'],
        estimatedValue: 35000,
      },
      {
        id: 'item4',
        category: 'Kitchen',
        name: 'Stove',
        status: 'good',
        notes: 'All burners working',
        photos: ['/photos/move-in/stove-1.jpg'],
        estimatedValue: 12000,
      },
      {
        id: 'item5',
        category: 'Bedroom',
        name: 'AC Unit',
        status: 'good',
        notes: 'Cooling properly',
        photos: ['/photos/move-in/ac-1.jpg'],
        estimatedValue: 45000,
      },
    ],
    photos: [
      '/photos/move-in/overview-1.jpg',
      '/photos/move-in/overview-2.jpg',
      '/photos/move-in/overview-3.jpg',
    ],
    notes: 'Overall condition is good. Minor wear and tear expected.',
    totalEstimatedValue: 125000,
    securityDepositAmount: 30000,
    status: 'approved',
    approvedBy: 'owner1',
    approvedAt: '2024-01-02T14:00:00Z',
  },
  {
    id: 'chk2',
    userId: 'r1',
    propertyId: 'b1',
    propertyName: 'Green Valley Apartments',
    flatId: 'f1',
    flatNumber: '3A',
    type: 'move_out',
    completedAt: '2024-12-15T10:00:00Z',
    completedBy: 'r1',
    items: [
      {
        id: 'item1',
        category: 'Living Room',
        name: 'Sofa',
        status: 'fair',
        notes: 'Some wear on cushions',
        photos: ['/photos/move-out/sofa-1.jpg'],
        estimatedValue: 25000,
        damageDescription: 'Minor wear on cushions',
        repairCost: 2000,
      },
      {
        id: 'item2',
        category: 'Living Room',
        name: 'TV Stand',
        status: 'poor',
        notes: 'Additional scratches',
        photos: ['/photos/move-out/tv-stand-1.jpg'],
        estimatedValue: 8000,
        damageDescription: 'Deep scratches on surface',
        repairCost: 3000,
      },
      {
        id: 'item3',
        category: 'Kitchen',
        name: 'Refrigerator',
        status: 'good',
        notes: 'Still working well',
        photos: ['/photos/move-out/fridge-1.jpg'],
        estimatedValue: 35000,
      },
      {
        id: 'item4',
        category: 'Kitchen',
        name: 'Stove',
        status: 'good',
        notes: 'All burners working',
        photos: ['/photos/move-out/stove-1.jpg'],
        estimatedValue: 12000,
      },
      {
        id: 'item5',
        category: 'Bedroom',
        name: 'AC Unit',
        status: 'good',
        notes: 'Working fine',
        photos: ['/photos/move-out/ac-1.jpg'],
        estimatedValue: 45000,
      },
      {
        id: 'item6',
        category: 'Bathroom',
        name: 'Tiles',
        status: 'damaged',
        notes: 'Cracked tile near shower',
        photos: ['/photos/move-out/tile-damage-1.jpg'],
        estimatedValue: 5000,
        damageDescription: 'Cracked tile needs replacement',
        repairCost: 5000,
      },
    ],
    photos: [
      '/photos/move-out/overview-1.jpg',
      '/photos/move-out/overview-2.jpg',
      '/photos/move-out/overview-3.jpg',
    ],
    notes: 'Some items show normal wear. Minor damages noted.',
    totalEstimatedValue: 125000,
    totalRepairCost: 10000,
    securityDepositAmount: 30000,
    securityDepositReturned: 20000,
    securityDepositReturnDate: '2024-12-20',
    securityDepositDeductions: [
      {
        itemId: 'item2',
        itemName: 'TV Stand',
        reason: 'Deep scratches requiring repair',
        amount: 3000,
      },
      {
        itemId: 'item6',
        itemName: 'Bathroom Tiles',
        reason: 'Cracked tile replacement',
        amount: 5000,
      },
      {
        itemId: 'item1',
        itemName: 'Sofa',
        reason: 'Wear and tear on cushions',
        amount: 2000,
      },
    ],
    status: 'completed',
    approvedBy: 'owner1',
    approvedAt: '2024-12-18T16:00:00Z',
  },
]

// Helper functions
export function getChecklistsByUserId(userId: string): Checklist[] {
  return mockChecklists
    .filter(checklist => checklist.userId === userId)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
}

export function getChecklistById(checklistId: string): Checklist | undefined {
  return mockChecklists.find(checklist => checklist.id === checklistId)
}

export function getMoveInChecklist(userId: string, propertyId: string, flatId?: string): Checklist | undefined {
  return mockChecklists.find(
    checklist =>
      checklist.userId === userId &&
      checklist.propertyId === propertyId &&
      checklist.flatId === flatId &&
      checklist.type === 'move_in'
  )
}

export function getMoveOutChecklist(userId: string, propertyId: string, flatId?: string): Checklist | undefined {
  return mockChecklists.find(
    checklist =>
      checklist.userId === userId &&
      checklist.propertyId === propertyId &&
      checklist.flatId === flatId &&
      checklist.type === 'move_out'
  )
}

export function addChecklist(checklist: Omit<Checklist, 'id'>): Checklist {
  const newChecklist: Checklist = {
    ...checklist,
    id: `chk${mockChecklists.length + 1}`,
  }
  mockChecklists.push(newChecklist)
  return newChecklist
}

export function updateChecklist(
  checklistId: string,
  updates: Partial<Checklist>
): Checklist | undefined {
  const index = mockChecklists.findIndex(c => c.id === checklistId)
  if (index === -1) return undefined

  mockChecklists[index] = {
    ...mockChecklists[index],
    ...updates,
  }
  return mockChecklists[index]
}
