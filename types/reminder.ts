export type ReminderChannel = 'sms' | 'push' | 'email'

export type ReminderType = 'rent_due' | 'bill_due' | 'maintenance' | 'custom'

export interface ReminderSettings {
  userId: string
  rentReminders: {
    enabled: boolean
    daysBefore: number[] // e.g., [7, 3, 1] means reminders 7, 3, and 1 day before
    channels: ReminderChannel[]
    time: string // e.g., "09:00"
  }
  billReminders: {
    enabled: boolean
    daysBefore: number[]
    channels: ReminderChannel[]
    time: string
  }
  maintenanceReminders: {
    enabled: boolean
    channels: ReminderChannel[]
  }
  customReminders: {
    enabled: boolean
    defaultChannels: ReminderChannel[]
  }
}

export interface Reminder {
  id: string
  userId: string
  type: ReminderType
  title: string
  message: string
  scheduledDate: string
  sentDate?: string
  channels: ReminderChannel[]
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  relatedEntityId?: string // Bill ID, Property ID, etc.
  relatedEntityType?: string
  metadata?: {
    [key: string]: any
  }
}

export interface ReminderHistory {
  reminders: Reminder[]
  totalSent: number
  totalFailed: number
  totalPending: number
}
