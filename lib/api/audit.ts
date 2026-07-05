import { addAuditLog } from '@/data/mockAuditLogs'
import type { AuditLog } from '@/types/audit'
import { mockDelay, ok, type ApiResult } from './http'

export type CreateAuditLogInput = Parameters<typeof addAuditLog>[0]

/** POST /audit/logs */
export async function createAuditLog(
  input: CreateAuditLogInput
): Promise<ApiResult<AuditLog>> {
  await mockDelay(30)
  return ok(addAuditLog(input))
}

/** Sync append — used by client audit helpers until all callers are async */
export function appendAuditLog(input: CreateAuditLogInput): AuditLog {
  return addAuditLog(input)
}
