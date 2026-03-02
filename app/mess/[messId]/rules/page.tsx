'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
} from '@/data/mockMessRules'
import { mockMess, mockStudents } from '@/data/mockMess'
import { getStoredRole } from '@/utils/auth'
import { Plus, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { MessRule, RuleViolation } from '@/types/messRules'

export default function RulesManagementPage() {
  const params = useParams()
  const router = useRouter()
  const role = getStoredRole()
  const messId = params.messId as string

  const mess = mockMess.find(m => m.id === messId)
  const [rules, setRules] = useState(getRulesByMess(messId))
  const [violations, setViolations] = useState(getViolationsByMess(messId))
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<MessRule | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')

  // In real app, get from auth
  const currentStudentId = 'r1'

  if (!mess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <p className="text-center">Mess not found</p>
        </div>
      </Layout>
    )
  }

  const studentAcceptances = useMemo(
    () => getAcceptancesByStudent(currentStudentId),
    [currentStudentId]
  )

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

  const handleRuleSubmit = (data: any) => {
    if (editingRule) {
      updateRule(editingRule.id, data)
    } else {
      addRule(data)
    }
    setRules(getRulesByMess(messId))
    setEditingRule(null)
  }

  const handleRuleDelete = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      deleteRule(ruleId)
      setRules(getRulesByMess(messId))
    }
  }

  const handleAcceptRule = (rule: MessRule) => {
    const student = mockStudents.find(s => s.id === currentStudentId)
    if (student) {
      acceptRule(rule.id, currentStudentId, student.name)
      setRules(getRulesByMess(messId))
      alert('Rule accepted successfully!')
    }
  }

  const handleResolveViolation = (violation: RuleViolation) => {
    const notes = prompt('Enter resolution notes:')
    if (notes) {
      updateViolation(violation.id, {
        status: 'resolved',
        resolutionNotes: notes,
        resolvedBy: role === 'owner' ? 'owner1' : currentStudentId,
      })
      setViolations(getViolationsByMess(messId))
    }
  }

  const isOwner = role === 'owner'
  const isRenter = role === 'renter'

  return (
    <Layout userRole={role as any}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Rules & Regulations</h1>
            <p className="text-muted-foreground">{mess.name}</p>
          </div>
          {isOwner && (
            <Button onClick={() => {
              setEditingRule(null)
              setIsRuleDialogOpen(true)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="rules" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rules">
              <FileText className="h-4 w-4 mr-2" />
              Rules
            </TabsTrigger>
            {isOwner && (
              <TabsTrigger value="violations">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Violations
              </TabsTrigger>
            )}
            {isRenter && (
              <TabsTrigger value="my-violations">
                <AlertTriangle className="h-4 w-4 mr-2" />
                My Violations
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
                  <p className="text-muted-foreground mb-4">No rules defined yet</p>
                  {isOwner && (
                    <Button onClick={() => setIsRuleDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Rule
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
                <h2 className="text-xl font-semibold">Rule Violations</h2>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="appealed">Appealed</SelectItem>
                      <SelectItem value="dismissed">Dismissed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
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
                    <p className="text-muted-foreground">No violations found</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          {/* My Violations Tab (Renter) */}
          {isRenter && (
            <TabsContent value="my-violations" className="space-y-4">
              {violations.filter(v => v.studentId === currentStudentId).length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {violations
                    .filter(v => v.studentId === currentStudentId)
                    .map(violation => (
                      <ViolationCard key={violation.id} violation={violation} showActions={false} />
                    ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No violations recorded</p>
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
            onOpenChange={(open) => {
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
