import type {
  AdminUser,
  VerificationRequest,
  Dispute,
  PropertyModeration,
  UserManagement,
  AnalyticsData,
  SystemSettings,
  FraudReport,
  ActivityLog,
} from '@/types/admin'
import { mockHotels } from './mockHotels'
import { mockProperties } from './mockProperties'
import { mockComplaints } from './mockComplaints'
import { mockBookings } from './mockHotels'

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@smartliving.com',
    phone: '+8801711111111',
    role: 'super-admin',
    createdAt: '2024-01-01',
    lastLogin: '2024-03-20T10:00:00',
    isActive: true,
  },
  {
    id: 'admin2',
    name: 'Moderator One',
    email: 'moderator@smartliving.com',
    phone: '+8801722222222',
    role: 'moderator',
    createdAt: '2024-01-15',
    lastLogin: '2024-03-20T09:30:00',
    isActive: true,
  },
]

export const mockVerificationRequests: VerificationRequest[] = [
  {
    id: 'v1',
    userId: 'user1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    userPhone: '+8801711111111',
    verificationType: 'nid',
    documentType: 'nid',
    documentNumber: '1234567890123',
    documentImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
    status: 'pending',
    submittedAt: '2024-03-18T10:00:00',
  },
  {
    id: 'v2',
    userId: 'user2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    userPhone: '+8801722222222',
    verificationType: 'property',
    documentType: 'license',
    documentNumber: 'PROP-2024-001',
    documentImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
    status: 'approved',
    submittedAt: '2024-03-15T14:00:00',
    reviewedAt: '2024-03-16T10:00:00',
    reviewedBy: 'admin1',
  },
  {
    id: 'v3',
    userId: 'user3',
    userName: 'Mike Johnson',
    userEmail: 'mike@example.com',
    userPhone: '+8801733333333',
    verificationType: 'nid',
    documentType: 'nid',
    documentNumber: '9876543210987',
    documentImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
    status: 'rejected',
    submittedAt: '2024-03-10T09:00:00',
    reviewedAt: '2024-03-11T15:00:00',
    reviewedBy: 'admin2',
    rejectionReason: 'Document image is unclear. Please upload a clear photo.',
  },
]

export const mockDisputes: Dispute[] = [
  {
    id: 'd1',
    title: 'Payment Dispute - Booking #B001',
    description: 'Guest claims payment was made but booking shows as unpaid. Transaction ID: BK123456789',
    type: 'payment',
    status: 'open',
    createdBy: 'user1',
    createdByName: 'John Doe',
    relatedBookingId: 'b1',
    priority: 'high',
    createdAt: '2024-03-19T11:00:00',
    updatedAt: '2024-03-19T11:00:00',
  },
  {
    id: 'd2',
    title: 'Property Misrepresentation',
    description: 'Renter claims the property does not match the description. Missing amenities listed.',
    type: 'property',
    status: 'assigned',
    createdBy: 'user2',
    createdByName: 'Jane Smith',
    assignedTo: 'admin2',
    assignedToName: 'Moderator One',
    relatedPropertyId: '1',
    priority: 'medium',
    createdAt: '2024-03-17T14:30:00',
    updatedAt: '2024-03-18T09:00:00',
  },
  {
    id: 'd3',
    title: 'Booking Cancellation Refund',
    description: 'Guest cancelled booking but did not receive refund as per cancellation policy.',
    type: 'booking',
    status: 'in_progress',
    createdBy: 'user3',
    createdByName: 'Mike Johnson',
    assignedTo: 'admin1',
    assignedToName: 'Admin User',
    relatedBookingId: 'b2',
    priority: 'high',
    createdAt: '2024-03-15T16:00:00',
    updatedAt: '2024-03-16T10:00:00',
  },
]

export const mockPropertyModerations: PropertyModeration[] = [
  {
    id: 'pm1',
    propertyId: '1',
    propertyType: 'mess',
    propertyName: 'Green Valley Mess',
    ownerId: 'owner1',
    ownerName: 'Abdul Karim',
    status: 'approved',
    submittedAt: '2024-01-15T10:00:00',
    reviewedAt: '2024-01-16T14:00:00',
    reviewedBy: 'admin1',
    featured: false,
    verified: true,
    city: 'Dhaka',
    area: 'Mirpur-10',
  },
  {
    id: 'pm2',
    propertyId: 'h1',
    propertyType: 'hotel',
    propertyName: 'Grand Plaza Hotel',
    ownerId: 'owner1',
    ownerName: 'Ahmed Rahman',
    status: 'approved',
    submittedAt: '2024-01-01T09:00:00',
    reviewedAt: '2024-01-02T11:00:00',
    reviewedBy: 'admin1',
    featured: true,
    verified: true,
    city: 'Dhaka',
    area: 'Gulshan',
  },
  {
    id: 'pm3',
    propertyId: 'new1',
    propertyType: 'apartment',
    propertyName: 'New Apartment Complex',
    ownerId: 'owner2',
    ownerName: 'Fatima Begum',
    status: 'pending',
    submittedAt: '2024-03-20T08:00:00',
    featured: false,
    verified: false,
    city: 'Dhaka',
    area: 'Uttara',
  },
]

