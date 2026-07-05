import type { Complaint, Notification } from '@/types/complaint'
import { mockComplaints, mockNotifications } from '@/data/mockComplaints'
import type { CreateComplaintRequest } from './contracts'
import { getDemoUserId } from './demoUser'
import { mockDelay, ok, type ApiResult } from './http'

export async function fetchComplaints(options?: {
  userId?: string
  ownerView?: boolean
}): Promise<ApiResult<Complaint[]>> {
  await mockDelay()
  let list = [...mockComplaints]
  if (!options?.ownerView) {
    const uid = options?.userId || getDemoUserId('renter')
    list = list.filter(c => c.userId === uid)
  }
  return ok(list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)))
}

export async function createComplaint(
  input: CreateComplaintRequest
): Promise<ApiResult<Complaint>> {
  await mockDelay(150)
  const complaint: Complaint = {
    id: `c${Date.now()}`,
    userId: input.userId,
    userName: input.userName,
    title: input.title,
    description: input.description,
    status: 'open',
    createdAt: new Date().toISOString(),
    imageUrl: input.imageUrl,
  }
  mockComplaints.unshift(complaint)
  return ok(complaint)
}

export async function updateComplaintStatus(
  id: string,
  status: Complaint['status'],
  response?: string
): Promise<ApiResult<Complaint>> {
  await mockDelay(100)
  const idx = mockComplaints.findIndex(c => c.id === id)
  if (idx < 0) return { ok: false, error: 'Complaint not found', code: 'NOT_FOUND' }
  mockComplaints[idx] = {
    ...mockComplaints[idx],
    status,
    response,
    updatedAt: new Date().toISOString(),
  }
  return ok(mockComplaints[idx])
}

export async function fetchNotifications(
  userId?: string
): Promise<ApiResult<Notification[]>> {
  await mockDelay()
  const uid = userId || getDemoUserId()
  return ok(mockNotifications.filter(n => n.userId === uid))
}

export async function saveComplaintsSnapshot(
  complaints: Complaint[]
): Promise<ApiResult<Complaint[]>> {
  await mockDelay(50)
  mockComplaints.length = 0
  mockComplaints.push(...complaints)
  return ok([...mockComplaints])
}
