import type {
  RenterProfile,
  Document,
  JobInfo,
  FamilyMember,
  EmergencyContact,
} from '@/types/renterProfile'

export const mockRenterProfile: RenterProfile = {
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
}

// Helper functions
export function getRenterProfile(userId: string): RenterProfile | null {
  if (mockRenterProfile.userId === userId) {
    return mockRenterProfile
  }
  return null
}

export function updateRenterProfile(
  userId: string,
  updates: Partial<RenterProfile>
): void {
  if (mockRenterProfile.userId === userId) {
    Object.assign(mockRenterProfile, updates, {
      updatedAt: new Date().toISOString(),
    })
  }
}
