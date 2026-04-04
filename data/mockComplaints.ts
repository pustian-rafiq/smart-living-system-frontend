import type { Complaint, Notification } from '@/types/complaint'

export const mockComplaints: Complaint[] = [
  {
    id: 'c1',
    userId: 'r1',
    userName: 'Rahim Uddin',
    title: 'Water Leakage in Bathroom',
    description:
      'There is a continuous water leakage from the bathroom tap. It has been going on for 3 days now. Please fix it as soon as possible.',
    status: 'open',
    imageUrl:
      'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800',
    createdAt: '2024-03-15T10:30:00',
    updatedAt: '2024-03-15T10:30:00',
  },
  {
    id: 'c2',
    userId: 'r1',
    userName: 'Rahim Uddin',
    title: 'Broken Window',
    description:
      'The window in my room is broken and needs to be replaced. It is causing security concerns.',
    status: 'in_progress',
    imageUrl:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
    createdAt: '2024-03-10T14:20:00',
    updatedAt: '2024-03-12T09:15:00',
    response:
      'We have assigned a technician to fix the window. Expected completion: March 18, 2024.',
  },
  {
    id: 'c3',
    userId: 'r2',
    userName: 'Fatima Begum',
    title: 'Power Outage Issue',
    description:
      'Frequent power outages in the building. The generator is not working properly.',
    status: 'resolved',
    createdAt: '2024-02-28T08:00:00',
    updatedAt: '2024-03-05T16:45:00',
    resolvedAt: '2024-03-05T16:45:00',
    response:
      'Generator has been repaired and tested. All systems are now working properly.',
  },
  {
    id: 'c4',
    userId: 'r1',
    userName: 'Rahim Uddin',
    title: 'Noise Complaint',
    description:
      'Excessive noise from the apartment above during late hours. It is disturbing my sleep.',
    status: 'open',
    createdAt: '2024-03-20T22:15:00',
    updatedAt: '2024-03-20T22:15:00',
  },
  {
    id: 'c5',
    userId: 'r3',
    userName: 'Karim Ahmed',
    title: 'Lift Not Working',
    description:
      'The lift has been out of order for the past week. It is very inconvenient for elderly residents.',
    status: 'in_progress',
    createdAt: '2024-03-18T11:00:00',
    updatedAt: '2024-03-19T14:30:00',
    response:
      'We have contacted the lift maintenance company. They will visit on March 22, 2024.',
  },
]

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: 'r1',
    title: 'Complaint Status Updated',
    message:
      'Your complaint "Water Leakage in Bathroom" status has been updated to In Progress.',
    type: 'complaint',
    read: false,
    createdAt: '2024-03-15T11:00:00',
    link: '/complaints',
  },
  {
    id: 'n2',
    userId: 'r1',
    title: 'New Bill Generated',
    message:
      'Your monthly bill for March 2024 has been generated. Amount: ৳12,500',
    type: 'bill',
    read: false,
    createdAt: '2024-03-01T09:00:00',
    link: '/bills',
  },
  {
    id: 'n3',
    userId: 'r1',
    title: 'Complaint Resolved',
    message:
      'Your complaint "Broken Window" has been resolved. Please check the response.',
    type: 'complaint',
    read: true,
    createdAt: '2024-03-12T10:00:00',
    link: '/complaints',
  },
  {
    id: 'n4',
    userId: 'r1',
    title: 'System Maintenance',
    message:
      'Scheduled maintenance on March 25, 2024 from 2 PM to 4 PM. Services may be interrupted.',
    type: 'system',
    read: false,
    createdAt: '2024-03-20T08:00:00',
  },
  {
    id: 'n5',
    userId: 'r1',
    title: 'Payment Reminder',
    message:
      'Your bill payment for February 2024 is due. Please pay before March 5, 2024.',
    type: 'bill',
    read: true,
    createdAt: '2024-03-03T12:00:00',
    link: '/bills',
  },
  {
    id: 'n6',
    userId: 'r1',
    title: 'Welcome to Smart Living',
    message:
      'Thank you for joining Smart Living System. We hope you have a great experience!',
    type: 'other',
    read: true,
    createdAt: '2024-01-15T10:00:00',
  },
]
