import type { Reminder, ReminderSettings, ReminderHistory } from '@/types/reminder'
import { apiRequest } from './client'
import type { ApiResult } from './http'
import { hasAuthTokens } from '@/utils/auth-tokens'

export async function fetchReminderSettings(
  _userId?: string,
): Promise<ApiResult<ReminderSettings>> {
  if (!hasAuthTokens()) {
    return {
      ok: true,
      data: {
        userId: '',
        rentReminders: {
          enabled: true,
          daysBefore: [7, 3, 1],
          channels: ['sms', 'push'],
          time: '09:00',
        },
        billReminders: {
          enabled: true,
          daysBefore: [5, 2],
          channels: ['sms'],
          time: '09:00',
        },
        maintenanceReminders: {
          enabled: true,
          channels: ['push'],
        },
        customReminders: {
          enabled: true,
          defaultChannels: ['push'],
        },
      },
    }
  }
  return apiRequest<ReminderSettings>('/reminders/settings/')
}

export async function saveReminderSettings(
  _userId: string,
  settings: ReminderSettings,
): Promise<ApiResult<ReminderSettings>> {
  return apiRequest<ReminderSettings>('/reminders/settings/', {
    method: 'PUT',
    body: settings,
  })
}

export async function fetchReminders(
  _userId?: string,
  filters?: { status?: string; type?: string },
): Promise<ApiResult<Reminder[]>> {
  if (!hasAuthTokens()) return { ok: true, data: [] }
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.type) params.set('type', filters.type)
  const qs = params.toString()
  return apiRequest<Reminder[]>(`/reminders/${qs ? `?${qs}` : ''}`)
}

export async function fetchReminderHistory(
  _userId?: string,
): Promise<ApiResult<ReminderHistory>> {
  if (!hasAuthTokens()) {
    return {
      ok: true,
      data: {
        reminders: [],
        totalSent: 0,
        totalFailed: 0,
        totalPending: 0,
      },
    }
  }
  return apiRequest<ReminderHistory>('/reminders/history/')
}

export async function createReminder(
  reminder: Omit<Reminder, 'id'> & { id?: string },
): Promise<ApiResult<Reminder>> {
  return apiRequest<Reminder>('/reminders/', {
    method: 'POST',
    body: reminder,
  })
}
