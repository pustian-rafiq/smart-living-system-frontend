import type {
  AdminUser,
  VerificationRequest,
  Dispute,
  PropertyModeration,
  UserManagement,
  AnalyticsData,
  SystemSettings,
  HeartbeatStats,
  HeartbeatPingRow,
  PushAdminStats,
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

export async function fetchHeartbeatOverview(): Promise<
  ApiResult<{ stats: HeartbeatStats; config: HeartbeatStats['config'] }>
> {
  return apiRequest('/admin/heartbeat/')
}

export async function runHeartbeatJob(options?: {
  sendSms?: boolean
}): Promise<ApiResult<Record<string, unknown>>> {
  return apiRequest('/admin/heartbeat/', {
    method: 'POST',
    body: { sendSms: options?.sendSms },
  })
}

export async function fetchHeartbeatPings(): Promise<ApiResult<HeartbeatPingRow[]>> {
  return apiRequest('/admin/heartbeat/pings/')
}

export async function fetchPushAdminStats(): Promise<ApiResult<PushAdminStats>> {
  return apiRequest('/admin/push/')
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

export type AdminSMSOverview = {
  ownerWallets: number
  totalBalance: number
  totalGranted: number
  totalPurchased: number
  totalUsed: number
  smsBatches: number
  smsSuccessful: number
  smsFailed: number
  smsCostBdt: number
  activePackages: number
  unitPriceBdt: number
  gateway: {
    provider: string
    channel: string
    configured: boolean
    label: string
  }
  freeQuota: { free: number; basic: number; premium: number }
}

export type AdminSMSPackage = {
  id: string
  packageKey: string
  label: string
  credits: number
  priceBdt: number
  description: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type AdminOwnerSMSWallet = {
  ownerId: string
  ownerName: string
  ownerPhone: string
  balance: number
  lifetimeGranted: number
  lifetimePurchased: number
  lifetimeUsed: number
  available: number
  occupied: number
  period: string
  planTier: string
  planName: string
  monthlyFreeQuota: number
  smsBatches: number
  smsSuccessful: number
  smsFailed: number
  smsCostBdt: number
  updatedAt: string
}

export async function fetchAdminSMSOverview(): Promise<
  ApiResult<AdminSMSOverview>
> {
  return apiRequest('/admin/sms/overview/')
}

export async function fetchAdminSMSPackages(
  all = true,
): Promise<ApiResult<AdminSMSPackage[]>> {
  return apiRequest(`/admin/sms/packages/${all ? '?all=1' : ''}`)
}

export async function createAdminSMSPackage(
  body: Partial<AdminSMSPackage> & {
    packageKey: string
    label: string
    credits: number
    priceBdt: number
  },
): Promise<ApiResult<AdminSMSPackage>> {
  return apiRequest('/admin/sms/packages/', { method: 'POST', body })
}

export async function updateAdminSMSPackage(
  id: string,
  body: Partial<AdminSMSPackage>,
): Promise<ApiResult<AdminSMSPackage>> {
  return apiRequest(`/admin/sms/packages/${id}/`, { method: 'PATCH', body })
}

export async function deactivateAdminSMSPackage(
  id: string,
): Promise<ApiResult<AdminSMSPackage>> {
  return apiRequest(`/admin/sms/packages/${id}/`, { method: 'DELETE' })
}

export async function fetchAdminSMSWallets(
  params: PageQuery,
): Promise<ApiResult<PaginatedData<AdminOwnerSMSWallet>>> {
  return pagedGet('/admin/sms/wallets/', params)
}

export async function fetchAdminSMSWalletDetail(
  ownerId: string,
): Promise<
  ApiResult<{
    wallet: AdminOwnerSMSWallet
    ledger: import('@/types/sms').SMSCreditLedgerEntry[]
    messages: import('@/types/sms').SMSMessage[]
  }>
> {
  return apiRequest(`/admin/sms/wallets/${ownerId}/`)
}

export async function adjustAdminSMSCredits(
  ownerId: string,
  credits: number,
  note?: string,
): Promise<
  ApiResult<{
    wallet: AdminOwnerSMSWallet
    ledger: import('@/types/sms').SMSCreditLedgerEntry[]
  }>
> {
  return apiRequest(`/admin/sms/wallets/${ownerId}/adjust/`, {
    method: 'POST',
    body: { credits, note },
  })
}

export async function fetchAdminSMSMessages(
  params: PageQuery,
): Promise<ApiResult<PaginatedData<import('@/types/sms').SMSMessage>>> {
  return pagedGet('/admin/sms/messages/', params)
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
