export type AuditAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'verify'
  | 'unverify'
  | 'payment'
  | 'rollback'

export type AuditEntityType =
  | 'property'
  | 'building'
  | 'flat'
  | 'bill'
  | 'booking'
  | 'user'
  | 'verification'
  | 'dispute'
  | 'complaint'
  | 'notice'
  | 'mess'
  | 'hotel'
  | 'room'

export interface AuditLog {
  id: string
  action: AuditAction
  entityType: AuditEntityType
  entityId: string
  entityName: string
  userId: string
  userName: string
  userRole: 'renter' | 'owner' | 'admin'
  timestamp: string
  ipAddress?: string
  userAgent?: string
  changes?: {
    field: string
    oldValue: any
    newValue: any
  }[]
  metadata?: {
    [key: string]: any
  }
  rollbackData?: {
    [key: string]: any
  }
  canRollback?: boolean
}

export interface AuditLogFilter {
  action?: AuditAction[]
  entityType?: AuditEntityType[]
  userId?: string
  userRole?: 'renter' | 'owner' | 'admin'
  dateFrom?: string
  dateTo?: string
  search?: string
}
