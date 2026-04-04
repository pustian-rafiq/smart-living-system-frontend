/**
 * Audit Log Helper Functions
 *
 * These functions help track changes throughout the application.
 * In a real app, these would make API calls to log changes.
 */

import { addAuditLog } from '@/data/mockAuditLogs'
import type { AuditLog, AuditAction, AuditEntityType } from '@/types/audit'

interface TrackChangeOptions {
  action: AuditAction
  entityType: AuditEntityType
  entityId: string
  entityName: string
  userId: string
  userName: string
  userRole: 'renter' | 'owner' | 'admin'
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
  ipAddress?: string
  userAgent?: string
}

/**
 * Track a change/action in the audit log
 */
export function trackAuditLog(options: TrackChangeOptions): AuditLog {
  return addAuditLog({
    action: options.action,
    entityType: options.entityType,
    entityId: options.entityId,
    entityName: options.entityName,
    userId: options.userId,
    userName: options.userName,
    userRole: options.userRole,
    changes: options.changes,
    metadata: options.metadata,
    rollbackData: options.rollbackData,
    canRollback: options.canRollback ?? true,
    ipAddress: options.ipAddress || getClientIP(),
    userAgent: options.userAgent || getClientUserAgent(),
  })
}

/**
 * Track a property creation
 */
export function trackPropertyCreate(
  propertyId: string,
  propertyName: string,
  userId: string,
  userName: string,
  userRole: 'renter' | 'owner' | 'admin',
  propertyData: any
): AuditLog {
  return trackAuditLog({
    action: 'create',
    entityType: 'property',
    entityId: propertyId,
    entityName: propertyName,
    userId,
    userName,
    userRole,
    changes: Object.entries(propertyData).map(([key, value]) => ({
      field: key,
      oldValue: null,
      newValue: value,
    })),
    rollbackData: {
      action: 'delete',
      entityId: propertyId,
    },
  })
}

/**
 * Track a property update
 */
export function trackPropertyUpdate(
  propertyId: string,
  propertyName: string,
  userId: string,
  userName: string,
  userRole: 'renter' | 'owner' | 'admin',
  changes: { field: string; oldValue: any; newValue: any }[],
  rollbackData?: any
): AuditLog {
  return trackAuditLog({
    action: 'update',
    entityType: 'property',
    entityId: propertyId,
    entityName: propertyName,
    userId,
    userName,
    userRole,
    changes,
    rollbackData,
  })
}

/**
 * Track a bill generation
 */
export function trackBillGeneration(
  billId: string,
  billName: string,
  userId: string,
  userName: string,
  billData: any
): AuditLog {
  return trackAuditLog({
    action: 'create',
    entityType: 'bill',
    entityId: billId,
    entityName: billName,
    userId,
    userName,
    userRole: 'owner',
    changes: Object.entries(billData).map(([key, value]) => ({
      field: key,
      oldValue: null,
      newValue: value,
    })),
    rollbackData: {
      action: 'delete',
      entityId: billId,
    },
  })
}

/**
 * Track a bill payment
 */
export function trackBillPayment(
  billId: string,
  billName: string,
  userId: string,
  userName: string,
  paymentData: {
    amount: number
    paymentMethod: string
    transactionId?: string
  }
): AuditLog {
  return trackAuditLog({
    action: 'payment',
    entityType: 'bill',
    entityId: billId,
    entityName: billName,
    userId,
    userName,
    userRole: 'renter',
    changes: [
      { field: 'status', oldValue: 'unpaid', newValue: 'paid' },
      { field: 'paidDate', oldValue: null, newValue: new Date().toISOString() },
    ],
    metadata: paymentData,
    canRollback: false, // Payments typically cannot be rolled back
  })
}

/**
 * Track a booking action
 */
export function trackBookingAction(
  action: 'create' | 'approve' | 'reject',
  bookingId: string,
  bookingName: string,
  userId: string,
  userName: string,
  userRole: 'renter' | 'owner' | 'admin',
  changes?: { field: string; oldValue: any; newValue: any }[]
): AuditLog {
  return trackAuditLog({
    action,
    entityType: 'booking',
    entityId: bookingId,
    entityName: bookingName,
    userId,
    userName,
    userRole,
    changes,
    rollbackData: changes
      ? {
          status:
            changes.find(c => c.field === 'status')?.oldValue || 'pending',
        }
      : undefined,
  })
}

/**
 * Track a verification action
 */
export function trackVerification(
  action: 'verify' | 'unverify' | 'reject',
  verificationId: string,
  entityName: string,
  userId: string,
  userName: string,
  reason?: string
): AuditLog {
  return trackAuditLog({
    action,
    entityType: 'verification',
    entityId: verificationId,
    entityName,
    userId,
    userName,
    userRole: 'admin',
    changes: [
      {
        field: 'status',
        oldValue: action === 'verify' ? 'pending' : 'verified',
        newValue:
          action === 'verify'
            ? 'verified'
            : action === 'unverify'
              ? 'pending'
              : 'rejected',
      },
    ],
    metadata: reason ? { reason } : undefined,
    rollbackData: {
      status: action === 'verify' ? 'pending' : 'verified',
    },
  })
}

// Helper functions to get client info (mocked for now)
function getClientIP(): string {
  if (typeof window === 'undefined') return 'unknown'
  // In a real app, this would come from the server
  return '192.168.1.100'
}

function getClientUserAgent(): string {
  if (typeof window === 'undefined') return 'unknown'
  return navigator.userAgent
}
