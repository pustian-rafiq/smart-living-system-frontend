'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Layout } from '@/components/layout/Layout'
import { CreateNoticeDialog } from '@/components/notice/CreateNoticeDialog'
import { BulkNoticeDialog } from '@/components/bulk/BulkNoticeDialog'
import { BulkSMSDialog } from '@/components/bulk/BulkSMSDialog'
import { EnhancedNoticeBoard } from '@/components/notice/EnhancedNoticeBoard'
import { Plus, Search, Filter, Trash2, Edit, Eye, CheckCircle2 } from 'lucide-react'
import { mockMess, mockNotices, addNotice, updateNotice, deleteNotice, acknowledgeNotice } from '@/data/mockMess'
import { getStoredRole } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import type { Notice } from '@/types/mess'
import { format } from 'date-fns'

export default function NoticesPage() {
  const router = useRouter()
  const role = getStoredRole()
  const [notices, setNotices] = useState<Notice[]>(mockNotices)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isBulkNoticeDialogOpen, setIsBulkNoticeDialogOpen] = useState(false)
  const [isBulkSMSDialogOpen, setIsBulkSMSDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedMess, setSelectedMess] = useState<string>('all')

  // Mock current user ID (in real app, get from auth context)
  const currentUserId = 'owner1'

  // Filter notices
  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !notice.title.toLowerCase().includes(query) &&
          !notice.content.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Category filter
      if (categoryFilter !== 'all' && notice.category !== categoryFilter) {
        return false
      }

      // Priority filter
      if (priorityFilter !== 'all' && notice.priority !== priorityFilter) {
        return false
      }

      // Status filter
      if (statusFilter === 'active') {
        if (notice.expiryDate && new Date(notice.expiryDate) < new Date()) {
          return false
        }
      } else if (statusFilter === 'expired') {
        if (!notice.expiryDate || new Date(notice.expiryDate) >= new Date()) {
          return false
        }
      }

      // Mess filter
      if (selectedMess !== 'all' && notice.messId !== selectedMess) {
        return false
      }

      return true
    })
  }, [notices, searchQuery, categoryFilter, priorityFilter, statusFilter, selectedMess])

  const activeNotices = filteredNotices.filter((notice) => {
    if (!notice.expiryDate) return true
    return new Date(notice.expiryDate) >= new Date()
  })

  const expiredNotices = filteredNotices.filter((notice) => {
    if (!notice.expiryDate) return false
    return new Date(notice.expiryDate) < new Date()
  })

  const handleCreateNotice = (data: any) => {
    // In a real app, upload files to server and get URLs
    const newNotice: Notice = {
      id: `notice-${Date.now()}`,
      title: data.title,
      content: data.content,
      date: new Date().toISOString(),
      priority: data.priority,
      messId: selectedMess !== 'all' ? selectedMess : mockMess[0].id,
      category: data.category,
      expiryDate: data.expiryDate ? data.expiryDate.toISOString() : undefined,
      pdfUrl: data.pdfFile ? URL.createObjectURL(data.pdfFile) : undefined,
      imageUrls: data.imageFiles?.map((file: File) => URL.createObjectURL(file)),
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
      acknowledgments: [],
    }

    addNotice(newNotice)
    setNotices([...notices, newNotice])
    setIsCreateDialogOpen(false)
  }

  const handleDeleteNotice = (noticeId: string) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      deleteNotice(noticeId)
      setNotices(notices.filter(n => n.id !== noticeId))
    }
  }

  const handleAcknowledge = (noticeId: string) => {
    acknowledgeNotice(noticeId, currentUserId, 'Current User')
    setNotices(notices.map(n => {
      if (n.id === noticeId) {
        return {
          ...n,
          acknowledgments: [
            ...(n.acknowledgments || []),
            {
              userId: currentUserId,
              userName: 'Current User',
              acknowledgedAt: new Date().toISOString(),
            },
          ],
        }
      }
      return n
    }))
  }

  if (role !== 'owner') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">You don't have permission to access this page.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Notice Management</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage notices for your mess/hostel
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Notice
            </Button>
            <Button onClick={() => setIsBulkNoticeDialogOpen(true)} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Bulk Notice
            </Button>
            <Button onClick={() => setIsBulkSMSDialogOpen(true)} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Bulk SMS
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="sm:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search notices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Select value={selectedMess} onValueChange={setSelectedMess}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Mess" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Mess</SelectItem>
                  {mockMess.map((mess) => (
                    <SelectItem key={mess.id} value={mess.id}>
                      {mess.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="rule">Rule</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notices List */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All ({filteredNotices.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeNotices.length})</TabsTrigger>
            <TabsTrigger value="expired">Expired ({expiredNotices.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <EnhancedNoticeBoard
              notices={filteredNotices}
              userId={currentUserId}
              onAcknowledge={handleAcknowledge}
              showAcknowledgment={false}
            />
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <EnhancedNoticeBoard
              notices={activeNotices}
              userId={currentUserId}
              onAcknowledge={handleAcknowledge}
              showAcknowledgment={false}
            />
          </TabsContent>

          <TabsContent value="expired" className="mt-4">
            <EnhancedNoticeBoard
              notices={expiredNotices}
              userId={currentUserId}
              onAcknowledge={handleAcknowledge}
              showAcknowledgment={false}
            />
          </TabsContent>
        </Tabs>

        {/* Notice Management Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Notices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredNotices.map((notice) => {
                const isExpired = notice.expiryDate && new Date(notice.expiryDate) < new Date()
                const ackCount = notice.acknowledgments?.length || 0

                return (
                  <div
                    key={notice.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <h3 className="font-semibold">{notice.title}</h3>
                        {isExpired && (
                          <Badge variant="outline" className="bg-red-50 text-red-600">
                            Expired
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>{format(new Date(notice.date), 'MMM dd, yyyy')}</span>
                        {notice.category && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {notice.category}
                            </Badge>
                          </>
                        )}
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {notice.priority}
                        </Badge>
                        {ackCount > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {ackCount} acknowledged
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteNotice(notice.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}

              {filteredNotices.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No notices found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <CreateNoticeDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          messId={selectedMess !== 'all' ? selectedMess : mockMess[0].id}
          onSubmit={handleCreateNotice}
        />
        <BulkNoticeDialog
          open={isBulkNoticeDialogOpen}
          onOpenChange={setIsBulkNoticeDialogOpen}
          onSubmit={(data) => {
            // Handle bulk notice sending
            alert(`Bulk notice sent to ${data.buildingId || data.messId ? 'multiple' : 'all'} recipients`)
            // In a real app, this would send notices to all selected recipients
          }}
        />
        <BulkSMSDialog
          open={isBulkSMSDialogOpen}
          onOpenChange={setIsBulkSMSDialogOpen}
          onSubmit={(data) => {
            // Handle bulk SMS sending
            alert(`Bulk SMS sent to ${data.recipientType} recipients`)
            // In a real app, this would send SMS to all selected recipients
          }}
        />
      </div>
    </Layout>
  )
}
