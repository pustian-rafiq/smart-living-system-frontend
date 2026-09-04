import type {
  HisabGridRow,
  HisabMonth,
  MealOffRequest,
  MemberDeposit,
  Mess,
  MessMealCalendar,
  MessUtilities,
  Notice,
  Seat,
  Student,
} from '@/types/mess'
import type { SMSTemplate, SMSGroup } from '@/types/sms'
import type { Bill } from '@/types/bill'
import { apiRequest } from './client'
import type { ApiResult } from './http'
import { hasAuthTokens } from '@/utils/auth-tokens'

export async function fetchMessList(
  options?: { mine?: boolean },
): Promise<ApiResult<Mess[]>> {
  const query = options?.mine ? '?mine=1' : ''
  return apiRequest<Mess[]>(`/mess/${query}`, {
    auth: Boolean(options?.mine),
  })
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

export async function updateMessLiveStatus(
  messId: string,
  status: Record<string, 'ok' | 'warn' | 'down'>,
): Promise<ApiResult<{ status: Record<string, string>; updatedAt?: string | null }>> {
  return apiRequest(`/mess/${messId}/live-status/`, {
    method: 'PATCH',
    body: status,
  })
}

export type MessExpenseSplit = {
  messId: string
  month: string
  year: number
  activeStudents: number
  splitTotal: number
  perPerson: number
  shares: Array<{
    studentId: string | null
    name: string
    seatNumber: string
    share: number
  }>
  byCategory: Array<{ category: string; total: number; perPerson: number }>
  note: string
}

export async function fetchMessExpenseSplit(
  messId: string,
  month?: number,
  year?: number,
): Promise<ApiResult<MessExpenseSplit>> {
  const params = new URLSearchParams()
  if (month) params.set('month', String(month))
  if (year) params.set('year', String(year))
  const q = params.toString()
  return apiRequest<MessExpenseSplit>(
    `/mess/${messId}/expenses/split/${q ? `?${q}` : ''}`,
  )
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

/* —— Public meal calendar, utilities, book bridge, মিল হিসাব —— */

export async function fetchMessMealCalendar(
  messId: string,
  days = 7,
): Promise<ApiResult<MessMealCalendar>> {
  return apiRequest<MessMealCalendar>(
    `/mess/${messId}/meals/calendar/?days=${days}`,
    { auth: false },
  )
}

export async function updateMessMealPricing(
  messId: string,
  body: Record<string, unknown>,
): Promise<ApiResult<Mess>> {
  return apiRequest<Mess>(`/mess/${messId}/meals/pricing/`, {
    method: 'PATCH',
    body,
  })
}

export async function fetchMessUtilities(
  messId: string,
): Promise<ApiResult<MessUtilities>> {
  return apiRequest<MessUtilities>(`/mess/${messId}/utilities/`, {
    auth: false,
  })
}

export async function updateMessUtilities(
  messId: string,
  body: {
    waterProfile?: Record<string, unknown>
    electricityProfile?: Record<string, unknown>
  },
): Promise<ApiResult<MessUtilities>> {
  return apiRequest<MessUtilities>(`/mess/${messId}/utilities/`, {
    method: 'PATCH',
    body,
  })
}

export async function ensureMessListing(
  messId: string,
): Promise<
  ApiResult<{ listingId: string; bookUrl: string; mess: Mess }>
> {
  return apiRequest(`/mess/${messId}/ensure-listing/`, { method: 'POST' })
}

export async function fetchHisabGrid(
  messId: string,
  date: string,
): Promise<
  ApiResult<{
    messId: string
    date: string
    rows: HisabGridRow[]
    totals: { memberMeals: number; guestMeals: number; students: number }
  }>
> {
  return apiRequest(`/mess/${messId}/hisab/grid/?date=${date}`)
}

export async function saveHisabGrid(
  messId: string,
  date: string,
  rows: Array<Partial<HisabGridRow> & { studentId: string }>,
): Promise<ApiResult<{ rows: HisabGridRow[] }>> {
  return apiRequest(`/mess/${messId}/hisab/grid/`, {
    method: 'PUT',
    body: { date, rows },
  })
}

export async function markAllHisabMeals(
  messId: string,
  date: string,
  on: boolean,
): Promise<ApiResult<{ rows: HisabGridRow[] }>> {
  return apiRequest(`/mess/${messId}/hisab/grid/mark-all/`, {
    method: 'POST',
    body: { date, on },
  })
}

export async function fetchHisabMonth(
  messId: string,
  month?: number,
  year?: number,
): Promise<ApiResult<HisabMonth>> {
  const params = new URLSearchParams()
  if (month) params.set('month', String(month))
  if (year) params.set('year', String(year))
  const q = params.toString()
  return apiRequest<HisabMonth>(
    `/mess/${messId}/hisab/month/${q ? `?${q}` : ''}`,
  )
}

export async function closeHisabMonth(
  messId: string,
  month: number,
  year: number,
): Promise<ApiResult<HisabMonth>> {
  return apiRequest(`/mess/${messId}/hisab/month/close/`, {
    method: 'POST',
    body: { month, year },
  })
}

export async function reopenHisabMonth(
  messId: string,
  month: number,
  year: number,
): Promise<ApiResult<HisabMonth>> {
  return apiRequest(`/mess/${messId}/hisab/month/reopen/`, {
    method: 'POST',
    body: { month, year },
  })
}

export async function fetchMealOffRequests(
  messId: string,
): Promise<ApiResult<MealOffRequest[]>> {
  return apiRequest(`/mess/${messId}/hisab/meal-off/`)
}

export async function createMealOffRequest(
  messId: string,
  body: {
    studentId?: string
    startDate: string
    endDate: string
    reason?: string
    meals?: Record<string, boolean>
  },
): Promise<ApiResult<MealOffRequest>> {
  return apiRequest(`/mess/${messId}/hisab/meal-off/`, {
    method: 'POST',
    body,
  })
}

export async function reviewMealOffRequest(
  messId: string,
  requestId: string,
  approve: boolean,
  note?: string,
): Promise<ApiResult<MealOffRequest>> {
  return apiRequest(`/mess/${messId}/hisab/meal-off/${requestId}/review/`, {
    method: 'POST',
    body: { approve, note: note || '' },
  })
}

export async function fetchMemberDeposits(
  messId: string,
): Promise<ApiResult<MemberDeposit[]>> {
  return apiRequest(`/mess/${messId}/hisab/deposits/`)
}

export async function addMemberDeposit(
  messId: string,
  body: { studentId: string; amount: number; date: string; note?: string },
): Promise<ApiResult<MemberDeposit>> {
  return apiRequest(`/mess/${messId}/hisab/deposits/`, {
    method: 'POST',
    body,
  })
}
