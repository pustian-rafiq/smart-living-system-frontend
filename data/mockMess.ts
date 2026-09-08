import type { Mess, Student, Notice, Seat } from '@/types/mess'

export const mockMess: Mess[] = [
  {
    id: 'm1',
    name: 'Green Valley Mess',
    address: 'House 45, Road 7, Block C, Mirpur-10',
    city: 'Dhaka',
    totalSeats: 30,
    availableSeats: 8,
    monthlyFee: 3500,
    gender: 'male',
    facilities: [
      'WiFi',
      'AC',
      'Generator',
      'Security',
      'Parking',
      'Common Kitchen',
    ],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    description:
      'Clean and spacious mess with modern amenities. Perfect for students and working professionals.',
    ownerName: 'Abdul Karim',
    ownerPhone: '+8801712345678',
    createdAt: '2024-01-15',
  },
  {
    id: 'm2',
    name: 'Student Hub Mess',
    address: 'House 23, Road 27, Dhanmondi',
    city: 'Dhaka',
    totalSeats: 25,
    availableSeats: 5,
    monthlyFee: 3200,
    gender: 'male',
    facilities: ['WiFi', 'Generator', 'Security', 'Common Kitchen'],
    images: [
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7c8?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    ],
    description:
      'Affordable mess for students. Close to universities and public transport.',
    ownerName: 'Rashid Ahmed',
    ownerPhone: '+8801712345680',
    createdAt: '2024-01-18',
  },
  {
    id: 'm3',
    name: 'Ladies Hostel',
    address: 'House 12, Road 8, Block A, Mohammadpur',
    city: 'Dhaka',
    totalSeats: 20,
    availableSeats: 3,
    monthlyFee: 4000,
    gender: 'female',
    facilities: ['WiFi', 'AC', 'Generator', 'Security', 'CCTV', 'Common Room'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1556912172-45b7abe8b7c8?w=800',
    ],
    description:
      'Safe and secure ladies hostel with 24/7 security. All modern amenities available.',
    ownerName: 'Nazma Khatun',
    ownerPhone: '+8801712345681',
    createdAt: '2024-01-22',
  },
]

export const mockStudents: Student[] = [
  {
    id: 's1',
    messId: 'm1',
    name: 'Rahim Uddin',
    phone: '+8801712345678',
    email: 'rahim@example.com',
    occupantType: 'student',
    studentId: 'STU-2024-001',
    university: 'Dhaka University',
    seatNumber: 'A-12',
    joinedDate: '2024-01-15',
    monthlyFee: 3500,
  },
  {
    id: 's2',
    messId: 'm1',
    name: 'Karim Ahmed',
    phone: '+8801712345680',
    email: 'karim@example.com',
    occupantType: 'job_holder',
    organization: 'Brain Station 23',
    designation: 'Software Engineer',
    seatNumber: 'B-05',
    joinedDate: '2024-01-20',
    monthlyFee: 3500,
  },
  {
    id: 's3',
    messId: 'm1',
    name: 'Fatima Begum',
    phone: '+8801712345679',
    email: 'fatima@example.com',
    occupantType: 'student',
    studentId: 'STU-2024-003',
    university: 'Dhaka University',
    seatNumber: 'C-08',
    joinedDate: '2024-02-01',
    monthlyFee: 4000,
  },
]

