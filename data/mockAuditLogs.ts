import type { AuditLog, AuditAction, AuditEntityType } from '@/types/audit'

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'al1',
    action: 'create',
    entityType: 'property',
    entityId: 'p1',
    entityName: 'Green Valley Apartment',
    userId: 'owner1',
    userName: 'Ahmed Rahman',
    userRole: 'owner',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    changes: [
      { field: 'name', oldValue: null, newValue: 'Green Valley Apartment' },
      { field: 'rent', oldValue: null, newValue: 15000 },
      { field: 'address', oldValue: null, newValue: 'Mirpur, Dhaka' },
    ],
    canRollback: true,
    rollbackData: {
      action: 'delete',
      entityId: 'p1',
    },
  },
  {
    id: 'al2',
    action: 'update',
    entityType: 'bill',
    entityId: 'b1',
    entityName: 'Monthly Bill - January 2024',
    userId: 'owner1',
    userName: 'Ahmed Rahman',
    userRole: 'owner',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    ipAddress: '192.168.1.100',
    changes: [
      { field: 'amount', oldValue: 12000, newValue: 12500 },
      { field: 'status', oldValue: 'unpaid', newValue: 'paid' },
    ],
    canRollback: true,
    rollbackData: {
      amount: 12000,
      status: 'unpaid',
    },
  },
  {
    id: 'al3',
    action: 'verify',
    entityType: 'property',
    entityId: 'p2',
    entityName: 'Sunset Hostel',
    userId: 'admin1',
    userName: 'Admin User',
    userRole: 'admin',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    ipAddress: '10.0.0.1',
    changes: [
      { field: 'verified', oldValue: false, newValue: true },
      {
        field: 'verificationStatus',
        oldValue: 'pending',
        newValue: 'verified',
      },
    ],
    canRollback: true,
    rollbackData: {
      verified: false,
      verificationStatus: 'pending',
    },
  },
  {
    id: 'al4',
    action: 'create',
    entityType: 'booking',
    entityId: 'bk1',
    entityName: 'Booking for Green Valley Apartment',
    userId: 'r1',
    userName: 'Rahim Uddin',
    userRole: 'renter',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    ipAddress: '192.168.1.50',
    changes: [
      { field: 'propertyId', oldValue: null, newValue: 'p1' },
      { field: 'moveInDate', oldValue: null, newValue: '2024-02-01' },
      { field: 'status', oldValue: null, newValue: 'pending' },
    ],
    canRollback: true,
    rollbackData: {
      action: 'delete',
      entityId: 'bk1',
    },
  },
  {
    id: 'al5',
    action: 'update',
    entityType: 'flat',
    entityId: 'f1',
    entityName: 'Flat 3A - Building A',
    userId: 'owner1',
    userName: 'Ahmed Rahman',
    userRole: 'owner',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    ipAddress: '192.168.1.100',
    changes: [
      { field: 'rent', oldValue: 12000, newValue: 13000 },
      { field: 'status', oldValue: 'available', newValue: 'occupied' },
    ],
    canRollback: true,
    rollbackData: {
      rent: 12000,
      status: 'available',
    },
  },
  {
    id: 'al6',
    action: 'approve',
    entityType: 'booking',
    entityId: 'bk2',
    entityName: 'Booking for Sunset Hostel',
    userId: 'owner2',
    userName: 'Fatima Begum',
    userRole: 'owner',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    ipAddress: '192.168.1.101',
    changes: [{ field: 'status', oldValue: 'pending', newValue: 'approved' }],
    canRollback: true,
    rollbackData: {
      status: 'pending',
    },
  },
  {
    id: 'al7',
    action: 'payment',
    entityType: 'bill',
    entityId: 'b2',
    entityName: 'Monthly Bill - December 2023',
    userId: 'r1',
    userName: 'Rahim Uddin',
    userRole: 'renter',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    ipAddress: '192.168.1.50',
    changes: [
      { field: 'status', oldValue: 'unpaid', newValue: 'paid' },
      { field: 'paidDate', oldValue: null, newValue: new Date().toISOString() },
    ],
    canRollback: false,
    metadata: {
      paymentMethod: 'bKash',
      transactionId: 'TXN123456789',
    },
  },
  {
    id: 'al8',
    action: 'delete',
    entityType: 'notice',
    entityId: 'n1',
    entityName: 'Maintenance Notice',
    userId: 'owner1',
    userName: 'Ahmed Rahman',
    userRole: 'owner',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    ipAddress: '192.168.1.100',
    changes: [{ field: 'deleted', oldValue: false, newValue: true }],
    canRollback: true,
    rollbackData: {
      action: 'restore',
      entityId: 'n1',
      data: {
        title: 'Maintenance Notice',
        content: 'Scheduled maintenance on...',
      },
    },
  },
  {
    id: 'al9',
    action: 'create',
    entityType: 'building',
    entityId: 'bld1',
    entityName: 'Sunset Tower',
    userId: 'owner1',
    userName: 'Ahmed Rahman',
    userRole: 'owner',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    ipAddress: '192.168.1.100',
    changes: [
      { field: 'name', oldValue: null, newValue: 'Sunset Tower' },
      { field: 'address', oldValue: null, newValue: 'Dhanmondi, Dhaka' },
      { field: 'totalFloors', oldValue: null, newValue: 5 },
    ],
    canRollback: true,
    rollbackData: {
      action: 'delete',
      entityId: 'bld1',
    },
  },
  {
    id: 'al10',
    action: 'reject',
    entityType: 'verification',
    entityId: 'v1',
    entityName: 'Property Verification Request',
    userId: 'admin1',
    userName: 'Admin User',
    userRole: 'admin',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    ipAddress: '10.0.0.1',
    changes: [{ field: 'status', oldValue: 'pending', newValue: 'rejected' }],
    metadata: {
      rejectionReason: 'Incomplete documentation',
    },
    canRollback: true,
    rollbackData: {
      status: 'pending',
    },
  },
]

