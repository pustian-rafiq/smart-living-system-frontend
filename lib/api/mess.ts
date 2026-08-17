import type { Mess, Notice, Student, Seat } from '@/types/mess'
import type { SMSTemplate, SMSGroup } from '@/types/sms'
import type { Bill } from '@/types/bill'
import { apiRequest } from './client'
import type { ApiResult } from './http'
import { hasAuthTokens } from '@/utils/auth-tokens'

export async function fetchMessList(): Promise<ApiResult<Mess[]>> {
  return apiRequest<Mess[]>('/mess/', { auth: hasAuthTokens() })
}

export async function fetchMessById(
  id: string,
): Promise<ApiResult<Mess | undefined>> {
  const result = await apiRequest<Mess>(`/mess/${id}/`, { auth: false })
  if (!result.ok) {
    if (result.code === 'NOT_FOUND') return { ok: true, data: undefined }
    return result
  }
  return result
}

export async function fetchMessStudents(
  messId?: string,
): Promise<ApiResult<Student[]>> {
  if (!messId) {
    // Load all messes then aggregate students (student dashboard fallback)
    const messes = await fetchMessList()
    if (!messes.ok) return messes
    if (!hasAuthTokens() || !messes.data.length) return { ok: true, data: [] }
    const lists = await Promise.all(
      messes.data.map(m =>
        apiRequest<Student[]>(`/mess/${m.id}/students/`),
      ),
    )
    const students = lists.flatMap(r => (r.ok ? r.data : []))
    return { ok: true, data: students }
  }
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<Student[]>(`/mess/${messId}/students/`)
}

export async function assignMessStudent(
  messId: string,
  data: {
    name: string
    phone: string
    email?: string
    studentId?: string
    university?: string
    seatNumber: string
  },
): Promise<ApiResult<Student>> {
  return apiRequest<Student>(`/mess/${messId}/students/`, {
    method: 'POST',
    body: {
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      studentId: data.studentId || '',
      university: data.university || '',
      seatNumber: data.seatNumber,
    },
  })
}

export async function fetchMessSeats(
  messId?: string,
): Promise<ApiResult<Seat[]>> {
  if (!messId) {
    const messes = await fetchMessList()
    if (!messes.ok) return messes
    const lists = await Promise.all(
      messes.data.map(m =>
        apiRequest<Seat[]>(`/mess/${m.id}/seats/`, { auth: false }),
      ),
    )
    return { ok: true, data: lists.flatMap(r => (r.ok ? r.data : [])) }
  }
  return apiRequest<Seat[]>(`/mess/${messId}/seats/`, { auth: false })
}

export async function fetchNoticesByMess(
  messId: string,
): Promise<ApiResult<Notice[]>> {
  return apiRequest<Notice[]>(`/mess/${messId}/notices/`, {
    auth: hasAuthTokens(),
  })
}

export async function fetchAllNotices(): Promise<ApiResult<Notice[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<Notice[]>('/notices/')
}

export async function createNotice(
  notice: Omit<Notice, 'id' | 'createdAt' | 'acknowledgments'> & {
    id?: string
    createdAt?: string
  },
): Promise<ApiResult<Notice>> {
  return apiRequest<Notice>(`/mess/${notice.messId}/notices/`, {
    method: 'POST',
    body: {
      title: notice.title,
      content: notice.content,
      date: notice.date,
      priority: notice.priority,
      category: notice.category || 'general',
      expiryDate: notice.expiryDate,
      pdfUrl: notice.pdfUrl || '',
      imageUrls: notice.imageUrls || [],
    },
  })
}

export async function patchNotice(
  id: string,
  updates: Partial<Notice>,
): Promise<ApiResult<Notice>> {
  return apiRequest<Notice>(`/notices/${id}/`, {
    method: 'PATCH',
    body: updates,
  })
}

export async function removeNotice(id: string): Promise<ApiResult<void>> {
  const result = await apiRequest<unknown>(`/notices/${id}/`, {
    method: 'DELETE',
  })
  if (!result.ok) return result
  return { ok: true, data: undefined }
}

export async function acknowledgeMessNotice(
  noticeId: string,
  _userId?: string,
): Promise<ApiResult<Notice>> {
  return apiRequest<Notice>(`/notices/${noticeId}/acknowledge/`, {
    method: 'POST',
    body: {},
  })
}

export async function fetchOrCreateMessBill(input: {
  tenantId?: string
  tenantName: string
  messId: string
  messName?: string
  seatNumber?: string
  monthlyFee: number
  studentId?: string
}): Promise<ApiResult<Bill>> {
  return apiRequest<Bill>(`/mess/${input.messId}/bills/get-or-create/`, {
    method: 'POST',
    body: {
      tenantName: input.tenantName,
      seatNumber: input.seatNumber || '',
      monthlyFee: input.monthlyFee,
      studentId: input.studentId || '',
    },
  })
}

export async function fetchMessSmsTemplates(
  messId: string,
): Promise<ApiResult<SMSTemplate[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<SMSTemplate[]>(`/mess/${messId}/sms/templates/`)
}

export async function fetchMessSmsGroups(
  messId: string,
): Promise<ApiResult<SMSGroup[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  return apiRequest<SMSGroup[]>(`/mess/${messId}/sms/groups/`)
}

/** Compatibility helpers previously re-exported from mocks */
export async function getNoticesByMess(messId: string): Promise<Notice[]> {
  const result = await fetchNoticesByMess(messId)
  return result.ok ? result.data : []
}

export async function getNoticeById(
  id: string,
): Promise<Notice | undefined> {
  const all = await fetchAllNotices()
  if (!all.ok) return undefined
  return all.data.find(n => n.id === id)
}

export async function acknowledgeNotice(
  noticeId: string,
  userId?: string,
): Promise<Notice | undefined> {
  const result = await acknowledgeMessNotice(noticeId, userId)
  return result.ok ? result.data : undefined
}
