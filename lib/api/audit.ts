import type { AuditLog } from '@/types/audit'
import { apiRequest } from './client'
import type { ApiResult } from './http'
import { hasAuthTokens } from '@/utils/auth-tokens'

export type CreateAuditLogInput = {
  action: AuditLog['action']
  entityType: AuditLog['entityType']
  entityId: string
  entityName: string
  userId?: string
  userName?: string
  userRole?: AuditLog['userRole']
  changes?: AuditLog['changes']
  metadata?: AuditLog['metadata']
  rollbackData?: AuditLog['rollbackData']
  canRollback?: boolean
  ipAddress?: string
  userAgent?: string
}

/** POST /audit/logs */
export async function createAuditLog(
  input: CreateAuditLogInput,
): Promise<ApiResult<AuditLog>> {
  if (!hasAuthTokens()) {
    return {
      ok: true,
      data: {
        id: `local-${Date.now()}`,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        entityName: input.entityName,
        userId: input.userId || '',
        userName: input.userName || '',
        userRole: input.userRole || 'renter',
        timestamp: new Date().toISOString(),
        changes: input.changes,
        metadata: input.metadata,
        rollbackData: input.rollbackData,
        canRollback: input.canRollback,
      },
    }
  }
  return apiRequest<AuditLog>('/audit/logs/', {
    method: 'POST',
    body: input,
  })
}

/**
 * Fire-and-forget sync helper for existing callers.
 * Queues the API write without blocking the UI.
 */
export function appendAuditLog(input: CreateAuditLogInput): AuditLog {
  const local: AuditLog = {
    id: `local-${Date.now()}`,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    entityName: input.entityName,
    userId: input.userId || '',
    userName: input.userName || '',
    userRole: input.userRole || 'renter',
    timestamp: new Date().toISOString(),
    changes: input.changes,
    metadata: input.metadata,
    rollbackData: input.rollbackData,
    canRollback: input.canRollback,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
  }
  void createAuditLog(input)
  return local
}