export const mockUsers: UserManagement[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+8801711111111',
    role: 'renter',
    status: 'active',
    verified: true,
    createdAt: '2024-01-10',
    lastLogin: '2024-03-20T08:00:00',
    totalBookings: 5,
    totalComplaints: 2,
    activityScore: 85,
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+8801722222222',
    role: 'owner',
    status: 'active',
    verified: true,
    createdAt: '2024-01-05',
    lastLogin: '2024-03-19T15:00:00',
    totalProperties: 3,
    totalBookings: 12,
    activityScore: 92,
  },
  {
    id: 'user3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+8801733333333',
    role: 'renter',
    status: 'suspended',
    verified: false,
    createdAt: '2024-02-01',
    lastLogin: '2024-03-15T10:00:00',
    totalBookings: 2,
    totalComplaints: 5,
    activityScore: 45,
  },
]

export const mockAnalytics: AnalyticsData = {
  totalUsers: 1250,
  usersByRole: {
    renters: 850,
    owners: 350,
    admins: 50,
  },
  totalProperties: 450,
  propertiesByType: {
    mess: 200,
    apartment: 180,
    hotel: 70,
  },
  totalBookings: 3200,
  totalRevenue: 12500000,
  pendingVerifications: 15,
  openDisputes: 8,
  openComplaints: 25,
  growthMetrics: {
    usersGrowth: 12.5,
    propertiesGrowth: 8.3,
    bookingsGrowth: 15.2,
    revenueGrowth: 18.7,
  },
  cityWiseStats: [
    { city: 'Dhaka', properties: 280, bookings: 2100, revenue: 8500000 },
    { city: 'Chattogram', properties: 85, bookings: 650, revenue: 2500000 },
    { city: 'Sylhet', properties: 45, bookings: 280, revenue: 1000000 },
    { city: 'Rajshahi', properties: 30, bookings: 150, revenue: 500000 },
    { city: 'Cox\'s Bazar', properties: 10, bookings: 20, revenue: 0 },
  ],
}

export const mockSystemSettings: SystemSettings = {
  platformName: 'Smart Living Ecosystem',
  platformEmail: 'support@smartliving.com',
  platformPhone: '+8801712345678',
  commissionRate: 5,
  subscriptionPlans: {
    free: {
      maxFlats: 3,
      features: ['Basic listing', 'Bill management', 'Complaint system'],
    },
    basic: {
      price: 500,
      maxFlats: 10,
      features: ['All free features', 'Advanced analytics', 'Priority support'],
    },
    premium: {
      price: 2000,
      maxFlats: -1, // unlimited
      features: ['All basic features', 'White-label option', 'API access', 'Dedicated support'],
    },
  },
  featureFlags: {
    hotelModule: true,
    paymentGateway: true,
    smsNotifications: true,
    emailNotifications: true,
    aiRecommendations: false,
  },
  smsGateway: {
    provider: 'Twilio',
    enabled: true,
  },
  emailService: {
    provider: 'SendGrid',
    enabled: true,
  },
}

export const mockFraudReports: FraudReport[] = [
  {
    id: 'fr1',
    userId: 'user4',
    userName: 'Suspicious User',
    reportType: 'fake_listing',
    description: 'Property images appear to be stolen from another website. Address verification needed.',
    status: 'investigating',
    reportedAt: '2024-03-19T12:00:00',
    investigatedBy: 'admin2',
    priority: 'high',
  },
  {
    id: 'fr2',
    userId: 'user5',
    userName: 'Another User',
    reportType: 'payment_fraud',
    description: 'Multiple failed payment attempts with different cards. Possible fraud.',
    status: 'pending',
    reportedAt: '2024-03-20T09:00:00',
    priority: 'urgent',
  },
]

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'al1',
    userId: 'user1',
    userName: 'John Doe',
    action: 'created',
    resourceType: 'booking',
    resourceId: 'b1',
    details: 'Created booking for Grand Plaza Hotel',
    ipAddress: '192.168.1.1',
    createdAt: '2024-03-20T10:00:00',
  },
  {
    id: 'al2',
    userId: 'user2',
    userName: 'Jane Smith',
    action: 'updated',
    resourceType: 'property',
    resourceId: '1',
    details: 'Updated property details',
    ipAddress: '192.168.1.2',
    createdAt: '2024-03-20T09:30:00',
  },
]

// Helper functions
export function getVerificationRequestsByStatus(status: VerificationRequest['status']) {
  return mockVerificationRequests.filter(v => v.status === status)
}

export function getDisputesByStatus(status: Dispute['status']) {
  return mockDisputes.filter(d => d.status === status)
}

export function getPropertiesByStatus(status: PropertyModeration['status']) {
  return mockPropertyModerations.filter(p => p.status === status)
}

export function getUsersByStatus(status: UserManagement['status']) {
  return mockUsers.filter(u => u.status === status)
}