// Helper functions
export function getAuditLogs(filters?: {
  action?: AuditAction[]
  entityType?: AuditEntityType[]
  userId?: string
  userRole?: 'renter' | 'owner' | 'admin'
  dateFrom?: string
  dateTo?: string
  search?: string
}): AuditLog[] {
  let filtered = [...mockAuditLogs]

  if (filters?.action && filters.action.length > 0) {
    filtered = filtered.filter(log => filters.action!.includes(log.action))
  }

  if (filters?.entityType && filters.entityType.length > 0) {
    filtered = filtered.filter(log =>
      filters.entityType!.includes(log.entityType)
    )
  }

  if (filters?.userId) {
    filtered = filtered.filter(log => log.userId === filters.userId)
  }

  if (filters?.userRole) {
    filtered = filtered.filter(log => log.userRole === filters.userRole)
  }

  if (filters?.dateFrom) {
    filtered = filtered.filter(log => log.timestamp >= filters.dateFrom!)
  }

  if (filters?.dateTo) {
    filtered = filtered.filter(log => log.timestamp <= filters.dateTo!)
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      log =>
        log.entityName.toLowerCase().includes(searchLower) ||
        log.userName.toLowerCase().includes(searchLower) ||
        log.id.toLowerCase().includes(searchLower)
    )
  }

  // Sort by timestamp (newest first)
  return filtered.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

export function getAuditLogById(id: string): AuditLog | undefined {
  return mockAuditLogs.find(log => log.id === id)
}

export function getAuditLogsByEntity(
  entityType: AuditEntityType,
  entityId: string
): AuditLog[] {
  return mockAuditLogs
    .filter(log => log.entityType === entityType && log.entityId === entityId)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
}

export function addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
  const newLog: AuditLog = {
    ...log,
    id: `al${mockAuditLogs.length + 1}`,
    timestamp: new Date().toISOString(),
  }
  mockAuditLogs.unshift(newLog)
  return newLog
}

export function rollbackAuditLog(logId: string): boolean {
  const log = getAuditLogById(logId)
  if (!log || !log.canRollback || !log.rollbackData) {
    return false
  }

  // In a real app, this would make an API call to rollback the change
  // For now, we'll just add a rollback audit log entry
  addAuditLog({
    action: 'rollback',
    entityType: log.entityType,
    entityId: log.entityId,
    entityName: log.entityName,
    userId: log.userId,
    userName: log.userName,
    userRole: log.userRole,
    changes: [
      { field: 'rollback', oldValue: log.action, newValue: 'rolled_back' },
    ],
    metadata: {
      originalLogId: log.id,
      rollbackData: log.rollbackData,
    },
    canRollback: false,
  })

  return true
}
