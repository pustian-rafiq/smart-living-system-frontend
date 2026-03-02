import type { BillTemplate, BillGenerationRule, MeterReading } from '@/types/bill'

export const mockBillTemplates: BillTemplate[] = [
  {
    id: 'template1',
    name: 'Standard Apartment Bill',
    description: 'Monthly rent + utilities + service charge',
    propertyId: 'b1',
    propertyType: 'apartment',
    items: [
      {
        id: 'item1',
        description: 'Monthly Rent',
        type: 'rent',
        calculationType: 'fixed',
        fixedAmount: 12000,
      },
      {
        id: 'item2',
        description: 'Electricity',
        type: 'utility',
        calculationType: 'meter-based',
        unitRate: 8.5, // ৳8.5 per unit
        meterType: 'electricity',
      },
      {
        id: 'item3',
        description: 'Gas',
        type: 'utility',
        calculationType: 'meter-based',
        unitRate: 30, // ৳30 per unit
        meterType: 'gas',
      },
      {
        id: 'item4',
        description: 'Water',
        type: 'utility',
        calculationType: 'meter-based',
        unitRate: 15, // ৳15 per unit
        meterType: 'water',
      },
      {
        id: 'item5',
        description: 'Service Charge',
        type: 'maintenance',
        calculationType: 'fixed',
        fixedAmount: 500,
      },
    ],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'template2',
    name: 'Mess Monthly Fee',
    description: 'Monthly mess fee with meal cost',
    propertyId: 'm1',
    propertyType: 'mess',
    items: [
      {
        id: 'item6',
        description: 'Monthly Fee',
        type: 'rent',
        calculationType: 'fixed',
        fixedAmount: 3500,
      },
      {
        id: 'item7',
        description: 'Meal Cost',
        type: 'utility',
        calculationType: 'fixed',
        fixedAmount: 2000,
      },
      {
        id: 'item8',
        description: 'Electricity',
        type: 'utility',
        calculationType: 'meter-based',
        unitRate: 8.5,
        meterType: 'electricity',
      },
    ],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'template3',
    name: 'Premium Apartment Bill',
    description: 'Higher rent with all utilities',
    propertyId: 'b2',
    propertyType: 'apartment',
    items: [
      {
        id: 'item9',
        description: 'Monthly Rent',
        type: 'rent',
        calculationType: 'fixed',
        fixedAmount: 20000,
      },
      {
        id: 'item10',
        description: 'Electricity',
        type: 'utility',
        calculationType: 'meter-based',
        unitRate: 9.0,
        meterType: 'electricity',
      },
      {
        id: 'item11',
        description: 'Gas',
        type: 'utility',
        calculationType: 'meter-based',
        unitRate: 35,
        meterType: 'gas',
      },
      {
        id: 'item12',
        description: 'Water',
        type: 'utility',
        calculationType: 'meter-based',
        unitRate: 20,
        meterType: 'water',
      },
      {
        id: 'item13',
        description: 'Maintenance',
        type: 'maintenance',
        calculationType: 'percentage',
        percentage: 5,
        baseItemId: 'item9', // 5% of rent
      },
    ],
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

export const mockBillGenerationRules: BillGenerationRule[] = [
  {
    id: 'rule1',
    name: 'Auto-generate Monthly Bills',
    description: 'Automatically generate bills for all apartments on the 1st of each month',
    templateId: 'template1',
    schedule: {
      type: 'monthly',
      dayOfMonth: 1,
      generateBeforeDays: 0,
      dueDateDay: 5,
    },
    isActive: true,
    lastRun: '2024-03-01',
    nextRun: '2024-04-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'rule2',
    name: 'Mess Bills Auto-generation',
    description: 'Generate mess bills on the 1st of each month',
    propertyId: 'm1',
    propertyType: 'mess',
    templateId: 'template2',
    schedule: {
      type: 'monthly',
      dayOfMonth: 1,
      generateBeforeDays: 0,
      dueDateDay: 5,
    },
    isActive: true,
    lastRun: '2024-03-01',
    nextRun: '2024-04-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'rule3',
    name: 'Premium Building Bills',
    description: 'Auto-generate bills for Sunshine Tower',
    propertyId: 'b2',
    propertyType: 'apartment',
    templateId: 'template3',
    schedule: {
      type: 'monthly',
      dayOfMonth: 1,
      generateBeforeDays: 0,
      dueDateDay: 5,
    },
    isActive: true,
    lastRun: '2024-03-01',
    nextRun: '2024-04-01',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
]

export const mockMeterReadings: MeterReading[] = [
  {
    id: 'reading1',
    propertyId: 'b1',
    propertyType: 'apartment',
    flatId: 'f1',
    month: 'March',
    year: 2024,
    electricity: 1250,
    gas: 45,
    water: 120,
    previousElectricity: 1180,
    previousGas: 42,
    previousWater: 115,
    electricityConsumption: 70,
    gasConsumption: 3,
    waterConsumption: 5,
    submittedAt: '2024-03-01T10:00:00Z',
    submittedBy: 'owner1',
  },
  {
    id: 'reading2',
    propertyId: 'b1',
    propertyType: 'apartment',
    flatId: 'f2',
    month: 'March',
    year: 2024,
    electricity: 1320,
    gas: 48,
    water: 125,
    previousElectricity: 1250,
    previousGas: 45,
    previousWater: 120,
    electricityConsumption: 70,
    gasConsumption: 3,
    waterConsumption: 5,
    submittedAt: '2024-03-01T10:15:00Z',
    submittedBy: 'owner1',
  },
  {
    id: 'reading3',
    propertyId: 'b2',
    propertyType: 'apartment',
    flatId: 'f11',
    month: 'March',
    year: 2024,
    electricity: 1850,
    gas: 52,
    water: 150,
    previousElectricity: 1750,
    previousGas: 48,
    previousWater: 145,
    electricityConsumption: 100,
    gasConsumption: 4,
    waterConsumption: 5,
    submittedAt: '2024-03-01T11:00:00Z',
    submittedBy: 'owner1',
  },
  {
    id: 'reading4',
    propertyId: 'm1',
    propertyType: 'mess',
    seatId: 'seat1',
    month: 'March',
    year: 2024,
    electricity: 3200,
    gas: 120,
    water: 250,
    previousElectricity: 3000,
    previousGas: 110,
    previousWater: 240,
    electricityConsumption: 200,
    gasConsumption: 10,
    waterConsumption: 10,
    submittedAt: '2024-03-01T09:00:00Z',
    submittedBy: 'owner1',
  },
]

// Helper functions
export function getTemplatesByProperty(propertyId: string): BillTemplate[] {
  return mockBillTemplates.filter(t => t.propertyId === propertyId)
}

export function getActiveTemplates(): BillTemplate[] {
  return mockBillTemplates.filter(t => t.isActive)
}

export function getTemplateById(id: string): BillTemplate | undefined {
  return mockBillTemplates.find(t => t.id === id)
}

export function getMeterReading(
  propertyId: string,
  flatId: string | undefined,
  seatId: string | undefined,
  month: string,
  year: number
): MeterReading | undefined {
  return mockMeterReadings.find(
    r =>
      r.propertyId === propertyId &&
      r.flatId === flatId &&
      r.seatId === seatId &&
      r.month === month &&
      r.year === year
  )
}

export function getPreviousMeterReading(
  propertyId: string,
  flatId: string | undefined,
  seatId: string | undefined,
  currentMonth: string,
  currentYear: number
): MeterReading | undefined {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const currentIndex = months.indexOf(currentMonth)
  let prevMonth: string
  let prevYear = currentYear

  if (currentIndex === 0) {
    prevMonth = 'December'
    prevYear = currentYear - 1
  } else {
    prevMonth = months[currentIndex - 1]
  }

  return getMeterReading(propertyId, flatId, seatId, prevMonth, prevYear)
}

export function getActiveRules(): BillGenerationRule[] {
  return mockBillGenerationRules.filter(r => r.isActive)
}

export function getRuleById(id: string): BillGenerationRule | undefined {
  return mockBillGenerationRules.find(r => r.id === id)
}
