import type { Mess, Notice, Student, Seat } from '@/types/mess'
import type { SMSTemplate, SMSGroup } from '@/types/sms'
import {
  mockMess,
  mockStudents,
  mockNotices,
  mockSeats,
  getNoticesByMess,
  getNoticeById,
  addNotice,
  updateNotice,
  deleteNotice,
  acknowledgeNotice,
} from '@/data/mockMess'
import { getSMSTemplatesByMess, getSMSGroupsByMess } from '@/data/mockSMS'
import { getOrCreateMessBill } from '@/data/mockBills'
import { mockDelay, ok, err, type ApiResult } from './http'

export async function fetchMessList(): Promise<ApiResult<Mess[]>> {
  await mockDelay()
  return ok([...mockMess])
}

export async function fetchMessById(
  id: string
): Promise<ApiResult<Mess | undefined>> {
  await mockDelay(100)
  return ok(mockMess.find(m => m.id === id))
}

export async function fetchMessStudents(
  messId?: string
): Promise<ApiResult<Student[]>> {
  await mockDelay()
  if (messId) return ok(mockStudents.filter(s => s.messId === messId))
  return ok([...mockStudents])
}

export async function fetchMessSeats(
  messId?: string
): Promise<ApiResult<Seat[]>> {
  await mockDelay()
  if (messId) return ok(mockSeats.filter(s => s.messId === messId))
  return ok([...mockSeats])
}

export async function fetchNoticesByMess(
  messId: string
): Promise<ApiResult<Notice[]>> {
  await mockDelay()
  return ok(getNoticesByMess(messId))
}

export async function fetchAllNotices(): Promise<ApiResult<Notice[]>> {
  await mockDelay()
  return ok([...mockNotices])
}

export async function createNotice(notice: Notice): Promise<ApiResult<Notice>> {
  await mockDelay(150)
  addNotice(notice)
  return ok(notice)
}

export async function patchNotice(
  id: string,
  updates: Partial<Notice>
): Promise<ApiResult<Notice>> {
  await mockDelay(100)
  updateNotice(id, updates)
  const found = getNoticeById(id)
  if (!found) return err('Notice not found', 'NOT_FOUND')
  return ok(found)
}

export async function removeNotice(id: string): Promise<ApiResult<void>> {
  await mockDelay(100)
  deleteNotice(id)
  return ok(undefined)
}

export async function acknowledgeMessNotice(
  noticeId: string,
  userId: string
): Promise<ApiResult<Notice>> {
  await mockDelay(100)
  const updated = acknowledgeNotice(noticeId, userId)
  if (!updated) return err('Notice not found', 'NOT_FOUND')
  return ok(updated)
}

export async function fetchOrCreateMessBill(
  input: Parameters<typeof getOrCreateMessBill>[0]
): Promise<ApiResult<ReturnType<typeof getOrCreateMessBill>>> {
  await mockDelay(150)
  return ok(getOrCreateMessBill(input))
}

export async function fetchMessSmsTemplates(
  messId: string
): Promise<ApiResult<SMSTemplate[]>> {
  await mockDelay()
  return ok(getSMSTemplatesByMess(messId))
}

export async function fetchMessSmsGroups(
  messId: string
): Promise<ApiResult<SMSGroup[]>> {
  await mockDelay()
  return ok(getSMSGroupsByMess(messId))
}

export {
  getNoticesByMess,
  getNoticeById,
  acknowledgeNotice,
}
