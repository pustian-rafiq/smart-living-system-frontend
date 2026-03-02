import type {
  RenterHistory,
  RentalHistory,
  PaymentHistory,
  ComplaintHistory,
  OwnerReference,
  OwnerRating,
} from '@/types/renterHistory'

// Mock rental histories
// Note: renterId should match the id from mockRenters in mockBuildings.ts
export const mockRentalHistories: RentalHistory[] = [
  {
    id: 'rh1',
    renterId: 'r1', // Matches mockRenters[0].id (Rahim Uddin)
    propertyId: 'b2',
    propertyName: 'Sunshine Tower',
    propertyAddress: 'Road 5, Dhanmondi, Dhaka',
    flatNumber: '101',
    moveInDate: '2022-01-15',
    moveOutDate: '2023-12-31',
    monthlyRent: 20000,
    status: 'completed',
    ownerId: 'owner2',
    ownerName: 'Ahmed Rahman',
    ownerPhone: '+8801712345689',
  },
  {
    id: 'rh2',
    renterId: 'r1',
    propertyId: 'b3',
    propertyName: 'Modern Heights',
    propertyAddress: 'House 12, Gulshan-2, Dhaka',
    flatNumber: 'A1',
    moveInDate: '2021-06-01',
    moveOutDate: '2022-01-10',
    monthlyRent: 15000,
    status: 'completed',
    ownerId: 'owner3',
    ownerName: 'Fatima Begum',
    ownerPhone: '+8801712345690',
  },
  {
    id: 'rh3',
    renterId: 'r2', // Matches mockRenters[1].id (Fatima Begum)
    propertyId: 'b1',
    propertyName: 'Green Valley Apartments',
    propertyAddress: 'House 45, Road 7, Block C, Mirpur-10',
    flatNumber: '1B',
    moveInDate: '2023-01-15',
    moveOutDate: undefined,
    monthlyRent: 12000,
    status: 'ongoing',
    ownerId: 'owner1',
    ownerName: 'Karim Uddin',
    ownerPhone: '+8801712345678',
  },
  {
    id: 'rh4',
    renterId: 'r3', // Matches mockRenters[2].id (Karim Ahmed)
    propertyId: 'b2',
    propertyName: 'Sunshine Tower',
    propertyAddress: 'Road 5, Dhanmondi, Dhaka',
    flatNumber: '102',
    moveInDate: '2020-03-01',
    moveOutDate: '2022-12-31',
    monthlyRent: 20000,
    status: 'completed',
    ownerId: 'owner2',
    ownerName: 'Ahmed Rahman',
    ownerPhone: '+8801712345689',
  },
]

// Mock payment histories
export const mockPaymentHistories: PaymentHistory[] = [
  // For rh1 (r1, Sunshine Tower)
  {
    id: 'ph1',
    rentalHistoryId: 'rh1',
    month: 'January',
    year: 2023,
    amount: 20000,
    status: 'paid',
    paidDate: '2023-01-05',
    dueDate: '2023-01-01',
    paymentMethod: 'bkash',
  },
  {
    id: 'ph2',
    rentalHistoryId: 'rh1',
    month: 'February',
    year: 2023,
    amount: 20000,
    status: 'paid',
    paidDate: '2023-02-03',
    dueDate: '2023-02-01',
    paymentMethod: 'bkash',
  },
  {
    id: 'ph3',
    rentalHistoryId: 'rh1',
    month: 'March',
    year: 2023,
    amount: 20000,
    status: 'paid',
    paidDate: '2023-03-05',
    dueDate: '2023-03-01',
    paymentMethod: 'cash',
  },
  {
    id: 'ph4',
    rentalHistoryId: 'rh1',
    month: 'April',
    year: 2023,
    amount: 20000,
    status: 'overdue',
    paidDate: '2023-04-10',
    dueDate: '2023-04-01',
    paymentMethod: 'nagad',
    notes: 'Paid 5 days late',
  },
  // For rh2 (r1, Modern Heights)
  {
    id: 'ph5',
    rentalHistoryId: 'rh2',
    month: 'June',
    year: 2021,
    amount: 15000,
    status: 'paid',
    paidDate: '2021-06-02',
    dueDate: '2021-06-01',
    paymentMethod: 'bkash',
  },
  {
    id: 'ph6',
    rentalHistoryId: 'rh2',
    month: 'July',
    year: 2021,
    amount: 15000,
    status: 'paid',
    paidDate: '2021-07-01',
    dueDate: '2021-07-01',
    paymentMethod: 'bkash',
  },
  // For rh3 (r2, Green Valley - ongoing)
  {
    id: 'ph7',
    rentalHistoryId: 'rh3',
    month: 'January',
    year: 2024,
    amount: 12000,
    status: 'paid',
    paidDate: '2024-01-03',
    dueDate: '2024-01-01',
    paymentMethod: 'bkash',
  },
  {
    id: 'ph8',
    rentalHistoryId: 'rh3',
    month: 'February',
    year: 2024,
    amount: 12000,
    status: 'paid',
    paidDate: '2024-02-02',
    dueDate: '2024-02-01',
    paymentMethod: 'bkash',
  },
  {
    id: 'ph9',
    rentalHistoryId: 'rh3',
    month: 'March',
    year: 2024,
    amount: 12000,
    status: 'pending',
    dueDate: '2024-03-01',
  },
]

