import type { Complaint, Notification } from '@/types/complaint'
import type { CreateComplaintRequest } from './contracts'
import { apiRequest } from './client'
import type { ApiResult } from './http'
import { hasAuthTokens } from '@/utils/auth-tokens'

export async function fetchComplaints(options?: {
  userId?: string
  ownerView?: boolean
}): Promise<ApiResult<Complaint[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  const qs = options?.ownerView ? '?ownerView=1' : ''
  return apiRequest<Complaint[]>(`/complaints/${qs}`)
}

export async function createComplaint(
  input: CreateComplaintRequest,
): Promise<ApiResult<Complaint>> {
  return apiRequest<Complaint>('/complaints/', {
    method: 'POST',
    body: {
      title: input.title,
      description: input.description,
      imageUrl: input.imageUrl || '',
    },
  })
}

export async function updateComplaintStatus(
  id: string,
  status: Complaint['status'],
  response?: string,
): Promise<ApiResult<Complaint>> {
  return apiRequest<Complaint>(`/complaints/${id}/status/`, {
    method: 'PATCH',
    body: { status, response: response || '' },
  })
}

export async function fetchNotifications(
  _userId?: string,
): Promise<ApiResult<Notification[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<Notification[]>('/notifications/')
}

export async function markNotificationRead(
  id: string,
): Promise<ApiResult<Notification>> {
  return apiRequest<Notification>(`/notifications/${id}/read/`, {
    method: 'PATCH',
    body: {},
  })
}

export async function markAllNotificationsRead(): Promise<ApiResult<boolean>> {
  const result = await apiRequest<unknown>('/notifications/mark-all-read/', {
    method: 'POST',
    body: {},
  })
  if (!result.ok) return result
  return { ok: true, data: true }
}

/** @deprecated Snapshot save not used with real API */
export async function saveComplaintsSnapshot(
  complaints: Complaint[],
): Promise<ApiResult<Complaint[]>> {
  return { ok: true, data: complaints }
}
