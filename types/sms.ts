export type SMSStatus = 'pending' | 'sent' | 'failed' | 'delivered'

export type SMSRecipientType = 'all' | 'group' | 'individual' | 'custom'

export interface SMSTemplate {
  id: string
  name: string
  content: string
  variables?: string[] // e.g., ['{name}', '{date}', '{amount}']
  category?: 'payment' | 'attendance' | 'notice' | 'reminder' | 'general'
  messId?: string // Optional, for mess-specific templates
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface SMSRecipient {
  id: string
  name: string
  phone: string
  studentId?: string
  groupId?: string
}

export interface SMSGroup {
  id: string
  name: string
  description?: string
  messId: string
  memberIds: string[] // Student IDs
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface SMSMessage {
  id: string
  messId: string
  messName?: string
  templateId?: string
  content: string
  recipientType: SMSRecipientType
  recipients: SMSRecipient[]
  totalRecipients: number
  successful: number
  failed: number
  status: SMSStatus
  scheduledAt?: string // For scheduled SMS
  sentAt?: string
  sentBy: string
  sentByName?: string
  sentByPhone?: string
  gateway?: string
  cost?: number // Total cost in BDT (owner credit accounting)
  errorMessage?: string
  metadata?: {
    [key: string]: any
  }
  createdAt: string
}

export interface SMSHistory {
  messages: SMSMessage[]
  totalSent: number
  totalFailed: number
  totalCost: number
  period: {
    startDate: string
    endDate: string
  }
}

export interface SMSCreditPackage {
  id: string
  label: string
  credits: number
  price: number
  description: string
}

export interface OwnerSMSWallet {
  balance: number
  lifetimeGranted: number
  lifetimePurchased: number
  lifetimeUsed: number
  period: string
  planTier: string
  planName: string
  monthlyFreeQuota: number
  unitPriceBdt: number
  gateway: {
    provider: string
    channel: string
    configured: boolean
    label: string
  }
  packages: SMSCreditPackage[]
}

export interface SMSCreditLedgerEntry {
  id: string
  entryType: string
  credits: number
  balanceAfter: number
  note: string
  messId?: string | null
  messName?: string | null
  smsMessageId?: string | null
  createdAt: string
  metadata?: Record<string, unknown>
}
