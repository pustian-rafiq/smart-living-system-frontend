import type { MessRule, RuleAcceptance, RuleViolation } from '@/types/messRules'
import { mockStudents } from './mockMess'

export const mockMessRules: MessRule[] = [
  {
    id: 'rule1',
    messId: 'm1',
    title: 'Monthly Fee Payment',
    description:
      'Monthly fee must be paid by the 5th of every month. Late payment will incur a fine of ৳200.',
    category: 'payment',
    severity: 'moderate',
    penalty: 'Fine: ৳200',
    status: 'active',
    requiresAcceptance: true,
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    effectiveDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  },
  {
    id: 'rule2',
    messId: 'm1',
    title: 'Meal Attendance',
    description:
      'Students must inform in advance if they will not attend a meal. Uninformed absence from meals may result in charges.',
    category: 'meal',
    severity: 'minor',
    penalty: 'Charge for meal',
    status: 'active',
    requiresAcceptance: true,
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
    effectiveDate: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  },
  {
    id: 'rule3',
    messId: 'm1',
    title: 'Quiet Hours',
    description:
      'Quiet hours are from 10:00 PM to 6:00 AM. Loud music, conversations, or activities are prohibited during this time.',
    category: 'behavior',
    severity: 'moderate',
    penalty: 'Warning, then fine: ৳500',
    status: 'active',
    requiresAcceptance: true,
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    effectiveDate: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  },
  {
    id: 'rule4',
    messId: 'm1',
    title: 'No Smoking',
    description:
      'Smoking is strictly prohibited inside the mess premises. Violation will result in immediate termination.',
    category: 'behavior',
    severity: 'critical',
    penalty: 'Immediate termination',
    status: 'active',
    requiresAcceptance: true,
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    effectiveDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  },
  {
    id: 'rule5',
    messId: 'm1',
    title: 'Guest Policy',
    description:
      'Guests are allowed only during meal times with prior permission. Maximum 2 guests per student per month.',
    category: 'general',
    severity: 'minor',
    penalty: 'Fine: ৳100 per unauthorized guest',
    status: 'active',
    requiresAcceptance: true,
    createdBy: 'owner1',
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    effectiveDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  },
]

export const mockRuleAcceptances: RuleAcceptance[] = [
  {
    id: 'acc1',
    ruleId: 'rule1',
    studentId: mockStudents[0].id,
    studentName: mockStudents[0].name,
    acceptedAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
    acceptedBy: mockStudents[0].id,
  },
  {
    id: 'acc2',
    ruleId: 'rule2',
    studentId: mockStudents[0].id,
    studentName: mockStudents[0].name,
    acceptedAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
    acceptedBy: mockStudents[0].id,
  },
  {
    id: 'acc3',
    ruleId: 'rule3',
    studentId: mockStudents[0].id,
    studentName: mockStudents[0].name,
    acceptedAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
    acceptedBy: mockStudents[0].id,
  },
  {
    id: 'acc4',
    ruleId: 'rule4',
    studentId: mockStudents[0].id,
    studentName: mockStudents[0].name,
    acceptedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
    acceptedBy: mockStudents[0].id,
  },
]

