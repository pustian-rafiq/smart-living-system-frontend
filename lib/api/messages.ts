import type { Chat, ChatMessage, ChatUser } from '@/types/chat'
import {
  mockChats,
  mockMessages,
  getChatsByUserId,
  getMessagesByChatId,
  getChatById,
  getChatUser,
  getUnreadCount,
} from '@/data/mockChats'
import { fetchProperties } from './properties'
import type { Property } from '@/types/property'
import { getDemoChatUserId } from './demoUser'
import { mockDelay, ok, type ApiResult } from './http'

export async function fetchUserChats(
  userId?: string
): Promise<ApiResult<Chat[]>> {
  await mockDelay()
  const id = userId || getDemoChatUserId()
  return ok(getChatsByUserId(id))
}

export async function fetchChatMessages(
  chatId: string
): Promise<ApiResult<ChatMessage[]>> {
  await mockDelay(150)
  return ok(getMessagesByChatId(chatId))
}

export async function fetchChatById(
  chatId: string
): Promise<ApiResult<Chat | undefined>> {
  await mockDelay(100)
  return ok(getChatById(chatId))
}

export async function fetchChatUser(
  userId: string
): Promise<ApiResult<ChatUser | undefined>> {
  await mockDelay(50)
  return ok(getChatUser(userId))
}

export async function fetchUnreadMessageCount(
  userId?: string
): Promise<ApiResult<number>> {
  await mockDelay(50)
  return ok(getUnreadCount(userId || getDemoChatUserId()))
}

export async function sendChatMessage(
  chatId: string,
  message: ChatMessage
): Promise<ApiResult<ChatMessage>> {
  await mockDelay(100)
  mockMessages.push(message)
  const chat = getChatById(chatId)
  if (chat) {
    chat.lastMessage = message.content
    chat.lastMessageTime = message.timestamp
  }
  return ok(message)
}

export async function createChat(chat: Chat): Promise<ApiResult<Chat>> {
  await mockDelay(150)
  mockChats.unshift(chat)
  return ok(chat)
}

export async function fetchMessageProperties(): Promise<ApiResult<Property[]>> {
  return fetchProperties()
}
