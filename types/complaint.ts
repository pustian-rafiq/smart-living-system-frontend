export type ComplaintStatus = 'open' | 'in_progress' | 'resolved'

export interface Complaint {
  id: string
  userId: string
  userName: string
  title: string
  description: string
  status: ComplaintStatus
  imageUrl?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  response?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'complaint' | 'bill' | 'system' | 'other'
  read: boolean
  createdAt: string
  link?: string
}