export const mockRuleViolations: RuleViolation[] = [
  {
    id: 'viol1',
    ruleId: 'rule1',
    ruleTitle: 'Monthly Fee Payment',
    studentId: mockStudents[1].id,
    studentName: mockStudents[1].name,
    messId: 'm1',
    violationDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    description: 'Monthly fee not paid by due date (5th of month)',
    severity: 'moderate',
    penalty: {
      type: 'fine',
      amount: 200,
      description: 'Late payment fine',
    },
    status: 'resolved',
    reportedBy: 'owner1',
    reportedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedBy: 'owner1',
    resolutionNotes: 'Fine paid along with monthly fee',
  },
  {
    id: 'viol2',
    ruleId: 'rule3',
    ruleTitle: 'Quiet Hours',
    studentId: mockStudents[2].id,
    studentName: mockStudents[2].name,
    messId: 'm1',
    violationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    description: 'Loud music played after 11:00 PM',
    severity: 'moderate',
    penalty: {
      type: 'warning',
      description: 'First warning issued',
    },
    status: 'resolved',
    reportedBy: 'owner1',
    reportedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedBy: 'owner1',
    resolutionNotes: 'Student acknowledged and apologized',
  },
  {
    id: 'viol3',
    ruleId: 'rule2',
    ruleTitle: 'Meal Attendance',
    studentId: mockStudents[0].id,
    studentName: mockStudents[0].name,
    messId: 'm1',
    violationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    description: 'Absent from lunch without prior notice',
    severity: 'minor',
    penalty: {
      type: 'fine',
      amount: 50,
      description: 'Meal charge',
    },
    status: 'pending',
    reportedBy: 'owner1',
    reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Helper functions
export function getRulesByMess(messId: string): MessRule[] {
  return mockMessRules
    .filter(rule => rule.messId === messId && rule.status === 'active')
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

export function getRuleById(ruleId: string): MessRule | undefined {
  return mockMessRules.find(rule => rule.id === ruleId)
}

export function getAcceptancesByStudent(studentId: string): RuleAcceptance[] {
  return mockRuleAcceptances
    .filter(acc => acc.studentId === studentId)
    .sort(
      (a, b) =>
        new Date(b.acceptedAt).getTime() - new Date(a.acceptedAt).getTime()
    )
}

export function getAcceptancesByRule(ruleId: string): RuleAcceptance[] {
  return mockRuleAcceptances.filter(acc => acc.ruleId === ruleId)
}

export function getViolationsByMess(
  messId: string,
  filters?: {
    studentId?: string
    status?: string
    severity?: string
  }
): RuleViolation[] {
  let violations = mockRuleViolations.filter(v => v.messId === messId)

  if (filters?.studentId) {
    violations = violations.filter(v => v.studentId === filters.studentId)
  }
  if (filters?.status) {
    violations = violations.filter(v => v.status === filters.status)
  }
  if (filters?.severity) {
    violations = violations.filter(v => v.severity === filters.severity)
  }

  return violations.sort(
    (a, b) =>
      new Date(b.violationDate).getTime() - new Date(a.violationDate).getTime()
  )
}

export function getViolationsByStudent(studentId: string): RuleViolation[] {
  return mockRuleViolations
    .filter(v => v.studentId === studentId)
    .sort(
      (a, b) =>
        new Date(b.violationDate).getTime() -
        new Date(a.violationDate).getTime()
    )
}

export function addRule(
  rule: Omit<MessRule, 'id' | 'createdAt' | 'updatedAt'>
): MessRule {
  const newRule: MessRule = {
    ...rule,
    id: `rule${mockMessRules.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockMessRules.push(newRule)
  return newRule
}

export function updateRule(
  ruleId: string,
  updates: Partial<MessRule>
): MessRule | undefined {
  const index = mockMessRules.findIndex(r => r.id === ruleId)
  if (index === -1) return undefined

  mockMessRules[index] = {
    ...mockMessRules[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockMessRules[index]
}

export function deleteRule(ruleId: string): boolean {
  const index = mockMessRules.findIndex(r => r.id === ruleId)
  if (index === -1) return false
  mockMessRules[index].status = 'archived'
  return true
}

export function acceptRule(
  ruleId: string,
  studentId: string,
  studentName: string
): RuleAcceptance {
  // Remove existing acceptance if any
  const existingIndex = mockRuleAcceptances.findIndex(
    acc => acc.ruleId === ruleId && acc.studentId === studentId
  )
  if (existingIndex !== -1) {
    mockRuleAcceptances.splice(existingIndex, 1)
  }

  const newAcceptance: RuleAcceptance = {
    id: `acc${mockRuleAcceptances.length + 1}`,
    ruleId,
    studentId,
    studentName,
    acceptedAt: new Date().toISOString(),
    acceptedBy: studentId,
  }
  mockRuleAcceptances.push(newAcceptance)
  return newAcceptance
}

export function addViolation(
  violation: Omit<RuleViolation, 'id' | 'reportedAt'>
): RuleViolation {
  const newViolation: RuleViolation = {
    ...violation,
    id: `viol${mockRuleViolations.length + 1}`,
    reportedAt: new Date().toISOString(),
  }
  mockRuleViolations.push(newViolation)
  return newViolation
}

export function updateViolation(
  violationId: string,
  updates: Partial<RuleViolation>
): RuleViolation | undefined {
  const index = mockRuleViolations.findIndex(v => v.id === violationId)
  if (index === -1) return undefined

  mockRuleViolations[index] = {
    ...mockRuleViolations[index],
    ...updates,
    resolvedAt:
      updates.status === 'resolved'
        ? new Date().toISOString()
        : mockRuleViolations[index].resolvedAt,
  }
  return mockRuleViolations[index]
}
