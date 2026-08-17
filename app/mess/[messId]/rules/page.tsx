'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RuleCard } from '@/components/rules/RuleCard'
import { RuleDialog } from '@/components/rules/RuleDialog'
import { ViolationCard } from '@/components/rules/ViolationCard'
import {
  getRulesByMess,
  getViolationsByMess,
  getAcceptancesByStudent,
  addRule,
  updateRule,
  deleteRule,
  acceptRule,
  updateViolation,
} from '@/lib/api/messDomain'
import { fetchMessById } from '@/lib/api/mess'
import { getDemoTenantId, getDemoOwnerId } from '@/lib/api/demoUser'
import { useMockQuery } from '@/hooks/useMockQuery'
import { getStoredRole } from '@/utils/auth'
import { Plus, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { MessRule, RuleAcceptance, RuleViolation } from '@/types/messRules'
import { useConfirm } from '@/components/feedback'
import { toast } from '@/lib/feedback/toast'

export default function RulesManagementPage() {
  const t = useTranslations('mess')
  const tc = useTranslations('common')
  const { confirm } = useConfirm()
  const params = useParams()
  const role = getStoredRole()
  const messId = params.messId as string

  const loadMess = useCallback(() => fetchMessById(messId), [messId])
  const { data: mess } = useMockQuery(loadMess)
  const [rules, setRules] = useState<MessRule[]>([])
  const [violations, setViolations] = useState<RuleViolation[]>([])
  const [studentAcceptances, setStudentAcceptances] = useState<RuleAcceptance[]>(
    []
  )
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<MessRule | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')

  const currentStudentId = getDemoTenantId()
  const ownerId = getDemoOwnerId()

  useEffect(() => {
    void getRulesByMess(messId).then(setRules)
    void getViolationsByMess(messId).then(setViolations)
  }, [messId])

  useEffect(() => {
    void getAcceptancesByStudent(currentStudentId).then(setStudentAcceptances)
  }, [currentStudentId])

  const acceptedRuleIds = useMemo(
    () => new Set(studentAcceptances.map(acc => acc.ruleId)),
    [studentAcceptances]
  )

  const filteredViolations = useMemo(() => {
    let filtered = violations

    if (statusFilter !== 'all') {
      filtered = filtered.filter(v => v.status === statusFilter)
    }
    if (severityFilter !== 'all') {
      filtered = filtered.filter(v => v.severity === severityFilter)
    }

    return filtered
  }, [violations, statusFilter, severityFilter])

  const handleRuleSubmit = async (data: Parameters<typeof addRule>[0]) => {
    if (editingRule) {
      await updateRule(editingRule.id, { ...data, messId })
    } else {
      await addRule(data)
    }
    setRules(await getRulesByMess(messId))
    setEditingRule(null)
  }

  const handleRuleDelete = async (ruleId: string) => {
    const ok = await confirm({
      title: t('rules.deleteTitle'),
      description: t('rules.deleteDesc'),
      variant: 'destructive',
    })
    if (!ok) return
    await deleteRule(messId, ruleId)
    setRules(await getRulesByMess(messId))
  }

  const handleAcceptRule = async (rule: MessRule) => {
    const result = await acceptRule(messId, rule.id)
    if (result) {
      setRules(await getRulesByMess(messId))
      toast.success(t('rules.acceptSuccess'))
    }
  }

  const handleResolveViolation = async (violation: RuleViolation) => {
    const notes = prompt(t('rules.resolutionPrompt'))
    if (notes) {
      await updateViolation(violation.id, {
        status: 'resolved',
        resolutionNotes: notes,
        resolvedBy: role === 'owner' ? ownerId : currentStudentId,
        messId,
      })
      setViolations(await getViolationsByMess(messId))
    }
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

  const isOwner = role === 'owner'
  const isRenter = role === 'renter'

  return (
    <Layout userRole={role as 'owner' | 'renter'}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {t('rules.managementTitle')}
            </h1>
            <p className="text-muted-foreground">{mess.name}</p>
          </div>
          {isOwner && (
            <Button
              onClick={() => {
                setEditingRule(null)
                setIsRuleDialogOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('rules.createRule')}
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="rules" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rules">
              <FileText className="h-4 w-4 mr-2" />
              {t('rules.tabs.rules')}
            </TabsTrigger>
            {isOwner && (
              <TabsTrigger value="violations">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {t('rules.tabs.violations')}
              </TabsTrigger>
            )}
            {isRenter && (
              <TabsTrigger value="my-violations">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {t('rules.tabs.myViolations')}
              </TabsTrigger>
            )}
          </TabsList>

          {/* Rules Tab */}
          <TabsContent value="rules" className="space-y-4">
            {rules.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rules.map(rule => (
                  <RuleCard
                    key={rule.id}
                    rule={rule}
                    isAccepted={acceptedRuleIds.has(rule.id)}
                    onAccept={isRenter ? handleAcceptRule : undefined}
                    showActions={isRenter}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">
                    {t('rules.emptyRules')}
                  </p>
                  {isOwner && (
                    <Button onClick={() => setIsRuleDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('rules.createFirstRule')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Violations Tab (Owner) */}
          {isOwner && (
            <TabsContent value="violations" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {t('rules.violationsTitle')}
                </h2>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t('rules.allStatus')}
                      </SelectItem>
                      <SelectItem value="pending">
                        {tc('status.pending')}
                      </SelectItem>
                      <SelectItem value="resolved">
                        {tc('status.resolved')}
                      </SelectItem>
                      <SelectItem value="appealed">
                        {t('rules.status.appealed')}
                      </SelectItem>
                      <SelectItem value="dismissed">
                        {t('rules.status.dismissed')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={severityFilter}
                    onValueChange={setSeverityFilter}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t('rules.allSeverity')}
                      </SelectItem>
                      <SelectItem value="minor">
                        {t('rules.severity.minor')}
                      </SelectItem>
                      <SelectItem value="moderate">
                        {t('rules.severity.moderate')}
                      </SelectItem>
                      <SelectItem value="major">
                        {t('rules.severity.major')}
                      </SelectItem>
                      <SelectItem value="critical">
                        {t('rules.severity.critical')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredViolations.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredViolations.map(violation => (
                    <ViolationCard
                      key={violation.id}
                      violation={violation}
                      onResolve={handleResolveViolation}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">
                      {t('rules.emptyViolations')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          {/* My Violations Tab (Renter) */}
          {isRenter && (
            <TabsContent value="my-violations" className="space-y-4">
              {violations.filter(v => v.studentId === currentStudentId).length >
              0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {violations
                    .filter(v => v.studentId === currentStudentId)
                    .map(violation => (
                      <ViolationCard
                        key={violation.id}
                        violation={violation}
                        showActions={false}
                      />
                    ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">
                      {t('rules.emptyMyViolations')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}
        </Tabs>

        {/* Dialogs */}
        {isOwner && (
          <RuleDialog
            rule={editingRule}
            messId={messId}
            open={isRuleDialogOpen}
            onOpenChange={open => {
              setIsRuleDialogOpen(open)
              if (!open) setEditingRule(null)
            }}
            onSubmit={handleRuleSubmit}
          />
        )}
      </div>
    </Layout>
  )
}
