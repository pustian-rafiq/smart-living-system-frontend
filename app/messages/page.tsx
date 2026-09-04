'use client'

import { useState, useMemo, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { EmptyState, LoadingState } from '@/components/page'
import { ChatList } from '@/components/chat/ChatList'
import { ChatWindow } from '@/components/chat/ChatWindow'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Chat, ChatMessage, ChatUser } from '@/types/chat'
import type { Property } from '@/types/property'
import { Plus, Search } from 'lucide-react'
import { useSSE } from '@/hooks/useSSE'
import {
  fetchUserChats,
  fetchChatMessages,
  fetchMessageProperties,
  sendChatMessage,
  createChat,
  fetchChatUser,
  fetchChatById,
} from '@/lib/api/messages'
import { getCurrentAccountUserId } from '@/lib/api/account'
import { uploadMediaFile } from '@/lib/api/media'

function MessagesPageContent() {
  const t = useTranslations('tools.messages')
  const tc = useTranslations('common')
  const searchParams = useSearchParams()
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)
  const [searchProperty, setSearchProperty] = useState('')
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('')
  const [userChats, setUserChats] = useState<Chat[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [otherParticipant, setOtherParticipant] = useState<
    ChatUser | undefined
  >(undefined)
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const currentUserId = getCurrentAccountUserId()

  const loadChats = useCallback(async () => {
    const result = await fetchUserChats(currentUserId)
    if (result.ok) {
      setUserChats(
        result.data.sort((a, b) => {
          const timeA = a.lastMessageTime
            ? new Date(a.lastMessageTime).getTime()
            : 0
          const timeB = b.lastMessageTime
            ? new Date(b.lastMessageTime).getTime()
            : 0
          return timeB - timeA
        })
      )
    }
  }, [currentUserId])

  useEffect(() => {
    let mounted = true
    setIsLoading(true)
    Promise.all([
      loadChats(),
      fetchMessageProperties().then(result => {
        if (result.ok) setProperties(result.data)
      }),
    ]).finally(() => {
      if (mounted) setIsLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [loadChats])

  useEffect(() => {
    const propertyId = searchParams.get('propertyId')
    if (propertyId) {
      const existingChat = userChats.find(
        chat => chat.propertyId === propertyId
      )
      if (existingChat) {
        setSelectedChatId(existingChat.id)
      } else {
        setSelectedPropertyId(propertyId)
        setShowNewChatDialog(true)
      }
    }
  }, [searchParams, userChats])

  useEffect(() => {
    if (!selectedChatId) {
      setSelectedChat(null)
      setChatMessages([])
      setOtherParticipant(undefined)
      return
    }

    fetchChatById(selectedChatId).then(result => {
      if (result.ok) setSelectedChat(result.data ?? null)
    })
    fetchChatMessages(selectedChatId).then(result => {
      if (result.ok) setChatMessages(result.data)
    })
  }, [selectedChatId])

  useSSE(
    selectedChatId ? `/chats/${selectedChatId}/messages/stream/` : null,
    {
      onEvent: (event, data) => {
        if (event !== 'messages' || !data || typeof data !== 'object') return
        const incoming = (data as { messages?: ChatMessage[] }).messages || []
        if (!incoming.length) return
        setChatMessages(prev => {
          const ids = new Set(prev.map(m => m.id))
          const merged = [...prev]
          for (const msg of incoming) {
            if (!ids.has(msg.id)) merged.push(msg)
          }
          return merged
        })
      },
    },
    Boolean(selectedChatId),
  )

  useEffect(() => {
    if (!selectedChat) {
      setOtherParticipant(undefined)
      return
    }
    const otherId =
      selectedChat.participant1Id === currentUserId
        ? selectedChat.participant2Id
        : selectedChat.participant1Id
    fetchChatUser(otherId).then(result => {
      if (result.ok) setOtherParticipant(result.data)
    })
  }, [selectedChat, currentUserId])

  const handleChatSelect = (chat: Chat) => {
    setSelectedChatId(chat.id)
  }

  const handleSendMessage = async (
    content: string,
    type: 'text' | 'image' | 'file' = 'text'
  ) => {
    if (!selectedChat) return

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId: selectedChat.id,
      senderId: currentUserId,
      receiverId:
        selectedChat.participant1Id === currentUserId
          ? selectedChat.participant2Id
          : selectedChat.participant1Id,
      type,
      content,
      status: 'sending',
      timestamp: new Date().toISOString(),
    }

    setTimeout(() => {
      newMessage.status = 'sent'
    }, 500)

    const result = await sendChatMessage(selectedChat.id, newMessage)
    if (result.ok) {
      setChatMessages(prev => [...prev, result.data])
      await loadChats()
    }
  }

  const handleSendFile = async (file: File) => {
    if (!selectedChat) return
    const kind = file.type.startsWith('image/') ? 'image' : 'document'
    const uploaded = await uploadMediaFile(file, kind)
    if (!uploaded.ok) return
    handleSendMessage(uploaded.data.url, 'file')
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleNewChat = async () => {
    if (selectedPropertyId) {
      const property = properties.find(p => p.id === selectedPropertyId)
      if (property) {
        const existingChat = userChats.find(
          chat => chat.propertyId === property.id
        )

        if (existingChat) {
          setSelectedChatId(existingChat.id)
          setShowNewChatDialog(false)
        } else {
          const newChat: Chat = {
            id: `chat-${Date.now()}`,
            participant1Id: currentUserId,
            participant2Id: property.ownerId,
            participant1Name: 'Current User',
            participant2Name: property.ownerName,
            lastMessage: undefined,
            unreadCount: 0,
            propertyId: property.id,
            propertyName: property.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          const result = await createChat(newChat)
          if (result.ok) {
            setUserChats(prev => [result.data, ...prev])
            setSelectedChatId(result.data.id)
            setShowNewChatDialog(false)
          }
        }
      }
    }
  }

  const filteredProperties = useMemo(() => {
    if (!searchProperty) return properties.slice(0, 10)
    const searchLower = searchProperty.toLowerCase()
    return properties.filter(
      p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.address.toLowerCase().includes(searchLower) ||
        p.area.toLowerCase().includes(searchLower)
    )
  }, [searchProperty, properties])

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">{t('title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {isLoading ? (
          <LoadingState label={t('loading')} variant="skeleton" />
        ) : userChats.length === 0 ? (
          <EmptyState title={t('emptyTitle')} description={t('emptyDesc')}>
            <Button onClick={() => setShowNewChatDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {t('startNewChat')}
            </Button>
          </EmptyState>
        ) : null}

        {!isLoading && userChats.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
            <div className="lg:col-span-1">
              <ChatList
                chats={userChats}
                currentUserId={currentUserId}
                selectedChatId={selectedChatId || undefined}
                onChatSelect={handleChatSelect}
                onNewChat={() => setShowNewChatDialog(true)}
              />
            </div>

            <div className="lg:col-span-2">
              <ChatWindow
                chat={selectedChat}
                currentUserId={currentUserId}
                messages={chatMessages}
                otherParticipant={otherParticipant}
                onSendMessage={handleSendMessage}
                onSendFile={handleSendFile}
                onCall={handleCall}
              />
            </div>
          </div>
        )}

        <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('startNewChat')}</DialogTitle>
              <DialogDescription>{t('startNewChatDesc')}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">{t('searchProperty')}</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder={t('searchPropertyPlaceholder')}
                    value={searchProperty}
                    onChange={e => setSearchProperty(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <Label>{t('chooseProperty')}</Label>
                <Select
                  value={selectedPropertyId}
                  onValueChange={setSelectedPropertyId}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={t('selectProperty')} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProperties.map(property => (
                      <SelectItem key={property.id} value={property.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{property.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {property.area}, {property.city}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowNewChatDialog(false)}
                >
                  {tc('cancel')}
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleNewChat}
                  disabled={!selectedPropertyId}
                >
                  {t('startChat')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}

export default function MessagesPage() {
  const t = useTranslations('tools.messages')
  const tc = useTranslations('common')

  return (
    <Suspense
      fallback={
        <Layout>
          <div className="flex min-h-[40vh] items-center justify-center p-8 text-muted-foreground">
            {t('loading')}
          </div>
        </Layout>
      }
    >
      <MessagesPageContent />
    </Suspense>
  )
}
