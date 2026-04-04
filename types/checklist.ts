export type ChecklistItemStatus =
  | 'good'
  | 'fair'
  | 'poor'
  | 'damaged'
  | 'missing'

export interface ChecklistItem {
  id: string
  category: string
  name: string
  description?: string
  status: ChecklistItemStatus
  notes?: string
  photos?: string[]
  estimatedValue?: number
  damageDescription?: string
  repairCost?: number
}

export interface Checklist {
  id: string
  userId: string
  propertyId: string
  propertyName: string
  flatId?: string
  flatNumber?: string
  type: 'move_in' | 'move_out'
  completedAt: string
  completedBy: string
  items: ChecklistItem[]
  photos: string[]
  notes?: string
  totalEstimatedValue?: number
  totalRepairCost?: number
  securityDepositAmount: number
  securityDepositReturned?: number
  securityDepositReturnDate?: string
  securityDepositDeductions?: {
    itemId: string
    itemName: string
    reason: string
    amount: number
  }[]
  status: 'draft' | 'completed' | 'approved' | 'disputed'
  approvedBy?: string
  approvedAt?: string
}

export interface ChecklistCategory {
  id: string
  name: string
  items: string[]
}
