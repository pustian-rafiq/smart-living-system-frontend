'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { BulkSMSDialog } from '@/components/sms/BulkSMSDialog'
import { SMSTemplateDialog } from '@/components/sms/SMSTemplateDialog'
import { SMSGroupDialog } from '@/components/sms/SMSGroupDialog'
import { SMSHistoryCard } from '@/components/sms/SMSHistoryCard'
import {
  getSMSTemplatesByMess,
  getSMSGroupsByMess,
  getSMSMessagesByMess,
  getSMSHistory,
  addSMSTemplate,
  updateSMSTemplate,
  deleteSMSTemplate,
  addSMSGroup,
  updateSMSGroup,
  deleteSMSGroup,
  sendBulkSMS,
} from '@/lib/api/messDomain'
import { fetchMessById } from '@/lib/api/mess'
import { getCurrentAccountUserId } from '@/lib/api/account'
import { useMockQuery } from '@/hooks/useMockQuery'
import { getStoredRole } from '@/utils/auth'
import {
  Plus,
  Send,
  FileText,
  Users,
  Trash2,
  Edit,
  MessageSquare,
  DollarSign,
} from 'lucide-react'
import type { SMSTemplate, SMSGroup, SMSMessage, SMSHistory } from '@/types/sms'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'

export default function SMSManagementPage() {
  const t = useTranslations('mess')
  const tc = useTranslations('common')
  const { confirm } = useConfirm()
  const params = useParams()
  const router = useRouter()
  const role = getStoredRole()
  const messId = params.messId as string
  const ownerId = getCurrentAccountUserId()

  const loadMess = useCallback(() => fetchMessById(messId), [messId])
  const { data: mess } = useMockQuery(loadMess)
  const [templates, setTemplates] = useState<SMSTemplate[]>([])
  const [groups, setGroups] = useState<SMSGroup[]>([])
  const [smsHistory, setSMSHistory] = useState<SMSMessage[]>([])
  const [history, setHistory] = useState<SMSHistory>({
    messages: [],
    totalSent: 0,
    totalFailed: 0,
    totalCost: 0,
    period: { startDate: '', endDate: '' },
  })
  const [isBulkSMSDialogOpen, setIsBulkSMSDialogOpen] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<SMSTemplate | null>(
    null
  )
  const [editingGroup, setEditingGroup] = useState<SMSGroup | null>(null)

  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd')

  useEffect(() => {
    void getSMSTemplatesByMess(messId).then(setTemplates)
    void getSMSGroupsByMess(messId).then(setGroups)
    void getSMSMessagesByMess(messId).then(setSMSHistory)
  }, [messId])

  useEffect(() => {
    void getSMSHistory(messId, monthStart, monthEnd).then(setHistory)
  }, [messId, monthStart, monthEnd])

  useEffect(() => {
    if (role !== 'owner') {
      router.replace('/dashboard')
    }
  }, [role, router])

  const handleTemplateSubmit = async (data: Parameters<typeof addSMSTemplate>[0]) => {
    if (editingTemplate) {
      await updateSMSTemplate(editingTemplate.id, { ...data, messId })
    } else {
      await addSMSTemplate({ ...data, messId })
    }
    setTemplates(await getSMSTemplatesByMess(messId))
    setEditingTemplate(null)
  }

  const handleTemplateDelete = async (templateId: string) => {
    const ok = await confirm({
      title: t('sms.deleteTemplateTitle'),
      description: t('sms.deleteTemplateDesc'),
      variant: 'destructive',
    })
    if (!ok) return
    await deleteSMSTemplate(messId, templateId)
    setTemplates(await getSMSTemplatesByMess(messId))
  }

  const handleGroupSubmit = async (data: Parameters<typeof addSMSGroup>[0]) => {
    if (editingGroup) {
      await updateSMSGroup(editingGroup.id, { ...data, messId })
    } else {
      await addSMSGroup(data)
    }
    setGroups(await getSMSGroupsByMess(messId))
    setEditingGroup(null)
  }

  const handleGroupDelete = async (groupId: string) => {
    const ok = await confirm({
      title: t('sms.deleteGroupTitle'),
      description: t('sms.deleteGroupDesc'),
      variant: 'destructive',
    })
    if (!ok) return
    await deleteSMSGroup(messId, groupId)
    setGroups(await getSMSGroupsByMess(messId))
  }

  const handleBulkSMSSubmit = async (data: Record<string, unknown>) => {
    const message = await sendBulkSMS(messId, {
      templateId: data.templateId || undefined,
      content: data.content,
      recipientType: data.recipientType,
      recipients: data.recipients,
      totalRecipients: data.totalRecipients,
      sentBy: ownerId,
      gateway: data.gateway || 'bKash',
    })
    setSMSHistory(await getSMSMessagesByMess(messId))
    void getSMSHistory(messId, monthStart, monthEnd).then(setHistory)
    if (message) {
      toast.success(t('sms.sendSuccess', { count: message.successful }))
    }
  }

  if (role !== 'owner') {
    return null
  }

  if (!mess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <p className="text-center">{t('notFound')}</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout userRole="owner">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {t('sms.managementTitle')}
            </h1>
            <p className="text-muted-foreground">{mess.name}</p>
          </div>
          <Button onClick={() => setIsBulkSMSDialogOpen(true)}>
            <Send className="h-4 w-4 mr-2" />
            {t('sms.sendBulk')}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                {t('sms.totalSent')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{history.totalSent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-red-600" />
                {t('sms.failed')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{history.totalFailed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                {t('sms.totalCost')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ৳{history.totalCost.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                {t('sms.templates')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{templates.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList>
            <TabsTrigger value="history">
              {t('sms.tabs.history')}
            </TabsTrigger>
            <TabsTrigger value="templates">
              {t('sms.tabs.templates')}
            </TabsTrigger>
            <TabsTrigger value="groups">{t('sms.tabs.groups')}</TabsTrigger>
          </TabsList>

          {/* SMS History Tab */}
          <TabsContent value="history" className="space-y-4">
            {smsHistory.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {smsHistory.map(message => (
                  <SMSHistoryCard key={message.id} message={message} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    {t('sms.emptyHistory')}
                  </p>
                  <Button onClick={() => setIsBulkSMSDialogOpen(true)}>
                    <Send className="h-4 w-4 mr-2" />
                    {t('sms.sendFirstSms')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {t('sms.templatesTitle')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('sms.templatesDesc')}
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingTemplate(null)
                  setIsTemplateDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('sms.createTemplate')}
              </Button>
            </div>

            {templates.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {templates.map(template => (
                  <Card
                    key={template.id}
                    className="transition-all hover:shadow-md"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">
                            {template.name}
                          </CardTitle>
                          {template.category && (
                            <Badge variant="outline" className="mt-2">
                              {template.category}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingTemplate(template)
                              setIsTemplateDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTemplateDelete(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {template.content}
                      </p>
                      {template.variables && template.variables.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {template.variables.map(variable => (
                            <Badge
                              key={variable}
                              variant="outline"
                              className="text-xs"
                            >
                              {'{' + variable + '}'}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    {t('sms.emptyTemplates')}
                  </p>
                  <Button onClick={() => setIsTemplateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('sms.createTemplate')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {t('sms.groupsTitle')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('sms.groupsDesc')}
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingGroup(null)
                  setIsGroupDialogOpen(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('sms.createGroup')}
              </Button>
            </div>

            {groups.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups.map(group => (
                  <Card
                    key={group.id}
                    className="transition-all hover:shadow-md"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base">
                            {group.name}
                          </CardTitle>
                          {group.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {group.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingGroup(group)
                              setIsGroupDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGroupDelete(group.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {t('sms.members', {
                            count: group.memberIds.length,
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    {t('sms.emptyGroups')}
                  </p>
                  <Button onClick={() => setIsGroupDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('sms.createGroup')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <BulkSMSDialog
          messId={messId}
          open={isBulkSMSDialogOpen}
          onOpenChange={setIsBulkSMSDialogOpen}
          onSubmit={handleBulkSMSSubmit}
        />
        <SMSTemplateDialog
          template={editingTemplate}
          messId={messId}
          open={isTemplateDialogOpen}
          onOpenChange={open => {
            setIsTemplateDialogOpen(open)
            if (!open) setEditingTemplate(null)
          }}
          onSubmit={handleTemplateSubmit}
        />
        <SMSGroupDialog
          group={editingGroup}
          messId={messId}
          open={isGroupDialogOpen}
          onOpenChange={open => {
            setIsGroupDialogOpen(open)
            if (!open) setEditingGroup(null)
          }}
          onSubmit={handleGroupSubmit}
        />
      </div>
    </Layout>
  )
}
