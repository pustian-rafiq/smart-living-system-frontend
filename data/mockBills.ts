import type { Bill } from '@/types/bill'

export const mockBills: Bill[] = [
  // Renter bills
  {
    id: 'bill1',
    tenantName: 'Rahim Uddin',
    tenantId: 'r1',
    propertyType: 'apartment',
    propertyName: 'Green Valley Apartments',
    propertyId: 'b1',
    flatNumber: '1A',
    month: 'January',
    year: 2024,
    amount: 12000,
    dueDate: '2024-01-05',
    paidDate: '2024-01-03',
    status: 'paid',
    items: [
      { id: 'item1', description: 'Monthly Rent', amount: 12000, type: 'rent' },
    ],
    createdAt: '2024-01-01',
  },
  {
    id: 'bill2',
    tenantName: 'Rahim Uddin',
    tenantId: 'r1',
    propertyType: 'apartment',
    propertyName: 'Green Valley Apartments',
    propertyId: 'b1',
    flatNumber: '1A',
    month: 'February',
    year: 2024,
    amount: 12000,
    dueDate: '2024-02-05',
    paidDate: '2024-02-02',
    status: 'paid',
    items: [
      { id: 'item2', description: 'Monthly Rent', amount: 12000, type: 'rent' },
    ],
    createdAt: '2024-02-01',
  },
  {
    id: 'bill3',
    tenantName: 'Rahim Uddin',
    tenantId: 'r1',
    propertyType: 'apartment',
    propertyName: 'Green Valley Apartments',
    propertyId: 'b1',
    flatNumber: '1A',
    month: 'March',
    year: 2024,
    amount: 12500,
    dueDate: '2024-03-05',
    status: 'unpaid',
    items: [
      { id: 'item3', description: 'Monthly Rent', amount: 12000, type: 'rent' },
      {
        id: 'item4',
        description: 'Utility Bill',
        amount: 500,
        type: 'utility',
      },
    ],
    createdAt: '2024-03-01',
  },
  {
    id: 'bill4',
    tenantName: 'Fatima Begum',
    tenantId: 'r2',
    propertyType: 'apartment',
    propertyName: 'Green Valley Apartments',
    propertyId: 'b1',
    flatNumber: '1B',
    month: 'March',
    year: 2024,
    amount: 12000,
    dueDate: '2024-03-05',
    status: 'unpaid',
    items: [
      { id: 'item5', description: 'Monthly Rent', amount: 12000, type: 'rent' },
    ],
    createdAt: '2024-03-01',
  },
  {
    id: 'bill5',
    tenantName: 'Karim Ahmed',
    tenantId: 'r3',
    propertyType: 'mess',
    propertyName: 'Green Valley Mess',
    propertyId: 'm1',
    seatNumber: 'A-12',
    month: 'March',
    year: 2024,
    amount: 3500,
    dueDate: '2024-03-05',
    status: 'overdue',
    items: [
      { id: 'item6', description: 'Monthly Fee', amount: 3500, type: 'rent' },
    ],
    createdAt: '2024-03-01',
  },
  {
    id: 'bill6',
    tenantName: 'Sadia Islam',
    tenantId: 'r4',
    propertyType: 'apartment',
    propertyName: 'Sunshine Tower',
    propertyId: 'b2',
    flatNumber: '101',
    month: 'February',
    year: 2024,
    amount: 20000,
    dueDate: '2024-02-05',
    paidDate: '2024-02-04',
    status: 'paid',
    items: [
      { id: 'item7', description: 'Monthly Rent', amount: 20000, type: 'rent' },
    ],
    createdAt: '2024-02-01',
  },
  {
    id: 'bill7',
    tenantName: 'Sadia Islam',
    tenantId: 'r4',
    propertyType: 'apartment',
    propertyName: 'Sunshine Tower',
    propertyId: 'b2',
    flatNumber: '101',
    month: 'March',
    year: 2024,
    amount: 20500,
    dueDate: '2024-03-05',
    status: 'unpaid',
    items: [
      { id: 'item8', description: 'Monthly Rent', amount: 20000, type: 'rent' },
      {
        id: 'item9',
        description: 'Maintenance',
        amount: 500,
        type: 'maintenance',
      },
    ],
    createdAt: '2024-03-01',
  },
]

export function getBillById(billId: string): Bill | undefined {
  return mockBills.find(b => b.id === billId)
}

export function markBillPaid(
  billId: string,
  paidDate = new Date().toISOString().split('T')[0]
): Bill | null {
  const bill = mockBills.find(b => b.id === billId)
  if (!bill) return null
  bill.status = 'paid'
  bill.paidDate = paidDate
  return bill
}

export function getBillsByTenantId(tenantId: string): Bill[] {
  return mockBills.filter(b => b.tenantId === tenantId)
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

/** Current (or unpaid) mess fee bill for a student — creates one if missing. */
export function getOrCreateMessBill(input: {
  tenantId: string
  tenantName: string
  messId: string
  messName: string
  seatNumber?: string
  monthlyFee: number
}): Bill {
  const existing = mockBills.find(
    b =>
      b.tenantId === input.tenantId &&
      b.propertyType === 'mess' &&
      b.propertyId === input.messId &&
      b.status !== 'paid'
  )
  if (existing) return existing

  const now = new Date()
  const month = MONTHS[now.getMonth()]
  const year = now.getFullYear()
  const due = new Date(year, now.getMonth(), 5)
  const bill: Bill = {
    id: `mess-bill-${input.tenantId}-${input.messId}-${year}-${now.getMonth() + 1}`,
    tenantName: input.tenantName,
    tenantId: input.tenantId,
    propertyType: 'mess',
    propertyName: input.messName,
    propertyId: input.messId,
    seatNumber: input.seatNumber,
    month,
    year,
    amount: input.monthlyFee,
    dueDate: due.toISOString().split('T')[0],
    status: due < now ? 'overdue' : 'unpaid',
    items: [
      {
        id: `mess-item-${Date.now()}`,
        description: 'Monthly mess fee',
        amount: input.monthlyFee,
        type: 'rent',
      },
    ],
    createdAt: now.toISOString().split('T')[0],
  }
  mockBills.unshift(bill)
  return bill
}