export const mockNotices: Notice[] = [
  {
    id: 'n1',
    title: 'Monthly Fee Payment Reminder',
    content:
      'Please pay your monthly fee by 5th of every month. Late payment will incur a fine of ৳200.',
    date: '2024-03-01',
    priority: 'high',
    messId: 'm1',
    category: 'payment',
    expiryDate: '2024-04-01',
    pdfUrl:
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdBy: 'owner1',
    createdAt: '2024-03-01T10:00:00Z',
    acknowledgments: [
      {
        userId: 's1',
        userName: 'Rahim Uddin',
        acknowledgedAt: '2024-03-01T11:00:00Z',
      },
      {
        userId: 's2',
        userName: 'Karim Ahmed',
        acknowledgedAt: '2024-03-01T12:00:00Z',
      },
    ],
  },
  {
    id: 'n2',
    title: 'Mess Meeting Scheduled',
    content:
      'A general meeting will be held on 15th March at 7 PM. All students are requested to attend.',
    date: '2024-03-05',
    priority: 'medium',
    messId: 'm1',
    category: 'event',
    expiryDate: '2024-03-16',
    imageUrls: [
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    ],
    createdBy: 'owner1',
    createdAt: '2024-03-05T09:00:00Z',
    acknowledgments: [],
  },
  {
    id: 'n3',
    title: 'Generator Maintenance',
    content:
      'Generator maintenance scheduled for 20th March. There may be power cuts during 2 PM - 4 PM.',
    date: '2024-03-10',
    priority: 'medium',
    messId: 'm1',
    category: 'maintenance',
    expiryDate: '2024-03-21',
    createdBy: 'owner1',
    createdAt: '2024-03-10T08:00:00Z',
    acknowledgments: [
      {
        userId: 's1',
        userName: 'Rahim Uddin',
        acknowledgedAt: '2024-03-10T10:00:00Z',
      },
    ],
  },
  {
    id: 'n4',
    title: 'New WiFi Password',
    content:
      'The WiFi password has been changed. Please contact the mess manager for the new password.',
    date: '2024-03-12',
    priority: 'low',
    messId: 'm1',
    category: 'announcement',
    createdBy: 'owner1',
    createdAt: '2024-03-12T14:00:00Z',
    acknowledgments: [],
  },
  {
    id: 'n5',
    title: 'Holiday Notice',
    content:
      'Mess will be closed on 26th March (Independence Day). No meals will be served.',
    date: '2024-03-15',
    priority: 'high',
    messId: 'm1',
    category: 'announcement',
    expiryDate: '2024-03-27',
    imageUrls: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
    ],
    createdBy: 'owner1',
    createdAt: '2024-03-15T10:00:00Z',
    acknowledgments: [],
  },
]

// Helper functions for notice management
export function getNoticesByMess(messId: string): Notice[] {
  return mockNotices.filter(notice => notice.messId === messId)
}

export function getNoticeById(noticeId: string): Notice | undefined {
  return mockNotices.find(notice => notice.id === noticeId)
}

export function addNotice(notice: Notice): void {
  mockNotices.push(notice)
}

export function updateNotice(noticeId: string, updates: Partial<Notice>): void {
  const index = mockNotices.findIndex(n => n.id === noticeId)
  if (index !== -1) {
    mockNotices[index] = { ...mockNotices[index], ...updates }
  }
}

export function deleteNotice(noticeId: string): void {
  const index = mockNotices.findIndex(n => n.id === noticeId)
  if (index !== -1) {
    mockNotices.splice(index, 1)
  }
}

export function acknowledgeNotice(
  noticeId: string,
  userId: string,
  userName: string
): void {
  const notice = mockNotices.find(n => n.id === noticeId)
  if (notice) {
    if (!notice.acknowledgments) {
      notice.acknowledgments = []
    }
    // Check if already acknowledged
    if (!notice.acknowledgments.some(ack => ack.userId === userId)) {
      notice.acknowledgments.push({
        userId,
        userName,
        acknowledgedAt: new Date().toISOString(),
      })
    }
  }
}

export const mockSeats: Seat[] = [
  {
    id: 'seat1',
    seatNumber: 'A-01',
    roomNumber: 'Room 1',
    status: 'occupied',
    studentId: 's1',
    messId: 'm1',
  },
  {
    id: 'seat2',
    seatNumber: 'A-02',
    roomNumber: 'Room 1',
    status: 'occupied',
    studentId: 's2',
    messId: 'm1',
  },
  {
    id: 'seat3',
    seatNumber: 'A-03',
    roomNumber: 'Room 1',
    status: 'available',
    messId: 'm1',
  },
  {
    id: 'seat4',
    seatNumber: 'A-04',
    roomNumber: 'Room 1',
    status: 'available',
    messId: 'm1',
  },
  {
    id: 'seat5',
    seatNumber: 'B-01',
    roomNumber: 'Room 2',
    status: 'occupied',
    messId: 'm1',
  },
  {
    id: 'seat6',
    seatNumber: 'B-02',
    roomNumber: 'Room 2',
    status: 'available',
    messId: 'm1',
  },
]
