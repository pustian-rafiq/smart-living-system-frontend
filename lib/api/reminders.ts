import type { Reminder, ReminderSettings, ReminderHistory } from '@/types/reminder'
import {
  getReminderSettings,
  updateReminderSettings,
  getReminders,
  getReminderHistory,
  addReminder,
} from '@/data/mockReminders'
import { getDemoUserId } from './demoUser'
import { mockDelay, ok, type ApiResult } from './http'

export async function fetchReminderSettings(
  userId?: string
): Promise<ApiResult<ReminderSettings>> {
  await mockDelay()
  return ok(getReminderSettings(userId || getDemoUserId()))
}

export async function saveReminderSettings(
  userId: string,
  settings: ReminderSettings
): Promise<ApiResult<ReminderSettings>> {
  await mockDelay(100)
  return ok(updateReminderSettings(userId, settings))
}

export async function fetchReminders(
  userId?: string,
  filters?: Parameters<typeof getReminders>[1]
): Promise<ApiResult<Reminder[]>> {
  await mockDelay()
  return ok(getReminders(userId || getDemoUserId(), filters))
}

export async function fetchReminderHistory(
  userId?: string
): Promise<ApiResult<ReminderHistory>> {
  await mockDelay()
  return ok(getReminderHistory(userId || getDemoUserId()))
}

export async function createReminder(
  reminder: Omit<Reminder, 'id'>
): Promise<ApiResult<Reminder>> {
  await mockDelay(150)
  return ok(addReminder(reminder))
}
