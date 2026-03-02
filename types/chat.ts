export type MessageType = 'text' | 'image' | 'file' | 'system'

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read'

export interface ChatUser {
  id: string
  name: string
  phone: string
  avatar?: string
  isOnline?: boolean
  lastSeen?: string
}

export interface ChatMessage {
  id: string
  chatId: string
  senderId: string
  receiverId: string
  type: MessageType
  content: string // text content or file URL
  fileName?: string // for file messages
  fileSize?: number // in bytes
  thumbnail?: string // for image messages
  status: MessageStatus
  timestamp: string
  readAt?: string
}

export interface Chat {
  id: string
  participant1Id: string
  participant2Id: string
  participant1Name: string
  participant2Name: string
  participant1Avatar?: string
  participant2Avatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  propertyId?: string
  propertyName?: string
  createdAt: string
  updatedAt: string
}

export interface ChatFormData {
  message: string
  file?: File
}
