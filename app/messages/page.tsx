'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
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
import {
  mockChats,
  mockMessages,
  getChatsByUserId,
  getMessagesByChatId,
  getChatUser,
  getChatById,
} from '@/data/mockChats'
import { mockProperties } from '@/data/mockProperties'
import type { Chat, ChatMessage } from '@/types/chat'
import { Plus, Search } from 'lucide-react'

function MessagesPageContent() {
  const searchParams = useSearchParams()
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)
  const [searchProperty, setSearchProperty] = useState('')
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('')

  // Get current user ID (in real app, this would come from auth)
  const currentUserId = 'user1' // Mock user ID

  const userChats = useMemo(() => {
    return getChatsByUserId(currentUserId).sort((a, b) => {
      const timeA = a.lastMessageTime
        ? new Date(a.lastMessageTime).getTime()
        : 0
      const timeB = b.lastMessageTime
        ? new Date(b.lastMessageTime).getTime()
        : 0
      return timeB - timeA
    })
  }, [currentUserId])

  // Check for propertyId in URL params
  useEffect(() => {
    const propertyId = searchParams.get('propertyId')
    if (propertyId) {
      // Find or create chat for this property
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

  const selectedChat = useMemo(() => {
    if (!selectedChatId) return null
    return getChatById(selectedChatId) || null
  }, [selectedChatId])

  const chatMessages = useMemo(() => {
    if (!selectedChatId) return []
    return getMessagesByChatId(selectedChatId)
  }, [selectedChatId])

  const otherParticipant = useMemo(() => {
    if (!selectedChat) return undefined
    const otherId =
      selectedChat.participant1Id === currentUserId
        ? selectedChat.participant2Id
        : selectedChat.participant1Id
    return getChatUser(otherId)
  }, [selectedChat, currentUserId])

  const handleChatSelect = (chat: Chat) => {
    setSelectedChatId(chat.id)
    // In real app, mark messages as read
  }

  const handleSendMessage = (
    content: string,
    type: 'text' | 'image' | 'file' = 'text'
  ) => {
    if (!selectedChat) return

    // In real app, this would call an API
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

    // Simulate sending
    setTimeout(() => {
      newMessage.status = 'sent'
      // In real app, update via API
    }, 500)

    // Add to mock messages (in real app, this would be handled by API/WebSocket)
    mockMessages.push(newMessage)
  }

  const handleSendFile = (file: File) => {
    if (!selectedChat) return

    // In real app, upload file first, then send URL
    const fileUrl = URL.createObjectURL(file)
    handleSendMessage(fileUrl, 'file')
  }

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const handleNewChat = () => {
    if (selectedPropertyId) {
      const property = mockProperties.find(p => p.id === selectedPropertyId)
      if (property) {
        // Check if chat already exists
        const existingChat = userChats.find(
          chat => chat.propertyId === property.id
        )

        if (existingChat) {
          setSelectedChatId(existingChat.id)
          setShowNewChatDialog(false)
        } else {
          // Create new chat (in real app, this would call an API)
          const newChat: Chat = {
            id: `chat-${Date.now()}`,
            participant1Id: currentUserId,
            participant2Id: 'owner1', // In real app, get from property
            participant1Name: 'Current User',
            participant2Name: property.ownerName,
            lastMessage: undefined,
            unreadCount: 0,
            propertyId: property.id,
            propertyName: property.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          mockChats.push(newChat)
          setSelectedChatId(newChat.id)
          setShowNewChatDialog(false)
        }
      }
    }
  }

  const filteredProperties = useMemo(() => {
    if (!searchProperty) return mockProperties.slice(0, 10)
    const searchLower = searchProperty.toLowerCase()
    return mockProperties.filter(
      p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.address.toLowerCase().includes(searchLower) ||
        p.area.toLowerCase().includes(searchLower)
    )
  }, [searchProperty])

  return (
    <Layout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Chat with property owners and renters
          </p>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-12rem)]">
          {/* Chat List */}
          <div className="lg:col-span-1">
            <ChatList
              chats={userChats}
              currentUserId={currentUserId}
              selectedChatId={selectedChatId || undefined}
              onChatSelect={handleChatSelect}
              onNewChat={() => setShowNewChatDialog(true)}
            />
          </div>

          {/* Chat Window */}
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

        {/* New Chat Dialog */}
        <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Chat</DialogTitle>
              <DialogDescription>
                Select a property to start chatting with the owner
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="search">Search Property</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, address, or area..."
                    value={searchProperty}
                    onChange={e => setSearchProperty(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <Label>Select Property</Label>
                <Select
                  value={selectedPropertyId}
                  onValueChange={setSelectedPropertyId}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a property" />
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
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleNewChat}
                  disabled={!selectedPropertyId}
                >
                  Start Chat
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
  return (
    <Suspense
      fallback={
        <Layout>
          <div className="flex min-h-[40vh] items-center justify-center p-8 text-muted-foreground">
            Loading messages…
          </div>
        </Layout>
      }
    >
      <MessagesPageContent />
    </Suspense>
  )
}
