export type LiveStatusState = 'ok' | 'warn' | 'down'

export interface MessMealSystem {
  mealsPerDay: number
  vegetarianOption: boolean
  mealMonthlyCharge?: number | null
  guestMealPrice?: number | null
  mealOffPolicy?: string
  fishMeatDaysPerWeek?: number | null
}

export interface MessUtilityProfile {
  availability?: string
  source?: string
  tankCapacityLiters?: number | null
  hasFilter?: boolean
  separateDrinkingWater?: boolean
  hasBackup?: boolean
  loadSheddingLevel?: string
  hasIps?: boolean
  hasGenerator?: boolean
  generatorCovers?: string[]
  liftBackup?: boolean
  commonAreaBackup?: boolean
  emergencyLight?: boolean
  meterType?: string
  billSplitMethod?: string
}

export interface MessReliabilityScore {
  score: number
  label: string
  profile: MessUtilityProfile
  live: LiveStatusState
}

export interface MessUtilities {
  water: MessReliabilityScore
  electricity: MessReliabilityScore
  combined: number
}

export interface MessMealDay {
  date: string
  source: 'daily' | 'weekly' | 'empty'
  breakfast: string[]
  lunch: string[]
  dinner: string[]
  snack: string[]
  notes?: string
}

export interface MessMealCalendar {
  messId: string
  from: string
  to: string
  mealSystem: MessMealSystem
  today: MessMealDay | null
  calendar: MessMealDay[]
  guestMealPrice?: number | null
}

export interface HisabGridRow {
  studentId: string
  name: string
  seatNumber: string
  breakfast: number
  lunch: number
  dinner: number
  guestBreakfast: number
  guestLunch: number
  guestDinner: number
  memberTotal: number
  guestTotal: number
  notes?: string
  logId?: string | null
}

export interface HisabMonthMember {
  studentId: string
  name: string
  seatNumber: string
  mealCount: number
  mealCost: number
  guestMeals: number
  guestCost: number
  fixedShare: number
  deposits: number
  total: number
  due: number
  credit: number
}

export interface HisabMonth {
  messId: string
  year: number
  month: number
  status: 'open' | 'closed'
  closedAt?: string | null
  bazaarTotal: number
  fixedTotal: number
  totalMeals: number
  mealRate: number
  guestMealPrice?: number | null
  guestMeals: number
  activeStudents: number
  fixedShare: number
  members: HisabMonthMember[]
  note: string
  paymentTodo?: boolean
}

export interface MealOffRequest {
  id: string
  messId: string
  studentId: string
  studentName: string
  startDate: string
  endDate: string
  meals: Record<string, boolean>
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  reviewNote?: string
  reviewedAt?: string | null
  createdAt?: string | null
}

export interface MemberDeposit {
  id: string
  messId: string
  studentId: string
  studentName: string
  amount: number
  date: string
  note: string
  createdAt?: string | null
}

export interface Student {
  id: string
  messId: string
  userId?: string
  name: string
  phone: string
  email?: string
  studentId?: string
  university?: string
  seatNumber?: string
  joinedDate: string
  monthlyFee: number
}

export interface Notice {
  id: string
  title: string
  content: string
  date: string
  priority: 'high' | 'medium' | 'low'
  messId: string
  category?:
    | 'general'
    | 'payment'
    | 'maintenance'
    | 'event'
    | 'announcement'
    | 'rule'
    | 'other'
  expiryDate?: string
  pdfUrl?: string
  imageUrls?: string[]
  createdBy: string
  createdAt: string
  acknowledgments?: NoticeAcknowledgment[]
}

export interface NoticeAcknowledgment {
  userId: string
  userName: string
  acknowledgedAt: string
}

export interface Mess {
  id: string
  name: string
  address: string
  city: string
  totalSeats: number
  availableSeats: number
  monthlyFee: number
  gender: 'male' | 'female' | 'mixed'
  facilities: string[]
  images: string[]
  description?: string
  ownerName: string
  ownerPhone: string
  createdAt: string
  featured?: boolean
  lastConfirmedAt?: string | null
  confirmedHoursAgo?: number | null
  stale?: boolean
  listingId?: string | null
  bookUrl?: string | null
  mealSystem?: MessMealSystem
  utilities?: MessUtilities
  liveStatus?: {
    status: Record<string, LiveStatusState>
    updatedAt?: string | null
  }
}

export interface Seat {
  id: string
  seatNumber: string
  roomNumber: string
  status: 'available' | 'occupied'
  studentId?: string
  messId: string
}
