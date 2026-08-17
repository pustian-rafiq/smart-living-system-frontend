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
  UserStatus,
  VerificationStatus,
  PropertyStatus,
  DisputeStatus,
} from '@/types/admin'
import type { Complaint } from '@/types/complaint'
import type { AuditLog } from '@/types/audit'
import type { Booking } from '@/types/booking'
import { apiRequest } from './client'
import type { ApiResult } from './http'
import { hasAuthTokens } from '@/utils/auth-tokens'
import {
  buildPageQuery,
  type PageQuery,
  type PaginatedData,
} from './paging'

/** Prefer real API errors over silent empty lists when JWT is missing. */
function requireAuth<T>(empty: T): ApiResult<T> | null {
  if (!hasAuthTokens()) {
    return {
      ok: false,
      error: 'Admin session expired. Sign in again at /admin/login.',
      code: 'FORBIDDEN',
    }
  }
  return null
}

function pagedGet<T>(
  path: string,
  params: PageQuery,
): Promise<ApiResult<PaginatedData<T>>> {
  const blocked = requireAuth<PaginatedData<T>>({
    results: [],
    count: 0,
    page: 1,
    pageSize: 20,
    totalPages: 1,
    next: null,
    previous: null,
  })
  if (blocked) return Promise.resolve(blocked)
  const qs = buildPageQuery(params)
  return apiRequest<PaginatedData<T>>(`${path}?${qs}`)
}

export async function fetchAdminUsers(): Promise<ApiResult<AdminUser[]>> {
  return requireAuth<AdminUser[]>([]) ?? apiRequest('/admin/users/')
}

export async function fetchVerificationRequests(
  params: PageQuery = {},
): Promise<ApiResult<PaginatedData<VerificationRequest>>> {
  return pagedGet('/admin/verifications/', params)
}

export async function patchVerificationRequest(
  id: string,
  updates: {
    status: VerificationStatus
    rejectionReason?: string
    notes?: string
  },
): Promise<ApiResult<VerificationRequest>> {
  return apiRequest(`/admin/verifications/${id}/`, {
    method: 'PATCH',
    body: updates,
  })
}

export async function fetchDisputes(
  params: PageQuery = {},
): Promise<ApiResult<PaginatedData<Dispute>>> {
  return pagedGet('/admin/disputes/', params)
}

export async function patchDispute(
  id: string,
  updates: Partial<Dispute> & { status?: DisputeStatus },
): Promise<ApiResult<Dispute>> {
  return apiRequest(`/admin/disputes/${id}/`, {
    method: 'PATCH',
    body: updates,
  })
}

export async function fetchPropertyModerations(
  params: PageQuery = {},
): Promise<ApiResult<PaginatedData<PropertyModeration>>> {
  return pagedGet('/admin/properties/moderation/', params)
}

export async function patchPropertyModeration(
  id: string,
  updates: {
    status?: PropertyStatus
    rejectionReason?: string
    featured?: boolean
    verified?: boolean
  },
): Promise<ApiResult<PropertyModeration>> {
  return apiRequest(`/admin/properties/moderation/${id}/`, {
    method: 'PATCH',
    body: updates,
  })
}

export async function fetchManagedUsers(
  params: PageQuery = {},
): Promise<ApiResult<PaginatedData<UserManagement>>> {
  return pagedGet('/admin/users/managed/', params)
}

export async function patchManagedUserStatus(
  id: string,
  status: UserStatus,
): Promise<ApiResult<UserManagement>> {
  return patchManagedUser(id, { status })
}

export async function patchManagedUser(
  id: string,
  updates: { status?: UserStatus; verified?: boolean },
): Promise<ApiResult<UserManagement>> {
  return apiRequest(`/admin/users/managed/${id}/`, {
    method: 'PATCH',
    body: updates,
  })
}

export async function fetchManagedUser(
  id: string,
): Promise<ApiResult<UserManagement>> {
  return (
    requireAuth<UserManagement>(null as unknown as UserManagement) ??
    apiRequest(`/admin/users/managed/${id}/`)
  )
}

