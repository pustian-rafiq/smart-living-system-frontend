import type {
  AdminUser,
  VerificationRequest,
  Dispute,
  PropertyModeration,
  UserManagement,
  AnalyticsData,
  SystemSettings,
  FraudReport,
  ActivityLog,
} from '@/types/admin'
import type { Complaint } from '@/types/complaint'
import {
  mockAdminUsers,
  mockVerificationRequests,
  mockDisputes,
  mockPropertyModerations,
  mockUsers,
  mockAnalytics,
  mockSystemSettings,
  mockFraudReports,
  mockActivityLogs,
  getVerificationRequestsByStatus,
  getDisputesByStatus,
  getPropertiesByStatus,
  getUsersByStatus,
  getFraudReportsByStatus,
} from '@/data/mockAdmin'
import { mockComplaints } from '@/data/mockComplaints'
import { mockBookings } from '@/data/mockBookings'
import { getAuditLogs, rollbackAuditLog } from '@/data/mockAuditLogs'
import type { AuditLog } from '@/types/audit'
import { mockDelay, ok, err, type ApiResult } from './http'

export async function fetchAdminUsers(): Promise<ApiResult<AdminUser[]>> {
  await mockDelay()
  return ok([...mockAdminUsers])
}

export async function fetchVerificationRequests(): Promise<
  ApiResult<VerificationRequest[]>
> {
  await mockDelay()
  return ok([...mockVerificationRequests])
}

export async function fetchDisputes(): Promise<ApiResult<Dispute[]>> {
  await mockDelay()
  return ok([...mockDisputes])
}

export async function fetchPropertyModerations(): Promise<
  ApiResult<PropertyModeration[]>
> {
  await mockDelay()
  return ok([...mockPropertyModerations])
}

export async function fetchManagedUsers(): Promise<ApiResult<UserManagement[]>> {
  await mockDelay()
  return ok([...mockUsers])
}

export async function fetchAdminAnalytics(): Promise<ApiResult<AnalyticsData>> {
  await mockDelay()
  return ok({ ...mockAnalytics })
}

export async function fetchSystemSettings(): Promise<ApiResult<SystemSettings>> {
  await mockDelay()
  return ok({ ...mockSystemSettings })
}

export async function saveSystemSettings(
  settings: SystemSettings
): Promise<ApiResult<SystemSettings>> {
  await mockDelay(150)
  Object.assign(mockSystemSettings, settings)
  return ok({ ...mockSystemSettings })
}

export async function fetchFraudReports(): Promise<ApiResult<FraudReport[]>> {
  await mockDelay()
  return ok([...mockFraudReports])
}

export async function fetchActivityLogs(): Promise<ApiResult<ActivityLog[]>> {
  await mockDelay()
  return ok([...mockActivityLogs])
}

export async function fetchAdminComplaints(): Promise<ApiResult<Complaint[]>> {
  await mockDelay()
  return ok([...mockComplaints])
}

export async function fetchAdminBookings(): Promise<
  ApiResult<typeof mockBookings>
> {
  await mockDelay()
  return ok([...mockBookings])
}

export async function fetchAuditLogs(filters?: {
  entity?: string
  action?: string
}): Promise<ApiResult<AuditLog[]>> {
  await mockDelay()
  return ok(getAuditLogs(filters))
}

export async function rollbackAudit(
  logId: string
): Promise<ApiResult<AuditLog | null>> {
  await mockDelay(200)
  return ok(rollbackAuditLog(logId))
}

export type AdminDashboardData = {
  analytics: AnalyticsData
  pendingVerifications: VerificationRequest[]
  openDisputes: Dispute[]
  inProgressDisputes: Dispute[]
  openComplaints: Complaint[]
  pendingFraudReports: FraudReport[]
  investigatingFraudReports: FraudReport[]
}

export async function fetchAdminDashboardData(): Promise<
  ApiResult<AdminDashboardData>
> {
  await mockDelay()
  return ok({
    analytics: { ...mockAnalytics },
    pendingVerifications: getVerificationRequestsByStatus('pending'),
    openDisputes: getDisputesByStatus('open'),
    inProgressDisputes: getDisputesByStatus('in_progress'),
    openComplaints: mockComplaints.filter(c => c.status !== 'resolved'),
    pendingFraudReports: getFraudReportsByStatus('pending'),
    investigatingFraudReports: getFraudReportsByStatus('investigating'),
  })
}

export async function patchFraudReport(
  id: string,
  updates: Partial<FraudReport>
): Promise<ApiResult<FraudReport>> {
  await mockDelay(150)
  const idx = mockFraudReports.findIndex(r => r.id === id)
  if (idx < 0) return err('Fraud report not found', 'NOT_FOUND')
  mockFraudReports[idx] = {
    ...mockFraudReports[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return ok({ ...mockFraudReports[idx] })
}

export {
  getVerificationRequestsByStatus,
  getDisputesByStatus,
  getPropertiesByStatus,
  getUsersByStatus,
  getFraudReportsByStatus,
}