// Mock complaint histories
export const mockComplaintHistories: ComplaintHistory[] = [
  {
    id: 'ch1',
    rentalHistoryId: 'rh1',
    title: 'AC Not Working',
    description: 'The AC in the bedroom stopped working. Need repair.',
    category: 'maintenance',
    status: 'resolved',
    createdAt: '2023-02-15T10:00:00Z',
    resolvedAt: '2023-02-18T14:00:00Z',
    resolution: 'AC repaired and working properly now.',
  },
  {
    id: 'ch2',
    rentalHistoryId: 'rh1',
    title: 'Water Leakage',
    description: 'Water leaking from the ceiling in the kitchen area.',
    category: 'maintenance',
    status: 'resolved',
    createdAt: '2023-05-20T09:00:00Z',
    resolvedAt: '2023-05-22T16:00:00Z',
    resolution: 'Leakage fixed. Ceiling repaired.',
  },
  {
    id: 'ch3',
    rentalHistoryId: 'rh3',
    title: 'Noise Complaint',
    description: 'Neighbors playing loud music late at night.',
    category: 'noise',
    status: 'in_progress',
    createdAt: '2024-02-10T20:00:00Z',
  },
]

// Mock owner references
export const mockOwnerReferences: OwnerReference[] = [
  {
    id: 'or1',
    rentalHistoryId: 'rh1',
    ownerId: 'owner2',
    ownerName: 'Ahmed Rahman',
    ownerPhone: '+8801712345689',
    propertyName: 'Sunshine Tower',
    referenceText: 'Rahim was a responsible tenant. Always paid rent on time and maintained the property well. Would recommend.',
    rating: 5,
    wouldRentAgain: true,
    createdAt: '2024-01-05T10:00:00Z',
    verified: true,
  },
  {
    id: 'or2',
    rentalHistoryId: 'rh2',
    ownerId: 'owner3',
    ownerName: 'Fatima Begum',
    ownerPhone: '+8801712345690',
    propertyName: 'Modern Heights',
    referenceText: 'Good tenant overall. Minor issues with late payments on a couple of occasions but resolved quickly.',
    rating: 4,
    wouldRentAgain: true,
    createdAt: '2022-01-15T11:00:00Z',
    verified: true,
  },
  {
    id: 'or3',
    rentalHistoryId: 'rh4',
    ownerId: 'owner2',
    ownerName: 'Ahmed Rahman',
    ownerPhone: '+8801712345689',
    propertyName: 'Sunshine Tower',
    referenceText: 'Karim was an excellent tenant. Very clean, respectful, and always communicated well. Highly recommended.',
    rating: 5,
    wouldRentAgain: true,
    createdAt: '2023-01-05T09:00:00Z',
    verified: true,
  },
]