export async function fetchAdminAnalytics(): Promise<ApiResult<AnalyticsData>> {
  return (
    requireAuth<AnalyticsData>({
      totalUsers: 0,
      usersByRole: { renters: 0, owners: 0, admins: 0 },
      totalProperties: 0,
      propertiesByType: { mess: 0, apartment: 0, hotel: 0 },
      totalBookings: 0,
      totalRevenue: 0,
      pendingVerifications: 0,
      openDisputes: 0,
      openComplaints: 0,
      growthMetrics: {
        usersGrowth: 0,
        propertiesGrowth: 0,
        bookingsGrowth: 0,
        revenueGrowth: 0,
      },
      cityWiseStats: [],
    }) ?? apiRequest('/admin/analytics/')
  )
}

export async function fetchSystemSettings(): Promise<ApiResult<SystemSettings>> {
  const blocked = requireAuth<SystemSettings>(null as unknown as SystemSettings)
  if (blocked) return blocked
  return apiRequest('/admin/settings/')
}

export async function saveSystemSettings(
  settings: SystemSettings,
): Promise<ApiResult<SystemSettings>> {
  return apiRequest('/admin/settings/', {
    method: 'PUT',
    body: settings,
  })
}

export async function fetchFraudReports(
  params: PageQuery = {},
): Promise<ApiResult<PaginatedData<FraudReport>>> {
  return pagedGet('/admin/fraud-reports/', params)
}

export async function fetchActivityLogs(
  params: PageQuery = {},
): Promise<ApiResult<PaginatedData<ActivityLog>>> {
  return pagedGet('/admin/activity-logs/', params)
}

export async function fetchAdminComplaints(
  params: PageQuery = {},
): Promise<ApiResult<PaginatedData<Complaint>>> {
  return pagedGet('/admin/complaints/', params)
}

export async function fetchAdminBookings(
  params: PageQuery = {},
): Promise<ApiResult<PaginatedData<Booking>>> {
  return pagedGet('/admin/bookings/', params)
}

export async function fetchAuditLogs(
  params: PageQuery & {
    entity?: string
    action?: string
    entityType?: string
    userId?: string
  } = {},
): Promise<ApiResult<PaginatedData<AuditLog>>> {
  return pagedGet('/admin/audit-logs/', params)
}

export async function rollbackAudit(
  logId: string,
): Promise<ApiResult<AuditLog | null>> {
  return apiRequest(`/admin/audit-logs/${logId}/rollback/`, {
    method: 'POST',
    body: {},
  })
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
  const blocked = requireAuth<AdminDashboardData>({
    analytics: {
      totalUsers: 0,
      usersByRole: { renters: 0, owners: 0, admins: 0 },
      totalProperties: 0,
      propertiesByType: { mess: 0, apartment: 0, hotel: 0 },
      totalBookings: 0,
      totalRevenue: 0,
      pendingVerifications: 0,
      openDisputes: 0,
      openComplaints: 0,
      growthMetrics: {
        usersGrowth: 0,
        propertiesGrowth: 0,
        bookingsGrowth: 0,
        revenueGrowth: 0,
      },
      cityWiseStats: [],
    },
    pendingVerifications: [],
    openDisputes: [],
    inProgressDisputes: [],
    openComplaints: [],
    pendingFraudReports: [],
    investigatingFraudReports: [],
  })
  if (blocked) return blocked
  return apiRequest('/admin/dashboard/')
}

export async function patchFraudReport(
  id: string,
  updates: Partial<FraudReport>,
): Promise<ApiResult<FraudReport>> {
  return apiRequest(`/admin/fraud-reports/${id}/`, {
    method: 'PATCH',
    body: updates,
  })
}

/** Client-side filters for pages that still filter locally after fetch */
export function getVerificationRequestsByStatus(
  status: VerificationStatus,
  list: VerificationRequest[] = [],
): VerificationRequest[] {
  return list.filter(r => r.status === status)
}

export function getDisputesByStatus(
  status: DisputeStatus,
  list: Dispute[] = [],
): Dispute[] {
  return list.filter(d => d.status === status)
}

export function getPropertiesByStatus(
  status: PropertyStatus,
  list: PropertyModeration[] = [],
): PropertyModeration[] {
  return list.filter(p => p.status === status)
}

export function getUsersByStatus(
  status: UserStatus,
  list: UserManagement[] = [],
): UserManagement[] {
  return list.filter(u => u.status === status)
}

export function getFraudReportsByStatus(
  status: FraudReport['status'],
  list: FraudReport[] = [],
): FraudReport[] {
  return list.filter(r => r.status === status)
}
