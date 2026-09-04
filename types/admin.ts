export type AdminRole = 'super-admin' | 'moderator' | 'support'
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'expired'
export type DisputeStatus =
  | 'open'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed'
export type PropertyStatus = 'pending' | 'approved' | 'rejected' | 'suspended'
export type UserStatus = 'active' | 'suspended' | 'banned'

export interface AdminUser {
  id: string
  name: string
  email: string
  phone: string
  role: AdminRole
  createdAt: string
  lastLogin?: string
  isActive: boolean
}

export interface VerificationRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  verificationType: 'nid' | 'phone' | 'document' | 'property'
  documentType?: 'nid' | 'passport' | 'license' | 'other'
  documentNumber?: string
  documentImage?: string
  status: VerificationStatus
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
  notes?: string
}

export interface Dispute {
  id: string
  title: string
  description: string
  type: 'payment' | 'property' | 'booking' | 'other'
  status: DisputeStatus
  createdBy: string
  createdByName: string
  assignedTo?: string
  assignedToName?: string
  relatedUserId?: string
  relatedPropertyId?: string
  relatedBookingId?: string
  evidence?: string[]
  resolution?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface PropertyModeration {
  id: string
  propertyId: string
  propertyType: 'mess' | 'apartment' | 'hotel'
  propertyName: string
  ownerId: string
  ownerName: string
  status: PropertyStatus
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
  featured: boolean
  verified: boolean
  city: string
  area: string
  rent?: number
  description?: string
  imageUrl?: string | null
}

export interface UserManagement {
  id: string
  name: string
  email: string
  phone: string
  role: 'renter' | 'owner' | 'admin'
  status: UserStatus
  verified: boolean
  createdAt: string
  lastLogin?: string
  totalProperties?: number
  totalBookings?: number
  totalComplaints?: number
  activityScore?: number
}

export interface AnalyticsData {
  totalUsers: number
  usersByRole: {
    renters: number
    owners: number
    admins: number
  }
  totalProperties: number
  propertiesByType: {
    mess: number
    apartment: number
    hotel: number
  }
  totalBookings: number
  totalRevenue: number
  pendingVerifications: number
  openDisputes: number
  openComplaints: number
  growthMetrics: {
    usersGrowth: number
    propertiesGrowth: number
    bookingsGrowth: number
    revenueGrowth: number
  }
  cityWiseStats: {
    city: string
    properties: number
    bookings: number
    revenue: number
  }[]
}

export interface SystemSettings {
  platformName: string
  platformEmail: string
  platformPhone: string
  commissionRate: number
  subscriptionPlans: {
    free: {
      maxFlats: number
      features: string[]
    }
    basic: {
      price: number
      maxFlats: number
      features: string[]
    }
    premium: {
      price: number
      maxFlats: number
      features: string[]
    }
  }
  featureFlags: {
    [key: string]: boolean
  }
  smsGateway: {
    provider: string
    apiKey?: string
    enabled: boolean
  }
  emailService: {
    provider: string
    apiKey?: string
    enabled: boolean
  }
  heartbeat?: HeartbeatConfig
  push?: PushConfig
}

export interface PushConfig {
  enabled: boolean
  heartbeatEnabled: boolean
  preferPushOverSms: boolean
  smsIfPushFails: boolean
  titleTemplate: string
  bodyTemplate: string
  iconPath: string
}

export interface PushAdminStats {
  config: PushConfig
  configured: boolean
  envEnabled: boolean
  liveWouldSend: boolean
  subscribers: number
  devices: number
  optedOutUsers: number
}

export interface HeartbeatConfig {
  jobEnabled: boolean
  smsEnabled: boolean
  intervalDays: number
  staleHideDays: number
  tokenTtlHours: number
  maxSmsPerOwnerPerWeek: number
  weekday: number
  hour: number
  includeListings: boolean
  includeHotels: boolean
  includeMesses: boolean
  onlyAvailable: boolean
  publicBaseUrl: string
  messageTemplate: string
}

export interface HeartbeatStats {
  windowDays: number
  created: number
  sent: number
  dryRun: number
  failed: number
  confirmed: number
  markedFull: number
  pending: number
  expired: number
  uniqueOwners: number
  config: HeartbeatConfig
  envSmsEnabled: boolean
  liveSmsWouldSend: boolean
  weekdayLabel: string
}

export interface HeartbeatPingRow {
  id: string
  token: string
  ownerPhone: string
  ownerName: string
  targetType: string
  targetName: string
  city: string
  status: string
  dryRun: boolean
  sentAt: string | null
  respondedAt: string | null
  expiresAt: string
  linkPath: string
  error: string
}

export interface FraudReport {
  id: string
  userId: string
  userName: string
  reportType: 'suspicious_activity' | 'fake_listing' | 'payment_fraud' | 'other'
  description: string
  evidence?: string[]
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
  reportedAt: string
  investigatedBy?: string
  resolution?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface ActivityLog {
  id: string
  userId: string
  userName: string
  action: string
  resourceType: 'user' | 'property' | 'booking' | 'complaint' | 'dispute'
  resourceId: string
  details?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
}