// Mock owner ratings
export const mockOwnerRatings: OwnerRating[] = [
  {
    id: 'rating1',
    rentalHistoryId: 'rh1',
    ownerId: 'owner2',
    ownerName: 'Ahmed Rahman',
    overallRating: 4,
    punctualityRating: 5,
    cleanlinessRating: 4,
    behaviorRating: 4,
    communicationRating: 4,
    comment: 'Good landlord, responsive to maintenance requests.',
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    id: 'rating2',
    rentalHistoryId: 'rh2',
    ownerId: 'owner3',
    ownerName: 'Fatima Begum',
    overallRating: 4,
    punctualityRating: 4,
    cleanlinessRating: 4,
    behaviorRating: 5,
    communicationRating: 4,
    comment: 'Friendly and helpful landlord.',
    createdAt: '2022-01-15T11:00:00Z',
  },
  {
    id: 'rating3',
    rentalHistoryId: 'rh4',
    ownerId: 'owner2',
    ownerName: 'Ahmed Rahman',
    overallRating: 5,
    punctualityRating: 5,
    cleanlinessRating: 5,
    behaviorRating: 5,
    communicationRating: 5,
    comment: 'Excellent landlord. Very professional and accommodating.',
    createdAt: '2023-01-05T09:00:00Z',
  },
]

// Helper functions
export function getRenterHistory(renterId: string): RenterHistory | undefined {
  const rentalHistories = mockRentalHistories.filter(rh => rh.renterId === renterId)
  const paymentHistories = mockPaymentHistories.filter(ph =>
    rentalHistories.some(rh => rh.id === ph.rentalHistoryId)
  )
  const complaintHistories = mockComplaintHistories.filter(ch =>
    rentalHistories.some(rh => rh.id === ch.rentalHistoryId)
  )
  const ownerReferences = mockOwnerReferences.filter(or =>
    rentalHistories.some(rh => rh.id === or.rentalHistoryId)
  )
  const ownerRatings = mockOwnerRatings.filter(rat =>
    rentalHistories.some(rh => rh.id === rat.rentalHistoryId)
  )

  if (rentalHistories.length === 0) return undefined

  const totalRentals = rentalHistories.length
  const averageRating =
    ownerRatings.length > 0
      ? ownerRatings.reduce((sum, r) => sum + r.overallRating, 0) / ownerRatings.length
      : 0
  const totalComplaints = complaintHistories.length
  const resolvedComplaints = complaintHistories.filter(c => c.status === 'resolved').length

  // Get renter name from first rental history or use a default
  let renterName = 'Unknown Renter'
  if (rentalHistories.length > 0) {
    // In real app, fetch from renter data
    const firstRenterId = rentalHistories[0]?.renterId
    renterName = firstRenterId === 'r1' ? 'Rahim Uddin' : 
                 firstRenterId === 'r2' ? 'Fatima Begum' : 
                 firstRenterId === 'r3' ? 'Karim Ahmed' : 
                 firstRenterId === 'r4' ? 'Sadia Islam' : 'Unknown Renter'
  }

  return {
    renterId,
    renterName,
    rentalHistories,
    paymentHistories,
    complaintHistories,
    ownerReferences,
    ownerRatings,
    totalRentals,
    averageRating,
    totalComplaints,
    resolvedComplaints,
  }
}

export function getRentalHistoryById(rentalHistoryId: string): RentalHistory | undefined {
  return mockRentalHistories.find(rh => rh.id === rentalHistoryId)
}

export function getPaymentsByRentalHistory(rentalHistoryId: string): PaymentHistory[] {
  return mockPaymentHistories.filter(ph => ph.rentalHistoryId === rentalHistoryId)
}

export function getComplaintsByRentalHistory(rentalHistoryId: string): ComplaintHistory[] {
  return mockComplaintHistories.filter(ch => ch.rentalHistoryId === rentalHistoryId)
}

export function getReferencesByRentalHistory(rentalHistoryId: string): OwnerReference[] {
  return mockOwnerReferences.filter(or => or.rentalHistoryId === rentalHistoryId)
}

export function getRatingsByRentalHistory(rentalHistoryId: string): OwnerRating[] {
  return mockOwnerRatings.filter(rat => rat.rentalHistoryId === rentalHistoryId)
}
