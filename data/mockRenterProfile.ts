import type {
  RenterProfile,
  Document,
  JobInfo,
  FamilyMember,
  EmergencyContact,
} from '@/types/renterProfile'

/** Shared profile shape for renters and owners (trust docs, job, family). */
export type UserProfile = RenterProfile

function emptyProfile(userId: string): UserProfile {
  return {
    userId,
    documents: [],
    familyMembers: [],
    emergencyContacts: [],
    updatedAt: new Date().toISOString(),
  }
}

export const mockProfiles: Record<string, UserProfile> = {
  user1: {
    userId: 'user1',
    documents: [
      {
        id: 'doc1',
        type: 'nid',
        documentNumber: '1234567890123',
        fileUrl:
          'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
        fileName: 'nid_front.jpg',
        fileSize: 245678,
        uploadedAt: '2024-01-15T10:00:00Z',
        expiryDate: '2030-12-31',
        verificationStatus: 'verified',
        verifiedAt: '2024-01-20T14:30:00Z',
      },
      {
        id: 'doc2',
        type: 'nid',
        documentNumber: '1234567890123',
        fileUrl:
          'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
        fileName: 'nid_back.jpg',
        fileSize: 234567,
        uploadedAt: '2024-01-15T10:05:00Z',
        expiryDate: '2030-12-31',
        verificationStatus: 'verified',
        verifiedAt: '2024-01-20T14:30:00Z',
      },
    ],
    jobInfo: {
      id: 'job1',
      type: 'student',
      instituteName: 'Dhaka University',
      studentId: '2019-1-60-123',
      department: 'Computer Science and Engineering',
      verificationStatus: 'verified',
      verifiedAt: '2024-01-18T11:00:00Z',
    },
    familyMembers: [
      {
        id: 'fam1',
        name: 'Sarah Ahmed',
        relation: 'spouse',
        age: 28,
        gender: 'female',
        photoUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        nid: '9876543210987',
        phone: '+8801712345678',
        isEmergencyContact: true,
        createdAt: '2024-01-20T09:00:00Z',
      },
      {
        id: 'fam2',
        name: 'Ayan Ahmed',
        relation: 'child',
        age: 5,
        gender: 'male',
        photoUrl:
          'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400',
        isEmergencyContact: false,
        createdAt: '2024-01-20T09:05:00Z',
      },
    ],
    emergencyContacts: [
      {
        id: 'ec1',
        name: 'Sarah Ahmed',
        relation: 'Spouse',
        phone: '+8801712345678',
        email: 'sarah.ahmed@email.com',
        address: 'Mirpur, Dhaka',
        isPrimary: true,
      },
      {
        id: 'ec2',
        name: 'Mohammad Rahman',
        relation: 'Brother',
        phone: '+8801812345678',
        email: 'm.rahman@email.com',
        address: 'Gulshan, Dhaka',
        isPrimary: false,
      },
    ],
    updatedAt: '2024-02-20T10:00:00Z',
  },
  owner1: {
    userId: 'owner1',
    documents: [
      {
        id: 'owner-doc-nid',
        type: 'nid',
        documentNumber: '1990123456789',
        fileUrl:
          'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
        fileName: 'owner_nid.jpg',
        fileSize: 198000,
        uploadedAt: '2024-02-01T09:00:00Z',
        expiryDate: '2032-06-30',
        verificationStatus: 'verified',
        verifiedAt: '2024-02-05T11:00:00Z',
      },
      {
        id: 'owner-doc-police',
        type: 'police_verification',
        documentNumber: 'PV-DHK-2024-8841',
        fileUrl:
          'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800',
        fileName: 'police_verification.pdf',
        fileSize: 512000,
        uploadedAt: '2024-02-10T10:00:00Z',
        expiryDate: '2025-02-10',
        verificationStatus: 'pending',
      },
    ],
    jobInfo: {
      id: 'owner-job1',
      type: 'self_employed',
      jobTitle: 'Property Owner & Manager',
      company: 'Green Valley Apartments',
      employmentStartDate: '2018-01-01',
      verificationStatus: 'pending',
    },
    familyMembers: [
      {
        id: 'owner-fam1',
        name: 'Nasrin Begum',
        relation: 'spouse',
        age: 42,
        gender: 'female',
        phone: '+8801711112233',
        nid: '1985123456789',
        isEmergencyContact: true,
        createdAt: '2024-02-01T09:00:00Z',
      },
    ],
    emergencyContacts: [
      {
        id: 'owner-ec1',
        name: 'Nasrin Begum',
        relation: 'Spouse',
        phone: '+8801711112233',
        email: 'nasrin@email.com',
        address: 'Mirpur, Dhaka',
        isPrimary: true,
      },
      {
        id: 'owner-ec2',
        name: 'Karim Hossain',
        relation: 'Brother',
        phone: '+8801911223344',
        isPrimary: false,
      },
    ],
    updatedAt: '2024-03-01T10:00:00Z',
  },
}

/** @deprecated use mockProfiles.user1 */
export const mockRenterProfile = mockProfiles.user1

export function getUserProfile(userId: string): UserProfile {
  if (!mockProfiles[userId]) {
    mockProfiles[userId] = emptyProfile(userId)
  }
  return mockProfiles[userId]
}

export function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): UserProfile {
  const current = getUserProfile(userId)
  const next: UserProfile = {
    ...current,
    ...updates,
    userId,
    updatedAt: new Date().toISOString(),
  }
  mockProfiles[userId] = next
  return next
}

export function getProfileUserId(role: string): string {
  if (role === 'owner') return 'owner1'
  if (role === 'admin') return 'admin1'
  return 'user1'
}

// Back-compat aliases
export function getRenterProfile(userId: string): UserProfile | null {
  return getUserProfile(userId)
}

export function updateRenterProfile(
  userId: string,
  updates: Partial<UserProfile>
): void {
  updateUserProfile(userId, updates)
}
