import type { Chat, ChatMessage, ChatUser } from '@/types/chat'

export const mockChatUsers: ChatUser[] = [
  {
    id: 'user1',
    name: 'Rahim Uddin',
    phone: '+8801711111111',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    isOnline: true,
  },
  {
    id: 'owner1',
    name: 'Abdul Karim',
    phone: '+8801712345678',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    isOnline: false,
    lastSeen: '2024-02-20T10:30:00Z',
  },
  {
    id: 'owner2',
    name: 'Fatima Begum',
    phone: '+8801712345679',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    isOnline: true,
  },
  {
    id: 'user2',
    name: 'Karim Ahmed',
    phone: '+8801722222222',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    isOnline: true,
  },
]

export const mockChats: Chat[] = [
  {
    id: 'chat1',
    participant1Id: 'user1',
    participant2Id: 'owner1',
    participant1Name: 'Rahim Uddin',
    participant2Name: 'Abdul Karim',
    participant1Avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    participant2Avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    lastMessage: 'Yes, the property is still available. When would you like to visit?',
    lastMessageTime: '2024-02-20T14:30:00Z',
    unreadCount: 2,
    propertyId: '1',
    propertyName: 'Green Valley Mess',
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-20T14:30:00Z',
  },
  {
    id: 'chat2',
    participant1Id: 'user1',
    participant2Id: 'owner2',
    participant1Name: 'Rahim Uddin',
    participant2Name: 'Fatima Begum',
    participant1Avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    participant2Avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    lastMessage: 'Thank you for your interest!',
    lastMessageTime: '2024-02-19T16:20:00Z',
    unreadCount: 0,
    propertyId: '2',
    propertyName: 'Sunshine Apartment',
    createdAt: '2024-02-18T09:00:00Z',
    updatedAt: '2024-02-19T16:20:00Z',
  },
]

export const mockMessages: ChatMessage[] = [
  {
    id: 'msg1',
    chatId: 'chat1',
    senderId: 'user1',
    receiverId: 'owner1',
    type: 'text',
    content: 'Hello, is the Green Valley Mess still available?',
    status: 'read',
    timestamp: '2024-02-20T10:00:00Z',
    readAt: '2024-02-20T10:05:00Z',
  },
  {
    id: 'msg2',
    chatId: 'chat1',
    senderId: 'owner1',
    receiverId: 'user1',
    type: 'text',
    content: 'Yes, the property is still available. When would you like to visit?',
    status: 'read',
    timestamp: '2024-02-20T14:30:00Z',
    readAt: '2024-02-20T14:35:00Z',
  },
  {
    id: 'msg3',
    chatId: 'chat1',
    senderId: 'user1',
    receiverId: 'owner1',
    type: 'text',
    content: 'Can I visit this weekend?',
    status: 'delivered',
    timestamp: '2024-02-20T15:00:00Z',
  },
  {
    id: 'msg4',
    chatId: 'chat1',
    senderId: 'user1',
    receiverId: 'owner1',
    type: 'text',
    content: 'Also, what documents do I need to bring?',
    status: 'sent',
    timestamp: '2024-02-20T15:01:00Z',
  },
  {
    id: 'msg5',
    chatId: 'chat2',
    senderId: 'user1',
    receiverId: 'owner2',
    type: 'text',
    content: 'Hi, I am interested in the Sunshine Apartment.',
    status: 'read',
    timestamp: '2024-02-18T09:00:00Z',
    readAt: '2024-02-18T09:10:00Z',
  },
  {
    id: 'msg6',
    chatId: 'chat2',
    senderId: 'owner2',
    receiverId: 'user1',
    type: 'text',
    content: 'Thank you for your interest!',
    status: 'read',
    timestamp: '2024-02-19T16:20:00Z',
    readAt: '2024-02-19T16:25:00Z',
  },
  {
    id: 'msg7',
    chatId: 'chat1',
    senderId: 'owner1',
    receiverId: 'user1',
    type: 'image',
    content: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200',
    status: 'sent',
    timestamp: '2024-02-20T16:00:00Z',
  },
]

// Helper functions
export function getChatsByUserId(userId: string): Chat[] {
  return mockChats.filter(
    chat => chat.participant1Id === userId || chat.participant2Id === userId
  )
}

export function getMessagesByChatId(chatId: string): ChatMessage[] {
  return mockMessages
    .filter(msg => msg.chatId === chatId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

export function getChatById(chatId: string): Chat | undefined {
  return mockChats.find(chat => chat.id === chatId)
}

export function getChatUser(userId: string): ChatUser | undefined {
  return mockChatUsers.find(user => user.id === userId)
}

export function getUnreadCount(userId: string): number {
  return mockChats
    .filter(chat => {
      const isParticipant1 = chat.participant1Id === userId
      const isParticipant2 = chat.participant2Id === userId
      return isParticipant1 || isParticipant2
    })
    .reduce((total, chat) => {
      // Check if last message was sent by the other participant
      const lastMessage = mockMessages
        .filter(m => m.chatId === chat.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      
      if (lastMessage && lastMessage.receiverId === userId) {
        return total + chat.unreadCount
      }
      return total
    }, 0)
}
