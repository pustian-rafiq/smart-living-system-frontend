import type {
  ReminderSettings,
  Reminder,
  ReminderHistory,
} from '@/types/reminder'

export const mockReminderSettings: ReminderSettings = {
  userId: 'r1',
  rentReminders: {
    enabled: true,
    daysBefore: [7, 3, 1],
    channels: ['sms', 'push', 'email'],
    time: '09:00',
  },
  billReminders: {
    enabled: true,
    daysBefore: [5, 2],
    channels: ['push', 'email'],
    time: '10:00',
  },
  maintenanceReminders: {
    enabled: true,
    channels: ['push'],
  },
  customReminders: {
    enabled: true,
    defaultChannels: ['push', 'email'],
  },
}

export const mockReminders: Reminder[] = [
  {
    id: 'rem1',
    userId: 'r1',
    type: 'rent_due',
    title: 'Rent Due Reminder',
    message: 'Your rent of ৳15,000 is due in 7 days (January 5, 2024)',
    scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    sentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    channels: ['sms', 'push', 'email'],
    status: 'sent',
    relatedEntityId: 'bill1',
    relatedEntityType: 'bill',
  },
  {
    id: 'rem2',
    userId: 'r1',
    type: 'rent_due',
    title: 'Rent Due Reminder',
    message: 'Your rent of ৳15,000 is due in 3 days (January 5, 2024)',
    scheduledDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    sentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    channels: ['sms', 'push', 'email'],
    status: 'sent',
    relatedEntityId: 'bill1',
    relatedEntityType: 'bill',
  },
  {
    id: 'rem3',
    userId: 'r1',
    type: 'rent_due',
    title: 'Rent Due Reminder',
    message: 'Your rent of ৳15,000 is due tomorrow (January 5, 2024)',
    scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    sentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    channels: ['sms', 'push', 'email'],
    status: 'sent',
    relatedEntityId: 'bill1',
    relatedEntityType: 'bill',
  },
  {
    id: 'rem4',
    userId: 'r1',
    type: 'bill_due',
    title: 'Bill Payment Reminder',
    message: 'Your electricity bill of ৳2,500 is due in 5 days',
    scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    sentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    channels: ['push', 'email'],
    status: 'sent',
    relatedEntityId: 'bill2',
    relatedEntityType: 'bill',
  },
  {
    id: 'rem5',
    userId: 'r1',
    type: 'rent_due',
    title: 'Rent Due Reminder',
    message: 'Your rent of ৳15,000 is due in 7 days (February 5, 2024)',
    scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    channels: ['sms', 'push', 'email'],
    status: 'pending',
    relatedEntityId: 'bill3',
    relatedEntityType: 'bill',
  },
  {
    id: 'rem6',
    userId: 'r1',
    type: 'maintenance',
    title: 'Maintenance Request Update',
    message: 'Your maintenance request has been updated',
    scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    channels: ['push'],
    status: 'sent',
    relatedEntityType: 'maintenance',
  },
]

// Helper functions
export function getReminderSettings(userId: string): ReminderSettings {
  return mockReminderSettings
}

export function updateReminderSettings(
  userId: string,
  updates: Partial<ReminderSettings>
): ReminderSettings {
  Object.assign(mockReminderSettings, updates)
  return mockReminderSettings
}

export function getReminders(
  userId: string,
  filters?: {
    type?: string
    status?: string
    limit?: number
  }
): Reminder[] {
  let reminders = mockReminders.filter(r => r.userId === userId)

  if (filters?.type) {
    reminders = reminders.filter(r => r.type === filters.type)
  }

  if (filters?.status) {
    reminders = reminders.filter(r => r.status === filters.status)
  }

  // Sort by scheduled date (newest first)
  reminders.sort(
    (a, b) =>
      new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
  )

  if (filters?.limit) {
    reminders = reminders.slice(0, filters.limit)
  }

  return reminders
}

export function getReminderHistory(userId: string): ReminderHistory {
  const reminders = getReminders(userId)
  return {
    reminders,
    totalSent: reminders.filter(r => r.status === 'sent').length,
    totalFailed: reminders.filter(r => r.status === 'failed').length,
    totalPending: reminders.filter(r => r.status === 'pending').length,
  }
}

export function addReminder(reminder: Omit<Reminder, 'id'>): Reminder {
  const newReminder: Reminder = {
    ...reminder,
    id: `rem${mockReminders.length + 1}`,
  }
  mockReminders.push(newReminder)
  return newReminder
}
