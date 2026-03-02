export type RuleStatus = 'active' | 'inactive' | 'archived'

export type ViolationSeverity = 'minor' | 'moderate' | 'major' | 'critical'

export interface MessRule {
  id: string
  messId: string
  title: string
  description: string
  category: 'general' | 'payment' | 'attendance' | 'meal' | 'behavior' | 'facility' | 'other'
  severity: ViolationSeverity
  penalty?: string // e.g., "Fine: ৳500"
  status: RuleStatus
  requiresAcceptance: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  effectiveDate?: string
  expiryDate?: string
}

export interface RuleAcceptance {
  id: string
  ruleId: string
  studentId: string
  studentName: string
  acceptedAt: string
  acceptedBy: string // User ID
  ipAddress?: string
  userAgent?: string
}

export interface RuleViolation {
  id: string
  ruleId: string
  ruleTitle: string
  studentId: string
  studentName: string
  messId: string
  violationDate: string
  description: string
  severity: ViolationSeverity
  penalty?: {
    type: 'warning' | 'fine' | 'suspension' | 'termination'
    amount?: number
    duration?: number // days for suspension
    description: string
  }
  status: 'pending' | 'resolved' | 'appealed' | 'dismissed'
  reportedBy: string
  reportedAt: string
  resolvedAt?: string
  resolvedBy?: string
  resolutionNotes?: string
  evidence?: string[] // URLs to photos/documents
}
