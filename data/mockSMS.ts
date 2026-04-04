import type {
  SMSTemplate,
  SMSGroup,
  SMSMessage,
  SMSRecipient,
  SMSRecipientType,
} from '@/types/sms'
import { mockStudents } from './mockMess'

export const mockSMSTemplates: SMSTemplate[] = [
  {
    id: 'template1',
    name: 'Payment Reminder',
    content:
      'Dear {name}, your monthly fee of ৳{amount} is due on {date}. Please pay before the due date to avoid late fees.',
    variables: ['name', 'amount', 'date'],
    category: 'payment',
    messId: 'm1',
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'template2',
    name: 'Attendance Notice',
    content:
      'Dear {name}, you have been marked {status} for {date}. Please contact the mess manager if you have any concerns.',
    variables: ['name', 'status', 'date'],
    category: 'attendance',
    messId: 'm1',
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'template3',
    name: 'General Notice',
    content: 'Dear students, {message}. Thank you for your attention.',
    variables: ['message'],
    category: 'notice',
    messId: 'm1',
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'template4',
    name: 'Meal Reminder',
    content: 'Reminder: {meal} will be served from {time}. Please be on time.',
    variables: ['meal', 'time'],
    category: 'reminder',
    messId: 'm1',
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockSMSGroups: SMSGroup[] = [
  {
    id: 'group1',
    name: 'All Students',
    description: 'All students in the mess',
    messId: 'm1',
    memberIds: mockStudents.map(s => s.id),
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'group2',
    name: 'Payment Due',
    description: 'Students with pending payments',
    messId: 'm1',
    memberIds: mockStudents.slice(0, 3).map(s => s.id),
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'group3',
    name: 'Absent Students',
    description: 'Students marked absent today',
    messId: 'm1',
    memberIds: mockStudents.slice(1, 2).map(s => s.id),
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockSMSMessages: SMSMessage[] = [
  {
    id: 'sms1',
    messId: 'm1',
    templateId: 'template1',
    content:
      'Dear John Doe, your monthly fee of ৳3500 is due on 2024-01-05. Please pay before the due date to avoid late fees.',
    recipientType: 'all',
    recipients: mockStudents.map(s => ({
      id: s.id,
      name: s.name,
      phone: s.phone,
      studentId: s.id,
    })),
    totalRecipients: mockStudents.length,
    successful: mockStudents.length - 1,
    failed: 1,
    status: 'sent',
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'owner1',
    gateway: 'bKash',
    cost: mockStudents.length * 0.5, // 0.5 BDT per SMS
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sms2',
    messId: 'm1',
    templateId: 'template2',
    content:
      'Dear Jane Smith, you have been marked absent for 2024-01-15. Please contact the mess manager if you have any concerns.',
    recipientType: 'individual',
    recipients: [
      {
        id: mockStudents[1].id,
        name: mockStudents[1].name,
        phone: mockStudents[1].phone,
        studentId: mockStudents[1].id,
      },
    ],
    totalRecipients: 1,
    successful: 1,
    failed: 0,
    status: 'delivered',
    sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    sentBy: 'owner1',
    gateway: 'bKash',
    cost: 0.5,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sms3',
    messId: 'm1',
    content: 'Reminder: Lunch will be served from 12:00 PM. Please be on time.',
    recipientType: 'all',
    recipients: mockStudents.map(s => ({
      id: s.id,
      name: s.name,
      phone: s.phone,
      studentId: s.id,
    })),
    totalRecipients: mockStudents.length,
    successful: mockStudents.length,
    failed: 0,
    status: 'sent',
    sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    sentBy: 'owner1',
    gateway: 'Nagad',
    cost: mockStudents.length * 0.5,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
]

// Helper functions
export function getSMSTemplatesByMess(messId: string): SMSTemplate[] {
  return mockSMSTemplates
    .filter(t => !t.messId || t.messId === messId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

export function getSMSTemplateById(
  templateId: string
): SMSTemplate | undefined {
  return mockSMSTemplates.find(t => t.id === templateId)
}

export function getSMSGroupsByMess(messId: string): SMSGroup[] {
  return mockSMSGroups
    .filter(g => g.messId === messId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

export function getSMSGroupById(groupId: string): SMSGroup | undefined {
  return mockSMSGroups.find(g => g.id === groupId)
}

export function getSMSMessagesByMess(
  messId: string,
  limit?: number
): SMSMessage[] {
  let messages = mockSMSMessages
    .filter(m => m.messId === messId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  if (limit) {
    messages = messages.slice(0, limit)
  }

  return messages
}

export function getSMSMessageById(messageId: string): SMSMessage | undefined {
  return mockSMSMessages.find(m => m.id === messageId)
}

export function addSMSTemplate(
  template: Omit<SMSTemplate, 'id' | 'createdAt' | 'updatedAt'>
): SMSTemplate {
  const newTemplate: SMSTemplate = {
    ...template,
    id: `template${mockSMSTemplates.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockSMSTemplates.push(newTemplate)
  return newTemplate
}

export function updateSMSTemplate(
  templateId: string,
  updates: Partial<SMSTemplate>
): SMSTemplate | undefined {
  const index = mockSMSTemplates.findIndex(t => t.id === templateId)
  if (index === -1) return undefined

  mockSMSTemplates[index] = {
    ...mockSMSTemplates[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockSMSTemplates[index]
}

export function deleteSMSTemplate(templateId: string): boolean {
  const index = mockSMSTemplates.findIndex(t => t.id === templateId)
  if (index === -1) return false
  mockSMSTemplates.splice(index, 1)
  return true
}

export function addSMSGroup(
  group: Omit<SMSGroup, 'id' | 'createdAt' | 'updatedAt'>
): SMSGroup {
  const newGroup: SMSGroup = {
    ...group,
    id: `group${mockSMSGroups.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockSMSGroups.push(newGroup)
  return newGroup
}

export function updateSMSGroup(
  groupId: string,
  updates: Partial<SMSGroup>
): SMSGroup | undefined {
  const index = mockSMSGroups.findIndex(g => g.id === groupId)
  if (index === -1) return undefined

  mockSMSGroups[index] = {
    ...mockSMSGroups[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockSMSGroups[index]
}

export function deleteSMSGroup(groupId: string): boolean {
  const index = mockSMSGroups.findIndex(g => g.id === groupId)
  if (index === -1) return false
  mockSMSGroups.splice(index, 1)
  return true
}

export function sendBulkSMS(
  message: Omit<
    SMSMessage,
    'id' | 'createdAt' | 'sentAt' | 'status' | 'successful' | 'failed'
  >
): SMSMessage {
  // Simulate SMS sending
  const successRate = 0.95 // 95% success rate
  const successful = Math.floor(message.totalRecipients * successRate)
  const failed = message.totalRecipients - successful

  const newMessage: SMSMessage = {
    ...message,
    id: `sms${mockSMSMessages.length + 1}`,
    status: failed > 0 ? 'sent' : 'sent', // In real app, would check delivery status
    successful,
    failed,
    sentAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    cost: message.totalRecipients * 0.5, // 0.5 BDT per SMS
  }

  mockSMSMessages.unshift(newMessage)
  return newMessage
}

export function getSMSHistory(
  messId: string,
  startDate?: string,
  endDate?: string
): SMSHistory {
  let messages = mockSMSMessages.filter(m => m.messId === messId)

  if (startDate) {
    messages = messages.filter(m => m.createdAt >= startDate)
  }
  if (endDate) {
    messages = messages.filter(m => m.createdAt <= endDate)
  }

  const totalSent = messages.reduce((sum, m) => sum + m.successful, 0)
  const totalFailed = messages.reduce((sum, m) => sum + m.failed, 0)
  const totalCost = messages.reduce((sum, m) => sum + (m.cost || 0), 0)

  return {
    messages,
    totalSent,
    totalFailed,
    totalCost,
    period: {
      startDate: startDate || '',
      endDate: endDate || '',
    },
  }
}
